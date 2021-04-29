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
import { SEARCH_QUERY } from '../apollo-client/queries/SearchQueries'
import { convertStringToQuery } from '../../lib/client/search-helper'
import msgs from '../../nls/platform.properties'

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
  const result = {}
  let isArgoApp = false
  const appNode = nodes.find(r => r.type === 'application')
  if (appNode) {
    isArgoApp =
      lodash
        .get(appNode, ['specs', 'raw', 'apiVersion'], '')
        .indexOf('argo') !== -1
    result.isArgoApp = isArgoApp
    //get argo app destination namespaces 'show_search':
    if (isArgoApp) {
      result.source = lodash.get(
        appNode,
        ['specs', 'raw', 'spec', 'source'],
        {}
      )
    }
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

  //if only one subscription, ask for resources only related to that subscription
  result.subscription = nbOfSubscriptions === 1 ? subscriptionName : null
  //ask only for these type of resources since only those are displayed
  result.relatedKinds = lodash.uniq(nodeTypes)

  return result
}

//open URL for this Route resource
export const openRouteURL = (routeObject, toggleLoading, handleErrorMsg) => {
  const name = lodash.get(routeObject, 'name', '')
  const namespace = lodash.get(routeObject, 'namespace', '')
  const cluster = lodash.get(routeObject, 'cluster', '')
  const apigroup = lodash.get(routeObject, 'apigroup', '')
  const apiversion = lodash.get(routeObject, 'apiversion', '')
  const routeRequest = {
    name: name,
    namespace: namespace,
    cluster: cluster,
    apiVersion: `${apigroup}/${apiversion}`
  }
  toggleLoading()
  apolloClient
    .getRouteResourceURL(routeRequest)
    .then(routeURLResult => {
      toggleLoading()
      if (routeURLResult.errors) {
        handleErrorMsg(`Error: ${routeURLResult.errors[0].message}`)
      } else {
        if (routeURLResult.data.routeResourceURL) {
          window.open(`${routeURLResult.data.routeResourceURL}`, '_blank')
        } else {
          handleErrorMsg(msgs.get('resource.route.err', [namespace, cluster]))
        }
      }
    })
    .catch(err => {
      toggleLoading()
      handleErrorMsg(`Error: ${err.msg}`)
    })
}

const getArgoRoute = (args, appName, appNamespace, cluster, handleErrorMsg) => {
  apolloClient
    .getArgoAppRouteURL(args)
    .then(routeURLResult => {
      if (routeURLResult.errors) {
        handleErrorMsg(`Error: ${routeURLResult.errors[0].message}`)
      } else {
        if (routeURLResult.data.argoAppRouteURL) {
          window.open(
            `${routeURLResult.data.argoAppRouteURL}/${appName}`,
            '_blank'
          )
        } else {
          handleErrorMsg(
            msgs.get('resource.argo.app.route.err', [appNamespace, cluster])
          )
        }
      }
    })
    .catch(err => {
      handleErrorMsg(`Error: ${err.msg}`)
    })
}

//open argo app editor url for this Argo app, in a separate window
export const openArgoCDEditor = (
  cluster,
  namespace,
  name,
  toggleLoading,
  handleErrorMsg
) => {
  // toggle loading to true
  toggleLoading()

  if (cluster === 'local-cluster') {
    const routeRequest = {
      name: '',
      namespace: namespace,
      cluster: cluster,
      apiVersion: 'route.openshift.io/v1'
    }
    getArgoRoute(routeRequest, name, namespace, cluster, handleErrorMsg)
    // toggle loading to false
    toggleLoading()
  } else {
    const query = convertStringToQuery(
      `kind:route namespace:${namespace} cluster:${cluster} label:app.kubernetes.io/part-of=argocd`
    )
    apolloClient
      .search(SEARCH_QUERY, { input: [query] })
      .then(result => {
        // toggle loading to false
        toggleLoading()
        if (result.errors) {
          handleErrorMsg(`Error: ${result.errors[0].message}`)
          return
        } else {
          const searchResult = lodash.get(result, 'data.searchResult', [])
          if (searchResult.length > 0) {
            const routes = lodash.get(searchResult[0], 'items', [])
            const route = routes.length > 0 ? routes[0] : null
            if (!route) {
              const errMsg = msgs.get('resource.argo.app.route.err', [
                namespace,
                cluster
              ])
              handleErrorMsg(errMsg)
              return
            } else {
              //get route object info
              const routeRequest = {
                name: route.name,
                namespace: route.namespace,
                cluster: route.cluster,
                apiVersion: `${route.apigroup}/${route.apiversion}`
              }
              getArgoRoute(
                routeRequest,
                name,
                namespace,
                cluster,
                handleErrorMsg
              )
            }
          }
        }
      })
      .catch(() => {
        handleErrorMsg(`Error: ${msgs.get('error.launch.argo.editor')}`)
      })
  }
}

//fetch all deployed objects linked to this topology nodes
const fetchApplicationRelatedObjects = (
  dispatch,
  appNS,
  appName,
  appData,
  resourceType,
  fetchFilters,
  response
) => {
  dispatch(
    fetchResource(RESOURCE_TYPES.HCM_APPLICATIONS, appNS, appName, appData)
  )
  // return topology
  const topology = {
    clusters: lodash.cloneDeep(response.data.clusters),
    labels: lodash.cloneDeep(response.data.labels),
    namespaces: lodash.cloneDeep(response.data.namespaces),
    resourceTypes: lodash.cloneDeep(response.data.resourceTypes),
    resources: lodash.cloneDeep(response.data.topology.resources),
    relationships: lodash.cloneDeep(response.data.topology.relationships)
  }
  dispatch(receiveTopologySuccess(topology, resourceType, fetchFilters, false))
}

//try to find the name of the remote clusters using the server path
export const findMatchingCluster = (argoApp, argoMappingInfo) => {
  const serverApi = lodash.get(argoApp, 'destinationServer')
  if (
    (serverApi && serverApi === 'https://kubernetes.default.svc') ||
    lodash.get(argoApp, 'destinationName', '') === 'in-cluster'
  ) {
    return argoApp.cluster //target is the same as the argo app cluster
  }
  if (argoMappingInfo && serverApi) {
    // try to get server name from argo secret annotation
    try {
      const serverHostName = new URL(serverApi).hostname.substring(0, 63)
      const nameLabel = 'cluster-name='
      const serverLabel = `cluster-server=${serverHostName}`
      const mapServerInfo = lodash.find(
        lodash.map(argoMappingInfo, 'label', []),
        obj => obj.indexOf(serverLabel) !== -1
      )
      if (mapServerInfo) {
        // get the cluster name
        const labelsList = mapServerInfo.split(';')
        const clusterNameLabel = lodash.find(labelsList, obj =>
          lodash.includes(obj, nameLabel)
        )
        if (clusterNameLabel) {
          return clusterNameLabel.split('=')[1]
        }
        return serverApi
      }
    } catch (err) {
      // do nothing
      return serverApi
    }
  }
  return serverApi
}

const setArgoAppDetails = (
  allApps,
  dispatch,
  appNS,
  appName,
  appData,
  resourceType,
  fetchFilters,
  response
) => {
  const targetNS = []
  const targetClusters = []
  const argoAppsLabelNames = []
  const targetNSForClusters = {} //keep track of what namespaces each cluster must deploy on
  allApps.forEach(argoApp => {
    //get destination and clusters information
    argoAppsLabelNames.push(`app.kubernetes.io/instance=${argoApp.name}`)
    const argoNS = argoApp.destinationNamespace
    argoNS && targetNS.push(argoNS)
    const argoServerDest = findMatchingCluster(
      argoApp,
      lodash.get(appData, 'argoSecrets')
    )
    const argoServerNameDest = argoServerDest || argoApp.destinationName
    lodash.set(
      argoApp,
      'destinationCluster',
      argoServerNameDest || argoApp.destinationServer
    )
    const targetClusterName = argoServerNameDest
      ? argoServerNameDest
      : argoServerDest ? argoServerDest : null
    if (targetClusterName) {
      targetClusters.push(targetClusterName)
      //add namespace to target list
      if (!targetNSForClusters[targetClusterName]) {
        targetNSForClusters[targetClusterName] = []
      }
      if (
        argoNS &&
        !lodash.includes(targetNSForClusters[targetClusterName], argoNS)
      ) {
        targetNSForClusters[targetClusterName].push(argoNS)
      }
    }
  })
  appData.targetNamespaces = lodash.uniq(targetNS)
  appData.clusterInfo = lodash.uniq(targetClusters)
  appData.argoAppsLabelNames = lodash.uniq(argoAppsLabelNames)
  //store all argo apps and destination clusters info on the first app
  const topoResources = lodash.get(response, 'data.topology.resources', [])
  const firstNode = topoResources[0]
  const topoClusterNode = lodash.find(topoResources, {
    id: 'member--clusters--'
  })
  lodash.set(firstNode, 'specs.relatedApps', allApps)
  //desired deployment state
  lodash.set(firstNode, 'specs.clusterNames', appData.clusterInfo)
  lodash.set(topoClusterNode, 'specs.appClusters', appData.clusterInfo)
  const initialClusterData = []
  //make sure clusters array always contain only objects
  appData.clusterInfo.forEach(cls => {
    initialClusterData.push({
      name: cls
    })
  })
  lodash.set(topoClusterNode, 'specs.clusters', initialClusterData)
  lodash.set(topoClusterNode, 'specs.targetNamespaces', targetNSForClusters)

  fetchApplicationRelatedObjects(
    dispatch,
    appNS,
    appName,
    appData,
    resourceType,
    fetchFilters,
    response
  )
}

//get all argo applications using the same source repo as the selected app
const fetchArgoApplications = (
  dispatch,
  appNS,
  appName,
  appData,
  resourceType,
  fetchFilters,
  response
) => {
  //get all argo apps with the same source repo as this one
  const query = convertStringToQuery('kind:application apigroup:argoproj.io')
  for (const [property, value] of Object.entries(appData.source)) {
    // add argo app source filters
    query.filters.push({ property, values: [value] })
  }
  apolloClient
    .search(SEARCH_QUERY, { input: [query] })
    .then(app_response => {
      let allApps = []
      const searchResult = lodash.get(app_response, 'data.searchResult', [])
      if (searchResult.length > 0) {
        allApps = lodash.get(searchResult[0], 'items', [])
        // find argo server mapping
        const argoAppNS = lodash.uniqBy(lodash.map(allApps, 'namespace'))
        if (argoAppNS.length > 0) {
          const query = convertStringToQuery(
            `kind:secret namespace:${argoAppNS.join()} label:apps.open-cluster-management.io/acm-cluster='true'`
          )
          apolloClient
            .search(SEARCH_QUERY, { input: [query] })
            .then(secretResult => {
              const secretItems = lodash.get(
                secretResult,
                'data.searchResult',
                [{ items: [] }]
              )[0]
              lodash.set(
                appData,
                'argoSecrets',
                lodash.get(secretItems, 'items', [])
              )
              setArgoAppDetails(
                allApps,
                dispatch,
                appNS,
                appName,
                appData,
                resourceType,
                fetchFilters,
                response
              )
            })
            .catch(err => {
              lodash.set(appData, 'err', err)
              setArgoAppDetails(
                allApps,
                dispatch,
                appNS,
                appName,
                appData,
                resourceType,
                fetchFilters,
                response
              )
            })
        } else {
          setArgoAppDetails(
            allApps,
            dispatch,
            appNS,
            appName,
            appData,
            resourceType,
            fetchFilters,
            response
          )
        }
      }
    })
    .catch(err => {
      //return topology when failing to retrieve related apps
      const topology = {
        clusters: lodash.cloneDeep(response.data.clusters),
        labels: lodash.cloneDeep(response.data.labels),
        namespaces: lodash.cloneDeep(response.data.namespaces),
        resourceTypes: lodash.cloneDeep(response.data.resourceTypes),
        resources: lodash.cloneDeep(response.data.topology.resources),
        relationships: lodash.cloneDeep(response.data.topology.relationships)
      }
      dispatch(
        receiveTopologySuccess(topology, resourceType, fetchFilters, false)
      )
      dispatch(receiveResourceError(err, RESOURCE_TYPES.HCM_APPLICATIONS))
    })
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
          if (appData.isArgoApp) {
            fetchArgoApplications(
              dispatch,
              appNS,
              appName,
              appData,
              resourceType,
              fetchFilters,
              response
            )
          } else {
            fetchApplicationRelatedObjects(
              dispatch,
              appNS,
              appName,
              appData,
              resourceType,
              fetchFilters,
              response
            )
          }
        }
      })
      .catch(err => {
        dispatch(receiveResourceError(err, resourceType))
      })
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
