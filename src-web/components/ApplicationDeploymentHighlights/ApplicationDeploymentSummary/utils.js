/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import R from 'ramda'
import { getResourcesStatusPerChannel } from '../../ApplicationDeploymentPipeline/components/PipelineGrid/utils'

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

// Method will take the list of channels and return a another list, for each app showing cummulated data
export const getDeployedResourcesChannelChartData = list => {
  if (list && list.items) {
    const mappedChannels = list.items.map(item => {
      // Will return back status as:
      // [0, 0, 0, 0, 0]
      // Given the tall count of pass, fail, inprogress, pending, unidentified
      const status = getResourcesStatusPerChannel(item, false)
      const statusPassFailInProgress = [0, 0, 0]

      statusPassFailInProgress[0] =
        statusPassFailInProgress[0] + status[0] + status[4] // pass and unidentified
      statusPassFailInProgress[1] = statusPassFailInProgress[1] + status[1] //fail
      statusPassFailInProgress[2] =
        statusPassFailInProgress[2] + status[2] + status[3] //inprogress and pending

      return {
        name: item.name || 'unknown',
        cm: statusPassFailInProgress[0],
        fl: statusPassFailInProgress[1],
        pr: statusPassFailInProgress[2]
      }
    })
    // The way the above is written, if item && item.related is not true
    // deplChartDataList will have an undefined in the list which will break the code
    // down the line so we want to remove undefined
    const removeUndefined = x => x !== undefined
    const removedUndefinedDeployables = R.filter(
      removeUndefined,
      mappedChannels
    )
    return removedUndefinedDeployables
  }
  return []
}

// Method will take the list of applications and return a another list, for each app showing cummulated data
export const getDeployedResourcesChartData = list => {
  if (list && list.items) {
    const deplChartDataList = list.items.map(item => {
      // Will return cumulated status
      // Given the tall count of pass, fail, inprogress, pending, unidentified
      const status = getResourcesStatusPerChannel(item, false)

      const completed_counter = status[0] + status[4]
      const not_completed = status[1] + status[2] + status[3]

      let display_name = item.name || 'unknown'
      if (display_name.length > 20) {
        display_name = display_name.substring(0, 20) + '...'
      }
      if (completed_counter + not_completed > 0) {
        return {
          name: display_name,
          tooltip_name: item.name || 'unknown',
          completed: completed_counter,
          not_completed: not_completed
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
