/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import R from 'ramda'

import msgs from '../../../nls/platform.properties'
import config from '../../../lib/shared/config'

// Get the full list of deployables with details
export const getDeployableDetails = data => {
  if (
    data &&
    data.data &&
    data.data.searchResult &&
    data.data.searchResult.length > 0
  ) {
    return data.data.searchResult[0]
  }
  return []
}

// Get list of subscriptions that are associated with a specific deployable
export const getSubscriptions = data => {
  if (
    data &&
    data.data &&
    data.data.searchResult &&
    data.data.searchResult.length > 0 &&
    data.data.searchResult[0].related
  ) {
    const result = data.data.searchResult[0].related
    const subscriptionList = result.map(item => {
      if (
        item.kind &&
        item.kind === 'subscription' &&
        item.items &&
        item.items.length > 0
      ) {
        return item.items[0]
      }
    })
    const removeUndefined = x => x !== undefined
    const emptyArray = []
    const removedUndefinedSubscriptions = R.filter(
      removeUndefined,
      subscriptionList
    )
    return emptyArray.concat.apply([], removedUndefinedSubscriptions)
  }
  return []
}

// Get list of channels that are associated with the deployables subscription
export const getChannels = (channels, subscriptions) => {
  if (channels && channels.items) {
    if (subscriptions && subscriptions.length > 0 && subscriptions[0].channel) {
      const channelData = subscriptions[0].channel.split('/')

      if (channelData.length == 2) {
        const channelsList = channels.items.map(channel => {
          if (
            channel &&
            channel.name &&
            channel.namespace &&
            channel.name === channelData[1] &&
            channel.namespace &&
            channel.namespace === channelData[0]
          ) {
            return channel
          }
        })
        const removeUndefined = x => x !== undefined
        const emptyArray = []
        const removedUndefinedChannels = R.filter(
          removeUndefined,
          channelsList
        )
        return emptyArray.concat.apply([], removedUndefinedChannels)
      }
    }
    return channels.items
  }
  return []
}

// This method constructs the breadCrumbs for the application deployable details
export const getBreadCrumbs = (deployableParams, locale) => {
  if (deployableParams) {
    const breadCrumbs = [
      {
        label: msgs.get('dashboard.card.deployment.applications', locale),
        url: `${config.contextPath}`
      },
      {
        label: `${deployableParams.application || ''}`,
        url: `${config.contextPath}/${deployableParams.namespace ||
          ''}/${deployableParams.application || ''}`
      },
      {
        label: `${deployableParams.name || ''}`,
        url: `${config.contextPath}/${deployableParams.namespace ||
          ''}/${deployableParams.application ||
          ''}/deployable/${deployableParams.name || ''}`
      }
    ]

    return breadCrumbs
  }
  return [
    {
      label: msgs.get('dashboard.card.deployment.applications', locale),
      url: `${config.contextPath}`
    }
  ]
}
