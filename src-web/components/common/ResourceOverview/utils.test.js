/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import {
  getChannelsList,
  getNumDeployables,
  getNumDeployments,
  getNumPendingDeployments,
  getNumInProgressDeployments,
  getNumFailedDeployments
} from './utils'

const data1 = {
  name: 'appdemo-gbapp',
  namespace: 'ibmcom',
  selfLink:
    '/apis/app.k8s.io/v1beta1/namespaces/ibmcom/applications/appdemo-gbapp',
  _uid: '',
  created: '2019-08-10T12:14:24Z',
  apigroup: 'app.k8s.io',
  cluster: 'local-cluster',
  kind: 'application',
  label: 'release=appdemo; app=gbapp; chart=gbapp-0.1.0; heritage=Tiller',
  _hubClusterResource: 'true',
  _rbac: 'ibmcom_app.k8s.io_applications',
  related: [
    {
      kind: 'release',
      count: 4,
      items: [
        {
          name: 'appdemo',
          status: 'DEPLOYED'
        },
        {
          name: 'appdemo2',
          status: 'PENDING'
        },
        {
          name: 'appdemo3',
          status: 'IN PROGRESS'
        },
        {
          name: 'appdemo4',
          status: 'FAILED'
        }
      ],
      __typename: 'SearchRelatedResult'
    },
    {
      kind: 'deployable',
      count: 2,
      items: [
        {
          name: 'appdemo'
        },
        {
          name: 'appdemo2'
        }
      ]
    },
    {
      kind: 'placementbinding',
      count: 1,
      items: [
        {
          name: 'appdemo'
        }
      ]
    },
    {
      kind: 'subscription',
      count: 1,
      items: [
        {
          name: 'appdemo'
        }
      ]
    }
  ]
}

const data2 = {
  name: 'appdemo-gbapp',
  namespace: 'ibmcom',
  selfLink:
    '/apis/app.k8s.io/v1beta1/namespaces/ibmcom/applications/appdemo-gbapp',
  _uid: '',
  created: '2019-08-10T12:14:24Z',
  apigroup: 'app.k8s.io',
  cluster: 'local-cluster',
  kind: 'application',
  label: 'release=appdemo; app=gbapp; chart=gbapp-0.1.0; heritage=Tiller',
  _hubClusterResource: 'true',
  _rbac: 'ibmcom_app.k8s.io_applications',
  related: []
}

describe('getChannelsList', () => {
  const channelList = {
    items: [
      {
        metadata: {
          name: 'name1',
          pending: 1,
          inprogress: 2,
          failed: 3
        }
      },
      {
        metadata: {
          name: 'name3',
          pending: 1,
          failed: 2
        }
      }
    ]
  }
  const channelDud = {
    itteemmss: [{ channel: [{}, {}] }, { deployables: [{}] }]
  }
  it('should return channel list to be displayed in cards on overview tab', () => {
    const result = [
      {
        counts: {
          failed: { total: 'N/A' },
          'in progress': { total: 'N/A' },
          pending: { total: 'N/A' }
        },
        name: ''
      },
      {
        counts: {
          failed: { total: 'N/A' },
          'in progress': { total: 'N/A' },
          pending: { total: 'N/A' }
        },
        name: ''
      }
    ]
    expect(getChannelsList(channelList)).toEqual(result)
  })
  it('should return blank array', () => {
    expect(getChannelsList(channelDud)).toEqual([])
  })
})

describe('getNumDeployables', () => {
  it('should return deployable count of 2', () => {
    const result = 2
    expect(getNumDeployables(data1)).toEqual(result)
  })
  it('should return 0 if related is empty', () => {
    expect(getNumDeployables(data2)).toEqual(0)
  })
})

describe('getNumDeployments', () => {
  it('should return deployment count of 4', () => {
    const result = 4
    expect(getNumDeployments(data1)).toEqual(result)
  })
  it('should return 0 if related is empty', () => {
    expect(getNumDeployments(data2)).toEqual(0)
  })
})

describe('getNumPendingDeployments', () => {
  it('should return pending deployment count of 1', () => {
    const result = 1
    expect(getNumPendingDeployments(data1)).toEqual(result)
  })
  it('should return 0 if related is empty', () => {
    expect(getNumPendingDeployments(data2)).toEqual(0)
  })
})

describe('getNumInProgressDeployments', () => {
  it('should return in progress deployment count of 1', () => {
    const result = 1
    expect(getNumInProgressDeployments(data1)).toEqual(result)
  })
  it('should return 0 if related is empty', () => {
    expect(getNumInProgressDeployments(data2)).toEqual(0)
  })
})

describe('getNumFailedDeployments', () => {
  it('should return failed deployment count of 1', () => {
    const result = 1
    expect(getNumFailedDeployments(data1)).toEqual(result)
  })
  it('should return 0 if related is empty', () => {
    expect(getNumFailedDeployments(data2)).toEqual(0)
  })
})
