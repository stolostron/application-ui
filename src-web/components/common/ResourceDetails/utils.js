/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import R from 'ramda'

export const getIncidentList = list => {
  if (list && list.items) {
    return list.items
  }
  return []
}

export const getIncidentCount = list => {
  if (list && list.items && Array.isArray(list.items)) {
    return list.items.length
  }
  return '-'
}

/*

export const getIcamLinkForSubscription = (
  activeAccountId,
  namespace, subscriptionName
) => {
  if (activeAccountId && namespace && subscriptionName) {
    const hostingSubscriptionStr = base64.encode(`${namespace}/${subscriptionName}`)
    return `/cemui/applications/${hostingSubscriptionStr}?subscriptionId=${encodeURIComponent(activeAccountId)}&name=${subscriptionName}`
  }
  return '#'
}
*/

export const getICAMLinkForApp = (appId, clusterName, activeAccountId) => {
  if (appId && clusterName) {
    appId = R.replace(clusterName, '', appId)

    if (activeAccountId)
      return `/cemui/applications${appId}?subscriptionId=${activeAccountId}`

    return `/cemui/applications${appId}`
  }

  return '#'
}
