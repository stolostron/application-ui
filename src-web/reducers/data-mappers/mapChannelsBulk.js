/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

// @flow
import R from 'ramda'

export const mapBulkChannels = channels => {
  if (channels) {
    const mappedChannels = channels
      .filter(channel => {
        if (channel.items && channel.related) {
          // look inside channel.related
          const related = channel.related

          if (R.length(related) > 0) {
            const relItems = related[0].items

            // condition for excluding channel
            const excludeChannel = item =>
              item.status &&
              item.status === 'Subscribed' &&
              item._hubClusterResource &&
              item._hubClusterResource === 'true'

            // check to see if there is at least one channel that has status Subscribed and _hubClusterResource true, if yes, exclude
            if (relItems.some(excludeChannel)) {
              return false
            }
          }

          return true
        }
        return false
      })
      .map(channel => {
        const items = channel.items[0]
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
          related: channel.related || []
        }
      })

    return mappedChannels || [{}]
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
