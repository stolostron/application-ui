/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
import R from 'ramda'

// @flow
export const mapBulkSubscriptions = subscriptions => {
  if (subscriptions) {
    const mappedSubscriptions = subscriptions.map(subscription => {
      if (subscription.items && subscription.related) {
        const items = subscription.items[0]
        if (!items._hostingSubscription) {
          //filter out remote cluster subscriptions
          // identified by the fact that the _hostingSubscription is defined
          return {
            name: items.name || '',
            namespace: items.namespace || '',
            selfLink: items.selfLink || '',
            _uid: items._uid || '',
            created: items.created || '',
            pathname: items.pathname || '',
            apigroup: items.apigroup || '',
            cluster: items.cluster || '',
            kind: items.kind || '',
            label: items.label || '',
            type: items.type || '',
            _hubClusterResource: items._hubClusterResource || '',
            _rbac: items._rbac || '',
            related: subscription.related || []
          }
        }
      }
    })
    const removeUndefined = x => x !== undefined
    const emptyArray = []
    const removedUndefinedSubscriptions = R.filter(
      removeUndefined,
      mappedSubscriptions
    )
    return emptyArray.concat.apply([], removedUndefinedSubscriptions)
  }
  return [
    {
      name: '',
      namespace: '',
      selfLink: '',
      _uid: '',
      created: '',
      pathname: '',
      apigroup: '',
      cluster: '',
      kind: '',
      label: '',
      type: '',
      _hubClusterResource: '',
      _rbac: '',
      related: []
    }
  ]
}
