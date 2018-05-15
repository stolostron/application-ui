import * as Actions from '../actions'
import { RESOURCE_TYPES } from '../../lib/shared/constants'

const initialState = {
  availableFilters: {
    clusters: [],
    types: [],
    namespaces: [],
  },
  activeFilters: {
    // cluster: [],
    type: ['cluster'],
    // namespace: [],
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
      const filters = {
        types: action.filters.types.map(i => ({label: i })),
        clusters: action.filters.clusters.map(c => ({ label: c.ClusterName })),
        namespaces: action.filters.namespaces.map(n => ({ label: n.name})),
      }
      return { ...state,
        status: Actions.REQUEST_STATUS.DONE,
        availableFilters: filters,
        nodes: action.nodes,
        links: action.links }
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
  case Actions.TOPOLOGY_FILTERS_UPDATE: {
    const activeFilters = {...state.activeFilters} || {}
    activeFilters[action.filterType] = action.filters.map((f) => f.label)
    return {...state, activeFilters}
  }
  case Actions.TOPOLOGY_SELECTION_UPDATE: {
    return { ...state, selectedNodeId: action.selectedNodeId }
  }
  default:
    return { ...state }
  }
}
