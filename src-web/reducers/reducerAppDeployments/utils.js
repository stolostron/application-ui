/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import { convertStringToQuery } from '../../../lib/client/search-helper'

import R from 'ramda'

// We go through each application and pull out each kind: deployable
// and add it to the list to be returned
const extractAllDeployables = applicationList => {
  const filterDeployable = x => x.kind == 'deployable'
  // Get the totalDeploybleList for All the applications
  const totalDeploybleList = applicationList.map(app => {
    // filters out to only have deployables and then returns the items
    const deployalbeList = R.filter(filterDeployable, app.related) || []
    if (deployalbeList.length > 0) {
      return deployalbeList[0].items
    }
    return deployalbeList
  })
  return totalDeploybleList
}

// This method flattens out the list of lists of deployables
const flattenList = deployableList => {
  var flattenedList = []
  deployableList.map(deployable => {
    flattenedList = flattenedList.concat(deployable)
  })
  return flattenedList
}

// This method creates the query string used in the api to get all
// the deloyables related information
export const returnDeployableBulkQueryString = applicationList => {
  const deployableList = extractAllDeployables(applicationList)
  const removeEmptyArray = x => x.length > 0
  const finalDeployableList = flattenList(
    R.filter(removeEmptyArray, deployableList)
  )
  const combinedQuery = []
  finalDeployableList.map(item => {
    if (item.name) {
      combinedQuery.push(
        convertStringToQuery(`kind:deployable name:${item.name}`)
      )
    }
  })
  return combinedQuery
}
