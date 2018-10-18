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
import {RESOURCE_TYPES} from '../../lib/shared/constants'
import apolloClient from '../../lib/client/apollo-client'

export const requestResource = (resourceType) => ({
  type: Actions.RESOURCE_REQUEST,
  status: Actions.REQUEST_STATUS.IN_PROGRESS,
  resourceType
})

export const receiveResourceError = (err, resourceType) => ({
  type: Actions.RESOURCE_RECEIVE_FAILURE,
  status: Actions.REQUEST_STATUS.ERROR,
  err,
  resourceType
})


export const receiveTopologySuccess = (response, resourceType, fetchFilters) => ({
  type: Actions.RESOURCE_RECEIVE_SUCCESS,
  status: Actions.REQUEST_STATUS.DONE,
  nodes: response.resources || [],
  links: response.relationships || [],
  filters: {
    clusters: response.clusters,
    labels: response.labels,
    namespaces: response.namespaces,
    types: response.resourceTypes,
  },
  resourceType,
  fetchFilters
})

export const fetchRequiredTopologyFilters = (resourceType, namespace, name, staticResourceData) => {
  return (dispatch) => {
    dispatch(requestResource(resourceType))
    return apolloClient.getResource(resourceType, {namespace, name})
      .then(response => {
        if (response.errors) {
          return dispatch(receiveResourceError(response.errors[0], resourceType))
        }
        dispatch({
          type: Actions.TOPOLOGY_REQUIRED_FILTERS_RECEIVE_SUCCESS,
          item: lodash.cloneDeep(response.data.items[0]),
          staticResourceData
        }, resourceType)
      })
      .catch(err => dispatch(receiveResourceError(err, resourceType)))
  }
}

export const fetchTopology = (vars, fetchFilters) => {
  const resourceType = RESOURCE_TYPES.HCM_TOPOLOGY
  return (dispatch) => {
    dispatch(requestResource(resourceType))
    return apolloClient.get(resourceType, vars)
      .then(response => {
        if (response.errors) {
          return dispatch(receiveResourceError(response.errors[0], resourceType))
        }
        return dispatch(receiveTopologySuccess({
          clusters: lodash.cloneDeep(response.data.clusters),
          labels: lodash.cloneDeep(response.data.labels),
          namespaces: lodash.cloneDeep(response.data.namespaces),
          resourceTypes: lodash.cloneDeep(response.data.resourceTypes),
          resources: lodash.cloneDeep(response.data.topology.resources),
          relationships: lodash.cloneDeep(response.data.topology.relationships),
        }, resourceType, fetchFilters))
      })
      .catch(err => dispatch(receiveResourceError(err, resourceType)))
  }
}

export const restoreSavedTopologyFilters = (namespace, name) => ({
  type: Actions.TOPOLOGY_RESTORE_SAVED_FILTERS,
  namespace,
  name,
})

export const updateTopologyFilters = (filterType, filters, namespace, name) => ({
  type: Actions.TOPOLOGY_FILTERS_UPDATE,
  filterType,
  filters,
  namespace,
  name
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

