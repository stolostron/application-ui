/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

// @flow
export const mapSingleApplication = application => {
  if (application && application.items && application.related) {
    const items = application.items[0]
    let deploymentsList = []
    let deployablesList = []
    let placementRulesList = []
    let subscriptionsList = []
    const deployments = application.related.filter(
      elem =>
        ![
          'deployable',
          'channel',
          'cluster',
          'subscription',
          'placementbinding',
          'placementrule'
        ].includes(elem.kind)
    )
    const deployables = application.related.filter(
      elem => elem.kind === 'deployable'
    )
    const placementRules = application.related.filter(
      elem => elem.kind === 'placementrule'
    )
    const subscriptions = application.related.filter(
      elem => elem.kind === 'subscription'
    )
    deployments.map(elem => {
      if (elem.items instanceof Array) {
        deploymentsList = deploymentsList.concat(elem.items)
      }
    })
    deployables.map(elem => {
      if (elem.items instanceof Array) {
        deployablesList = deployablesList.concat(elem.items)
      }
    })
    placementRules.map(elem => {
      if (elem.items instanceof Array) {
        placementRulesList = placementRulesList.concat(elem.items)
      }
    })
    subscriptions.map(elem => {
      if (elem.items instanceof Array) {
        subscriptionsList = subscriptionsList.concat(elem.items)
      }
    })
    return [
      {
        name: items.name || '',
        namespace: items.namespace || '',
        dashboard: items.dashboard || '',
        selfLink: items.selfLink || '',
        _uid: items.uid || '',
        created: items.created || '',
        apigroup: items.apigroup || '',
        cluster: items.cluster || '',
        kind: items.kind || '',
        label: items.label || '',
        _hubClusterResource: items._hubClusterResource || '',
        _rbac: items._rbac || '',
        related: application.related || [],
        deployments: deploymentsList,
        deployables: deployablesList,
        placementRules: placementRulesList,
        subscriptions: subscriptionsList
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
