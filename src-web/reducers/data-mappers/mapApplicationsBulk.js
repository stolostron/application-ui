/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

// @flow
export const mapBulkApplications = applications => {
  if (applications && applications.items && applications.related) {
    const mappedApplications = applications.map(application => {
      return {
        name: application.items.name || '',
        namespace: application.items.namespace || '',
        selfLink: application.items.selfLink || '',
        _uid: application.items.uid || '',
        created: application.items.created || '',
        apigroup: application.items.apigroup || '',
        cluster: application.items.cluster || '',
        kind: application.items.kind || '',
        label: application.items.label || '',
        _hubClusterResource: application.items._hubClusterResource || '',
        _rbac: application.items._rbac || '',
        related: application.related || []
      }
    })
    return mappedApplications || [{}]
  }
  return [
    {
      name: '',
      namespace: '',
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
