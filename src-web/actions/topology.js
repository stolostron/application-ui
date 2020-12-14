/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import lodash from 'lodash'

import * as Actions from './index'
import { RESOURCE_TYPES } from '../../lib/shared/constants'
import apolloClient from '../../lib/client/apollo-client'
import { fetchResource } from './common'

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
  willLoadDetails
})

export const requestResourceDetails = (
  resourceType,
  fetchFilters,
  reloading
) => ({
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

//return the type of resources deployed by the application
//and whether there is only one subscription showing; in this case, retrieve the relatedKinds for this subscription only
export const getResourceData = nodes => {
  let subscriptionName = ''
  let nbOfSubscriptions = 0
  const nodeTypes = ['pod'] //always get pods

  nodes.forEach(node => {
    const nodeType = lodash.get(node, 'type', '')
    nodeTypes.push(nodeType) //ask for this related object type
    if (nodeType === 'subscription') {
      subscriptionName = lodash.get(node, 'name', '')
      nbOfSubscriptions = nbOfSubscriptions + 1
    }
  })

  return {
    subscription: nbOfSubscriptions === 1 ? subscriptionName : null, //ask for this subscription related kind only if one subscriptions shows up, otherwise it must show all subscriptions
    relatedKinds: lodash.uniq(nodeTypes) //ask only for these type of resources since only those are displayed
  }
}

export const fetchTopology = (vars, fetchFilters, reloading) => {
  const appName = lodash.get(fetchFilters, 'application.name', '')
  const appNS = lodash.get(fetchFilters, 'application.namespace', '')

  const resourceType = RESOURCE_TYPES.HCM_TOPOLOGY
  return dispatch => {
    dispatch(requestResource(resourceType, fetchFilters, reloading))
    apolloClient
      .getResource(resourceType, vars)
      .then(response => {
        if (response.errors) {
          dispatch(receiveResourceError(response.errors[0], resourceType))
        } else {
          //get application resource types and if only one subscription shows, get this subscription name
          //the data will be used to query the related kinds
          //if one subscription shows, get related kinds from the subscription object rather then the app, since the UI shows only that subscription
          //always ask only for related types that shows in the topology + pods
          const appData = getResourceData(
            lodash.get(response, 'data.topology.resources', [])
          )
          dispatch(
            fetchResource(
              RESOURCE_TYPES.HCM_APPLICATIONS,
              appNS,
              appName,
              appData
            )
          )
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
          dispatch(
            receiveTopologySuccess(topology, resourceType, fetchFilters, false)
          )
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
        return dispatch({
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
