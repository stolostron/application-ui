/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import { DataType, HeatSelections, GroupByChoices, SizeChoices, ShadeChoices } from './constants.js'
import { inflateKubeValue, deflateKubeValue } from '../../../lib/client/charts-helper'
import _ from 'lodash'


// get data based on choices and nodes
export const getHeatMapData = (filteredOverview, unfilteredOverview, heatMapChoices={},
  highFiltering, conditionFilters, conditionFilterSets, collapsed) => {

  const { clusters = [] } = unfilteredOverview
  const { clusters:filteredClusters = [] } = filteredOverview
  const { usageSets } = conditionFilterSets

  // how are we grouping data
  // if collapsed, always group by provider since that's what user is seeing
  let groupKey
  const grouping = collapsed ? GroupByChoices.provider : heatMapChoices[HeatSelections.groupBy]
  switch (grouping) {
  default:
  case GroupByChoices.provider:
    groupKey = 'cloud'
    break
  case GroupByChoices.region:
    groupKey = 'region'
    break
  case GroupByChoices.purpose:
    groupKey = 'environment'
    break
  case GroupByChoices.service:
    groupKey = 'vendor'
    break
  }

  // get set of the filtered clusters
  // we only return mapData for those clusters but we calc totals based on ALL clusters
  // active/condition filters
  const filteredSet = new Set()
  filteredClusters.forEach(({metadata: {namespace, name}})=>{
    filteredSet.add(`${namespace}//${name}`)
  })

  // collect data
  let sizeTotal = 0
  const shadeArray = []
  const shadeMap = {cpu:[], memory:[], storage:[]}
  const mapData = {}
  const filteredMapData = {}
  clusters.forEach((cluster)=>{
    const {metadata={}, consoleURL} = cluster
    const {namespace, name, labels={}} = metadata
    const clusterPath = `${namespace}//${name}`
    const key = labels[groupKey]

    let size=0
    switch (heatMapChoices[HeatSelections.size]) {
    default:
    case SizeChoices.nodes:
      size = _.get(cluster, 'capacity.nodes', 0)
      break
    case SizeChoices.pods:
      size = _.get(cluster, 'usage.pods', 0)
      break
    }
    sizeTotal+=size

    const clusterTooltips = {
      cpu: _.get(cluster, 'usage.cpu', 0),
      memory: _.get(cluster, 'usage.memory', 0),
      storage: _.get(cluster, 'usage.storage', 0),
    }
    let shade
    switch (heatMapChoices[HeatSelections.shade]) {
    default:
    case ShadeChoices.vcpu:
      shade = clusterTooltips.cpu
      break
    case ShadeChoices.memory:
      shade = clusterTooltips.memory
      break
    case ShadeChoices.storage:
      shade = clusterTooltips.storage
      break
    }
    shade = inflateKubeValue(shade)
    shadeArray.push(shade)

    // add to unfilter data
    const datum = {
      name,
      size,
      shade,
      consoleURL,
      clusterTooltips, // shade value displayed in tooltip
    }
    let heatData = mapData[key]
    if (!heatData) {
      heatData = mapData[key] = []
    }
    heatData.push(datum)

    // add to filtered data
    if (filteredSet.has(clusterPath)) {
      let heatData = filteredMapData[key]
      if (!heatData) {
        heatData = filteredMapData[key] = []
      }
      heatData.push(datum)

      // capture high range
      if (highFiltering) {
        Object.keys(clusterTooltips).forEach(key=>{
          if (usageSets[key].has(clusterPath)) {
            shadeMap[key].push(inflateKubeValue(clusterTooltips[key]))
          }
        })
      }
    }
  })
  // sort by name so that _.isEqual works
  Object.keys(filteredMapData).forEach(key=>{
    filteredMapData[key].sort((a,b) => {
      return a.name.localeCompare(b.name)
    })
  })

  const aboveShades=[]
  const averageShades=[]
  const belowShades=[]
  // if filtering by condition, all shades are red
  if (highFiltering) {
    Object.keys(filteredMapData).forEach(key=>{
      filteredMapData[key].forEach(cluster=>{
        cluster.color='square-red'
      })
    })

  } else {
    // assign color classname based on where it falls in spectrum
    if (shadeArray.length>4) {
      shadeArray.sort((a,b)=>{return a-b})
      shadeArray.shift()
      shadeArray.pop()
    }
    const avg = _.sum(shadeArray) / shadeArray.length
    const std = Math.max(avg*.05, Math.sqrt(_.sum(_.map(shadeArray, (i) => Math.pow((i - avg), 2))) / shadeArray.length))
    Object.keys(filteredMapData).forEach(key=>{
      filteredMapData[key].forEach(cluster=>{
        const {shade} = cluster
        if (shade < avg-std) {
          cluster.color='square-blue'
          belowShades.push(shade)
        } else if (shade <= avg+std) {
          cluster.color='square-yellow'
          averageShades.push(shade)
        } else {
          cluster.color='square-red'
          aboveShades.push(shade)
        }
      })
    })
  }

  return {sizeTotal, mapData, filteredMapData,
    below: getShadeRange(belowShades),
    average: getShadeRange(averageShades),
    above: getShadeRange(aboveShades),
    cpu: getShadeRange(shadeMap.cpu),
    memory: getShadeRange(shadeMap.memory),
    storage: getShadeRange(shadeMap.storage),
  }
}

const getShadeRange = (shades) => {
  if (shades.length) {
    return {min: Math.min(...shades), max:Math.max(...shades)}
  }
  return -1
}

export const getConditionFilterSets = (overview, collectUsage) => {
  const noncompliantClusterSet = new Set()
  _.get(overview, 'compliances', []).forEach(res=>{
    const policyClusters = _.get(res, 'raw.status.status', '')
    Object.keys(policyClusters).forEach(name=>{
      if ((policyClusters[name].compliant||'').toLowerCase()!=='compliant') {
        noncompliantClusterSet.add(name)
      }
    })
  })

  // if user is filtering by usage
  if (collectUsage) {
    const { clusters = [] } = overview

    // collect data
    const clusterMap = {}
    const usageSets = {}
    const arrays = {cpu:[], memory:[], storage:[]}
    clusters.forEach((cluster)=>{
      const {metadata={}} = cluster
      const {namespace, name} = metadata
      const values = {}
      Object.keys(arrays).forEach(key=>{
        const val = inflateKubeValue(_.get(cluster, `usage.${key}`, 0))
        values[key] = val
        arrays[key].push(val)
        usageSets[key] = new Set()
      })
      clusterMap[`${namespace}//${name}`] = values
    })

    const fillUsageSet = (key, array) => {
      // toss top and bottom values
      if (array.length>4) {
        array.sort((a,b)=>{return a-b})
        array.shift()
        array.pop()
      }

      // get standard deviation
      const avg = _.sum(array) / array.length
      const std = Math.max(avg*.05, Math.sqrt(_.sum(_.map(array, (i) => Math.pow((i - avg), 2))) / array.length))
      const threshhold = avg+std

      // determine what clusters are above it
      const usageSet = usageSets[key]
      Object.keys(clusterMap).forEach(cluster=>{
        if (clusterMap[cluster][key] > threshhold) {
          usageSet.add(cluster)
        }
      })
    }
    Object.keys(arrays).forEach(key=>{
      fillUsageSet(key, arrays[key])
    })
    return {noncompliantClusterSet, usageSets}
  }

  return {noncompliantClusterSet}
}

export const getDataValues = (overview, dataType, pieData) => {
  switch (dataType) {
  case DataType.compliance:
    return getComplianceValues(overview, pieData)

  case DataType.pods:
    return getPieValues(overview, 'pods', 'status', pieData)

  case DataType.cluster:
    return getPieValues(overview, 'clusters', 'status', pieData)

  case DataType.cpu:
    return getAvailableUsedValues(overview, 'clusters', 'cpu')

  case DataType.memory:
    return getAvailableUsedValues(overview, 'clusters', 'memory', true)

  case DataType.storage:
    return getAvailableUsedValues(overview, 'clusters', 'storage', true)
  }
  return {valueMap:{}, available:0, used:0, units:''}
}

const getComplianceValues = (overview) => {
  const valueMap = {compliant:[], default:[]}
  const clusterSet = _.keyBy(overview.clusters, 'metadata.name')
  const map = new Map([...Object.keys(clusterSet).map(item => [item, true])])
  _.get(overview, 'compliances', []).forEach(res=>{
    const policyClusters = _.get(res, 'raw.status.status', '')
    Object.keys(policyClusters).forEach(name=>{
      if (clusterSet[name]) {
        const value = (policyClusters[name].compliant||'').toLowerCase()
        if (value !== 'compliant') map.set(name, false)
      }
    })
  })
  map.forEach((status, cluster) => {
    if (status) {
      valueMap.compliant.push(cluster)
    } else {
      valueMap.default.push(cluster)
    }
  })
  return {valueMap}
}

const getAvailableUsedValues = (overview, overviewKey, valueKey, deflateValues) => {
  // get available/used
  const data = {
    'available': 0,
    'used': 0,
  }
  const values = _.get(overview, overviewKey, []).reduce((acc, {capacity, usage}) => {
    data['available'] += capacity ? inflateKubeValue(capacity[valueKey]) : 0
    data['used'] += usage ? inflateKubeValue(usage[valueKey]) : 0
    return acc
  }, data)

  let {used} = values
  let available = values.available
  let units = values.units
  if (deflateValues) {
    let deflated = deflateKubeValue(values.available)
    available = deflated.size
    units = deflated.units
    deflated = deflateKubeValue(values.used)
    used = deflated.size
    // in case avaialble is in tetra and used is in giga
    if (used>available) {
      available *= 1024
      units = deflated.units
    }
  }
  return {available: roundDecimal(available), used: roundDecimal(used), units}
}

const getPieValues = (overview, overviewKey, valueKey, pieData) => {
  const valueMap = {}
  _.get(overview, overviewKey, []).forEach(res=>{
    const value = _.get(res, valueKey, '').toLowerCase()
    let key  = 'default'
    for (var pieKey in pieData) {
      // ex: 'running' and 'succeeded' can be the same accumulated
      if (pieData[pieKey].values && pieData[pieKey].values.indexOf(value)!==-1) {
        key = pieKey
        break
      }
    }
    let arr = valueMap[key]
    if (!arr) {
      arr = valueMap[key] = []
    }
    arr.push(res)
  })
  return {valueMap}
}

const roundDecimal = (num, places=2) =>{
  return Number(Math.round(`${num}e${places}`)+`e-${places}`)
}
