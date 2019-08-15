/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import R from 'ramda'

// return the width of the chart
export const getChannelChartWidth = list => {
  if (list && list.items) {
    if (list.items.length > 10) {
      return 500
    }
    if (list.items.length > 7) {
      return 400
    }
    return list.items.length * 100
  }
  return 300
}

export const getDeployedResourcesChartData = list => {
  if (list && list.items) {
    const deplChartDataList = list.items.map(item => {
      if (item && item.related) {
        var app_resources = 0

        for (var i = 0; i < item.related.length; i++) {
          const kind = item.related[i].kind
          const correctKindAndItems =
            (kind === 'release' ||
              kind === 'deployment' ||
              kind === 'pod' ||
              kind === 'service' ||
              kind === 'replicaset') &&
            item.related[i].items

          if (kind && correctKindAndItems) {
            app_resources = app_resources + item.related[i].items.length
          }
        }
        return {
          name: item.name || 'unknown',
          counter: app_resources
        }
      }
    })
    // The way the above is written, if item && item.related is not true
    // deplChartDataList will have an undefined in the list which will break the code
    // down the line so we want to remove undefined
    const removeUndefined = x => x !== undefined
    const emptyArray = []
    const removedUndefinedDeployables = R.filter(
      removeUndefined,
      deplChartDataList
    )
    return emptyArray.concat.apply([], removedUndefinedDeployables)
  }
  return []
}
