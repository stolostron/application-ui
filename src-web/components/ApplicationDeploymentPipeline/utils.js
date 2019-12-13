/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import R from 'ramda'

// Method will take in an object and return back the items of applications
export const getApplicationsList = list => {
  if (list && list.items) {
    return list.items
  }
  return []
}

export const pullOutKindPerApplication = (application, kind = '') => {
  const isKind = n => n.kind.toLowerCase() == kind.toLowerCase()
  if (application && application.related) {
    const appDeployables = R.filter(isKind, application.related)
    return appDeployables
  }
  return []
}

//returns the placement rule for this Hub subscription
export const getPlacementRuleFromBulkSubscription = subscription => {
  if (subscription) {
    const placementRuleList = pullOutKindPerApplication(
      subscription,
      'placementrule'
    )
    if (
      placementRuleList &&
      placementRuleList[0] &&
      placementRuleList[0].items instanceof Array &&
      placementRuleList[0].items.length > 0
    ) {
      return placementRuleList[0].items[0]
    }
  }
  return undefined
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
// ----------------
// This is no longer being used but keeping it here for now
// ----------------
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

// This method takes in the application list ... and then goes through and pulls
// all the subscriptions found in that application list.
// The reason to do this is because its possible subscriptions can exist that
// are NOT assigned to any application. So to display an accurate count of
// subscriptions we need to get it from the applications list.
export const getSubscriptionListGivenApplicationList = applications => {
  let subsctiotionList = []
  const getKind = x => x.kind.toLowerCase() == 'subscription'
  if (applications) {
    applications.map(application => {
      if (application && application.related) {
        const subscriptionList = R.filter(getKind, application.related)
        if (
          subscriptionList &&
          subscriptionList[0] &&
          subscriptionList[0].items
        ) {
          const mappedSubscriptions = subscriptionList[0].items.map(
            subscription => {
              return {
                name: subscription.name || '',
                namespace: subscription.namespace || '',
                creationTimestamp: subscription.created || '',
                resourceVersion: subscription.packageFilterVersion || '',
                channel: subscription.channel || '',
                raw: subscription || {}
              }
            }
          )
          subsctiotionList = subsctiotionList.concat(mappedSubscriptions)
        }
      }
    })
  }
  return subsctiotionList
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
