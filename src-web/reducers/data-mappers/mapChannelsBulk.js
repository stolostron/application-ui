/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

// @flow
export const mapBulkChannels = channels => {
  if (channels) {
    const mappedChannels = channels.map(channel => {
      if (channel.items && channel.related) {
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
