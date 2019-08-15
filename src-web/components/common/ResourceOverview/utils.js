/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import { getResourcesStatusPerChannel } from '../../../components/ApplicationDeploymentPipeline/components/PipelineGrid/utils'

const kindsToExcludeForDeployments = [
  'deployable',
  'channel',
  'cluster',
  'subscription',
  'placementbinding',
  'placementrule',
  'placementpolicy',
  'applicationrelationship'
]

// Method will take in an object and return back the channels mapped for display purposes
export const getChannelsList = channels => {
  if (channels && channels.items) {
    const mappedChannels = channels.items.map(channel => {
      // Will return back status as:
      // [0, 0, 0, 0, 0]
      // Pass, Fail, InProgress, Pending, unidentified
      const status = getResourcesStatusPerChannel(channel, false)
      return {
        name: channel.name || '',
        counts: {
          pending: {
            total: status[3]
          },
          'in progress': {
            total: status[2]
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
    const filtered = data.related.filter(
      elem => !kindsToExcludeForDeployments.includes(elem.kind)
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

export const getNumPendingDeployments = data => {
  if (data && data.related instanceof Array && data.related.length > 0) {
    const filtered = data.related.filter(
      elem => !kindsToExcludeForDeployments.includes(elem.kind)
    )
    if (filtered.length > 0) {
      let total = 0
      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i].items instanceof Array) {
          total =
            total +
            filtered[i].items.reduce(
              (acc, cur) =>
                cur.status && cur.status.toUpperCase() === 'PENDING'
                  ? ++acc
                  : acc,
              0
            )
        }
      }
      return total
    } else {
      return 0
    }
  } else {
    return 0
  }
}

export const getNumInProgressDeployments = data => {
  if (data && data.related instanceof Array && data.related.length > 0) {
    const filtered = data.related.filter(
      elem => !kindsToExcludeForDeployments.includes(elem.kind)
    )
    if (filtered.length > 0) {
      let total = 0
      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i].items instanceof Array) {
          total =
            total +
            filtered[i].items.reduce(
              (acc, cur) =>
                cur.status && cur.status.toUpperCase() === 'IN PROGRESS'
                  ? ++acc
                  : acc,
              0
            )
        }
      }
      return total
    } else {
      return 0
    }
  } else {
    return 0
  }
}

export const getNumFailedDeployments = data => {
  if (data && data.related instanceof Array && data.related.length > 0) {
    const filtered = data.related.filter(
      elem => !kindsToExcludeForDeployments.includes(elem.kind)
    )
    if (filtered.length > 0) {
      let total = 0
      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i].items instanceof Array) {
          total =
            total +
            filtered[i].items.reduce(
              (acc, cur) =>
                cur.status &&
                (cur.status.toUpperCase() === 'FAILED' ||
                  cur.status.toUpperCase().includes('ERROR'))
                  ? ++acc
                  : acc,
              0
            )
        }
      }
      return total
    } else {
      return 0
    }
  } else {
    return 0
  }
}

export const getIcamLink = (activeAccountId, applicationUid) => {
  if (activeAccountId && applicationUid) {
    return `/cemui/applications/${encodeURIComponent(
      applicationUid
    )}?subscriptionId=${encodeURIComponent(activeAccountId)}`
  }
  return '#'
}
