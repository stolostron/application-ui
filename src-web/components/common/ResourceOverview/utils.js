/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

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

export const getSearchLinkForOneApplication = params => {
  if (params && params.name) {
    return `/multicloud/search?filters={"textsearch":"kind%3Aapplication%20name%3A${
      params.name
    }"}`
  }
  return ''
}

export const getSearchLinkForAllApplications = () => {
  return '/multicloud/search?filters={"textsearch":"kind%3Aapplication"}'
}
