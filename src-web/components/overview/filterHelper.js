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
import { getDefaultViewState } from './defaults.js'
import { OVERVIEW_STATE_COOKIE  } from '../../../lib/shared/constants'
import config from '../../../lib/shared/config'
import _ from 'lodash'

export const BANNER_FILTER = '_banner_'
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
  // remove non existant provider cards
  let idx = 0
  const existingMap = _.keyBy(existingProviders, 'title')
  while(idx < cardOrder.length) {
    const {type, title} = cardOrder[idx]
    if (type === CardTypes.provider) {
      if (!existingMap[title]) {
        cardOrder.splice(idx,1)
        idx--
      }
    }
    idx++
  }

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

  const bannerFiltered = activeFilters[BANNER_FILTER].length>0
  const providerFiltered = activeFilters[PROVIDER_FILTER].length>0
  if (!bannerFiltered && !providerFiltered) {

    // remove redundant provider cards
    let idx = 0
    const providerSet = new Set()
    while(idx < cardOrder.length) {
      const {type, title} = cardOrder[idx]
      if (type === CardTypes.provider) {
        if (!providerSet.has(title)) {
          providerSet.add(title)
        } else {
          cardOrder.splice(idx,1)
          idx--
        }
      }
      idx++
    }

    // make sure cardOrder has existing providers
    // don't chage provider cards if filtering providers
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
  let width=270
  const nProviders = existingProviders.length
  if (nProviders>4) {
    switch ((nProviders+6) % 6) {
    case 0:
      width = 180
      break

    case 4:
    case 5:
      width = 210
      break
    }
  }

  return {allProviders: existingProviders, providerWidth: width-7}
}

export const filterViewState = (activeFilters, prevState) => {
  const { viewState } = prevState
  let { bannerCards, providerCards=[] } = prevState

  // filter cards based on cloud filter
  const bannerFiltered = activeFilters[BANNER_FILTER].length>0
  const providerFiltered = activeFilters[PROVIDER_FILTER].length>0
  if (bannerFiltered || providerFiltered) {

    // remember all provider cards
    if (providerCards.length===0) {
      providerCards = []
      viewState.cardOrder.forEach(card=>{
        if (card.type===CardTypes.provider) {
          providerCards.push(card)
        }
      })
    }
    // then filter them out
    viewState.cardOrder = viewState.cardOrder.filter(card=>{
      return (card.type!==CardTypes.provider)
    })

    // if banner mode put selected provider in banner
    bannerCards = []
    if (bannerFiltered) {
      const map = _.keyBy(activeFilters[BANNER_FILTER], 'title')
      providerCards.forEach(card=>{
        const { title } = card
        if (map[title]) {
          // goes in banner
          bannerCards.push(card)
        }
      })
    } else {
      const map = _.keyBy(activeFilters[PROVIDER_FILTER], 'title')
      const filteredProviders = providerCards.filter(({title})=>{
        return map[title]
      })
      viewState.cardOrder = [...filteredProviders, ...viewState.cardOrder]
    }

  } else if (providerCards.length>0) {
    // restore all cards in original order
    viewState.cardOrder = viewState.cardOrder.filter(card=>{
      return (card.type!==CardTypes.provider)
    })
    viewState.cardOrder = [...providerCards, ...viewState.cardOrder]
    bannerCards = []
    providerCards = []
  }

  return { viewState, bannerCards, providerCards }
}

export const filterOverview = (activeFilters, overview) => {
  // filter clusters based on activeFilters
  const filteredOverview = _.cloneDeep(overview)

  // provider filter
  filteredOverview.clusters = getFilteredClusters(filteredOverview.clusters, activeFilters)

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


