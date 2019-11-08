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
  fetchFilters,
  willLoadDetails
) => ({
  type: Actions.RESOURCE_RECEIVE_SUCCESS,
  status: Actions.REQUEST_STATUS.DONE,
  nodes: response.resources || [],
  links: response.relationships || [],
  filters: {
    clusters: response.clusters,
    labels: response.labels,
    namespaces: response.namespaces,
    types: response.resourceTypes
  },
  resourceType,
  fetchFilters,
  willLoadDetails,
})

export const requestResourceDetails = (resourceType, fetchFilters, reloading) => ({
  type: Actions.RESOURCE_DETAILS_REQUEST,
  status: Actions.REQUEST_STATUS.IN_PROGRESS,
  resourceType,
  fetchFilters,
  reloading
})

export const receiveTopologyDetailsSuccess = (
  response,
  resourceType,
  fetchFilters
) => ({
  type: Actions.RESOURCE_DETAILS_RECEIVE_SUCCESS,
  status: Actions.REQUEST_STATUS.DONE,
  pods: response.pods || [],
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

          // if there's a cluster, also fetch details
          let clusterNames
          const clusterIdx = topology.resources.findIndex(({type})=>{return type==='cluster'})
          if (clusterIdx!==-1) {
            clusterNames = lodash.get(topology, `resources[${clusterIdx}].specs.clusterNames`)
          }
          const loadDetails = !!clusterNames
          dispatch(receiveTopologySuccess(topology, resourceType, fetchFilters, loadDetails))
          if (loadDetails) {
            dispatch(requestResourceDetails(resourceType, fetchFilters, reloading))
            apolloClient
              .getResource({name: 'HCMTopologyDetails'}, {filter: {clusterNames}})
              .then(response => {
                if (!response.errors) {
                  topology.pods = lodash.cloneDeep(response.data.topologyDetails.pods)
                  dispatch(receiveTopologyDetailsSuccess(topology, resourceType, fetchFilters))
                }
              })
              .catch(err => (err))
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
