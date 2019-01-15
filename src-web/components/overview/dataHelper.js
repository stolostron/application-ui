/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import { DataType } from './constants.js'
import { inflateKubeValue, deflateKubeValue } from '../../../lib/client/charts-helper'
import _ from 'lodash'


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

export const getNoncompliantClusterSet = (overview) => {
  const noncompliantClusterSet = new Set()
  _.get(overview, 'compliances', []).forEach(res=>{
    const policyClusters = _.get(res, 'raw.status.status', '')
    Object.keys(policyClusters).forEach(name=>{
      if ((policyClusters[name].compliant||'').toLowerCase()!=='compliant') {
        noncompliantClusterSet.add(name)
      }
    })
  })
  return noncompliantClusterSet
}

const getComplianceValues = (overview, pieData) => {
  const valueMap = {}
  const clusterSet = _.keyBy(overview.clusters, 'metadata.name')
  _.get(overview, 'compliances', []).forEach(res=>{
    const policyClusters = _.get(res, 'raw.status.status', '')
    Object.keys(policyClusters).forEach(name=>{
      if (clusterSet[name]) {
        const value = (policyClusters[name].compliant||'').toLowerCase()
        let key  = 'default'
        for (var pieKey in pieData) {
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
      }

    })
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
    data['available'] += inflateKubeValue(capacity[valueKey])
    data['used'] += inflateKubeValue(usage[valueKey])
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
  return {available, used, units}
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
