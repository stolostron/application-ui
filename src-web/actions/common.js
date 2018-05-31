/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import lodash from 'lodash'

import * as Actions from './index'
import { RESOURCE_TYPES } from '../../lib/shared/constants'
import apolloClient from '../../lib/client/apollo-client'

export const changeTablePage = ({page, pageSize}, resourceType) => ({
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

export const requestResource = (resourceType) => ({
  type: Actions.RESOURCE_REQUEST,
  status: Actions.REQUEST_STATUS.IN_PROGRESS,
  resourceType
})

export const receiveTopologySuccess = (response, resourceType) => ({
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
  resourceType:  item.kind || resourceType,
  item
})

export const fetchResources = (resourceType, vars) => {
  return (dispatch) => {
    dispatch(requestResource(resourceType))
    return apolloClient.get(resourceType, vars)
      .then(response => {
        if (response.errors) {
          return dispatch(receiveResourceError(response.errors[0], resourceType))
        }
        if (resourceType.name === RESOURCE_TYPES.HCM_TOPOLOGY.name)
          return dispatch(receiveTopologySuccess({
            clusters: lodash.cloneDeep(response.data.clusters),
            labels: lodash.cloneDeep(response.data.labels),
            namespaces: lodash.cloneDeep(response.data.namespaces),
            resourceTypes: lodash.cloneDeep(response.data.resourceTypes),
            resources: lodash.cloneDeep(response.data.topology.resources),
            relationships: lodash.cloneDeep(response.data.topology.relationships),
          }, resourceType))
        return dispatch(receiveResourceSuccess({ items: lodash.cloneDeep(response.data.items)}, resourceType))
      })
      .catch(err => dispatch(receiveResourceError(err, resourceType)))
  }
}

export const removeResource = (resourceType, vars) => async dispatch => {
  dispatch(delResource(resourceType))
  try {
    const response = await apolloClient.remove(resourceType, vars)
    if (response.errors) {
      return dispatch(receiveDelError(response.errors, resourceType))
    }
    // assume every resource will have a 'Name' property
    dispatch(receiveDelResource(response, resourceType, vars.Name))
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

export const updateModal = (data) => ({
  type: Actions.MODAL_UPDATE,
  data
})

export const postResource = (resourceType) => ({ // TODO: Consider renaming
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

export const putResource = (resourceType) => ({ // TODO: Consider renaming
  type: Actions.PUT_REQUEST,
  putStatus: Actions.REQUEST_STATUS.IN_PROGRESS,
  resourceType
})

export const receivePutResource = (item, resourceType) => ({
  type: Actions.PUT_RECEIVE_SUCCESS,
  putStatus: Actions.REQUEST_STATUS.DONE,
  resourceType: item.kind || resourceType,
  item
})

export const receivePutError = (err, resourceType) => ({
  type: Actions.PUT_RECEIVE_FAILURE,
  putStatus: Actions.REQUEST_STATUS.ERROR,
  err,
  resourceType
})

export const delResource = (resourceType) => ({ // TODO: Consider renaming
  type: Actions.DEL_REQUEST,
  delStatus: Actions.REQUEST_STATUS.IN_PROGRESS,
  resourceType
})

export const receiveDelResource = (item, resourceType, resourceName) => ({
  type: Actions.DEL_RECEIVE_SUCCESS,
  delStatus: Actions.REQUEST_STATUS.DONE,
  resourceType: item.kind || resourceType,
  item,
  resourceName
})

export const receiveDelError = (err, resourceType) => ({
  type: Actions.DEL_RECEIVE_FAILURE,
  delStatus: Actions.REQUEST_STATUS.ERROR,
  err,
  resourceType
})

export const clearRequestStatus = (resourceType) => ({
  type: Actions.CLEAR_REQUEST_STATUS,
  resourceType: resourceType
})

export const resetResource = (resourceType) => ({
  type: Actions.RESOURCE_RESET,
  resourceType: resourceType
})

export const createResource = (resourceType, variables) => {
  return (dispatch) => {
    dispatch(postResource(resourceType))

    return apolloClient.createResource(resourceType, variables )
      .then(response => {
        if (response.errors) {
          return dispatch(receivePostError(response.errors[0], resourceType))
        }

        return dispatch(receivePostResource(lodash.cloneDeep(response.data.setHelmRepo), resourceType))
      })
      .catch(err => dispatch(receivePostError(err, resourceType)))
  }
}
