/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
import R from 'ramda'
import {
  getResourcesStatusPerChannel,
  getAllRelatedForList
} from '../../ApplicationDeploymentPipeline/components/PipelineGrid/utils'

// Method will take in an object and return back the status of related objects
// returns [completed + unidentified, fail, inprogress + pending]
// Given the tall count of completed + unidentified, fail, inprogress + pending
export const getAllDeployablesStatus = list => {
  const statusPassFailInProgress = [0, 0, 0]
  if (list && list.items instanceof Array && list.items.length > 0) {
    list.items.map(item => {
      // Will return back status as:
      // [0, 0, 0, 0, 0]
      // Pass, Fail, InProgress, Pending, Unidentified
      const status = getResourcesStatusPerChannel(item, false)
      statusPassFailInProgress[0] =
        statusPassFailInProgress[0] + status[0] + status[4]
      statusPassFailInProgress[1] = statusPassFailInProgress[1] + status[1]
      statusPassFailInProgress[2] =
        statusPassFailInProgress[2] + status[2] + status[3]
    })
  }
  return statusPassFailInProgress
}

export const getNumClusters = (applications, allsubscriptions) => {
  if (allsubscriptions && allsubscriptions.items) {
    const subscriptionsInApp = getAllRelatedForList(
      applications,
      'subscription'
    )

    if (subscriptionsInApp && subscriptionsInApp.length > 0) {
      const subscriptionForSearch = allsubscriptions.items.map(item => {
        if (item && item.name && item.namespace) {
          for (var i = 0; i < subscriptionsInApp.length; i++) {
            const sappitem = subscriptionsInApp[i]

            if (
              sappitem &&
              sappitem.name &&
              sappitem.namespace &&
              sappitem.name === item.name &&
              sappitem.namespace === item.namespace
            )
              return item
          }
        }
      })

      const removeUndefined = x => x !== undefined
      const emptyArray = []
      const removedUndefinedSubscriptions = R.filter(
        removeUndefined,
        subscriptionForSearch
      )
      const resultList = emptyArray.concat.apply(
        [],
        removedUndefinedSubscriptions
      )
      return getAllRelatedForList({ items: resultList }, 'cluster').length
    }
  }

  return 0
}

export const getApplicationName = list => {
  if (
    list &&
    list.items instanceof Array &&
    list.items.length > 0 &&
    list.items[0].name
  ) {
    return list.items[0].name
  }
  return ''
}

export const getSingleApplicationObject = list => {
  if (list && list.items instanceof Array && list.items.length > 0) {
    return list.items[0]
  }
  return ''
}

export const getChannelsCountFromSubscriptions = arr => {
  const channelSet = new Set()
  if (arr instanceof Array && arr.length > 0) {
    arr.map(elem => {
      if (elem && elem.items instanceof Array && elem.items.length > 0) {
        elem.items.map(subelem => {
          if (subelem.channel) {
            channelSet.add(subelem.channel)
          }
        })
      }
    })
  }
  return channelSet.size
}
