/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
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

// This method takes in an object and drills down to find the items of applications
// Within that it will go a step further and find the deployables and merge them together.
// ----------------
// This is no longer being used but keeping it here for now
// ----------------
export const getDeployablesList = list => {
  if (list && list.items) {
    const deployables = list.items.map(application => {
      const deployablesList = pullOutKindPerApplication(
        application,
        'deployable'
      )
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

export const createChannelSample =
  '# This is a sample template for creating channels.\n' +
  '# For more information, click the "Need help writing this?" link above.\n\n' +
  'apiVersion: app.ibm.com/v1alpha1\n' +
  'kind: Channel\n' +
  'metadata:\n' +
  '  name:' +
  '\t#The name of the channel\n' +
  '  namespace:' +
  '\t#The namespace for the channel\n' +
  'spec:\n' +
  '  sourceNamespaces:' +
  '\t#Identifies the namespace that the channel controller monitors\n' +
  '  type:' +
  '\t#The channel type\n' +
  '  pathname:' +
  '\t#Required for HelmRepo and ObjectBucket channels\n' +
  '  gates:' +
  '\t#Defines requirements for promoting a deployable within the channel\n' +
  '    annotations:' +
  '\t#The annotations for the channel\n' +
  '  labels:' +
  '\t#The labels for the channel'

export const createSubscriptionSample =
  '# This is a sample template for creating subscriptions.\n' +
  '# For more information, click the "Need help writing this?" link above.\n\n' +
  'apiVersion: app.ibm.com/v1alpha1\n' +
  'kind: Subscription\n' +
  'metadata:\n' +
  '  name:' +
  '\t#The name for identifying the subscription\n' +
  '  namespace:' +
  '\t#The namespace for the deployable\n' +
  '  labels:' +
  '\t#The labels for the subscription\n' +
  'spec:\n' +
  '  sourceNamespace:' +
  '\t#The source namespace where deployables are stored on the Hub cluster\n' +
  '  source:' +
  '\t#The path name ("URL") to the Helm repository where deployables are stored\n' +
  '  channel:' +
  '\t#The NamespaceName ("Namespace/Name") that defines the channel for the subscription\n' +
  '  name:' +
  '\t#The specific name for the target deployable\n' +
  '  packageFilter:' +
  '\t#Defines the parameters to use to find target deployables or a subset of a deployables\n' +
  '    version:' +
  '\t#The version or versions for the deployable\n' +
  '    labelSelector:\n' +
  '      matchLabels:\n' +
  '        package:\n' +
  '        component:\n' +
  '    annotations:' +
  '\t#The annotations for the deployable\n' +
  '  packageOverrides:' +
  '\t#Defines the parameters to override for a deployable and the replacement value to use\n' +
  '    packageName:' +
  '\t#The name of the package to override\n' +
  '    packageOverrides:' +
  '\t#The configuration of parameters and values to use to override a package\n' +
  '      path:\n' +
  '      value:\n' +
  '  placement:' +
  '\t#Identifies the subscribing clusters where deployables need to be placed, or the placement rule that defines the clusters\n' +
  '    clusters:' +
  '\t#Defines the subscribing clusters\n' +
  '      name:' +
  '\t#The name or names of the subscribing clusters\n' +
  '    placementRef:' +
  '\t#Defines the placement rule to use for the subscription\n' +
  '      name:' +
  '\t#The name of the placement rule\n' +
  '      kind: PlacementRule\n' +
  '  overrides:' +
  '\t#Any parameters and values that need to be overridden\n' +
  '    clusterName:' +
  '\t#The name of the cluster or clusters where parameters and values are being overridden\n' +
  '    clusterOverrides:' +
  '\t#The configuration of parameters and values to override\n' +
  '      path:\n' +
  '      value:'
