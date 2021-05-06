/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

import lodash from 'lodash'
import * as Actions from '../actions'
import {
  getFilterState,
  saveFilterState
} from '../../lib/client/filter-helper'
import { RESOURCE_TYPES } from '../../lib/shared/constants'

const initialState = {
  availableFilters: {
    clusters: [],
    labels: [],
    namespaces: [],
    types: []
  },
  activeFilters: {
    namespace: [],
    type: [{ label: 'deployment' }] // Sets the default filters
  },
  diagramFilters: [],
  otherTypeFilters: [],
  links: [],
  nodes: [],
  status: Actions.REQUEST_STATUS.INCEPTION
}

//default k8 type filters
export const defaultTypeFilters = new Set([
  'internet',
  'host',
  'service',
  'deployment',
  'daemonset',
  'statefulset',
  'pod',
  'container'
])

export const topology = (state = initialState, action) => {
  if (
    action.resourceType &&
    action.resourceType.name === RESOURCE_TYPES.HCM_TOPOLOGY.name
  ) {
    switch (action.type) {
    case Actions.RESOURCE_REQUEST: {
      return {
        ...state,
        status: Actions.REQUEST_STATUS.IN_PROGRESS,
        fetchFilters: action.fetchFilters,
        reloading: action.reloading,
        loaded: action.reloading,
        detailsReloading: false
      }
    }
    case Actions.RESOURCE_RECEIVE_SUCCESS: {
      const { links, nodes, willLoadDetails } = action
      return {
        ...state,
        status: Actions.REQUEST_STATUS.DONE,
        nodes,
        links,
        activeFilters: action.fetchFilters,
        loaded: true,
        reloading: false,
        detailsLoaded: !willLoadDetails,
        willLoadDetails
      }
    }
    case Actions.RESOURCE_DETAILS_REQUEST: {
      return {
        ...state,
        detailsStatus: Actions.REQUEST_STATUS.IN_PROGRESS,
        fetchFilters: action.fetchFilters,
        detailsReloading: action.reloading,
        detailsLoaded: action.reloading,
        willLoadDetails: false
      }
    }
    case Actions.RESOURCE_DETAILS_RECEIVE_SUCCESS: {
      const { pods } = action
      return {
        ...state,
        detailsStatus: Actions.REQUEST_STATUS.DONE,
        pods,
        activeFilters: action.fetchFilters,
        detailsLoaded: true,
        detailsReloading: false
      }
    }
    case Actions.RESOURCE_RECEIVE_FAILURE: {
      return {
        ...state,
        status: Actions.REQUEST_STATUS.ERROR,
        fetchError: action.err,
        nodes: action.nodes,
        links: action.links
      }
    }
    case Actions.RESOURCE_RECEIVE_CLUSTER_OFFLINE: {
      return {
        ...state,
        status: Actions.REQUEST_STATUS.CLUSTER_OFFLINE,
        err: action.err,
        detailsLoaded: true,
        loaded: true,
        nodes: [],
        links: []
      }
    }
    }
  }

  switch (action.type) {
  case '@@INIT': {
    return initialState
  }
  case Actions.TOPOLOGY_FILTERS_REQUEST: {
    return {
      ...state,
      filtersStatus: Actions.REQUEST_STATUS.IN_PROGRESS
    }
  }
  case Actions.TOPOLOGY_FILTERS_RECEIVE_ERROR: {
    return {
      ...state,
      filtersStatus: Actions.REQUEST_STATUS.ERROR,
      err: action.err
    }
  }
  case Actions.TOPOLOGY_RESTORE_SAVED_FILTERS: {
    const { filters: activeFilters, otherTypeFilters } = getFilterState(
      initialState.activeFilters
    )
    return { ...state, activeFilters, otherTypeFilters, savingFilters: true }
  }
  case Actions.TOPOLOGY_FILTERS_UPDATE: {
    const activeFilters = { ...state.activeFilters } || {}
    activeFilters[action.filterType] = action.filters
    if (state.savingFilters) {
      const { namespace, name } = action
      saveFilterState(namespace, name, {
        filters: activeFilters,
        otherTypeFilters: state.otherTypeFilters
      })
    }
    return { ...state, activeFilters }
  }
  case Actions.TOPOLOGY_SET_ACTIVE_FILTERS: {
    const { activeFilters, reloading = false } = action
    return {
      ...state,
      status: Actions.REQUEST_STATUS.INCEPTION,
      activeFilters,
      reloading
    }
  }
  case Actions.TOPOLOGY_NAME_SEARCH: {
    const { searchName } = action
    return { ...state, searchName }
  }
  case Actions.TOPOLOGY_FILTERS_RECEIVE_SUCCESS: {
    // The 'clusters' filter is different from other filters.
    // Here we are building the filter options using the cluster labels. When a filter is
    // is selected, we have to use the clusters associated with the label (filterValues).
    const clusterFilters = []
    action.clusters.forEach(({ metadata: c }) => {
      clusterFilters.push({
        label: `name: ${c.name}`,
        filterValues: [c.name]
      })
      Object.keys(c.labels).forEach(labelKey => {
        const existingLabel = clusterFilters.find(
          l => l.label === `${labelKey}: ${c.labels[labelKey]}`
        )
        if (existingLabel) {
          existingLabel.filterValues.push(c.name)
        } else {
          clusterFilters.push({
            label: `${labelKey}: ${c.labels[labelKey]}`,
            filterValues: [c.name]
          })
        }
      })
    })

    // consolidate misc types into "other" type
    const otherTypeFilters = []
    let types = action.types.map(i => ({ label: i }))
    if (types.length > 0) {
      types = types.filter(({ label }) => {
        if (defaultTypeFilters.has(label)) {
          return true
        } else {
          otherTypeFilters.push(label)
          return false
        }
      })
      types.push({ label: 'other' })
    }

    const filters = {
      clusters: clusterFilters,
      labels: action.labels.map(l => ({
        label: `${l.name}: ${l.value}`,
        name: l.name,
        value: l.value
      })),
      namespaces: lodash
        .uniqBy(action.namespaces, 'metadata.name')
        .map(n => ({ label: n.metadata.name })),
      types
    }
    return {
      ...state,
      availableFilters: filters,
      otherTypeFilters,
      filtersStatus: Actions.REQUEST_STATUS.DONE
    }
  }
  case Actions.DIAGRAM_RESTORE_FILTERS: {
    const { namespace, name, initialDiagramFilters } = action
    const { filters: diagramFilters } = getFilterState(
      initialDiagramFilters,
      namespace,
      name
    )
    state.diagramFilters = diagramFilters
    return { ...state }
  }
  case Actions.DIAGRAM_SAVE_FILTERS: {
    const { namespace, name, diagramFilters } = action
    saveFilterState(namespace, name, { filters: diagramFilters })
    state.diagramFilters = diagramFilters
    return { ...state }
  }
  default:
    return { ...state }
  }
}
