/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

// @flow
export const mapBulkDeployables = deployables => {
  if (deployables) {
    const mappedDeployables = deployables.map(deployable => {
      if (deployable.items) {
        const items = deployable.items[0]
        return {
          name: items.name || '',
          namespace: items.namespace || '',
          selfLink: items.selfLink || '',
          _uid: items.uid || '',
          created: items.created || '',
          apigroup: items.apigroup || '',
          cluster: items.cluster || '',
          kind: items.kind || '',
          label: items.label || '',
          _hubClusterResource: items._hubClusterResource || '',
          _rbac: items._rbac || '',
          related: deployable.related || []
        }
      }
    })
    return mappedDeployables || [{}]
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
