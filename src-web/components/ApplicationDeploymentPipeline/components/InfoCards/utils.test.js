/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import {
  getNumIncidents,
  getSingleApplicationObject,
  getNumPlacementRules,
  getSubscriptionDataOnHub,
  getSubscriptionDataOnManagedClustersSingle,
  getSubscriptionDataOnManagedClustersRoot,
  getPodData,
  getIncidentsData
} from './utils'

describe('getNumIncidents', () => {
  it('has application object', () => {
    const num = getNumIncidents(placementRuleSampleData)
    expect(num).toEqual(1)
  })
  it('empty list', () => {
    const num = getNumIncidents(emptyData)
    expect(num).toEqual(0) // empty string returned
  })
})

// getSingleApplicationObject
describe('getSingleApplicationObject', () => {
  it('has application object', () => {
    const firstAppObject = getSingleApplicationObject(placementRuleSampleData)
    // check if it equals the first one in the list
    expect(firstAppObject.name).toEqual('app1')
    expect(firstAppObject.namespace).toEqual('default')
  })
  it('empty list', () => {
    const firstAppObject = getSingleApplicationObject(emptyData)
    expect(firstAppObject).toHaveLength(0) // empty string returned
  })
})

// getNumPlacementRules
describe('getNumPlacementRules', () => {
  it('has subscription data', () => {
    const placementRuleCount = getNumPlacementRules(
      placementRuleSampleData,
      true,
      'default'
    )

    expect(placementRuleCount).toEqual(6)
  })

  it('has subscription data - non-single app view', () => {
    const placementRuleCount = getNumPlacementRules(
      placementRuleSampleData,
      false,
      'default'
    )

    expect(placementRuleCount).toEqual(6)
  })

  it('no subscription data', () => {
    const placementRuleCount = getNumPlacementRules(emptyData, true, 'default')

    expect(placementRuleCount).toEqual(0)
  })
})

// getSubscriptionDataOnHub
describe('getSubscriptionDataOnHub', () => {
  it('has subscription data', () => {
    const subscriptionData = getSubscriptionDataOnHub(
      subscriptionPropagatedSampleData,
      true,
      'app1',
      'default'
    )

    expect(subscriptionData.total).toEqual(5)
    expect(subscriptionData.failed).toEqual(1)
    expect(subscriptionData.noStatus).toEqual(2)
    expect(subscriptionData.channels).toEqual(2)
  })

  it('has subscription data - non-single app view', () => {
    const subscriptionData = getSubscriptionDataOnHub(
      subscriptionPropagatedSampleData,
      false,
      'app1',
      'default'
    )

    expect(subscriptionData.total).toEqual(5)
    expect(subscriptionData.failed).toEqual(1)
    expect(subscriptionData.noStatus).toEqual(2)
    expect(subscriptionData.channels).toEqual(2)
  })

  it('no subscription data', () => {
    const subscriptionData = getSubscriptionDataOnHub(
      emptyData,
      true,
      'app1',
      'default'
    )

    expect(subscriptionData.total).toEqual(0)
    expect(subscriptionData.failed).toEqual(0)
    expect(subscriptionData.noStatus).toEqual(0)
    expect(subscriptionData.channels).toEqual(0)
  })
})

// getSubscriptionDataOnManagedClustersSingle
describe('getSubscriptionDataOnManagedClustersSingle', () => {
  it('has subscription data', () => {
    const subscriptionData = getSubscriptionDataOnManagedClustersSingle(
      subscriptionSubscribedSampleDataSingleApp,
      'app1',
      'default'
    )

    expect(subscriptionData.clusters).toEqual(2)
    expect(subscriptionData.total).toEqual(5)
    expect(subscriptionData.failed).toEqual(1)
    expect(subscriptionData.noStatus).toEqual(1)
  })

  it('has subscription data', () => {
    const subscriptionData = getSubscriptionDataOnManagedClustersSingle(
      subscriptionSubscribedSampleDataSingleApp,
      'app2',
      'default'
    )

    expect(subscriptionData.clusters).toEqual(3)
    expect(subscriptionData.total).toEqual(5)
    expect(subscriptionData.failed).toEqual(0)
    expect(subscriptionData.noStatus).toEqual(0)
  })

  it('no subscription data', () => {
    const subscriptionData = getSubscriptionDataOnManagedClustersSingle(
      emptyData,
      'app1',
      'default'
    )

    expect(subscriptionData.clusters).toEqual(0)
    expect(subscriptionData.total).toEqual(0)
    expect(subscriptionData.failed).toEqual(0)
    expect(subscriptionData.noStatus).toEqual(0)
  })
})

// getSubscriptionDataOnManagedClustersRoot
describe('getSubscriptionDataOnManagedClustersRoot', () => {
  it('has subscription data', () => {
    const subscriptionData = getSubscriptionDataOnManagedClustersRoot(
      subscriptionSubscribedSampleDataRootApp
    )

    expect(subscriptionData.clusters).toEqual(2)
    expect(subscriptionData.total).toEqual(12)
    expect(subscriptionData.failed).toEqual(2)
    expect(subscriptionData.noStatus).toEqual(3)
  })

  it('no subscription data', () => {
    const subscriptionData = getSubscriptionDataOnManagedClustersRoot(
      emptyData
    )

    expect(subscriptionData.clusters).toEqual(0)
    expect(subscriptionData.total).toEqual(0)
    expect(subscriptionData.failed).toEqual(0)
    expect(subscriptionData.noStatus).toEqual(0)
  })
})

// getPodData
describe('getPodData', () => {
  it('has pod data', () => {
    const podData = getPodData(podSampleData, 'app1', 'default')

    expect(podData.total).toEqual(12)
    expect(podData.running).toEqual(4)
    expect(podData.failed).toEqual(5)
  })
  it('no pod data', () => {
    const podData = getPodData(emptyData, 'app1', 'default')

    expect(podData.total).toEqual(0)
    expect(podData.running).toEqual(0)
    expect(podData.failed).toEqual(0)
  })
})

// getIncidentsData
describe('getIncidentsData', () => {
  it('get incidents from list', () => {
    const incidentData = getIncidentsData(incidents)

    expect(incidentData.priority1).toEqual(3)
    expect(incidentData.priority2).toEqual(2)
  })

  it('empty incident list', () => {
    const incidentData = getIncidentsData(emptyData)

    expect(incidentData.priority1).toEqual(0)
    expect(incidentData.priority2).toEqual(0)
  })
})

const emptyData = {
  items: []
}

const appWithSubscriptionSampleData = {
  items: [
    {
      name: 'app1',
      namespace: 'default',
      related: [
        {
          kind: 'subscription',
          items: [
            { name: 'sub1', namespace: 'default' },
            { name: 'sub2', namespace: 'default' },
            { name: 'sub3', namespace: 'default' }
          ]
        },
        {
          kind: 'cluster',
          items: [
            { name: 'cls1', namespace: 'cls1-ns' },
            { name: 'local', namespace: 'local-ns' }
          ]
        }
      ]
    }
  ]
}

const placementRuleSampleData = {
  items: [
    {
      name: 'app1',
      namespace: 'default',
      related: [
        {
          kind: 'placementrule',
          items: [
            { name: 'pr1', namespace: 'default' },
            { name: 'pr2', namespace: 'default' },
            { name: 'pr3', namespace: 'default' },
            { name: 'pr4', namespace: 'default' },
            { name: 'pr5', namespace: 'default' },
            { name: 'pr6', namespace: 'default' }
          ]
        }
      ]
    }
  ]
}

const subscriptionPropagatedSampleData = {
  items: [
    {
      name: 'app1',
      namespace: 'default',
      hubSubscriptions: [
        {
          channel: 'fake-channel',
          status: 'Propagated',
          _uid: 'fake-uid-1'
        },
        {
          channel: 'fake-channel',
          status: 'Propagated',
          _uid: 'fake-uid-2'
        },
        {
          channel: 'fake-channel-2',
          status: 'unknown',
          _uid: 'fake-uid-3'
        },
        {
          channel: 'fake-channel-2',
          status: undefined,
          _uid: 'fake-uid-4'
        },
        {
          channel: 'fake-channel',
          status: null,
          _uid: 'fake-uid-5'
        }
      ]
    }
  ]
}

const subscriptionSubscribedSampleDataSingleApp = {
  items: [
    {
      clusterCount: 2,
      name: 'app1',
      namespace: 'default',
      remoteSubscriptionStatusCount:
      {
        Subscribed: 3,
        Failed: 1,
        null: 1,
      }
    },
    {
      clusterCount: 3,
      name: 'app2',
      namespace: 'default',
      remoteSubscriptionStatusCount:
      {
        Subscribed: 5
      }
    }
  ]
}

const subscriptionSubscribedSampleDataRootApp = {
  items:
  {
    clusterCount: 2,
    remoteSubscriptionStatusCount:
    {
      Subscribed: 7,
      Failed: 2,
      null: 3
    }
  }
}

// total: 12, running: 4, failed: 5
const podSampleData = {
  items: [
    {
      name: 'app1',
      namespace: 'default',
      podStatusCount:
      {
        Running: 2,
        Pass: 1,
        Deployed: 1,
        Failed: 2,
        Error: 2,
        ImagePullBackoff: 1,
        ContainerCreating: 1,
        Ready: 2
      }
    }
  ]
}

const incidents = {
  items: [
    { priority: 1 },
    { priority: 2 },
    { priority: 2 },
    { priority: 1 },
    { priority: 1 }
  ]
}
