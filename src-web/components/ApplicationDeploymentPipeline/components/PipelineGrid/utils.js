/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import R from 'ramda'

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

// This contains all the actions that will be done when clicking on the tile
// Opens the modal and sets the header information and subscription information
// for that deployable clicked
export const tileClick = (
  openDeployableModal,
  setsubscriptionModalHeaderInfo,
  setCurrentDeployableSubscriptionData,
  setCurrentDeployableModalData,
  deployableDataByChannel,
  applicationName,
  deployableName,
  matchingSubscription
) => {
  const headerInfo = {
    application: applicationName,
    deployable: deployableName
  }
  setsubscriptionModalHeaderInfo(headerInfo)
  setCurrentDeployableSubscriptionData(matchingSubscription)
  setCurrentDeployableModalData(deployableDataByChannel)
  openDeployableModal()
}

// When we click on the edit Channel, we need to make a fetch to get the channel
// yaml
// We also want to open up the edit channel modal
export const editChannelClick = (
  editChannel,
  resourceTypeChannel,
  channel,
  getChannelResource
) => {
  getChannelResource(
    channel.selfLink,
    channel.namespace,
    channel.name,
    channel.data.cluster
  )
}

// This method will find the matching subscription the the given channel and
// return the corresponding subscription from the list
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

// Given a current deployables data INCLUDING its related resources
// we want to return all the channels.
// Channels are not returned inside related resources so we have to
// insepect each related subscription because it contains the channel
// ----------------
// This is no longer being used but keeping it here for now
// ----------------
export const getDeployablesChannels = deployableData => {
  if (deployableData && deployableData.related) {
    const relatedData = deployableData.related
    // We want to pull only subscription data
    const filterToSubscriptions = x => x.kind == 'subscription'
    const subscriptionData = R.filter(filterToSubscriptions, relatedData)
    if (subscriptionData[0] && subscriptionData[0].items) {
      const channels = subscriptionData[0].items.map(sub => {
        return sub.channel
      })
      return channels
    }
    return []
  }
  return []
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

// Given the tall count of pass, fail, inprogress, pending, unidentified
// and the status. Add to the tall and return it
const determineStatus = (statusPassFailInProgress, status) => {
  const statusTotals = statusPassFailInProgress
  if (status.includes('deploy') || status.includes('pass')) {
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
  if (deployableData && deployableData.related) {
    const relatedData = deployableData.related
    // We want to pull resources data to check status
    const filterToResources = x =>
      x.kind == 'release' ||
      x.kind == 'pod' ||
      x.kind == 'replicaset' ||
      x.kind == 'deployment' ||
      x.kind == 'service'
    // ResourceData is an array of objects
    const resourceData = R.filter(filterToResources, relatedData)
    // PASS, FAIL, INPROGRESS, unidentified status
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
