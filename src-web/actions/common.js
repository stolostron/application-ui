/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import lodash from 'lodash'

import * as Actions from './index'
import apolloClient from '../../lib/client/apollo-client'
import {
  SEARCH_QUERY,
  SEARCH_QUERY_RELATED
} from '../apollo-client/queries/SearchQueries'
import { convertStringToQuery } from '../../lib/client/search-helper'
import { mapBulkChannels } from '../reducers/data-mappers/mapChannelsBulk'
import { mapBulkSubscriptions } from '../reducers/data-mappers/mapSubscriptionsBulk'
import { mapSingleApplication } from '../reducers/data-mappers/mapApplicationsSingle'

import {
  ApplicationsList,
  GlobalApplicationsData
} from '../../lib/client/queries'

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
  resourceVersion: lodash.get(response, 'metadata.resourceVersion'), //only supported on k8s resoruces
  resourceType
})

export const receiveResourceError = (err, resourceType) => ({
  type: Actions.RESOURCE_RECEIVE_FAILURE,
  status: Actions.REQUEST_STATUS.ERROR,
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
    return convertStringToQuery('kind:application')
  case 'HCMPlacementRule':
    return convertStringToQuery('kind:placementrule')
  default:
    return convertStringToQuery('kind:application')
  }
}

export const getQueryStringForResource = (resourcename, name, namespace) => {
  switch (resourcename) {
  case 'HCMChannel':
    return convertStringToQuery(
      `kind:channel name:${name} namespace:${namespace}`
    )
  case 'HCMSubscription':
    return convertStringToQuery(
      //get only hub subscriptions
      `kind:subscription name:${name} namespace:${namespace} cluster:local-cluster`
    )
  case 'HCMApplication':
    return convertStringToQuery(
      `kind:application name:${name} namespace:${namespace}`
    )
  case 'HCMPlacementRule':
    return convertStringToQuery(
      `kind:placementrule name:${name} namespace:${namespace}`
    )
  default:
    return convertStringToQuery(
      `kind:application name:${name} namespace:${namespace}`
    )
  }
}

export const fetchGlobalAppsData = resourceType => {
  return dispatch => {
    apolloClient
      .getSearchClient()
      .query({
        query: GlobalApplicationsData
      })
      .then(result => {
        if (result.data && result.data.globalAppData) {
          return dispatch(
            receiveResourceSuccess(
              { items: result.data.globalAppData },
              resourceType
            )
          )
        }
        if (result.error) {
          return dispatch(receiveResourceError(result.error, resourceType))
        }
        if (result.errors) {
          return dispatch(receiveResourceError(result.errors[0], resourceType))
        }
      })
      .catch(error => {
        // catch graph connection error
        return dispatch(receiveResourceError(error, resourceType))
      })
  }
}

export const fetchResources = resourceType => {
  if (resourceType.name == 'QueryApplications') {
    //use Query api to get the data, instead of the generic searchResource
    return dispatch => {
      apolloClient
        .getSearchClient()
        .query({
          query: ApplicationsList
        })
        .then(result => {
          if (result.data && result.data.applications) {
            return dispatch(
              receiveResourceSuccess(
                { items: result.data.applications },
                resourceType
              )
            )
          }
          if (result.error) {
            return dispatch(receiveResourceError(result.error, resourceType))
          }
          if (result.errors) {
            return dispatch(
              receiveResourceError(result.errors[0], resourceType)
            )
          }
        })
        .catch(error => {
          // catch graph connection error
          return dispatch(receiveResourceError(error, resourceType))
        })
    }
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
          resourceType.name == 'HCMChannel' ||
          resourceType.name == 'HCMSubscription'
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
            (!item.status || (item.status && item.status != 'Subscribed'))
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

export const fetchResource = (resourceType, namespace, name) => {
  const query = getQueryStringForResource(resourceType.name, name, namespace)
  return dispatch => {
    dispatch(requestResource(resourceType))
    return apolloClient
      .search(SEARCH_QUERY_RELATED, { input: [query] })
      .then(response => {
        if (response.errors) {
          return dispatch(
            receiveResourceError(response.errors[0], resourceType)
          )
        }
        return dispatch(
          receiveResourceSuccess(
            {
              items: mapSingleApplication(
                lodash.cloneDeep(response.data.searchResult[0])
              )
            },
            resourceType
          )
        )
      })
      .catch(err => {
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
        const dataClone = lodash.cloneDeep(response.data.searchResult)
        let result = false
        if (resourceType.name === 'HCMChannel') {
          result = mapBulkChannels(dataClone)
        } else if (resourceType.name === 'HCMSubscription') {
          result = mapBulkSubscriptions(dataClone)
        } else if (resourceType.name === 'CEMIncidentList') {
          result = dataClone
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

export const clearIncidents = resourceType => {
  return dispatch => {
    // Clear everything before fetching
    dispatch(receiveResourceSuccess({ items: [] }, resourceType))
  }
}

export const fetchIncidents = (resourceType, namespace, name) => {
  return dispatch => {
    dispatch(requestResource(resourceType))
    return apolloClient
      .getResource(resourceType, { namespace, name })
      .then(response => {
        if (response.errors) {
          return dispatch(
            receiveResourceError(response.errors[0], resourceType)
          )
        }
        return dispatch(
          receiveResourceSuccess(
            { items: lodash.cloneDeep(response.data.items) },
            resourceType
          )
        )
      })
      .catch(err => dispatch(receiveResourceError(err, resourceType)))
  }
}

export const fetchNamespace = (resourceType, namespace) => {
  return dispatch => {
    dispatch(requestResource(resourceType))
    return apolloClient
      .getResource(resourceType, { namespace })
      .then(response => {
        if (response.errors) {
          return dispatch(
            receiveResourceError(response.errors[0], resourceType)
          )
        }
        return dispatch(
          receiveResourceSuccess(
            { items: lodash.cloneDeep(response.data.items) },
            resourceType
          )
        )
      })
      .catch(err => dispatch(receiveResourceError(err, resourceType)))
  }
}

export const fetchUserInfo = resourceType => {
  return dispatch => {
    dispatch(requestResource(resourceType))
    return apolloClient
      .getResource(resourceType)
      .then(response => {
        if (response.errors) {
          return dispatch(
            receiveResourceError(response.errors[0], resourceType)
          )
        }
        return dispatch(
          receiveResourceSuccess(
            { items: lodash.cloneDeep(response.data.items) },
            resourceType
          )
        )
      })
      .catch(err => dispatch(receiveResourceError(err, resourceType)))
  }
}

export const updateResourceLabels = (
  resourceType,
  namespace,
  name,
  labels,
  selfLink
) => {
  return dispatch => {
    dispatch(putResource(resourceType))
    return apolloClient
      .updateResourceLabels(
        resourceType.name,
        namespace,
        name,
        labels,
        selfLink,
        '/metadata/labels'
      )
      .then(response => {
        if (response.errors) {
          return dispatch(receivePutError(response.errors[0], resourceType))
        }
        dispatch(fetchResources(resourceType))
        dispatch(updateModal({ open: false, type: 'label-editing' }))
        return dispatch(receivePutResource(resourceType))
      })
      .catch(err => dispatch(receivePutError(err, resourceType)))
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

export const removeResource = (resourceType, vars) => async dispatch => {
  dispatch(delResource(resourceType))
  try {
    const response = await apolloClient.remove(resourceType, vars)
    if (response.errors) {
      return dispatch(receiveDelError(response.errors, resourceType))
    }
    dispatch(receiveDelResource(response, resourceType, vars))
  } catch (err) {
    return dispatch(receiveDelError(err, resourceType))
  }
}

export const updateSecondaryHeader = (title, tabs, breadcrumbItems, links) => ({
  type: Actions.SECONDARY_HEADER_UPDATE,
  title,
  tabs,
  breadcrumbItems,
  links
})

export const updateModal = data => ({
  type: Actions.MODAL_UPDATE,
  data
})

export const postResource = resourceType => ({
  // TODO: Consider renaming
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
  // TODO: Consider renaming
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
  // TODO: Consider renaming
  type: Actions.DEL_REQUEST,
  delStatus: Actions.REQUEST_STATUS.IN_PROGRESS,
  resourceType
})

export const receiveDelResource = (item, resourceType, resource) => ({
  type: Actions.DEL_RECEIVE_SUCCESS,
  delStatus: Actions.REQUEST_STATUS.DONE,
  resourceType: item.kind || resourceType,
  item,
  resource
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

export const createResources = (resourceType, resourceJson) => {
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
      }
      return result
    })
  }
}

export const createResource = (resourceType, variables) => {
  return dispatch => {
    dispatch(postResource(resourceType))
    return apolloClient
      .createResource(resourceType, variables)
      .then(response => {
        if (response.errors) {
          return dispatch(receivePostError(response.errors[0], resourceType))
        }

        return dispatch(
          receivePostResource(
            lodash.cloneDeep(response.data.setHelmRepo),
            resourceType
          )
        )
      })
      .catch(err => dispatch(receivePostError(err, resourceType)))
  }
}
