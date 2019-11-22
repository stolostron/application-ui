/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
import R from 'ramda'

export const getRelatedItems = (related, kind) => {
  let result = []
  let filtered = []
  if (related instanceof Array && related.length > 0) {
    if (kind === 'deployment') {
      filtered = related.filter(
        elem =>
          ![
            'deployable',
            'channel',
            'cluster',
            'subscription',
            'placementbinding',
            'placementrule',
            'placementpolicy',
            'applicationrelationship'
          ].includes(elem.kind)
      )
    } else {
      filtered = related.filter(elem => elem.kind === kind)
    }
    filtered.map(elem => {
      if (elem.items instanceof Array) {
        if (kind === 'subscription') {
          //filter out remote cluster subscriptions
          // identified by the fact that the _hostingSubscription is defined
          const isHubSubscr = item =>
            !item._hostingSubscription &&
            (!item.status || (item.status && item.status != 'Subscribed'))
          const filteredResult = R.filter(isHubSubscr, elem.items)
          result = result.concat(filteredResult)
        } else {
          result = result.concat(elem.items)
        }
      }
    })
  }
  return result
}

//remove all remote cluster subscriptions from the related link
export const filterRemoteClusterSubscriptions = related => {
  if (related instanceof Array && related.length > 0) {
    const subscriptionsRel = item => item.kind === 'subscription'
    const subscr_index = R.findIndex(subscriptionsRel)(related)

    if (subscr_index != -1) {
      const isHubSubscr = item =>
        !item._hostingSubscription &&
        (!item.status || (item.status && item.status != 'Subscribed'))
      //replace subscriptions with a new list
      //where remote cluster subscriptions were removed
      if (related[subscr_index]) {
        const result = R.filter(isHubSubscr, related[subscr_index].items)
        //replace subscriptions with the filtered value
        related[subscr_index].items = result
      }
    }
  }
  return related
}

//get all remote cluster subscriptions from the related link
export const getRemoteClusterSubscriptions = related => {
  if (related instanceof Array && related.length > 0) {
    const subscriptionsRel = item => item.kind === 'subscription'
    const subscr_index = R.findIndex(subscriptionsRel)(related)

    if (subscr_index != -1) {
      const isNOTHubSubscr = item => item._hostingSubscription
      if (related[subscr_index]) {
        return R.filter(isNOTHubSubscr, related[subscr_index].items)
      }
    }
  }
  return []
}
