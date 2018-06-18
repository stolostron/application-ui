
/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
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
import ReactDOMServer from 'react-dom/server'
import { createResourcesSchema } from '../../lib/client/resource-schema'
import { transform } from '../../lib/client/resource-helper'
import * as Actions from '../actions'
import getResourceDefinitions, * as ResourceDefinitions from '../definitions'
import { RESOURCE_TYPES } from '../../lib/shared/constants'
import msgs from '../../nls/platform.properties'


export const getItems = (state, props) => getFromState(state,props.storeRoot, 'items')
export const getItemsPerPage = (state, props) => getFromState(state,props.storeRoot, 'itemsPerPage')
export const getPage = (state, props) => getFromState(state,props.storeRoot, 'page')
export const getSearch = (state, props) => getFromState(state,props.storeRoot, 'search')
export const getSortColumn = (state, props) => getFromState(state,props.storeRoot, 'sortColumn')
export const getSortDirection = (state, props) => getFromState(state,props.storeRoot, 'sortDirection')

function getFromState(state, root, attribute) {
  const storeRoot = state[root]
  if (storeRoot === undefined) {
    //eslint-disable-next-line no-console
    console.error(`store root '${root}' does not exist`)
  }
  return storeRoot[attribute]
}

export const INITIAL_STATE = {
  items: [],
  itemsPerPage: Actions.PAGE_SIZES.DEFAULT,
  page: 1,
  search: '',
  sortColumn: undefined,
  sortDirection: Actions.SORT_DIRECTION_ASCENDING,
  status: Actions.REQUEST_STATUS.INCEPTION,
  putStatus: undefined,
  putErrorMsg: '',
  postStatus: undefined,
  postStatusCode: undefined,
  postErrorMsg: ''
}

/**
 * Search in a table cell.  Uses the transformed data for the cell.
 *
 * @param {*} item - Table row data
 * @param {*} tableKey - Table column key
 * @param {*} context - React context
 * @param {*} searchText - String to match
 */
function searchTableCell(item, tableKey, context, searchText){
  return ReactDOMServer.renderToString(transform(item, tableKey, context.locale)).toString().toLowerCase().indexOf(searchText.toLowerCase()) !== -1
}

const makeGetFilteredItemsSelector = (resourceType) => {
  return createSelector(
    [getItems, getSearch],
    (items, search) => items.filter((item) => {
      if (lodash.isEmpty(search))
        return true

      const tableKeys = ResourceDefinitions.getTableKeys(resourceType)
      const context = JSON.parse(document.getElementById('context').textContent)

      // search when user specify the field e.g. cluster=myprod
      const searchField = search.toLowerCase().split('=')
      if (!lodash.isEmpty(searchField[1])) {
        const tableKey = tableKeys.find(tableKey => msgs.get(tableKey.msgKey, context.locale).toLowerCase() === searchField[0].toLowerCase())
        if (tableKey) {
          return searchTableCell(item, tableKey, context, searchField[1])
        }
      }

      // return all results when user types cluster=
      if (searchField[1] === '')
        return true

      // by default, search all fields
      return tableKeys.find(tableKey => searchTableCell(item, tableKey, context, search))
    })
  )
}

const makeGetTransformedItemsSelector = (resourceType) => {
  return createSelector(
    [makeGetFilteredItemsSelector(resourceType)],
    (items) => {
      const resourceData = getResourceDefinitions(resourceType)
      return items.map(item => {
        let customData = {}
        const context = JSON.parse(document.getElementById('context').textContent)
        resourceData.tableKeys.forEach(key => {
          if (key.transformFunction && typeof key.transformFunction === 'function') {
            customData[key.resourceKey.replace('custom.', '')] = key.transformFunction(item, context.locale)
          }
        })
        item.custom = customData
        return item
      })
    }
  )
}

//TODO could we do better? - we have one selector thus one cache for sorting.
//Thus if the sort direction change is toggled back we re-calculate.
const makeGetSortedItemsSelector = (resourceType) => {
  return createSelector(
    [makeGetTransformedItemsSelector(resourceType), getSortColumn, getSortDirection],
    (items, sortColumn, sortDirection) => {
      const initialSortField = sortColumn ? sortColumn : ResourceDefinitions.getDefaultSortField(resourceType)
      const sortField = initialSortField === 'custom.age' ? 'metadata.creationTimestamp' : initialSortField // sort by the actual date, not formatted value
      const sortDir = sortField === 'metadata.creationTimestamp' ? (sortDirection === Actions.SORT_DIRECTION_ASCENDING ? Actions.SORT_DIRECTION_DESCENDING : Actions.SORT_DIRECTION_ASCENDING) : sortDirection // date fields should initially sort from latest to oldest
      return lodash.orderBy(items, item => lodash.get(item, sortField), [sortDir])
    }
  )
}

const makeGetPagedItemsSelector = (resourceType) => {
  return createSelector(
    [makeGetSortedItemsSelector(resourceType), getPage, getItemsPerPage],
    (items, page, itemsPerPage) => {
      let offset = (page - 1) * itemsPerPage
      let lastIndex = offset + itemsPerPage
      lastIndex = lastIndex <= items.length ? lastIndex : items.length
      return {
        items: items.slice(offset, lastIndex),
        totalResults: items.length,
        totalPages: Math.ceil(items.length / itemsPerPage)
      }
    }
  )
}

export const makeGetVisibleTableItemsSelector = (resourceType) => {
  const pk = ResourceDefinitions.getPrimaryKey(resourceType)
  return createSelector(
    [makeGetPagedItemsSelector(resourceType)],
    result => {
      let normalizedItems = normalize(result.items, [createResourcesSchema(pk)]).entities.items
      return Object.assign(result, {
        normalizedItems: normalizedItems,
        items: result.items.map(item => `${lodash.get(item, pk)}-${lodash.get(item, 'cluster')}`) // to support multi cluster, use ${name}-${cluster} as unique id
      })
    }
  )
}

export const secondaryHeader = (state = {title: '', tabs: [], breadcrumbItems: [], links: [], extra:[]}, action) => {
  switch (action.type) {
  case Actions.SECONDARY_HEADER_UPDATE:
    return Object.assign({}, state, {
      title: action.title,
      tabs: action.tabs,
      breadcrumbItems: action.breadcrumbItems,
      links: action.links,
      extra: action.extra
    })
  default:
    return state
  }
}

const getItemProps= (state, props) => props

export const getSingleResourceItem = createSelector(
  [getItems, getItemProps],
  (items, props) => items && items.length > 0 && props.predicate(items, props)
)

export const resourceReducerFunction = (state = INITIAL_STATE, action) => {

  var items,index

  switch (action.type) {
  case Actions.RESOURCE_REQUEST:
    return Object.assign({}, state, {
      status: Actions.REQUEST_STATUS.IN_PROGRESS
    })
  case Actions.RESOURCE_RECEIVE_SUCCESS:
    return Object.assign({}, state, {
      status: Actions.REQUEST_STATUS.DONE,
      items: action.items,
      page: action.items.length === 0 ? 1 : action.items.length > state.itemsPerPage * (state.page - 1) ? state.page : state.page - 1,
      resourceVersion: action.resourceVersion
    })
  case Actions.DASHBOARD_RECEIVE_SUCCESS:
    return Object.assign({}, state, {
      status: Actions.REQUEST_STATUS.DONE,
      cardItems: action.cardItems,
      pieChartItems: action.pieChartItems,
      barChartItems: action.barChartItems
    })
  case Actions.RESOURCE_RECEIVE_FAILURE:
    return Object.assign({}, state, {
      status: Actions.REQUEST_STATUS.ERROR,
      err: action.err
    })
  case Actions.POST_REQUEST:
    return Object.assign({}, state, {
      postStatus: Actions.REQUEST_STATUS.IN_PROGRESS
    })
  case Actions.POST_RECEIVE_SUCCESS:
    items = state.items.slice(0)
    if (action.item.length > 0) { // if returned as an array due to making async calls, push action.item elements to the items array
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
      postStatusCode: action.err.error && action.err.error.response && action.err.error.response.status,
      postErrorMsg: action.err.error && action.err.error.message
    })
  case Actions.PUT_REQUEST:
    return Object.assign({}, state, {
      putStatus: Actions.REQUEST_STATUS.IN_PROGRESS
    })
  case Actions.PUT_RECEIVE_SUCCESS:
    return Object.assign({}, state, {
      putStatus: Actions.REQUEST_STATUS.DONE,
    })
  case Actions.PUT_RECEIVE_FAILURE:
    return Object.assign({}, state, {
      putStatus: Actions.REQUEST_STATUS.ERROR,
      putErrorMsg: action.err.error && action.err.error.message
    })
  case Actions.CLEAR_REQUEST_STATUS:
    return Object.assign({}, state, {
      postStatus: undefined,
      postStatusCode: undefined,
      postErrorMsg: undefined,
      putStatus: undefined,
      putErrorMsg: undefined
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
      page: action.page,
      itemsPerPage: action.pageSize
    })
  case Actions.RESOURCE_ADD: /* eslint-disable no-case-declarations */
  case Actions.RESOURCE_MODIFY:
    const resourceTypeObj = !lodash.isObject(action.resourceType) ? RESOURCE_TYPES[lodash.findKey(RESOURCE_TYPES, { name: action.resourceType })] : action.resourceType
    const primaryKey = ResourceDefinitions.getPrimaryKey(resourceTypeObj)
    items = state.items.slice(0)
    index = lodash.findIndex(items, o => (lodash.get(o, primaryKey) === lodash.get(action.item, primaryKey)))
    index > -1 ? items.splice(index, 1, action.item) : items.push(action.item)
    return Object.assign({}, state, {
      items: items
    })
  case Actions.RESOURCE_DELETE:
    items = [...state.items]
    index = lodash.findIndex(items, o => lodash.get(o, 'metadata.uid') === lodash.get(action, 'item.metadata.uid'))
    if(index > -1) {
      items.splice(index, 1)
      return Object.assign({}, state, {
        items: items
      })
    }
    return state
  case Actions.DEL_RECEIVE_SUCCESS:
    items = [...state.items]
    switch (action.resourceType) {
    case RESOURCE_TYPES.HCM_RELEASES:
      const targetObject = lodash.get(action, 'resource')
      index = lodash.findIndex(items, { 'name':targetObject.name, 'cluster':targetObject.cluster })
      break
    default:
      index = lodash.findIndex(items, o => lodash.get(o, 'Name') === lodash.get(action, 'resourceName'))
      break
    }
    if(index > -1) {
      items.splice(index, 1)
      return Object.assign({}, state, {
        items: items
      })
    }
    return state
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
    const shouldRunWrappedReducer = reducerPredicate(action) || isInitializationCall
    return shouldRunWrappedReducer ? reducerFunction(state, action) : state
  }
}
