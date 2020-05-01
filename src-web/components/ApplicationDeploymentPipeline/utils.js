/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
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

export const getApplicationsForSelection = (
  list,
  breadcrumbItems,
  AppDeployments
) => {
  let selectedAppName = ''
  let selectedAppNamespace = ''
  const isSingleApplicationView = breadcrumbItems.length === 2

  let filteredApplications = ''
  if (isSingleApplicationView) {
    const urlArray = R.split('/', breadcrumbItems[1].url)
    selectedAppName = urlArray[urlArray.length - 1]
    selectedAppNamespace = urlArray[urlArray.length - 2]

    // if there is only a single application, filter the list with the selectedAppName and selectedAppNamespace
    filteredApplications = filterSingleApp(
      list,
      selectedAppName,
      selectedAppNamespace
    )
  } else {
    // multi app view
    filteredApplications = filterApps(
      list,
      AppDeployments.deploymentPipelineSearch
    )
  }
  return getApplicationsList(filteredApplications)
}

export const pullOutKindPerApplication = (application, kind = '') => {
  const isKind = n => n.kind.toLowerCase() === kind.toLowerCase()
  if (application && application.related) {
    return R.filter(isKind, application.related)
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
    return channels.items.map(channel => {
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
  }
  return []
}

// Method will take in an object and return back the subscriptions
// ----------------
// This is no longer being used but keeping it here for now
// ----------------
export const getSubscriptionsList = subscriptions => {
  if (subscriptions && subscriptions.items) {
    return subscriptions.items.map(subscription => {
      return {
        name: subscription.name || '',
        namespace: subscription.namespace || '',
        creationTimestamp: subscription.created || '',
        resourceVersion: subscription.packageFilterVersion || '',
        channel: subscription.channel || '',
        raw: subscription || {}
      }
    })
  }
  return []
}

// This takes in the applications list, application name, and application namespace to filters down the applications
export const filterSingleApp = (applications, searchName, searchNamespace) => {
  if (
    searchName !== '' &&
    searchNamespace !== '' &&
    applications &&
    applications.items &&
    applications.items.length > 0
  ) {
    const doesContainName = x => x.name.includes(searchName)
    const doesContainNamespace = y => y.namespace.includes(searchNamespace)
    var filteredApps = R.filter(doesContainName, applications.items)
    filteredApps = R.filter(doesContainNamespace, filteredApps)
    // The format is expecting it in an objects of items so keeping the format
    return { items: filteredApps }
  }
  return applications
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
