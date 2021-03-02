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

import * as Actions from './index'
import { RESOURCE_TYPES } from '../../lib/shared/constants'
import apolloClient from '../../lib/client/apollo-client'
import { fetchResource } from './common'
import { nodeMustHavePods } from '../components/Topology/utils/diagram-helpers-utils'

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
  let resurceMustHavePods = false
  const nodeTypes = []

  let isArgoApp = false
  const targetNamespaces = []
  const appNode = nodes.find(r => r.type === 'application')
  if (appNode) {
    isArgoApp =
      lodash
        .get(appNode, ['specs', 'raw', 'apiVersion'], '')
        .indexOf('argo') !== -1
    //get argo app destination namespacescase 'show_search':
    const targetNamespacesInfo = lodash.get(
      appNode,
      ['specs', 'raw', 'spec', 'destinations'],
      []
    )
    targetNamespacesInfo.forEach(targetNS => {
      const ns = lodash.get(targetNS, 'namespace')
      ns && targetNamespaces.push(ns)
    })
  }

  nodes.forEach(node => {
    const nodeType = lodash.get(node, 'type', '')
    if (!(isArgoApp && lodash.includes(['application', 'cluster'], nodeType))) {
      nodeTypes.push(nodeType) //ask for this related object type
    }
    if (nodeMustHavePods(node)) {
      //request pods when asking for related resources, this resource can have pods
      resurceMustHavePods = true
    }
    if (nodeType === 'subscription') {
      subscriptionName = lodash.get(node, 'name', '')
      nbOfSubscriptions = nbOfSubscriptions + 1
    }
  })

  if (resurceMustHavePods) {
    nodeTypes.push('pod')
  }

  return {
    //if only one subscription, ask for resources only related to that subscription
    subscription: nbOfSubscriptions === 1 ? subscriptionName : null,
    //ask only for these type of resources since only those are displayed
    relatedKinds: lodash.uniq(nodeTypes),
    isArgoApp,
    targetNamespaces
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
