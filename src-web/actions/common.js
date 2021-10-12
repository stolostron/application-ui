/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

import _ from 'lodash'

import * as Actions from './index'
import apolloClient from '../../lib/client/apollo-client'
import {
  SEARCH_QUERY,
  SEARCH_QUERY_RELATED
} from '../apollo-client/queries/SearchQueries'
import {
  convertStringToQuery,
  searchError,
  searchFailure,
  searchSuccess,
  shouldTrySearch
} from '../../lib/client/search-helper'
import { mapBulkChannels } from '../reducers/data-mappers/mapChannelsBulk'
import { mapBulkSubscriptions } from '../reducers/data-mappers/mapSubscriptionsBulk'
import { mapSingleApplication } from '../reducers/data-mappers/mapApplicationsSingle'
import { RESOURCE_TYPES } from '../../lib/shared/constants'
import msgs from '../../nls/platform.properties'

const kindApplication = 'kind:application'

export const changeTablePage = ({ page, pageSize }, resourceType) => ({
  type: Actions.TABLE_PAGE_CHANGE,
  page,
  pageSize,
  resourceType
})

export const searchTable = (search, resourceType) => ({
  type: Actions.TABLE_SEARCH,
  search,
  resourceType
})

export const sortTable = (sortDirection, sortColumn, resourceType) => ({
  type: Actions.TABLE_SORT,
  sortDirection,
  sortColumn,
  resourceType
})

export const receiveResourceSuccess = (response, resourceType) => ({
  type: Actions.RESOURCE_RECEIVE_SUCCESS,
  status: Actions.REQUEST_STATUS.DONE,
  items: response.items,
  resourceVersion: _.get(response, 'metadata.resourceVersion'), //only supported on k8s resoruces
  resourceType
})

export const receiveResourceError = (err, resourceType) => ({
  type: Actions.RESOURCE_RECEIVE_FAILURE,
  status: Actions.REQUEST_STATUS.ERROR,
  err,
  resourceType
})

export const receiveResourceNotFound = (err, resourceType) => ({
  type: Actions.RESOURCE_RECEIVE_NOT_FOUND,
  status: Actions.REQUEST_STATUS.NOT_FOUND,
  err,
  resourceType
})

export const receiveClusterOffline = (err, resourceType) => ({
  type: Actions.RESOURCE_RECEIVE_CLUSTER_OFFLINE,
  status: Actions.REQUEST_STATUS.CLUSTER_OFFLINE,
  err,
  resourceType
})

export const requestResource = resourceType => ({
  type: Actions.RESOURCE_REQUEST,
  status: Actions.REQUEST_STATUS.IN_PROGRESS,
  resourceType
})

export const addResource = (item, resourceType) => ({
  type: Actions.RESOURCE_ADD,
  resourceType: item.kind || resourceType,
  item
})

export const modifyResource = (item, resourceType) => ({
  type: Actions.RESOURCE_MODIFY,
  resourceType: item.kind || resourceType,
  item
})

export const deleteResource = (item, resourceType) => ({
  type: Actions.RESOURCE_DELETE,
  resourceType: item.kind || resourceType,
  item
})

export const mutateResource = (resourceType, resourceName) => ({
  type: Actions.RESOURCE_MUTATE,
  resourceName,
  resourceType
})

export const mutateResourceSuccess = (resourceType, resourceName) => ({
  type: Actions.RESOURCE_MUTATE_SUCCESS,
  resourceName,
  resourceType
})

export const mutateResourceFailure = (resourceType, error) => ({
  type: Actions.RESOURCE_MUTATE_FAILURE,
  postStatus: Actions.REQUEST_STATUS.ERROR,
  err: { error },
  resourceType
})

export const getQueryStringForResources = resourcename => {
  switch (resourcename) {
  case 'HCMChannel':
    return convertStringToQuery('kind:channel')
  case 'HCMSubscription':
    return convertStringToQuery('kind:subscription')
  case 'HCMApplication':
    return convertStringToQuery(kindApplication)
  case 'HCMPlacementRule':
    return convertStringToQuery('kind:placementrule')
  default:
    return convertStringToQuery(kindApplication)
  }
}

export const getQueryStringForResource = (resourcename, name, namespace) => {
  let resource = ''
  const nameForQuery = name ? `name:${name}` : ''
  const namespaceForQuery = namespace ? ` namespace:${namespace}` : ''
  if (resourcename) {
    switch (resourcename) {
    case 'HCMChannel':
      resource = 'kind:channel '
      break
    case 'HCMSubscription':
      resource = 'kind:subscription '
      break
    case 'HCMApplication':
      resource = `${kindApplication} `
      break
    case 'HCMPlacementRule':
      resource = 'kind:placementrule '
      break
    default:
      resource = `kind:${resourcename} `
    }
  }
  return convertStringToQuery(`${resource}${nameForQuery}${namespaceForQuery}`)
}

const transformFallbackResult = (resourceType, result) => {
  if (result && result.data) {
    switch (resourceType.name) {
    case RESOURCE_TYPES.QUERY_APPLICATIONS.name:
      return {
        data: {
          applications:
              result.data.applications &&
              result.data.applications.map(app => ({
                name: app.metadata.name,
                namespace: app.metadata.namespace,
                created: app.metadata.creationTimestamp,
                _uid: app.metadata.uid,
                apiVersion: app.raw.apiVersion,
                cluster: 'local-cluster',
                destinationNamespace: _.get(
                  app,
                  'raw.spec.destination.namespace'
                )
              }))
        }
      }
    case RESOURCE_TYPES.QUERY_SUBSCRIPTIONS.name:
      return {
        data: {
          subscriptions:
              result.data.subscriptions &&
              result.data.subscriptions.map(sub => ({
                name: sub.metadata.name,
                namespace: sub.metadata.namespace,
                created: sub.metadata.creationTimestamp,
                apiVersion: sub.raw.apiVersion,
                channel: _.get(sub, 'raw.spec.channel'),
                timeWindow: _.get(sub, 'raw.spec.timewindow.windowtype')
              }))
        }
      }
    case RESOURCE_TYPES.QUERY_PLACEMENTRULES.name:
      return {
        data: {
          placementRules:
              result.data.placementrules &&
              result.data.placementrules.map(pr => ({
                name: pr.metadata.name,
                namespace: pr.metadata.namespace,
                created: pr.metadata.creationTimestamp,
                apiVersion: pr.raw.apiVersion,
                replicas: _.get(pr, 'raw.spec.clusterReplicas')
              }))
        }
      }
    case RESOURCE_TYPES.QUERY_CHANNELS.name:
      return {
        data: {
          channels:
              result.data.items &&
              result.data.items.map(ch => ({
                name: ch.metadata.name,
                namespace: ch.metadata.namespace,
                created: ch.metadata.creationTimestamp,
                apiVersion: ch.raw.apiVersion,
                type: _.get(ch, 'raw.spec.type'),
                pathname: _.get(ch, 'raw.spec.pathname')
              }))
        }
      }
    }
  }
  return undefined
}

const getResourceQuery = resourceType => {
  //use Query api to get the data, instead of the generic searchResource
  return dispatch => {
    const handleSuccess = result => {
      return dispatch(
        receiveResourceSuccess(
          { items: result.data[resourceType.dataKey] },
          resourceType
        )
      )
    }
    const handleFailure = result => {
      if (result && result.error) {
        return dispatch(receiveResourceError(result.error, resourceType))
      } else if (result && result.errors) {
        return dispatch(receiveResourceError(result.errors[0], resourceType))
      } else {
        return dispatch(receiveResourceError('invalid', resourceType))
      }
    }
    const handleError = error => {
      // catch graph connection error
      return dispatch(receiveResourceError(error, resourceType))
    }
    const fallback = () => {
      apolloClient
        .fallback(resourceType)
        .then(result => {
          const transformedResult = transformFallbackResult(
            resourceType,
            result
          )
          if (transformedResult) {
            return handleSuccess(transformedResult)
          } else {
            return handleFailure(result)
          }
        })
        .catch(error => handleError(error))
    }

    if (!shouldTrySearch() && resourceType.fallback) {
      fallback()
    } else {
      apolloClient
        .get(resourceType)
        .then(result => {
          if (result && result.data && result.data[resourceType.dataKey]) {
            searchSuccess()
            return handleSuccess(result)
          } else if (resourceType.fallback) {
            searchFailure()
            return fallback()
          } else {
            return handleFailure(result)
          }
        })
        .catch(error => {
          if (resourceType.fallback) {
            searchError()
            return fallback()
          } else {
            return handleError(error)
          }
        })
    }
  }
}

export const fetchResources = resourceType => {
  // Perform custom search query for certain resource types
  const resourceQuery = getResourceQuery(resourceType)
  if (resourceQuery) {
    return resourceQuery
  }
  const query = getQueryStringForResources(resourceType.name)
  return dispatch => {
    dispatch(requestResource(resourceType))
    return apolloClient
      .search(SEARCH_QUERY, { input: [query] })
      .then(response => {
        if (response.errors) {
          return dispatch(
            receiveResourceError(response.errors[0], resourceType)
          )
        }
        let itemRes =
          response &&
          response.data &&
          response.data.searchResult[0] &&
          response.data.searchResult[0].items
        if (
          resourceType.name === 'HCMChannel' ||
          resourceType.name === 'HCMSubscription'
        ) {
          //filter out remote cluster channels or subscriptions; here we only want hub resources
          //remote cluster resources will be linked as related to these hub objects
          itemRes = itemRes.filter(elem => elem._hubClusterResource)
        }
        const combinedQuery = []
        itemRes.map(item => {
          //build query only with local resources, MCM subscription model has no Propagated subscription, filter those out
          if (
            item &&
            !item._hostingSubscription &&
            (!item.status || (item.status && item.status !== 'Subscribed'))
          ) {
            combinedQuery.push(
              getQueryStringForResource(
                resourceType.name,
                item.name,
                item.namespace
              )
            )
          }
        })
        return dispatch(fetchResourcesInBulk(resourceType, combinedQuery))
      })
      .catch(err => {
        dispatch(receiveResourceError(err, resourceType))
      })
  }
}

export const fetchResource = (resourceType, namespace, name, querySettings) => {
  let query = getQueryStringForResource(resourceType.name, name, namespace)
  if (querySettings) {
    if (querySettings.isArgoApp) {
      const argoKinds = querySettings.relatedKinds
        ? querySettings.relatedKinds.toString()
        : null
      //get all resources from the target namespace since they are not linked to the argo application
      query = getQueryStringForResource(
        argoKinds,
        null,
        querySettings.targetNamespaces.toString()
      )
      query.filters.push({
        property: 'label',
        values: querySettings.argoAppsLabelNames
      })
      //get the cluster for each target namespace and all pods related to this objects only
      //always ask for related pods, replicaset and replocationcontroller because they are tagged by the app instance
      // we'll get them if any are linked to the objects returned above
      query.relatedKinds.push(
        'cluster',
        'pod',
        'replicaset',
        'replicationcontroller'
      )
    } else {
      //query asking for a subset of related kinds and possibly for one subscription only
      if (querySettings.subscription) {
        //get related resources only for the selected subscription
        query = getQueryStringForResource(
          RESOURCE_TYPES.HCM_SUBSCRIPTIONS.name,
          querySettings.subscription,
          namespace
        )
        //ask only for these type of resources
        query.relatedKinds = querySettings.relatedKinds
      } else {
        //filter out any argo app with the same name and ns, we are looking here for acm apps
        query.filters.push({ property: 'apigroup', values: ['!argoproj.io'] })

        //get related resources for the application, but only this subset
        query.relatedKinds = querySettings.relatedKinds
      }
    }
  }
  return dispatch => {
    dispatch(requestResource(resourceType))
    return apolloClient
      .search(SEARCH_QUERY_RELATED, { input: [query] })
      .then(response => {
        if (response.errors) {
          searchFailure()
          return dispatch(
            receiveResourceError(response.errors[0], resourceType)
          )
        }
        const searchResult = _.get(response, 'data.searchResult', [])
        if (
          !querySettings.isArgoApp &&
          (searchResult.length === 0 ||
            _.get(searchResult[0], 'items', []).length === 0)
        ) {
          //ignore this for argo apps, if we got to this point the app exists
          //app not found
          const err = {
            err: msgs.get(
              'load.app.info.notfound',
              [`${namespace}/${name}`],
              'en-US'
            )
          }
          return dispatch(receiveResourceNotFound(err, resourceType))
        }
        searchSuccess()
        return dispatch(
          receiveResourceSuccess(
            {
              items: mapSingleApplication(
                _.cloneDeep(response.data.searchResult[0])
              )
            },
            resourceType
          )
        )
      })
      .catch(err => {
        searchError()
        dispatch(receiveResourceError(err, resourceType))
      })
  }
}

export const fetchResourcesInBulk = (resourceType, bulkquery) => {
  return dispatch => {
    dispatch(requestResource(resourceType))
    return apolloClient
      .search(SEARCH_QUERY_RELATED, { input: bulkquery })
      .then(response => {
        if (response.errors) {
          return dispatch(
            receiveResourceError(response.errors[0], resourceType)
          )
        }
        const dataClone = _.cloneDeep(response.data.searchResult)
        let result = false
        if (resourceType.name === 'HCMChannel') {
          result = mapBulkChannels(dataClone)
        } else if (resourceType.name === 'HCMSubscription') {
          result = mapBulkSubscriptions(dataClone)
        } else {
          result = dataClone
        }
        return dispatch(
          receiveResourceSuccess({ items: result }, resourceType)
        )
      })
      .catch(err => {
        dispatch(receiveResourceError(err, resourceType))
      })
  }
}

export const editResource = (
  resourceType,
  namespace,
  name,
  body,
  selfLink,
  resourcePath
) => dispatch => {
  dispatch(putResource(resourceType))
  return apolloClient
    .updateResource(
      resourceType.name,
      namespace,
      name,
      body,
      selfLink,
      resourcePath
    )
    .then(response => {
      if (response.errors) {
        return dispatch(receivePutError(response.errors[0], resourceType))
      } else {
        dispatch(updateModal({ open: false, type: 'resource-edit' }))
      }
      dispatch(fetchResources(resourceType))
      return dispatch(receivePutResource(response, resourceType))
    })
}

export const updateSecondaryHeader = (
  title,
  tabs,
  breadcrumbItems,
  links,
  actions,
  tooltip,
  label,
  labelColor
) => {
  return {
    type: Actions.SECONDARY_HEADER_UPDATE,
    title,
    tabs,
    breadcrumbItems,
    links,
    actions,
    tooltip,
    label,
    labelColor
  }
}

export const updateModal = data => ({
  type: Actions.MODAL_UPDATE,
  data
})

export const postResource = resourceType => ({
  type: Actions.POST_REQUEST,
  postStatus: Actions.REQUEST_STATUS.IN_PROGRESS,
  resourceType
})

export const receivePostResource = (item, resourceType) => ({
  type: Actions.POST_RECEIVE_SUCCESS,
  postStatus: Actions.REQUEST_STATUS.DONE,
  resourceType: item.kind || resourceType,
  item
})

export const receivePostError = (err, resourceType) => ({
  type: Actions.POST_RECEIVE_FAILURE,
  postStatus: Actions.REQUEST_STATUS.ERROR,
  err,
  resourceType
})

export const putResource = resourceType => ({
  type: Actions.PUT_REQUEST,
  putStatus: Actions.REQUEST_STATUS.IN_PROGRESS,
  resourceType
})

export const receivePutResource = (item, resourceType) => {
  return {
    type: Actions.PUT_RECEIVE_SUCCESS,
    putStatus: Actions.REQUEST_STATUS.DONE,
    resourceType: item.kind || resourceType,
    item
  }
}

export const receivePutError = (err, resourceType) => ({
  type: Actions.PUT_RECEIVE_FAILURE,
  putStatus: Actions.REQUEST_STATUS.ERROR,
  err,
  resourceType
})

export const delResource = resourceType => ({
  type: Actions.DEL_REQUEST,
  delStatus: Actions.REQUEST_STATUS.IN_PROGRESS,
  resourceType
})

export const receiveDelResource = (item, resourceType, resource) => ({
  type: Actions.DEL_RECEIVE_SUCCESS,
  delStatus: Actions.REQUEST_STATUS.DONE,
  resourceType: resourceType || item.kind,
  item,
  resource
})

export const receiveDelResourceFinished = resourceType => ({
  type: Actions.DEL_RECEIVE_SUCCESS_FINISHED,
  resourceType
})

export const receiveDelError = (err, resourceType) => ({
  type: Actions.DEL_RECEIVE_FAILURE,
  delStatus: Actions.REQUEST_STATUS.ERROR,
  err,
  resourceType
})

export const clearRequestStatus = resourceType => ({
  type: Actions.CLEAR_REQUEST_STATUS,
  resourceType: resourceType
})

export const resetResource = resourceType => ({
  type: Actions.RESOURCE_RESET,
  resourceType: resourceType
})

export const forceResourceReload = resourceType => ({
  type: Actions.RESOURCE_FORCE_RELOAD,
  resourceType
})

export const forcedResourceReloadFinished = resourceType => ({
  type: Actions.RESOURCE_FORCE_RELOAD_FINISHED,
  resourceType
})

export const delResourceSuccessFinished = resourceType => ({
  type: Actions.DEL_RECEIVE_SUCCESS_FINISHED,
  resourceType
})

export const mutateResourceSuccessFinished = resourceType => ({
  type: Actions.RESOURCE_MUTATE_FINISHED,
  resourceType
})

export const clearSuccessFinished = dispatch => {
  [
    RESOURCE_TYPES.QUERY_APPLICATIONS,
    RESOURCE_TYPES.QUERY_APPLICATIONSET,
    RESOURCE_TYPES.QUERY_CHANNELS,
    RESOURCE_TYPES.QUERY_SUBSCRIPTIONS,
    RESOURCE_TYPES.QUERY_PLACEMENTRULES
  ].forEach(resourceType => {
    dispatch(mutateResourceSuccessFinished(resourceType))
    dispatch(delResourceSuccessFinished(resourceType))
  })
}

export const createResources = (resourceType, resourceJson) => {
  if (resourceType === RESOURCE_TYPES.HCM_APPLICATIONS) {
    resourceType = RESOURCE_TYPES.QUERY_APPLICATIONS
  }
  delResourceSuccessFinished(resourceType)
  mutateResourceSuccessFinished(resourceType)
  return dispatch => {
    dispatch(mutateResource(resourceType))
    return apolloClient.createResources(resourceJson).then(result => {
      if (
        result.data.createResources.errors &&
        result.data.createResources.errors.length > 0
      ) {
        dispatch(
          mutateResourceFailure(
            resourceType,
            result.data.createResources.errors[0]
          )
        )
      } else {
        dispatch(mutateResourceSuccess(resourceType))
        dispatch(forceResourceReload(resourceType))
      }
      return result
    })
  }
}
