/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import lodash from 'lodash'

import * as Actions from './index'
import { RESOURCE_TYPES } from '../../lib/shared/constants'
import apolloClient from '../../lib/client/apollo-client'
import { SEARCH_QUERY } from '../apollo-client/queries/SearchQueries'
import { convertStringToQuery } from '../../lib/client/search-helper'

export const requestResource = (resourceType, fetchFilters, reloading) => ({
  type: Actions.RESOURCE_REQUEST,
  status: Actions.REQUEST_STATUS.IN_PROGRESS,
  resourceType,
  fetchFilters,
  reloading
})

export const receiveResourceError = (err, resourceType) => ({
  type: Actions.RESOURCE_RECEIVE_FAILURE,
  status: Actions.REQUEST_STATUS.ERROR,
  err,
  resourceType
})

export const receiveTopologySuccess = (
  response,
  resourceType,
  fetchFilters
) => ({
  type: Actions.RESOURCE_RECEIVE_SUCCESS,
  status: Actions.REQUEST_STATUS.DONE,
  nodes: response.resources || [],
  links: response.relationships || [],
  pods: lodash.get(response, 'pods.items', []),
  filters: {
    clusters: response.clusters,
    labels: response.labels,
    namespaces: response.namespaces,
    types: response.resourceTypes
  },
  resourceType,
  fetchFilters
})

export const fetchTopology = (vars, fetchFilters, reloading) => {
  const resourceType = RESOURCE_TYPES.HCM_TOPOLOGY
  return dispatch => {
    dispatch(requestResource(resourceType, fetchFilters, reloading))
    apolloClient
      .getResource(resourceType, vars)
      .then(response => {
        if (response.errors) {
          dispatch(receiveResourceError(response.errors[0], resourceType))
        } else {
          // return topology
          const topology = {
            clusters: lodash.cloneDeep(response.data.clusters),
            labels: lodash.cloneDeep(response.data.labels),
            namespaces: lodash.cloneDeep(response.data.namespaces),
            resourceTypes: lodash.cloneDeep(response.data.resourceTypes),
            resources: lodash.cloneDeep(response.data.topology.resources),
            relationships: lodash.cloneDeep(
              response.data.topology.relationships
            )
          }
          dispatch(receiveTopologySuccess(topology, resourceType, fetchFilters))

          // if there's a cluster, fetch pods
          const clusterIdx = topology.resources.findIndex(({type})=>{return type==='clusters'})
          if (clusterIdx!==-1) {
            const clusterNames = lodash.get(topology, `resources[${clusterIdx}].specs.clusterNames`)
            if (clusterNames) {
              const query = convertStringToQuery( `kind:pod cluster:${clusterNames.join(',')}`)
              apolloClient
                .search(SEARCH_QUERY, { input: [query] })
                .then(response => {
                  if (!response.errors) {
                    const pods = response.data.searchResult && response.data.searchResult[0]
                    if (pods) {
                      topology.pods = pods
                      dispatch(receiveTopologySuccess(topology, resourceType, fetchFilters))
                    }
                  }
                })
                .catch(err => (err))
            }
          }
        }
      })
      .catch(err => dispatch(receiveResourceError(err, resourceType)))
  }
}

export const restoreSavedTopologyFilters = (namespace, name) => ({
  type: Actions.TOPOLOGY_RESTORE_SAVED_FILTERS,
  namespace,
  name
})

export const updateTopologyFilters = (
  filterType,
  filters,
  namespace,
  name
) => ({
  type: Actions.TOPOLOGY_FILTERS_UPDATE,
  filterType,
  filters,
  namespace,
  name
})

const receiveFiltersError = err => ({
  type: Actions.TOPOLOGY_FILTERS_RECEIVE_ERROR,
  err
})

export const fetchTopologyFilters = () => {
  return dispatch => {
    dispatch({
      type: Actions.TOPOLOGY_FILTERS_REQUEST
    })
    return apolloClient
      .getTopologyFilters()
      .then(response => {
        if (response.errors) {
          return dispatch(receiveFiltersError(response.errors[0]))
        }
        dispatch({
          type: Actions.TOPOLOGY_FILTERS_RECEIVE_SUCCESS,
          clusters: lodash.cloneDeep(response.data.clusters),
          labels: lodash.cloneDeep(response.data.labels),
          namespaces: lodash.cloneDeep(response.data.namespaces),
          types: lodash.cloneDeep(response.data.resourceTypes)
        })
      })
      .catch(err => dispatch(receiveFiltersError(err)))
  }
}
