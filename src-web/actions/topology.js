/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import lodash from 'lodash'

import * as Actions from './index'
import apolloClient from '../../lib/client/apollo-client'

export const updateTopologyFilters = (filterType, filters) => ({
  type: Actions.TOPOLOGY_FILTERS_UPDATE,
  filterType,
  filters,
})

export const updateTopologySelection = (nodeId) => ({
  type: Actions.TOPOLOGY_SELECTION_UPDATE,
  selectedNodeId: nodeId,
})

const  receiveFiltersError = (err) => ({
  type: Actions.TOPOLOGY_FILTERS_RECEIVE_ERROR,
  err
})

export const fetchTopologyFilters = () => {
  return (dispatch) => {
    dispatch({
      type: Actions.TOPOLOGY_FILTERS_REQUEST,
    })
    return apolloClient.getTopologyFilters()
      .then(response => {
        if (response.errors) {
          return dispatch(receiveFiltersError(response.errors[0]))
        }
        dispatch({
          type: Actions.TOPOLOGY_FILTERS_RECEIVE_SUCCESS,
          clusters: lodash.cloneDeep(response.data.clusters),
          labels: lodash.cloneDeep(response.data.labels),
          namespaces: lodash.cloneDeep(response.data.namespaces),
          types: lodash.cloneDeep(response.data.resourceTypes),
        })
      })
      .catch(err => dispatch(receiveFiltersError(err)))
  }
}

