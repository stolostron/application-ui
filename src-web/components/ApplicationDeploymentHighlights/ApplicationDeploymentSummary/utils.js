/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

// return the data for the stacked channel
export const getChannelChartData = list => {
  if (list && list.items) {
    const channelChartDataList = list.items.map(item => {
      if (item && item.related) {
        var completed = 0
        var failed = 0
        var progress = 0
        var name = item.name || 'unknown'

        for (var i = 0; i < item.related.length; i++) {
          if (item.related[i].kind && item.related[i].kind === 'release') {
            if (item.related[i].items) {
              for (var j = 0; j < item.related[i].items.length; j++) {
                if (item.related[i].items[j].status) {
                  var status = item.related[i].items[j].status
                  if (status === 'FAILED') {
                    failed = failed + 1
                  } else if (status === 'DEPLOYED') {
                    completed = completed + 1
                  } else if (status === 'PROGRESS') {
                    progress = progress + 1
                  } else {
                    completed = completed + 1
                  }
                } else {
                  completed = completed + 1
                }
              }
            }
          }
        }
        return {
          name: name,
          cm: completed,
          pr: progress,
          fl: failed
        }
      }
    })
    const emptyArray = []
    return emptyArray.concat.apply([], channelChartDataList)
  }
  return []
}

// return the width of the chart
export const getChannelChartWidth = list => {
  if (list && list.items) {
    if (list.items.length > 10) {
      return 500
    }
    if (list.items.length > 7) {
      return 400
    }
    return list.items.length * 75
  }
  return 300
}

export const getDeployedResourcesChartData = list => {
  if (list && list.items) {
    const deplChartDataList = list.items.map(item => {
      if (item && item.related) {
        var app_resources = 0

        for (var i = 0; i < item.related.length; i++) {
          if (item.related[i].kind && item.related[i].kind === 'release') {
            if (item.related[i].items) {
              app_resources = app_resources + item.related[i].items.length
            }
          }
        }
        return {
          name: item.name || 'unknown',
          counter: app_resources
        }
      }
    })
    const emptyArray = []
    return emptyArray.concat.apply([], deplChartDataList)
  }
  return []
}
