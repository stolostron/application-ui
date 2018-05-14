import * as Actions from './index'

export const updateTopologyFilters = (filterType, filters) => ({
  type: Actions.TOPOLOGY_FILTERS_UPDATE,
  filterType,
  filters,
})

export const updateTopologySelection = (nodeId) => ({
  type: Actions.TOPOLOGY_SELECTION_UPDATE,
  selectedNodeId: nodeId,
})
