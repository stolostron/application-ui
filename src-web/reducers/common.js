/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
/*
Since these selectors are common (i.e used across different components and different parts of the store)
we have to create unique selectors each invocation and the selectors need additional metata data sent
though props that indicate which part of the store it should select from.

//See https://github.com/reactjs/reselect#sharing-selectors-with-props-across-multiple-components
//See https://github.com/reactjs/reselect#q-can-i-share-a-selector-across-multiple-components

The selector pattern is an abstraction that standardizes an application’s store querying logic.
It is simple: for any part of the store that an application needs access to, define a function that
when given the full store, returns the desired part (or derivation) of the store.
*/

import { createSelector } from 'reselect'
import lodash from 'lodash'
import { normalize } from 'normalizr'
import { createResourcesSchema } from '../../lib/client/resource-schema'
import * as Actions from '../actions'
import getResourceDefinitions, * as ResourceDefinitions from '../definitions'
import { RESOURCE_TYPES } from '../../lib/shared/constants'

export const getItems = (state, props) =>
  getFromState(state, props.storeRoot, 'items')
export const getPage = (state, props) =>
  getFromState(state, props.storeRoot, 'page')

function getFromState(state, root, attribute) {
  const storeRoot = state[root]
  if (storeRoot) {
    return storeRoot[attribute]
  } else {
    //eslint-disable-next-line no-console
    console.error(`store root '${root}' does not exist`)
    return undefined
  }
}

let globalContext = { locale: 'en-US' }
try {
  globalContext = JSON.parse(document.getElementById('context').textContent)
} catch (e) {
  globalContext = { locale: 'en-US' }
}

export const INITIAL_STATE = {
  items: [],
  page: 1,
  search: '',
  sortColumn: undefined,
  sortDirection: Actions.SORT_DIRECTION_ASCENDING,
  status: Actions.REQUEST_STATUS.INCEPTION,
  putStatus: undefined,
  putErrorMsg: '',
  postStatus: undefined,
  postStatusCode: undefined,
  postErrorMsg: '',
  pendingActions: [],
  clientSideFilters: undefined,
  forceReload: false,
  mutateStatus: undefined,
  mutateErrorMsg: undefined,
  deleteMsg: undefined,
  deleteStatus: undefined
}

const makeGetTransformedItemsSelector = resourceType => {
  return createSelector([getItems], items => {
    const resourceData = getResourceDefinitions(resourceType)
    return items.map(item => {
      const transformed = {}

      resourceData.tableKeys.forEach(key => {
        if (key.textFunction && typeof key.textFunction === 'function') {
          transformed[`${key.resourceKey}.text`] = key.textFunction(
            item,
            globalContext.locale
          )
        }
      })
      item.transformed = transformed;
      // Augment with extra fields
      ['kind', 'apiVersion'].forEach(property => {
        if (!item[property] && resourceType[property]) {
          item[property] = resourceType[property]
        }
      })
      return item
    })
  })
}

export const makeGetVisibleTableItemsSelector = resourceType => {
  const pk = ResourceDefinitions.getPrimaryKey(resourceType)
  const sk = ResourceDefinitions.getSecondaryKey(resourceType)
  return createSelector(
    [makeGetTransformedItemsSelector(resourceType)],
    items => {
      const normalizedItems =
        normalize(items, [createResourcesSchema(pk, sk)]).entities.items || {}
      return {
        normalizedItems: normalizedItems,
        items: items.map(
          item =>
            sk
              ? `${lodash.get(item, pk)}-${lodash.get(item, sk)}`
              : `${lodash.get(item, pk)}`
        ) // to support multi cluster, use ${name}-${cluster} as unique id
      }
    }
  )
}

export const secondaryHeader = (
  state = { title: '', tabs: [], breadcrumbItems: [], links: [] },
  action
) => {
  switch (action.type) {
  case Actions.SECONDARY_HEADER_UPDATE:
    return Object.assign({}, state, {
      title: action.title,
      tabs: action.tabs,
      breadcrumbItems: action.breadcrumbItems,
      links: action.links,
      actions: action.actions,
      tooltip: action.tooltip,
      label: action.label,
      labelColor: action.labelColor
    })
  default:
    return state
  }
}

const getItemProps = (state, props) => props

export const getSingleResourceItem = createSelector(
  [getItems, getItemProps],
  (items, props) => items && items.length > 0 && props.predicate(items, props)
)

export const resourceItemByName = (items, props) => {
  const key = ResourceDefinitions.getURIKey(props.resourceType)
  return lodash.find(items, item => lodash.get(item, key) === props.name)
}

export const resourceItemByNameAndNamespace = (items, props) => {
  const key = ResourceDefinitions.getURIKey(props.resourceType)
  return lodash.find(
    items,
    item =>
      lodash.get(item, key) === props.name &&
      lodash.get(item, 'metadata.namespace') === props.namespace
  )
}

export const resourceReducerFunction = (state = INITIAL_STATE, action) => {
  let items, index
  switch (action.type) {
  case Actions.RESOURCE_REQUEST:
    return Object.assign({}, state, {
      status: Actions.REQUEST_STATUS.IN_PROGRESS
    })
  case Actions.RESOURCE_RECEIVE_SUCCESS: {
    return Object.assign({}, state, {
      status: Actions.REQUEST_STATUS.DONE,
      items: action.items,
      resourceVersion: action.resourceVersion,
      responseTime: Date.now()
    })
  }
  case Actions.RESOURCE_RECEIVE_FAILURE:
    return Object.assign({}, state, {
      status: Actions.REQUEST_STATUS.ERROR,
      err: action.err,
      responseTime: Date.now()
    })
  case Actions.RESOURCE_RECEIVE_NOT_FOUND:
    return Object.assign({}, state, {
      status: Actions.REQUEST_STATUS.NOT_FOUND,
      err: action.err
    })
  case Actions.POST_REQUEST:
    return Object.assign({}, state, {
      postStatus: Actions.REQUEST_STATUS.IN_PROGRESS
    })
  case Actions.POST_RECEIVE_SUCCESS:
    items = state.items.slice(0)
    if (action.item.length > 0) {
      // if returned as an array due to making async calls, push action.item elements to the items array
      action.item.forEach(el => {
        items.push(el)
      })
    } else {
      items.push(action.item)
    }
    return Object.assign({}, state, {
      items: items,
      postStatus: Actions.REQUEST_STATUS.DONE
    })
  case Actions.POST_RECEIVE_FAILURE:
    return Object.assign({}, state, {
      postStatus: Actions.REQUEST_STATUS.ERROR,
      postStatusCode:
          action.err.error &&
          action.err.error.response &&
          action.err.error.response.status,
      postErrorMsg: action.err.error && action.err.error.message
    })
  case Actions.PUT_REQUEST:
    return Object.assign({}, state, {
      putStatus: Actions.REQUEST_STATUS.IN_PROGRESS
    })
  case Actions.PUT_RECEIVE_SUCCESS:
    return Object.assign({}, state, {
      putStatus: Actions.REQUEST_STATUS.DONE
    })
  case Actions.PUT_RECEIVE_FAILURE:
    return Object.assign({}, state, {
      putStatus: Actions.REQUEST_STATUS.ERROR,
      putErrorMsg: action.err.error
        ? action.err.error.message
        : action.err.message
    })
  case Actions.CLEAR_REQUEST_STATUS:
    return Object.assign({}, state, {
      mutateStatus: undefined,
      mutateErrorMsg: undefined,
      postStatus: undefined,
      postStatusCode: undefined,
      postErrorMsg: undefined,
      putStatus: undefined,
      putErrorMsg: undefined,
      deleteMsg: undefined,
      deleteStatus: undefined
    })
  case Actions.TABLE_SEARCH:
    return Object.assign({}, state, {
      search: action.search,
      page: 1
    })
  case Actions.TABLE_SORT:
    return Object.assign({}, state, {
      sortDirection: action.sortDirection,
      sortColumn: action.sortColumn
    })
  case Actions.TABLE_PAGE_CHANGE:
    return Object.assign({}, state, {
      page: action.page
    })
  case Actions.RESOURCE_ADD:
  case Actions.RESOURCE_MODIFY: {
    const resourceTypeObj = !lodash.isObject(action.resourceType)
      ? RESOURCE_TYPES[
        lodash.findKey(RESOURCE_TYPES, { name: action.resourceType })
      ]
      : action.resourceType
    const primaryKey = ResourceDefinitions.getPrimaryKey(resourceTypeObj)
    items = state.items.slice(0)
    index = lodash.findIndex(
      items,
      o => lodash.get(o, primaryKey) === lodash.get(action.item, primaryKey)
    )
    index > -1
      ? items.splice(index, 1, action.item)
      : items.push(action.item)
    return Object.assign({}, state, {
      items: items
    })
  }
  case Actions.RESOURCE_MUTATE:
    return Object.assign({}, state, {
      mutateStatus: Actions.REQUEST_STATUS.IN_PROGRESS,
      mutateErrorMsg: null,
      pendingActions: [
        ...state.pendingActions,
        { name: action.resourceName, action: Actions.RESOURCE_MUTATE }
      ]
    })
  case Actions.RESOURCE_MUTATE_FAILURE:
    return Object.assign({}, state, {
      mutateStatus: Actions.REQUEST_STATUS.ERROR,
      mutateErrorMsg:
          action.err.message ||
          (action.err.error &&
            (action.err.error.message ||
              (action.err.error.data && action.err.error.data.Message))),
      pendingActions: state.pendingActions.filter(
        r => r && r.name !== action.resourceName
      )
    })
  case Actions.RESOURCE_MUTATE_SUCCESS:
    return Object.assign({}, state, {
      mutateStatus: Actions.REQUEST_STATUS.DONE,
      pendingActions: state.pendingActions.filter(
        r => r && r.name !== action.resourceName
      )
    })
  case Actions.RESOURCE_DELETE:
    items = [...state.items]
    index = lodash.findIndex(
      items,
      o =>
        lodash.get(o, 'metadata.uid') ===
          lodash.get(action, 'item.metadata.uid')
    )
    if (index > -1) {
      items.splice(index, 1)
      return Object.assign({}, state, {
        deleteStatus: Actions.REQUEST_STATUS.IN_PROGRESS,
        deleteMsg: null,
        items: items
      })
    }
    return state
  case Actions.DEL_RECEIVE_SUCCESS: {
    items = [...state.items]

    const { item } = action
    if (item && item.name && item.namespace) {
      index = lodash.findIndex(
        items,
        o =>
          lodash.get(o, 'name') === lodash.get(item, 'name') &&
            lodash.get(o, 'namespace') === lodash.get(item, 'namespace')
      )
      if (index > -1) {
        items.splice(index, 1)
      }
    }

    return Object.assign({}, state, {
      items: items,
      deleteStatus: Actions.REQUEST_STATUS.DONE,
      deleteMsg: action.item.name
    })
  }
  case Actions.RESOURCE_FORCE_RELOAD_FINISHED:
    return Object.assign({}, state, {
      forceReload: false
    })
  case Actions.DEL_RECEIVE_SUCCESS_FINISHED:
    return Object.assign({}, state, {
      deleteStatus: undefined,
      deleteMsg: null
    })
  case Actions.RESOURCE_MUTATE_FINISHED:
    return Object.assign({}, state, {
      mutateStatus: undefined
    })
  case Actions.RESOURCE_FORCE_RELOAD:
    return Object.assign({}, state, {
      forceReload: true
    })
  default:
    return state
  }
}

/**
 * A common higher order reducer for resources
 * Follows the Redux pattern described here: http://redux.js.org/docs/recipes/reducers/ReusingReducerLogic.html#customizing-behavior-with-higher-order-reducers
 * **/
export const createResourceReducer = (reducerFunction, reducerPredicate) => {
  return (state, action) => {
    const isInitializationCall = state === undefined
    const shouldRunWrappedReducer =
      reducerPredicate(action) || isInitializationCall
    return shouldRunWrappedReducer ? reducerFunction(state, action) : state
  }
}
