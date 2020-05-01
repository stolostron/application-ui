/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

// @flow
export const mapSingleApplication = application => {
  if (application && application.items && application.related) {
    const items = application.items[0]
    return [
      {
        name: items.name || '',
        namespace: items.namespace || '',
        dashboard: items.dashboard || '',
        selfLink: items.selfLink || '',
        _uid: items._uid || '',
        created: items.created || '',
        apigroup: items.apigroup || '',
        cluster: items.cluster || '',
        kind: items.kind || '',
        label: items.label || '',
        _hubClusterResource: items._hubClusterResource || '',
        _rbac: items._rbac || '',
        related: application.related || []
      }
    ]
  }
  return [
    {
      name: '',
      namespace: '',
      dashboard: '',
      selfLink: '',
      _uid: '',
      created: '',
      apigroup: '',
      cluster: '',
      kind: '',
      label: '',
      _hubClusterResource: '',
      _rbac: '',
      related: []
    }
  ]
}
