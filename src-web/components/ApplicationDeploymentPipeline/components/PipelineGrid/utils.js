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
  setDeployableModalHeaderInfo,
  setCurrentDeployableSubscriptionData,
  applicationName,
  deployableName,
  matchingSubscription
) => {
  const headerInfo = {
    application: applicationName,
    deployable: deployableName
  }
  setDeployableModalHeaderInfo(headerInfo)
  setCurrentDeployableSubscriptionData(matchingSubscription)
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
