/*******************************************************************************
 * Licensed Materials - Property of IBM
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
        //filter out and return only hub subscriptions
        const isHubSubscr = item =>
          !item._hostingSubscription &&
          (!item.status || (item.status && item.status != 'Subscribed'))
        const hubSubscriptions = R.filter(isHubSubscr, subscription.items)

        if (
          hubSubscriptions &&
          hubSubscriptions instanceof Array &&
          hubSubscriptions.length > 0
        ) {
          const items = hubSubscriptions[0]

          const data = {
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
            status: items.status || '',
            _hubClusterResource: items._hubClusterResource || '',
            _rbac: items._rbac || '',
            related: subscription.related || []
          }

          return data
        }
      }
    })
    const removeUndefined = x => x !== undefined
    const removedUndefinedSubscriptions = R.filter(
      removeUndefined,
      mappedSubscriptions
    )
    return removedUndefinedSubscriptions
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
