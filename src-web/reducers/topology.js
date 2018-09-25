/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import lodash from 'lodash'
import * as Actions from '../actions'
import { RESOURCE_TYPES, HCM_TOPOLOGY_FILTER_COOKIE } from '../../lib/shared/constants'

const initialState = {
  availableFilters: {
    clusters: [],
    labels: [],
    namespaces: [],
    types: [],
  },
  activeFilters: {
    namespace: [],
    type: [{ label: 'deployment'}] // Sets the default filters
  },
  links: [],
  nodes: [],
  status: Actions.REQUEST_STATUS.INCEPTION,
}


export const topology = (state = initialState, action) => {
  if (action.resourceType && action.resourceType.name === RESOURCE_TYPES.HCM_TOPOLOGY.name){
    switch (action.type) {
    case Actions.RESOURCE_REQUEST: {
      return {...state, status: Actions.REQUEST_STATUS.IN_PROGRESS}
    }
    case Actions.RESOURCE_RECEIVE_SUCCESS: {
      return { ...state,
        status: Actions.REQUEST_STATUS.DONE,
        nodes: action.nodes,
        links: action.links,
      }
    }
    case Actions.RESOURCE_RECEIVE_FAILURE: {
      return { ...state, status: Actions.REQUEST_STATUS.ERROR, nodes: action.nodes, links: action.links }
    }
    }
  }

  switch (action.type){
  case '@@INIT':{
    return initialState
  }
  case Actions.TOPOLOGY_FILTERS_REQUEST: {
    return {...state,
      filtersStatus: Actions.REQUEST_STATUS.IN_PROGRESS,
    }
  }
  case Actions.TOPOLOGY_FILTERS_RECEIVE_ERROR: {
    return {...state,
      filtersStatus: Actions.REQUEST_STATUS.ERROR,
      err: action.err,
    }
  }
  case Actions.TOPOLOGY_RESTORE_SAVED_FILTERS: {
    const savingFilters = true
    let activeFilters = {...state.activeFilters} || {}
    const savedActiveFilters = localStorage.getItem(`${HCM_TOPOLOGY_FILTER_COOKIE}`)
    if (savedActiveFilters) {
      try {
        activeFilters = JSON.parse(savedActiveFilters)
      } catch (e) {
        //
      }
    }
    return {...state, activeFilters, savingFilters}
  }
  case Actions.TOPOLOGY_FILTERS_RECEIVE_SUCCESS: {
    // The 'clusters' filter is different from other filters.
    // Here we are building the filter options using the cluster labels. When a filter is
    // is selected, we have to use the clusters associated with the label (filterValues).
    const clusterFilters = []
    action.clusters.forEach(({metadata:c}) => {
      clusterFilters.push({
        label: `name: ${c.name}`, //FIXME: NLS. Labels received from the API aren't translated either.
        filterValues: [c.name],
      })
      Object.keys(c.labels).forEach(labelKey => {
        const existingLabel = clusterFilters.find(l => l.label === `${labelKey}: ${c.labels[labelKey]}`)
        if(existingLabel) {
          existingLabel.filterValues.push(c.name)
        }
        else {
          clusterFilters.push({
            label: `${labelKey}: ${c.labels[labelKey]}`,
            filterValues: [c.name],
          })
        }
      })
    })

    const filters = {
      clusters: clusterFilters,
      labels: action.labels.map(l => ({label: `${l.name}: ${l.value}`, name: l.name, value: l.value })),
      namespaces: lodash.uniqBy(action.namespaces, 'metadata.name').map(n => ({ label: n.metadata.name})),
      types: action.types.map(i => ({label: i })),
    }
    return {...state,
      availableFilters: filters,
      filtersStatus: Actions.REQUEST_STATUS.DONE,
    }
  }
  case Actions.TOPOLOGY_FILTERS_UPDATE: {
    const activeFilters = {...state.activeFilters} || {}
    activeFilters[action.filterType] = action.filters
    if (state.savingFilters) {
      localStorage.setItem(`${HCM_TOPOLOGY_FILTER_COOKIE}`, JSON.stringify(activeFilters))
    }
    return {...state, activeFilters}
  }
  case Actions.TOPOLOGY_ACTIVE_FILTERS_RECEIVE_SUCCESS: {
    const {item, staticResourceData: {topologyActiveFilters}} = action
    const activeFilters = topologyActiveFilters(item)
    return {...state, activeFilters}
  }
  default:
    return { ...state }
  }
}
