/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

import { createSelector } from 'reselect'
import { findCommonElements, wrapWithArr } from '../shared/utils'

const pipe = fns => arg => fns.reduce((accum, fn) => fn(accum), arg)

// empty if it is: [], {}, null, undefined.
// Lodash's isEmpty does not work for this case, because lodash.isEmpty(boolean) === true
const isMatchValueEmpty = el => {
  return (
    typeof el !== 'boolean' &&
    (el === undefined || el === null || !el.length || !Object.keys(el).length)
  )
}

// create case-insensitive filter function that consumes an array of objects.
export const createFilter = (matchKey, matchValues) => {
  return dataToFilter => {
    if (isMatchValueEmpty(matchValues)) {
      return dataToFilter
    }
    const matchValueArr = wrapWithArr(matchValues)
    return dataToFilter.filter(eachObj => {
      // the object could have many keys, but we only care about the one we specified.
      const dataValueArr = wrapWithArr(eachObj[matchKey]) // properties on the object
      // compare arrays and see if there is match.
      return !!findCommonElements(dataValueArr, matchValueArr).length
    })
  }
}

/*

/**
 * Create an array of filters.
 * @param {Object} filterMapObj - a filter map.
 *  e.g. { ages: [14, 16], isAuthorized: true }
 * @returns Array<function> - an array of filters that we can pass to pipe().
 *  e.g.  [createFilter(ages, [14, 16]), createFilter(isAuthorized, true)]
 */
const createSimpleMatchFilters = (filterMapObj = {}) => {
  return Object.keys(filterMapObj).map(eachFilterKey => {
    return createFilter(eachFilterKey, filterMapObj[eachFilterKey])
  })
}

export const searchObjArr = (term, arr) => {
  if (!term) {
    return arr
  }
  const termWithoutSpaces = term.trim()
  const re = new RegExp(`\\b${termWithoutSpaces}`, 'i')
  return arr.filter(el => JSON.stringify(el).match(re))
}

export const multiFilter = (data = [], filterObj, searchStr) => {
  return pipe([
    ...createSimpleMatchFilters(filterObj),
    (...args) => searchObjArr(searchStr, ...args)
  ])(data)
}

// resources mapper for the data that comes with /charts/ call.
const mapResources = items =>
  items.map(({ Name, RepoName, URLs }) => ({
    name: Name,
    url: URLs && URLs.length && URLs[0],
    repoName: RepoName
  }))

const mappedItemsSelector = createSelector(
  ({ items }) => items,
  items => mapResources(items)
)

// for performance reasons, we only want to run maps and filters when the properties we care about change.
export const mapAndMultiFilterResoucesSelector = createSelector(
  [mappedItemsSelector, ({ filters }) => filters],
  (items, filters) => {
    const filterObj = {
      repoName: filters.selectedRepos
    }
    return multiFilter(items, filterObj, filters.searchText)
  }
)
