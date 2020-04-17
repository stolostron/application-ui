/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import { convertStringToQuery } from '../../../lib/client/search-helper'

import R from 'ramda'

// We go through each application and pull out each kind
// and add it to the list to be returned
const extractAllOfKind = (list, kind = '') => {
  const filterKind = x => x.kind === kind
  // Get the totalKindList for All the applications
  const totalKindList =
    list &&
    list.map(app => {
      // filters out to only have kind and then returns the items
      const kindList = R.filter(filterKind, app.related || []) || []
      if (kindList.length > 0) {
        return kindList[0].items
      }
      return kindList
    })
  return totalKindList || []
}

// This method flattens out the list of lists of deployables
const flattenList = list => {
  var flattenedList = []
  list.map(resource => {
    flattenedList = flattenedList.concat(resource)
  })
  return flattenedList
}

// This method creates the query string used in the api to get all
// the kind related information
export const returnBulkQueryString = (applicationList, kind) => {
  const list = extractAllOfKind(applicationList, kind)
  const removeEmptyArray = x => x.length > 0
  const finalList = flattenList(R.filter(removeEmptyArray, list))
  const combinedQuery = []
  finalList.map(item => {
    if (item.name) {
      combinedQuery.push(
        convertStringToQuery(
          `kind:${kind} name:${item.name} namespace:${item.namespace}`
        )
      )
    }
  })
  return combinedQuery
}
