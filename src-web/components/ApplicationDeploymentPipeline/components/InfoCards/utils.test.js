/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import {
  getNumClusters,
  getNumIncidents,
  getApplicationName,
  getApplicationNamespace,
  getSingleApplicationObject,
  getNumPlacementRules,
  getSubscriptionDataOnHub,
  getSubscriptionDataOnManagedClusters,
  getPodData,
  getIncidentData
} from './utils'

// getNumClusters
describe('getNumClusters', () => {
  it('has application object', () => {
    // pass in appsWithSubscription
    const num = getNumClusters(appWithSubscriptionSampleData)
    expect(num).toEqual(1)
  })
  it('empty list', () => {
    const num = getNumClusters(emptyData)
    expect(num).toEqual(0) // empty string returned
  })
})

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

// getApplicationName
describe('getApplicationName', () => {
  it('has application object', () => {
    const name = getApplicationName(placementRuleSampleData)
    expect(name).toEqual('app1')
  })
  it('empty list', () => {
    const name = getApplicationName(emptyData)
    expect(name).toHaveLength(0) // empty string returned
  })
})

// getApplicationNamespace
describe('getApplicationNamespace', () => {
  it('has application object', () => {
    const namespace = getApplicationNamespace(placementRuleSampleData)
    expect(namespace).toEqual('default')
  })
  it('empty list', () => {
    const namespace = getApplicationNamespace(emptyData)
    expect(namespace).toHaveLength(0) // empty string returned
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

// getSubscriptionDataOnManagedClusters
describe('getSubscriptionDataOnManagedClusters', () => {
  it('has subscription data', () => {
    const subscriptionData = getSubscriptionDataOnManagedClusters(
      subscriptionSubscribedSampleData,
      true,
      'app1',
      'default'
    )

    expect(subscriptionData.total).toEqual(4)
    expect(subscriptionData.failed).toEqual(1)
    expect(subscriptionData.noStatus).toEqual(2)
  })

  it('has subscription data - non-single app view', () => {
    const subscriptionData = getSubscriptionDataOnManagedClusters(
      subscriptionSubscribedSampleData,
      false,
      'app1',
      'default'
    )

    expect(subscriptionData.total).toEqual(4)
    expect(subscriptionData.failed).toEqual(1)
    expect(subscriptionData.noStatus).toEqual(2)
  })

  it('no subscription data', () => {
    const subscriptionData = getSubscriptionDataOnManagedClusters(
      emptyData,
      true,
      'app1',
      'default'
    )

    expect(subscriptionData.total).toEqual(0)
    expect(subscriptionData.failed).toEqual(0)
    expect(subscriptionData.noStatus).toEqual(0)
  })
})

// getPodData
describe('getPodData', () => {
  it('has pod data', () => {
    const podData = getPodData(podSampleData, 'app1', 'default')

    expect(podData.total).toEqual(9)
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

// getIncidentData
describe('getIncidentData', () => {
  it('get incidents from list', () => {
    const incidentData = getIncidentData(incidents)

    expect(incidentData.priority1).toEqual(3)
    expect(incidentData.priority2).toEqual(2)
  })

  it('empty incident list', () => {
    const incidentData = getIncidentData(emptyData)

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

const subscriptionSubscribedSampleData = {
  items: [
    {
      name: 'app1',
      namespace: 'default',
      remoteSubs: [
        {
          kind: 'subscription',
          name: 'sub1',
          namespace: 'default',
          status: ''
        },
        {
          kind: 'subscription',
          name: 'sub2',
          namespace: 'default',
          status: ''
        },
        {
          kind: 'subscription',
          name: 'sub3',
          namespace: 'default',
          status: 'subscribed'
        },
        {
          kind: 'subscription',
          name: 'sub3',
          namespace: 'default',
          status: '123'
        }
      ]
    }
  ]
}

// total: 9, running: 4, failed: 5
const podSampleData = {
  items: [
    {
      name: 'app1',
      namespace: 'default',
      related: [
        {
          kind: 'pod',
          items: [
            {
              status: 'deployed',
              name: 'p1',
              namespace: 'default'
            },
            {
              status: 'deployed',
              name: 'p2',
              namespace: 'default'
            },
            {
              status: 'pass',
              name: 'p3',
              namespace: 'default'
            },
            {
              status: 'running',
              name: 'p4',
              namespace: 'default'
            },
            {
              status: 'fail',
              name: 'p5',
              namespace: 'default'
            },
            {
              status: 'fail',
              name: 'p6',
              namespace: 'default'
            },
            {
              status: 'error',
              name: 'p7',
              namespace: 'default'
            },
            {
              status: 'CreateContainerConfigError',
              name: 'p8',
              namespace: 'default'
            },
            {
              status: 'imagepullbackoff',
              name: 'p9',
              namespace: 'default'
            }
          ]
        }
      ]
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
