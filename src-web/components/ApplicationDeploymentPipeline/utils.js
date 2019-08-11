/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import R from 'ramda'

// Method will take in an object and return back the items of applications
export const getApplicationsList = list => {
  if (list && list.items) {
    return list.items
  }
  return []
}

const pullOutDeployablePerApplication = application => {
  const isKind = n => n.kind === 'deployable'
  if (application && application.related) {
    const appDeployables = R.filter(isKind, application.related)
    return appDeployables
  }
  return []
}

// This method takes in an object and drills down to find the items of applications
// Within that it will go a step further and find the deployables and merge them together.
export const getDeployablesList = list => {
  if (list && list.items) {
    const deployables = list.items.map(application => {
      const deployablesList = pullOutDeployablePerApplication(application)
      if (deployablesList.length > 0) {
        return deployablesList
      }
    })
    const removeUndefined = x => x !== undefined
    const emptyArray = []
    const removedUndefinedDeployables = R.filter(removeUndefined, deployables)
    return emptyArray.concat.apply([], removedUndefinedDeployables)
  }
  return []
}

// Method will take in an object and return back the channels mapped
export const getChannelsList = channels => {
  if (channels && channels.items) {
    const mappedChannels = channels.items.map(channel => {
      return {
        id: channel.name || '',
        name: channel.name || '',
        namespace: channel.namespace || '',
        selfLink: channel.selfLink || '',
        uid: channel.uid || '',
        creationTimeStamp: channel.created || '',
        pathName: channel.pathName || '',
        type: channel.type || '',
        data: channel
      }
    })
    return mappedChannels
  }
  return []
}

// Method will take in an object and return back the subscriptions
export const getSubscriptionsList = subscriptions => {
  if (subscriptions && subscriptions.items) {
    const mappedSubscriptions = subscriptions.items.map(subscription => {
      return {
        name: subscription.name || '',
        namespace: subscription.namespace || '',
        creationTimestamp: subscription.created || '',
        resourceVersion: subscription.packageFilterVersion || '',
        channel: subscription.channel || '',
        raw: subscription || {}
      }
    })
    return mappedSubscriptions
  }
  return []
}

// This takes in the applications list and searchText and filters down the applications
export const filterApps = (applications, searchText) => {
  if (
    searchText !== '' &&
    applications &&
    applications.items &&
    applications.items.length > 0
  ) {
    const doesContainName = x => x.name.includes(searchText)
    const filteredApps = R.filter(doesContainName, applications.items)
    // The format is expecting it in an objects of items so keeping the format
    return { items: filteredApps }
  }
  return applications
}
