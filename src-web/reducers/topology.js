import lodash from 'lodash'
import * as Actions from '../actions'
import { RESOURCE_TYPES } from '../../lib/shared/constants'

const initialState = {
  availableFilters: {
    clusters: [],
    labels: [],
    namespaces: [],
    types: [],
  },
  activeFilters: {
    namespace: [{ label: 'default'}], // Sets the default filters
  },
  links: [],
  nodes: [],
  selectedNodeId: '',
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
      status: Actions.REQUEST_STATUS.ERROR,
      err: action.err,
    }
  }
  case Actions.TOPOLOGY_FILTERS_RECEIVE_SUCCESS: {
    const filters = {
      types: action.types.map(i => ({label: i })),
      labels: action.labels.map(l => ({label: `${l.name}: ${l.value}`, name: l.name, value: l.value })),
      clusters: action.clusters.map(c => ({ label: c.ClusterName })),
      namespaces: lodash.uniqBy(action.namespaces, 'name').map(n => ({ label: n.name})),
    }
    return {...state,
      availableFilters: filters,
      filtersStatus: Actions.REQUEST_STATUS.DONE,
    }
  }
  case Actions.TOPOLOGY_FILTERS_UPDATE: {
    const activeFilters = {...state.activeFilters} || {}
    activeFilters[action.filterType] = action.filters
    return {...state, activeFilters}
  }
  case Actions.TOPOLOGY_SELECTION_UPDATE: {
    return { ...state, selectedNodeId: action.selectedNodeId }
  }
  default:
    return { ...state }
  }
}
