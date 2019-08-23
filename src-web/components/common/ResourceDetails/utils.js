/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
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

export const getActiveAccountId = userInfoList => {
  return R.pathOr('', ['items', 'activeAccountId'], userInfoList)
}

export const getApplicationUid = HCMApplicationList => {
  if (
    HCMApplicationList &&
    HCMApplicationList.items instanceof Array &&
    HCMApplicationList.items.length > 0 &&
    HCMApplicationList.items[0]._uid
  ) {
    return HCMApplicationList.items[0]._uid
  }
  return ''
}
