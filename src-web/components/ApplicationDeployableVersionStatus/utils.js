/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

// this method may need to be updated with different status values
export const getChannelStatusClass = status => {
  return (
    (status === 'success' && 'statusTagCompleted') ||
    (status === 'failed' && 'statusTagFailed') ||
    (status === 'inprogress' && 'statusTagInProgress') ||
    (true && 'statusTag')
  )
}

export const getChannelClustersNb = channel => {
  if (channel && channel.related) {
    for (var i = 0; i < channel.related.length; i++) {
      const item = channel.related[i]

      if (item && item.kind && item.kind === 'cluster' && item.count)
        return item.count
    }
  }

  return 0
}

export const getDeployableInfo = item => {
  if (item && item.items && item.items.length > 0) return item.items[0]
  return {}
}

export const getDeployableSubscription = item => {
  if (item && item.length > 0) return item[0]
  return null
}

// Get list of channels that are associated with the deployables subscription
export const getSubscriptionForChannel = (channel, subscriptions) => {
  if (channel && channel.name && channel.namespace) {
    if (subscriptions && subscriptions.length > 0 && subscriptions[0].channel) {
      const subscription = subscriptions[0]
      const channelData = subscription.channel.split('/')

      if (
        subscription.name &&
        subscription.namespace &&
        channelData.length == 2 &&
        channel.name === channelData[1] &&
        channel.namespace === channelData[0]
      ) {
        return subscription.namespace + '/' + subscription.name
      }
    }
  }
  return 'None'
}
