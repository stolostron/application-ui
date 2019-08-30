/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import R from 'ramda'

//input [a,b,c,d] , output [a,b, 2+, 'c d']
//input [a,b,c,d, e] , output [a,b, 3+, 'c d e']
export const getLabelsListClass = list => {
  if (list.length > 2) {
    const placeholder = R.concat('+', list.length - 2)
    let result = R.insert(2, placeholder, list) //insert the placeholder label at position 3
    result = R.remove(3, list.length - 2, result) // remove everything after placeholder
    const lastElements = R.slice(2, list.length, list) //get all elements after first 2

    return {
      data: result,
      hover: R.join('', lastElements)
    }
  }
  return { data: list, hover: '' }
}

export const getCsvListClass = list => {
  if (list.length > 6) {
    const placeholder = R.concat(list[5], '...')
    let result = R.insert(5, placeholder, list)
    result = R.remove(6, list.length - 5, result)
    const lastElements = R.slice(6, list.length, list)

    return {
      data: result,
      hover: R.join('', lastElements)
    }
  }
  return {
    data: list,
    hover: ''
  }
}

export const getSearchUrl = subName => {
  return (
    '/multicloud/search?filters={"textsearch":"kind%3Asubscription%20name%3A' +
    subName +
    '"}'
  )
}

export const getIcamLinkForSubscription = (
  activeAccountId,
  subscriptionUid
) => {
  if (activeAccountId && subscriptionUid) {
    return `/cemui/applications/${encodeURIComponent(
      subscriptionUid.split('/').pop()
    )}?subscriptionId=${encodeURIComponent(activeAccountId)}`
  }
  return '#'
}
