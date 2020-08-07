/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *
 * Copyright (c) 2020 Red Hat, Inc.
 *
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
  'applicationrelationship',
  'vulnerabilitypolicy',
  'mutationpolicy'
]

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
  subscriptionName,
  applicationStatus
) => {
  const headerInfo = {
    application: applicationName,
    deployable: subscriptionName
  }
  subscription.applicationStatus = applicationStatus
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
    resource.cluster ||
      (resource.data && resource.data.cluster) ||
      'local-cluster'
  )
}

// Use tested Ramda to pull out uid
export const getDataByKind = (list, uid) => {
  if (list) {
    const result = R.find(R.propEq('_uid', uid))(list)
    return result || {}
  }
  return {}
}

//sort the channelList and return a new llist of channels with the channels having subscriptions showing first
export const sortChannelsBySubscriptionLength = (
  channelList,
  applicationList
) => {
  const getSubscriptions = x => x.kind.toLowerCase() === 'subscription'
  //find subscriptions with ns in the list of applications ns; ignore the rest, they are not going to be displayed
  const getSubscrForNSIndex = (x, list) =>
    x.namespace && R.findIndex(R.propEq('namespace', x.namespace))(list)

  const getNbOfSubscriptionsForChannel = (x, appList) => {
    let subscrChSize = 0
    const relatedCh =
      (x && R.pathOr(undefined, ['data', 'related'], x)) || undefined

    if (relatedCh) {
      //check subscription nb and use the namespace if specified
      const subscriptions = R.filter(getSubscriptions, relatedCh)

      if (subscriptions) {
        //get nb of subscriptions for that ns only
        subscriptions.forEach(item => {
          if (item && item.items && item.items instanceof Array) {
            item.items.forEach(channelSubscription => {
              if (getSubscrForNSIndex(channelSubscription, appList) >= 0) {
                subscrChSize = subscrChSize + 1
              }
            })
          }
        })
      }
    }
    return subscrChSize
  }

  const sortBy = function(a, b) {
    return (
      getNbOfSubscriptionsForChannel(b, applicationList) -
      getNbOfSubscriptionsForChannel(a, applicationList)
    )
  } // sort by lenght of subscriptions
  return R.sort(sortBy, channelList)
}
// This method will create the rows of subscriptions for each application
// that will fall under the channel columns
export const createSubscriptionPerChannel = (channelList, subscriptions) => {
  // The channel list contains the order of the columns
  // What we are going to do is go through each of the subscriptions for this
  // current Application and determine which channel column they fall under
  // if subscription 'A' falls under the second channel we will update the
  // variable below to be [[], ['A'], [], [], []] with the second index being
  // the second channel column
  const columnsUnderAChannel = Array(channelList.length).fill([])
  for (let i = 0; i < channelList.length; i++) {
    const columnChannelName = `${channelList[i].namespace}/${
      channelList[i].name
    }`
    subscriptions.map(sub => {
      const subChannelName = sub.channel
      // If the channel names match up we want to add that channel to the column
      if (subChannelName === columnChannelName) {
        columnsUnderAChannel[i] = columnsUnderAChannel[i].concat([sub])
      }
    })
  }
  return columnsUnderAChannel
}

// similar to createSubscriptionPerChannel but with custom logic for standalone subscriptions
// identify the subscription based on the uid
export const createStandaloneSubscriptionPerChannel = (
  channelList,
  subscriptions
) => {
  const columnsUnderAChannel = Array(channelList.length).fill([])
  for (let i = 0; i < channelList.length; i++) {
    subscriptions.forEach(sub => {
      if (channelList[i].data && channelList[i].data.related) {
        channelList[i].data.related.forEach(channelSub => {
          if (channelSub.items) {
            channelSub.items.forEach(item => {
              // if channel value is not set for standalone, fill it in
              if (sub._uid === item._uid) {
                columnsUnderAChannel[i] = columnsUnderAChannel[i].concat([sub])
              }
            })
          }
        })
      }
    })
  }
  return columnsUnderAChannel
}

export const getStandaloneSubsWithInvalidChannel = (
  channelList,
  subscriptions
) => {
  const subsWithNoChannel = []
  subscriptions.forEach(sub => {
    let channelFound = false
    for (let i = 0; i < channelList.length && !channelFound; i++) {
      if (channelList[i].data && channelList[i].data.related) {
        const channelSub = channelList[i].data.related
        for (let j = 0; j < channelSub.length && !channelFound; j++) {
          if (channelSub[j].items) {
            channelFound = channelSub[j].items.some(
              item => sub._uid === item._uid
            )
          }
        }
      }
    }
    if (!channelFound) {
      subsWithNoChannel.push(sub)
    }
  })
  return subsWithNoChannel
}

// This method takes in a list of lists and returns the longest length possilble
// inside the list of lists
const determineLongestArray = list => {
  let longestLength = 0
  list.map(x => {
    if (x.length > longestLength) {
      longestLength = x.length
    }
  })
  return longestLength
}

export const getLongestArray = list => {
  let longestLength = 0
  let longestArray = []
  list.map(x => {
    if (x.length > longestLength) {
      longestLength = x.length
      longestArray = x
    }
  })
  return longestArray
}

export const subscriptionsUnderColumnsGrid = subscriptionsUnderChannel => {
  const longestList = determineLongestArray(subscriptionsUnderChannel)
  let subscriptionGrid = []
  // Go through the channel columns
  for (let i = 0; i < subscriptionsUnderChannel.length; i++) {
    // Get the current subscription list for that channel
    const channelSubscriptionList = subscriptionsUnderChannel[i]
    let subscriptionList = []
    // We want to go the length of the longest list because we want to add
    // blank entires if they dont contain any to create a complete grid
    for (let x = 0; x < longestList; x++) {
      // if there is a subscription at this index we want to add it
      if (channelSubscriptionList[x]) {
        const currentSubscription = channelSubscriptionList[x]
        subscriptionList = subscriptionList.concat([currentSubscription])
      } else {
        // else add a blank for a table filler
        subscriptionList = subscriptionList.concat([{}])
      }
    }
    subscriptionGrid = subscriptionGrid.concat([subscriptionList])
  }

  return R.transpose(subscriptionGrid)
}

export const getStandaloneSubscriptions = subscriptions => {
  // if related field exists, it must not be an app
  subscriptions = R.filter(
    n =>
      R.isEmpty(n.related) ||
      !R.find(R.propEq('kind', 'application'))(n.related),
    subscriptions
  )

  return subscriptions
}

export const getSearchLinkForFailedSubscriptions = () => {
  return '/multicloud/search?filters={"textsearch":"kind%3Asubscription%20status%3APropagationFailed"}'
}
