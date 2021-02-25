/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
import R from 'ramda'

const isDataShown = channel => {
  if (channel) {
    const splitChannel = channel.split('/')
    // revert when charts-v1 tag exists
    if (splitChannel.length === 2 && splitChannel[1] === 'charts-v1') {
      return false // don't show if it's charts-v1 channel
    }
  }
  return true
}

const emptyData = {
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

// @flow
export const mapBulkSubscriptions = subscriptions => {
  if (subscriptions) {
    const mappedSubscriptions = subscriptions.map(subscription => {
      if (subscription.items) {
        //filter out and return only hub subscriptions
        const isHubSubscr = item =>
          !item._hostingSubscription &&
          (!item.status || (item.status && item.status !== 'Subscribed'))
        const hubSubscriptions = R.filter(isHubSubscr, subscription.items)

        if (
          hubSubscriptions &&
          hubSubscriptions instanceof Array &&
          hubSubscriptions.length > 0
        ) {
          const items = hubSubscriptions[0]
          if (items.channel && isDataShown(items.channel)) {
            return {
              name: items.name || '',
              namespace: items.namespace || '',
              selfLink: items.selfLink || '',
              _uid: items._uid || '',
              created: items.created || '',
              pathname: items.pathname || '',
              apigroup: items.apigroup || '',
              cluster: items.cluster || '',
              channel: items.channel || '',
              kind: items.kind || '',
              label: items.label || '',
              type: items.type || '',
              status: items.status || '',
              _hubClusterResource: items._hubClusterResource || '',
              _rbac: items._rbac || '',
              related: subscription.related || []
            }
          }
        }
      }
      return null
    })
    const removeUndefined = x => x !== undefined && x !== null
    return R.filter(removeUndefined, mappedSubscriptions)
  }
  return [emptyData]
}
