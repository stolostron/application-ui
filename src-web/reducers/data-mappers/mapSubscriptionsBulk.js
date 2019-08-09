/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

// @flow
export const mapBulkSubscriptions = subscriptions => {
  if (subscriptions && subscriptions.items && subscriptions.related) {
    const mappedSubscriptions = subscriptions.map(subscription => {
      return {
        name: subscription.items.name || '',
        namespace: subscription.items.namespace || '',
        selfLink: subscription.items.selfLink || '',
        _uid: subscription.items.uid || '',
        created: subscription.items.created || '',
        pathname: subscription.items.pathname || '',
        apigroup: subscription.items.apigroup || '',
        cluster: subscription.items.cluster || '',
        kind: subscription.items.kind || '',
        label: subscription.items.label || '',
        type: subscription.items.type || '',
        _hubClusterResource: subscription.items._hubClusterResource || '',
        _rbac: subscription.items._rbac || '',
        related: subscription.related || []
      }
    })
    return mappedSubscriptions || [{}]
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
