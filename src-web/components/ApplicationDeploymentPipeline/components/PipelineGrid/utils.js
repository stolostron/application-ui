/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import R from 'ramda'

export const kindsToExcludeForDeployments = [
  'cluster',
  'subscription',
  'channel',
  'events',
  'application',
  'deployable',
  'placementbinding',
  'placementrule',
  'placementpolicy',
  'applicationrelationship'
]

// A created Mapper to create the row for our application data table
const mapApplicationLookUp = application => {
  const { name, namespace, related } = application
  const idRef = name || 'default'
  return {
    [idRef]: {
      id: name || '',
      name: name || '',
      namespace: namespace || '',
      deployables: related || []
    }
  }
}

// Method will take in an object of applications and return back a mapped version
// for the DataTable that will contain more data that we will use to look up and
// reference given the ID
export const createApplicationRowsLookUp = list => {
  const mappedApps =
    (list && list.map(item => mapApplicationLookUp(item))) || {}
  return R.mergeAll(mappedApps)
}

// This contains all the actions that will be done when subscrition name under application
// Opens the modal and sets the header information and subscription information
// for that subscription clicked
export const onSubscriptionClick = (
  openSubscriptionModal,
  setSubscriptionModalHeaderInfo,
  setCurrentDeployableSubscriptionData,
  setCurrentSubscriptionModalData,
  subscription,
  applicationName,
  subscriptionName
) => {
  const headerInfo = {
    application: applicationName,
    deployable: subscriptionName
  }
  setSubscriptionModalHeaderInfo(headerInfo)
  setCurrentDeployableSubscriptionData(subscription)
  setCurrentSubscriptionModalData(subscription)
  openSubscriptionModal()
}

// When we click on the edit Channel or edit subscription, we need to make a
// fetch to get the channel yaml. We also want to open up the edit channel modal
export const editResourceClick = (resource, getResource) => {
  getResource(
    resource.selfLink,
    resource.namespace,
    resource.name,
    resource.cluster || resource.data.cluster
  )
}

// This method will find the matching subscription the the given channel and
// return the corresponding subscription from the list
// ----------------
// This is no longer being used but keeping it here for now
// ----------------
export const findMatchingSubscription = (subscriptionList, channelName) => {
  const subscription =
    subscriptionList &&
    R.find(R.propEq('channel', channelName))(subscriptionList)
  return (subscription && subscription.raw) || {}
}

// Use tested Ramda to pull out uid
export const getDataByKind = (list, uid) => {
  if (list) {
    const result = R.find(R.propEq('_uid', uid))(list)
    return result || {}
  }
  return {}
}

// ----------------
// This is no longer being used but keeping it here for now
// ----------------
export const getDataByKindByChannels = (data, channelNamespace = false) => {
  if (data && data.related) {
    const relatedData = data.related

    const dataUnderChannel = relatedData.map(resource => {
      // Items is a list of that speecific resource kind
      const items = resource.items
      const data = items.map(item => {
        // This statement checks to see if the channels namespace matches the
        // current resources namespace because if they match then we know it falls
        // under the same channel. BUT the !channelNamespace is there for if we decide
        // to pass in false we can still execute this method from other locations to
        // still get the status from other resources no matter the channel namespace
        if (item.namespace == channelNamespace || !channelNamespace) {
          return item
        }
      })
      const filterOutUndefined = x => x != undefined
      const cleanData = R.filter(filterOutUndefined, data)
      return cleanData
    })
    const filterOutEmpty = x => x.length > 0
    const finalData = R.filter(filterOutEmpty, dataUnderChannel)
    return finalData
  }
}

// Given the tally count of Pass, Fail, InProgress, Pending, Unidentified
// and the status. Add to the tally and return it
const determineStatus = (statusPassFailInProgress, status) => {
  const statusTotals = statusPassFailInProgress
  if (
    status.includes('deployed') ||
    status.includes('pass') ||
    status.includes('running')
  ) {
    // Increment PASS
    statusTotals[0] = statusTotals[0] + 1
  } else if (status.includes('fail') || status.includes('error')) {
    statusTotals[1] = statusTotals[1] + 1
  } else if (status.includes('progress')) {
    statusTotals[2] = statusTotals[2] + 1
  } else if (status.includes('pending')) {
    statusTotals[3] = statusTotals[3] + 1
  } else {
    statusTotals[4] = statusTotals[4] + 1
  }
  return statusTotals
}

// This method takes in an object of deployable data.
// From that we want to get the related resources and then filter down only to
// the resources we want to check status' for.
// If the namespace of that particular resource matches the namespace of the
// channel we can assume its in the channel.
// We also will pass in the currentDeployableStatus because we want to add that
// to the status count
export const getResourcesStatusPerChannel = (
  deployableData,
  channelNamespace = false
) => {
  if (
    deployableData &&
    deployableData.related instanceof Array &&
    deployableData.related.length > 0
  ) {
    const relatedData = deployableData.related
    // We want to pull resources data to check status
    const filterToResources = elem =>
      !kindsToExcludeForDeployments.includes(elem.kind)
    // ResourceData is an array of objects
    const resourceData = R.filter(filterToResources, relatedData)
    // Pass, Fail, InProgress, Pending, Unidentified
    let statusPassFailInProgress = [0, 0, 0, 0, 0]
    resourceData.map(resource => {
      // Items is a list of that speecific resource kind
      const items = resource.items
      items.map(item => {
        // This statement checks to see if the channels namespace matches the
        // current resources namespace because if they match then we know it fails
        // under the same channel. BUT the !channelNamespace is there for if we decide
        // to pass in false we can still execute this method from other locations to
        // still get the status from other resources no matter the channel namespace
        if (item.namespace == channelNamespace || !channelNamespace) {
          const status = (item.status || '').toLowerCase()
          statusPassFailInProgress = determineStatus(
            statusPassFailInProgress,
            status
          )
        }
      })
    })
    return statusPassFailInProgress
  }
  return [0, 0, 0, 0, 0]
}

//returns all objects of kind in the related for the specified item
//for example pullOutRelatedPerItem(application, 'cluster') returns all clusters for this application
export const pullOutRelatedPerItem = (item, kind) => {
  const isKind = n => n.kind.toLowerCase() == kind.toLowerCase()
  if (item && item.related) {
    return R.filter(isKind, item.related)
  }
  return []
}

//returns all objects of kind in the related for the specified list
//for example getAllRelatedForList(HCMApplicationList, 'cluster') returns all clusters for the applications list
//it removes the duplicates so if a cluster is part of 2 app related list, it shows up only once in the resulted array
//the list should be in the HCMApplicationList format ( { items : [{related:items}] }
export const getAllRelatedForList = (list, kind) => {
  if (list && list.items) {
    const relatedItems = list.items.map(item => {
      const resultRelatedForItem = pullOutRelatedPerItem(item, kind)
      if (resultRelatedForItem.length > 0 && resultRelatedForItem[0].items) {
        return resultRelatedForItem[0].items
      }
    })
    const removeUndefined = x => x !== undefined
    const emptyArray = []
    const removedUndefinedRelated = R.filter(removeUndefined, relatedItems)
    //filter duplicate values
    return R.uniq(emptyArray.concat.apply([], removedUndefinedRelated))
  }
  return []
}

// Given the subscriptionsForThisApplication, the channel,
// we will look through match the subscription with the channel
// and then tally up all the status under that application to give
// the total status that will be displayed at the header level
export const getApplicationLevelStatus = (
  subscriptionsForThisApplication,
  channel,
  bulkSubscriptionList
) => {
  // Pass, Fail, In Progress, Pending, unidentifed
  let appStatus = [0, 0, 0, 0, 0]
  {
    subscriptionsForThisApplication.map(subscription => {
      // Determine if this subscription is present in this channel
      const channelMatch = subscription.channel.includes(channel.name)
      if (channelMatch) {
        // Gather the subscription data that contains the matching UID
        const currSubscriptionData = getDataByKind(
          bulkSubscriptionList,
          subscription._uid
        )
        const status = getResourcesStatusPerChannel(currSubscriptionData)
        const newStatus = [
          appStatus[0] + status[0],
          appStatus[1] + status[1],
          appStatus[2] + status[2],
          appStatus[3] + status[3],
          appStatus[4] + status[4]
        ]
        appStatus = newStatus
      }
    })
  }
  return appStatus
}

// Go through the subscriptions For This Application and determine if one of them
// exists in the given channel
export const subscriptionPresentInGivenChannel = (
  subscriptionsForThisApplication,
  channel
) => {
  {
    const isItPresent = subscriptionsForThisApplication.map(subscription => {
      // Determine if this subscription is present in this channel
      const channelMatch = subscription.channel.includes(channel.name)
      if (channelMatch) {
        return true
      }
      return false
    })
    return isItPresent.includes(true)
  }
}

// This method will create the rows of subscriptions for each application
// that will fall under the channel columns
export const createSubscriptionRows = (channelList, subscriptions) => {
  // The channel list contains the order of the columns
  // What we are going to do is go through each of the subscriptions for this
  // current Application and determine which channel column they fall under
  // if subscription 'A' falls under the second channel we will update the
  // variable below to be [[], ['A'], [], [], []] with the second index being
  // the second channel column
  const columnsUnderAChannel = Array(channelList.length).fill([])
  for (var i = 0; i < channelList.length; i++) {
    const columnChannelName = `${channelList[i].namespace}/${
      channelList[i].name
    }`
    subscriptions.map(sub => {
      const subChannelName = sub.channel
      // If the channel names match up we want to add that channel to the column
      if (subChannelName == columnChannelName) {
        columnsUnderAChannel[i] = columnsUnderAChannel[i].concat([sub])
      }
    })
  }
  return columnsUnderAChannel
}

// This method takes in a list of lists and returns the longest length possilble
// inside the list of lists
export const determineLongestArray = list => {
  let longestLength = 0
  list.map(x => {
    if (x.length > longestLength) {
      longestLength = x.length
    }
  })
  return longestLength
}
