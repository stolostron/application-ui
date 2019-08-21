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
  kindsToIncludeForDeployments,
  getResourcesStatusPerChannel
} from '../../ApplicationDeploymentPipeline/components/PipelineGrid/utils'

// Method will take in an object and return back the channels mapped for display purposes
export const getChannelsList = channels => {
  if (
    channels &&
    channels.items instanceof Array &&
    channels.items.length > 0
  ) {
    const mappedChannels = channels.items.map(channel => {
      // Will return back status as:
      // [0, 0, 0, 0, 0]
      // Pass, Fail, InProgress, Pending, Unidentified
      const status = getResourcesStatusPerChannel(channel, false)
      return {
        name: channel.name || '',
        counts: {
          completed: {
            total: status[0] + status[4]
          },
          inProgress: {
            total: status[2] + status[3]
          },
          failed: {
            total: status[1]
          }
        }
      }
    })
    return mappedChannels
  }
  return []
}

export const getNumDeployables = data => {
  if (data && data.related instanceof Array && data.related.length > 0) {
    const filtered = data.related.filter(elem => elem.kind === 'deployable')
    if (filtered.length > 0) {
      return filtered.reduce((acc, cur) => acc + cur['count'], 0)
    } else {
      return 0
    }
  } else {
    return 0
  }
}

export const getNumDeployments = data => {
  if (data && data.related instanceof Array && data.related.length > 0) {
    const filtered = data.related.filter(elem =>
      kindsToIncludeForDeployments.includes(elem.kind)
    )
    if (filtered.length > 0) {
      return filtered.reduce((acc, cur) => acc + cur['count'], 0)
    } else {
      return 0
    }
  } else {
    return 0
  }
}

export const getNumInProgressDeployments = data => {
  const status = getResourcesStatusPerChannel(data, false)
  return status[2] + status[3]
}

export const getNumFailedDeployments = data => {
  const status = getResourcesStatusPerChannel(data, false)
  return status[1]
}

export const getNumCompletedDeployments = data => {
  const status = getResourcesStatusPerChannel(data, false)
  return status[0] + status[4]
}

export const getIcamLink = (activeAccountId, applicationUid) => {
  if (activeAccountId && applicationUid) {
    return `/cemui/applications/${encodeURIComponent(
      applicationUid.split('/').pop()
    )}?subscriptionId=${encodeURIComponent(activeAccountId)}`
  }
  return '#'
}

// Given a current resource data INCLUDING its related resources
// we want to return all the channels.
// Channels are not returned inside related resources so we have to
// insepect each related subscription because it contains the channel
export const getResourceChannels = resourceData => {
  if (resourceData && resourceData.related) {
    const relatedData = resourceData.related
    // We want to pull only subscription data
    const filterToSubscriptions = x => x.kind == 'subscription'
    const subscriptionData = R.filter(filterToSubscriptions, relatedData)
    if (subscriptionData[0] && subscriptionData[0].items) {
      const channels = subscriptionData[0].items.map(sub => {
        return sub.channel
      })
      return channels
    }
    return []
  }
  return []
}

const findMatchingResource = (kind, item, resourcesTwo) => {
  const match = resourcesTwo.map(resourceKindTwo => {
    const kindItemsTwo = resourceKindTwo.items || []
    const kindTwo = resourceKindTwo.kind || ''
    const matched = kindItemsTwo.map(itemTwo => {
      if (kindTwo == kind && item._uid == itemTwo._uid) {
        return { kind: kind, items: [itemTwo] }
      }
    })
    const filterOutUndefined = x => x != undefined
    const filteredData = R.filter(filterOutUndefined, matched)
    return filteredData
  })
  return match
}

export const getCommonResources = (resourcesListOne, resourcesTwo) => {
  let channelFormat = []
  let commonResources = []
  // Each Channel
  console.log(resourcesListOne)
  resourcesListOne.map(resourceOne => {
    // That channels related data
    resourceOne.related.map(resource => {
      const kindItems = resource.items || []
      const kind = resource.kind || ''
      kindItems.map(item => {
        const match = findMatchingResource(kind, item, resourcesTwo)
        commonResources = commonResources.concat(match)
      })
    })
    channelFormat = channelFormat.concat([
      { name: resourcesListOne.name, items: commonResources }
    ])
  })
  const filterOutEmpty = x => x.length > 0
  const filteredData = R.filter(filterOutEmpty, commonResources)
  console.log(filteredData)
  return filteredData
}

export const getCurrentApplication = (HCMApplicationList, secondaryHeader) => {
  const applicationView = secondaryHeader.breadcrumbItems.length == 2
  const currentApplication = R.pathOr([], ['items'])(HCMApplicationList)
  const currentApplicationItemZero =
    (applicationView &&
      (currentApplication.length > 0 && currentApplication[0])) ||
    {}
  return currentApplicationItemZero
}
