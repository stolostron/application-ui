/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import { CardTypes } from './constants.js'
import msgs from '../../../nls/platform.properties'
import config from '../../../lib/shared/config'
import _ from 'lodash'

export const PROVIDER_FILTER = '_provider_'

// make sure all the providers that exist have a card
export const updateProviderCards = (overview, cardOrder, activeFilters, locale) => {

  const {clusters=[]} = overview

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

  // if any unknown clusters out there, add a Data Center provider
  const unknownClusters = getUnknownClusters(clusters, configuredProviders)
  if (unknownClusters.length>0) {
    const cloudSet = new Set()
    unknownClusters.forEach(cluster=>{
      const labels = _.get(cluster, 'metadata.labels', {})
      cloudSet.add(labels['cloud'])
    })
    cloudSet.forEach(cloud=>{
      existingProviders.push({'title':  _.capitalize(cloud), includes: [{'cloud': cloud}]})
    })
  }

  // make sure cardOrder has existing providers
  // don't chage provider cards if filtering providers
  if (activeFilters[PROVIDER_FILTER].length===0) {
    existingProviders.reverse().forEach(({title, includes})=>{
      const idx = cardOrder.findIndex(card=>{
        return card.type === CardTypes.provider && card.title===title
      })
      if (idx===-1) {
        cardOrder.unshift({
          title,
          type: CardTypes.provider,
          includes,
          actions: [],
        })
      }
    })
  }

  // calculate provider width so that it can fit in as little rows as possible
  let width
  const nProviders = existingProviders.length
  if (nProviders<=4) {
    width = 270
  } else {
    switch ((nProviders+6) % 6) {
    case 0:
    case 5:
      width = 180
      break

    case 1:
    case 2:
      width = 210
      break

    case 3:
    case 4:
      width = 270
      break
    }
  }

  return {allProviders: existingProviders, providerWidth: width-7}
}

export const filterViewState = (activeFilters, viewState) => {
  viewState.activeFilters = activeFilters

  // filter cards based on cloud filter
  if (activeFilters[PROVIDER_FILTER].length>0) {
    // filter out all providers
    if (!viewState.providerCards || viewState.providerCards.length===0) {
      viewState.providerCards = []
      viewState.cardOrder = viewState.cardOrder.filter(card=>{
        if (card.type===CardTypes.provider) {
          viewState.providerCards.push(card)
          return false
        }
        return true
      })
    }

    // put selected providers in banner
    viewState.bannerCards = []
    const map = _.keyBy(activeFilters[PROVIDER_FILTER], 'title')
    viewState.providerCards.forEach(card=>{
      const { title } = card
      if (map[title]) {
        // goes in banner
        viewState.bannerCards.push(card)
      }
    })
  } else if (viewState.providerCards.length!==0) {
    // restore all cards in original order
    viewState.cardOrder = [...viewState.providerCards, ...viewState.cardOrder]
    viewState.bannerCards = []
    viewState.providerCards = []
  }

  return viewState
}

export const filterOverview = (activeFilters, overview) => {
  // filter clusters based on activeFilters
  const filteredOverview = _.cloneDeep(overview)

  // provider filter
  if (activeFilters[PROVIDER_FILTER].length>0) {
    filteredOverview.clusters = getFilteredClusters(filteredOverview.clusters, activeFilters[PROVIDER_FILTER])
  }

  // other cluster filters
  const clusterSet = new Set()
  filteredOverview.clusters = filteredOverview.clusters.filter(cluster=>{
    const labels = _.get(cluster, 'metadata.labels', {})
    const { vendor='Other', environment='Other', region='Other'} = labels
    const types = [{vendor}, {environment}, {region}]
    for (var i = 0; i < types.length; i++) {
      const type = types[i]
      const key = Object.keys(type)[0]
      if (activeFilters[key].length>0 && activeFilters[key].indexOf(type[key])===-1) {
        return false
      }
    }
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


export const getFilteredClusters = (clusters, activeFilters) => {
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

