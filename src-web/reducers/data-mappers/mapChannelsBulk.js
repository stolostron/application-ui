/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

// @flow
export const mapBulkChannels = channels => {
  if (channels && channels.items && channels.related) {
    const mappedChannels = channels.map(channel => {
      return {
        name: channel.items.name || '',
        namespace: channel.items.namespace || '',
        selfLink: channel.items.selfLink || '',
        _uid: channel.items.uid || '',
        created: channel.items.created || '',
        pathname: channel.items.pathname || '',
        apigroup: channel.items.apigroup || '',
        cluster: channel.items.cluster || '',
        kind: channel.items.kind || '',
        label: channel.items.label || '',
        type: channel.items.type || '',
        _hubClusterResource: channel.items._hubClusterResource || '',
        _rbac: channel.items._rbac || '',
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
