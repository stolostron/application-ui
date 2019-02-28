/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import { CardTypes, CARD_SPACING } from './constants.js'
import msgs from '../../../nls/platform.properties'
import { getDefaultViewState } from './defaults.js'
import { OVERVIEW_STATE_COOKIE  } from '../../../lib/shared/constants'
import config from '../../../lib/shared/config'
import _ from 'lodash'

export const BANNER_FILTER = '_banner_'
export const PROVIDER_FILTER = '_provider_'
export const CONDITION_FILTER = '_condition_'
export const ConditionTypes = Object.freeze({
  noncompliant: 'noncompliant',
  highVcpu: 'highVcpu',
  highStorage: 'highStorage',
  highMemory: 'highMemory',
})


// make sure all the providers that exist have a card
export const getProviderCards = (overview, filteredOverview, activeFilters, conditionFilters, locale) => {

  // only show provider cards that have clusters
  // unless NO provider has a cluster, then show them all
  const {clusters=[]} = overview
  const {clusters:filteredClusters=[]} = filteredOverview

  // get providers we've been configured for
  let configuredProviders = config['overview']
  configuredProviders = configuredProviders && configuredProviders.providers

  if (!configuredProviders) {
    // else default to these
    configuredProviders = [
      {'title':  msgs.get('provider.aws', locale), 'includes':[{'cloud':'aws'}]},
      {'title':  msgs.get('provider.azure', locale), 'includes':[{'cloud':'azure'}]},
      {'title':  msgs.get('provider.google', locale), 'includes':[{'cloud':'google'}]},
      {'title':  msgs.get('provider.ibm', locale), 'includes':[{'cloud':'ibm'}]},
    ]
  }

  // filter this list down to what's actually out there
  const existingProviders = configuredProviders.filter(({includes})=>{
    const {matchingClusters} = getMatchingClusters(clusters, includes)
    return (matchingClusters.length!==0)
  })

  // if any unknown clusters out there, add a custom provider card for it
  const unknownClusters = getUnknownClusters(clusters, configuredProviders)
  if (unknownClusters.length>0) {
    const cloudSet = new Set()
    unknownClusters.forEach(cluster=>{
      const labels = _.get(cluster, 'metadata.labels', {})
      cloudSet.add(labels['cloud'])
    })
    cloudSet.forEach(cloud=>{
      existingProviders.push({'title':  cloud, includes: [{'cloud': cloud}]})
    })
  }

  // filter out empty providers (no clusters after filtering)
  let filteredProviders = existingProviders
  if (clusters.length>filteredClusters.length) {
    filteredProviders = existingProviders.filter(({includes})=>{
      const {matchingClusters} = getMatchingClusters(filteredClusters, includes)
      return (matchingClusters.length!==0)
    })
  }
  if (filteredProviders.length==0) {
    filteredProviders = existingProviders
  }


  // start with existing provider cards
  let providerCards = []
  filteredProviders.forEach(({title, includes})=>{
    providerCards.push({
      title,
      type: CardTypes.provider,
      includes,
      actions: [],
    })
  })

  // filter cards based on active filters
  const bannerCards = []
  const bannerFiltered = activeFilters[BANNER_FILTER].length>0
  const providerFiltered = activeFilters[PROVIDER_FILTER].length>0
  if (bannerFiltered || providerFiltered) {

    // if banner mode put selected provider in banner
    if (bannerFiltered) {
      const map = _.keyBy(activeFilters[BANNER_FILTER], 'title')
      providerCards.forEach(card=>{
        const { title } = card
        if (map[title]) {
          // goes in banner
          bannerCards.push(card)
        }
      })
      providerCards=[]
    } else {
      const map = _.keyBy(activeFilters[PROVIDER_FILTER], 'title')
      providerCards = providerCards.filter(({title})=>{
        return map[title]
      })
    }

  }

  // calculate provider width so that it can fit in as little rows as possible
  let width=270
  const nProviders = existingProviders.length
  if (nProviders>4) {
    switch ((nProviders+6) % 6) {
    case 0:
      width = 180
      break

    case 4:
    case 5:
      width = 216
      break
    }
  }

  return {allProviders: existingProviders, providerWidth: width-CARD_SPACING, providerCards, bannerCards}
}

export const filterOverview = (activeFilters, conditionFilters, conditionFilterSets, overview) => {
  // filter clusters based on activeFilters
  const filteredOverview = _.cloneDeep(overview)

  // filter by condition (ex: non-compliant)
  filteredOverview.clusters = filterByCondition(filteredOverview.clusters, conditionFilters, conditionFilterSets)

  // filter by provider (ex: only AWS)
  filteredOverview.clusters = filterByProvider(filteredOverview.clusters, activeFilters)

  // filter by label (ex: only Dev)
  const clusterSet = new Set()
  filteredOverview.clusters = filteredOverview.clusters.filter(cluster=>{
    const labels = _.get(cluster, 'metadata.labels', {})
    const { vendor='Other', environment='Other', region='Other'} = labels

    // filter by Region, Purpose, Vendor (ex: IKS)
    const types = [{vendor}, {environment}, {region}]
    for (var i = 0; i < types.length; i++) {
      const type = types[i]
      const key = Object.keys(type)[0]
      if (activeFilters[key].length>0 && activeFilters[key].indexOf(type[key])===-1) {
        return false
      }
    }

    // else we show this cluster in overview
    clusterSet.add(_.get(cluster, 'metadata.name', 'unknown'))
    return true
  })

  // filter pods
  filteredOverview.pods = filteredOverview.pods.filter(pod=>{
    const cluster = _.get(pod, 'cluster.metadata.name', 'unknown')
    return clusterSet.has(cluster)
  })

  return filteredOverview
}


export const filterByCondition = (clusters, conditionFilters, conditionFilterSets) => {
  if (conditionFilters.size>0) {
    const {noncompliantClusterSet, usageSets} = conditionFilterSets
    return clusters.filter((cluster)=>{
      const {metadata={}} = cluster
      const {namespace, name} = metadata
      const clusterPath=`${namespace}//${name}`
      let meetsAllConditions = true
      conditionFilters.forEach(condition=>{
        switch (condition) {
        case ConditionTypes.noncompliant:
          if (!noncompliantClusterSet.has(name)) {
            meetsAllConditions = false
          }
          break
        case ConditionTypes.highVcpu:
          if (!usageSets['cpu'].has(clusterPath)) {
            meetsAllConditions = false
          }
          break
        case ConditionTypes.highStorage:
          if (!usageSets['storage'].has(clusterPath)) {
            meetsAllConditions = false
          }
          break
        case ConditionTypes.highMemory:
          if (!usageSets['memory'].has(clusterPath)) {
            meetsAllConditions = false
          }
          break
        }
      })
      return meetsAllConditions
    })
  }
  return clusters
}


export const filterByProvider = (clusters, activeFilters) => {
  const bannerFiltered = activeFilters[BANNER_FILTER].length>0
  const providerFiltered = activeFilters[PROVIDER_FILTER].length>0
  if (bannerFiltered || providerFiltered) {
    activeFilters = bannerFiltered ? activeFilters[BANNER_FILTER] : activeFilters[PROVIDER_FILTER] // banner filter takes presidence
    return clusters.filter((cluster)=>{
      const labels = _.get(cluster, 'metadata.labels', {})
      return -1!==activeFilters.findIndex(({includes})=>{
        // filter match
        return includes.every(include=>{
          const keys = Object.keys(include)
          return keys.length===1 && labels[keys[0]].toLowerCase() === Object.values(include)[0].toLowerCase()
        })
      })
    })
  }
  return clusters
}

export const getMatchingClusters = (clusters, includes=[]) => {
  const kubeMap = {}
  const matchingClusters = clusters.filter((cluster)=>{
    const labels = _.get(cluster, 'metadata.labels', {})

    // provider match
    const cloudMatch = includes.every(include=>{
      const keys = Object.keys(include)
      return keys.length===1 && labels[keys[0]].toLowerCase() === Object.values(include)[0].toLowerCase()
    })

    // vendor types
    if (cloudMatch) {
      const { vendor='Other'} = labels
      let arr = kubeMap[vendor]
      if (!arr) {
        arr = kubeMap[vendor] = []
      }
      arr.push(vendor)
    }
    return cloudMatch
  })
  const kubeTypes = Object.keys(kubeMap).sort()
  return {matchingClusters, kubeMap, kubeTypes}
}

export const getUnknownClusters = (clusters, configuredProviders) => {
  const includes = _.flatten(configuredProviders.map(({includes})=>{ return includes}))
  return clusters.filter((cluster)=>{
    const labels = _.get(cluster, 'metadata.labels', {})
    const cloudMatch = includes.some(include=>{
      const keys = Object.keys(include)
      return keys.length===1 && labels[keys[0]].toLowerCase() === Object.values(include)[0].toLowerCase()
    })
    return !cloudMatch
  })
}

export const getSavedViewState = (locale) => {
  let state = null
  const savedState = localStorage.getItem(OVERVIEW_STATE_COOKIE)
  if (savedState) {
    try {
      state = JSON.parse(savedState)
    } catch (e) {
      //
    }
  }
  if (!state) {
    state = getDefaultViewState(locale)
  }
  return state
}

export const saveViewState = (state) => {
  localStorage.setItem(OVERVIEW_STATE_COOKIE, JSON.stringify(state))
}

export const resetViewState = () => {
  localStorage.removeItem(OVERVIEW_STATE_COOKIE)
}


