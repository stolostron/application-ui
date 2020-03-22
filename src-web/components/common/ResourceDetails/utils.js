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

//getNamespaceAccountId for a specified namespace
//list the list of namespaces to search from
//itemName - if list has more than one items, pass the itemName to tell what namespace to look for
//return namespace account id
export const getNamespaceAccountId = (list, itemName) => {
  if (list && list.items && Array.isArray(list.items)) {
    let nsObject = undefined

    if (itemName) {
      const ns = R.pathEq(['metadata', 'name'], itemName)
      const nsObjectList = R.filter(ns, list.items)
      if (nsObjectList.length > 0) {
        nsObject = nsObjectList[0]
      }
    } else {
      nsObject = list.items[0]
    }

    if (nsObject) {
      const annotations = R.path(['metadata', 'annotations'], nsObject)

      if (annotations) {
        let properties = Object.getOwnPropertyNames(annotations)
        const isAccountId = name => name && name.includes('accountID')
        properties = R.filter(isAccountId, properties)

        if (properties && properties.length === 1) {
          return annotations[properties[0]]
        }
      }
    }

    return undefined
  }
  return undefined
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
