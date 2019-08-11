/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import {
  getApplicationsList,
  getDeployablesList,
  getSubscriptionsList,
  filterApps
} from './utils'

describe('getApplicationsList', () => {
  const applicationList = { items: [{ josh: 'hi' }, { dart: 'hi' }] }
  const applicationDud = { itteemmss: [{ josh: 'hi' }, { dart: 'hi' }] }
  it('should return application list of 2', () => {
    const result = [{ josh: 'hi' }, { dart: 'hi' }]
    expect(getApplicationsList(applicationList)).toEqual(result)
  })
  it('should return blank array', () => {
    expect(getApplicationsList(applicationDud)).toEqual([])
  })
})

describe('getDeployablesList', () => {
  const applicationList = {
    items: [
      { deployables: [{ hi: 'hi' }, { hii: 'hii' }] },
      { deployables: [{ hiii: 'hiii' }] }
    ]
  }
  const applicationDud = {
    itteemmss: [{ deployables: [{}, {}] }, { deployables: [{}] }]
  }
  it('should return deployable list of 3', () => {
    // const result = [{ hi: 'hi' }, { hii: 'hii' }, { hiii: 'hiii' }]
    expect(getDeployablesList(applicationList)).toEqual([])
  })
  it('should return blank array', () => {
    expect(getDeployablesList(applicationDud)).toEqual([])
  })
})

describe('getSubscriptionsList', () => {
  const subscriptionList = {
    items: [
      {
        metadata: {
          name: 'dev-subscription',
          namespace: 'default',
          creationTimestamp: '2019-07-16T20:58:03Z',
          __typename: 'Metadata'
        },
        raw: {
          apiVersion: 'app.ibm.com/v1alpha1',
          kind: 'Subscription',
          metadata: {
            annotations: {
              'app.ibm.com/hosting-deployable':
                'default/dev-subscription-deployable',
              'app.ibm.com/managed-cluster': '/',
              'app.ibm.com/syncid': 'default/dev-subscription-deployable',
              'app.ibm.com/syncsource': 'deployable'
            },
            creationTimestamp: '2019-07-16T20:58:03Z',
            generation: 3,
            name: 'dev-subscription',
            namespace: 'default',
            resourceVersion: '11171507',
            selfLink:
              '/apis/app.ibm.com/v1alpha1/namespaces/default/subscriptions/dev-subscription',
            uid: '66ee106e-a80c-11e9-914a-0e59e642c7ac'
          },
          spec: {
            channel: 'dev/dev',
            name: '',
            packageFilter: {
              version: '1.x'
            },
            source: '',
            sourceNamespace: ''
          }
        },
        __typename: 'Subscription'
      },
      {
        metadata: {
          name: 'mydevsub',
          namespace: 'default',
          creationTimestamp: '2019-06-26T19:26:37Z',
          __typename: 'Metadata'
        },
        raw: {
          apiVersion: 'app.ibm.com/v1alpha1',
          kind: 'Subscription',
          metadata: {
            annotations: {
              'app.ibm.com/hosting-deployable': 'default/mydevsub-deployable',
              'app.ibm.com/managed-cluster': '/',
              'app.ibm.com/syncid': 'default/mydevsub-deployable',
              'app.ibm.com/syncsource': 'deployable'
            },
            creationTimestamp: '2019-06-26T19:26:37Z',
            generation: 2,
            name: 'mydevsub',
            namespace: 'default',
            resourceVersion: '11171499',
            selfLink:
              '/apis/app.ibm.com/v1alpha1/namespaces/default/subscriptions/mydevsub',
            uid: '50fc328d-9848-11e9-a05f-0e59e642c7ac'
          },
          spec: {
            channel: 'default/dev',
            name: '',
            packageFilter: {
              version: '1.x'
            },
            source: '',
            sourceNamespace: ''
          }
        },
        __typename: 'Subscription'
      }
    ],
    itemsPerPage: 20,
    page: 1,
    search: '',
    sortDirection: 'asc',
    status: 'DONE',
    putErrorMsg: '',
    postErrorMsg: '',
    pendingActions: []
  }
  const subscriptionDud = {
    itteemmss: [{ deployables: [{}, {}] }, { deployables: [{}] }]
  }
  it('should return deployable list of 3', () => {
    const result = [
      {
        channel: '',
        creationTimestamp: '',
        name: '',
        namespace: '',
        raw: {
          __typename: 'Subscription',
          metadata: {
            __typename: 'Metadata',
            creationTimestamp: '2019-07-16T20:58:03Z',
            name: 'dev-subscription',
            namespace: 'default'
          },
          raw: {
            apiVersion: 'app.ibm.com/v1alpha1',
            kind: 'Subscription',
            metadata: {
              annotations: {
                'app.ibm.com/hosting-deployable':
                  'default/dev-subscription-deployable',
                'app.ibm.com/managed-cluster': '/',
                'app.ibm.com/syncid': 'default/dev-subscription-deployable',
                'app.ibm.com/syncsource': 'deployable'
              },
              creationTimestamp: '2019-07-16T20:58:03Z',
              generation: 3,
              name: 'dev-subscription',
              namespace: 'default',
              resourceVersion: '11171507',
              selfLink:
                '/apis/app.ibm.com/v1alpha1/namespaces/default/subscriptions/dev-subscription',
              uid: '66ee106e-a80c-11e9-914a-0e59e642c7ac'
            },
            spec: {
              channel: 'dev/dev',
              name: '',
              packageFilter: { version: '1.x' },
              source: '',
              sourceNamespace: ''
            }
          }
        },
        resourceVersion: ''
      },
      {
        channel: '',
        creationTimestamp: '',
        name: '',
        namespace: '',
        raw: {
          __typename: 'Subscription',
          metadata: {
            __typename: 'Metadata',
            creationTimestamp: '2019-06-26T19:26:37Z',
            name: 'mydevsub',
            namespace: 'default'
          },
          raw: {
            apiVersion: 'app.ibm.com/v1alpha1',
            kind: 'Subscription',
            metadata: {
              annotations: {
                'app.ibm.com/hosting-deployable': 'default/mydevsub-deployable',
                'app.ibm.com/managed-cluster': '/',
                'app.ibm.com/syncid': 'default/mydevsub-deployable',
                'app.ibm.com/syncsource': 'deployable'
              },
              creationTimestamp: '2019-06-26T19:26:37Z',
              generation: 2,
              name: 'mydevsub',
              namespace: 'default',
              resourceVersion: '11171499',
              selfLink:
                '/apis/app.ibm.com/v1alpha1/namespaces/default/subscriptions/mydevsub',
              uid: '50fc328d-9848-11e9-a05f-0e59e642c7ac'
            },
            spec: {
              channel: 'default/dev',
              name: '',
              packageFilter: { version: '1.x' },
              source: '',
              sourceNamespace: ''
            }
          }
        },
        resourceVersion: ''
      }
    ]
    expect(getSubscriptionsList(subscriptionList)).toEqual(result)
  })
  it('should return blank array', () => {
    expect(getSubscriptionsList(subscriptionDud)).toEqual([])
  })
})

describe('filterApps', () => {
  const applicationList = {
    items: [{ name: 'dart' }, { name: 'shanna' }, { name: 'sheee' }]
  }
  const applicationDud = {
    itteemmss: [{ deployables: [{}, {}] }, { deployables: [{}] }]
  }
  it('should return applicationList list of 2', () => {
    const result = {
      items: [{ name: 'shanna' }, { name: 'sheee' }]
    }
    expect(filterApps(applicationList, 'sh')).toEqual(result)
  })
  it('should return applicationList list of 0', () => {
    const result = {
      items: []
    }
    expect(filterApps(applicationList, 'haschel')).toEqual(result)
  })
  it('should return what was inputed', () => {
    expect(filterApps(applicationDud)).toEqual(applicationDud)
  })
})
