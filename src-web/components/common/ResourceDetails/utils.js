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

export const getICAMLinkForApp = (
  appId,
  appName,
  clusterName,
  activeAccountId
) => {
  if (appId && appName && clusterName) {
    appId = R.replace(clusterName, '', appId)

    if (activeAccountId)
      return `/cemui/applications${appId}?name=${appName}&subscriptionId=${activeAccountId}`

    return `/cemui/applications${appId}?name=${appName}`
  }

  return '#'
}
