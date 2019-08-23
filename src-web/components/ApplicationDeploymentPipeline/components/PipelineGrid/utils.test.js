/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import {
  createApplicationRowsLookUp,
  findMatchingSubscription,
  getResourcesStatusPerChannel,
  getAllRelatedForList
} from './utils'

describe('createApplicationRowsLookUp', () => {
  const data = [
    {
      deployables: [{ josh: 'hi' }, { dart: 'hi' }],
      metadata: { name: 'josh', namespace: 'namespace1' }
    }
  ]
  const applicationDud = [{ itteemmss: [{ josh: 'hi' }, { dart: 'hi' }] }]
  it('should return a mapped object of application rows for reference', () => {
    const result = {
      default: { deployables: [], id: '', name: '', namespace: '' }
    }
    expect(createApplicationRowsLookUp(data)).toEqual(result)
  })
  it('should return default data for reference', () => {
    const result = {
      default: { id: '', name: '', namespace: '', deployables: [] }
    }
    expect(createApplicationRowsLookUp(applicationDud)).toEqual(result)
  })
  it('should handle undefined object for reference', () => {
    expect(createApplicationRowsLookUp(undefined)).toEqual({})
  })
})

describe('findMatchingSubscription', () => {
  const data = [
    {
      channel: 'dev',
      raw: 'raw1'
    },
    {
      channel: 'dev2',
      raw: 'raw2'
    },
    {
      channel: 'dev3',
      raw: 'raw3'
    }
  ]
  const applicationDud = [{ itteemmss: [{ josh: 'hi' }, { dart: 'hi' }] }]
  it('should return matching raw if found matching channel', () => {
    const result = 'raw3'
    expect(findMatchingSubscription(data, 'dev3')).toEqual(result)
  })
  it('should return matching raw if found matching channel', () => {
    const result = 'raw2'
    expect(findMatchingSubscription(data, 'dev2')).toEqual(result)
  })
  it('should return {} if not found matching channel', () => {
    expect(findMatchingSubscription(data, 'dev66')).toEqual({})
  })
  it('should return {} if incalid format passed in', () => {
    expect(findMatchingSubscription(applicationDud, 'dev66')).toEqual({})
  })
  it('should handle undefined object', () => {
    expect(findMatchingSubscription(undefined)).toEqual({})
  })
})

describe('getAllRelatedForList', () => {
  const clustersResult = [
    {
      apigroup: 'clusterregistry.k8s.io',
      created: '2019-08-14T15:49:33Z',
      consoleURL: 'https://9.30.230.96:8443',
      cpu: 40,
      selfLink:
        '/apis/clusterregistry.k8s.io/v1alpha1/namespaces/local-cluster/clusters/local-cluster',
      storage: '2296Gi',
      status: 'OK',
      kubernetesVersion: 'v1.13.5+icp-ee',
      kind: 'cluster',
      klusterletVersion: '3.2.0-10+94ee790ac3208b',
      memory: '96327Mi',
      name: 'local-cluster',
      namespace: 'local-cluster',
      nodes: 5,
      _rbac: 'local-cluster_clusterregistry.k8s.io_clusters',
      _uid: '1c7e2439-beab-11e9-bbb3-d659679b8eb9'
    }
  ]
  it('should return list of clusters, removing duplicates', () => {
    expect(
      getAllRelatedForList(
        { items: [realDataSampleWithSubscriptions] },
        'cluster',
        true
      )
    ).toEqual(clustersResult)
  })
  it('should return a blank list because of no subscription', () => {
    const result = []
    expect(
      getAllRelatedForList(
        { items: [realDataSampleWithNOSubscriptions] },
        'subscription'
      )
    ).toEqual(result)
  })
  it('should handle undefined object', () => {
    expect(getAllRelatedForList(undefined)).toEqual([])
  })
})

describe('getResourcesStatusPerChannel', () => {
  it('should return status array per channel', () => {
    const result = [1, 0, 0, 1, 2]
    expect(
      getResourcesStatusPerChannel(realDataSampleWithSubscriptions, 'PICKME')
    ).toEqual(result)
  })
  it('should handle undefined object', () => {
    expect(getResourcesStatusPerChannel(undefined)).toEqual([0, 0, 0, 0, 0])
  })
})

// Yes yes this is a huge chunk of data ... but hey nothing like real world data :)
const realDataSampleWithSubscriptions = {
  name: 'apptest-gbapp',
  namespace: 'project-workspace',
  dashboard: '',
  selfLink:
    '/apis/app.k8s.io/v1beta1/namespaces/project-workspace/applications/apptest-gbapp',
  _uid: '',
  created: '2019-08-11T02:55:06Z',
  apigroup: 'app.k8s.io',
  cluster: 'local-cluster',
  kind: 'application',
  label: 'app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=apptest',
  _hubClusterResource: 'true',
  _rbac: 'project-workspace_app.k8s.io_applications',
  related: [
    {
      kind: 'release',
      count: 1,
      items: [
        {
          cluster: 'local-cluster',
          chartName: 'gbapp',
          chartVersion: '0.1.0',
          status: 'DEPLOYED',
          kind: 'release',
          name: 'apptest',
          namespace: 'PICKME',
          _rbac: 'project-workspace_null_releases',
          _uid: 'local-cluster/Release/apptest',
          _hubClusterResource: 'true',
          revision: 1,
          updated: '2019-08-11T02:55:05Z'
        }
      ],
      __typename: 'SearchRelatedResult'
    },
    {
      kind: 'cluster',
      count: 1,
      items: [
        {
          apigroup: 'clusterregistry.k8s.io',
          created: '2019-08-14T15:49:33Z',
          consoleURL: 'https://9.30.230.96:8443',
          cpu: 40,
          selfLink:
            '/apis/clusterregistry.k8s.io/v1alpha1/namespaces/local-cluster/clusters/local-cluster',
          storage: '2296Gi',
          status: 'OK',
          kubernetesVersion: 'v1.13.5+icp-ee',
          kind: 'cluster',
          klusterletVersion: '3.2.0-10+94ee790ac3208b',
          memory: '96327Mi',
          name: 'local-cluster',
          namespace: 'local-cluster',
          nodes: 5,
          _rbac: 'local-cluster_clusterregistry.k8s.io_clusters',
          _uid: '1c7e2439-beab-11e9-bbb3-d659679b8eb9'
        }
      ],
      __typename: 'SearchRelatedResult'
    },
    {
      kind: 'deployable',
      count: 6,
      items: [
        {
          apigroup: 'app.ibm.com',
          created: '2019-08-06T20:50:55Z',
          cluster: 'local-cluster',
          selfLink:
            '/apis/app.ibm.com/v1alpha1/namespaces/chn-gb/deployables/gbchn-gbchn-redismasterservice',
          status: 'Deployed',
          kind: 'deployable',
          name: 'PICKME',
          namespace: 'chn-gb',
          _rbac: 'chn-gb_app.ibm.com_deployables',
          _uid: 'local-cluster/e2fd5a6a-b88b-11e9-82a0-00163e019f14',
          _hubClusterResource: 'true',
          label: 'app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=gbchn'
        }
      ],
      __typename: 'SearchRelatedResult'
    },
    {
      kind: 'pod',
      count: 6,
      items: [
        {
          created: '2019-08-14T00:27:14Z',
          container: 'gbchn',
          cluster: 'search-squad-remote',
          selfLink:
            '/api/v1/namespaces/default/pods/gbchn-gbchn-redisslave-6bfbf95955-mnph5',
          status: 'Pending',
          kind: 'pod',
          name: 'gbchn-gbchn-redisslave-6bfbf95955-mnph5',
          namespace: 'PICKME',
          _rbac: 'search-squad-remote_null_pods',
          _uid: 'search-squad-remote/439ba0d5-be2a-11e9-833e-eeeeeeeeeeee',
          _clusterNamespace: 'search-squad-remote',
          label:
            'tier=backend; app=gbchn; pod-template-hash=6bfbf95955; release=gbchn; role=slave',
          restarts: 0,
          image: 'gcr.io/google_samples/gb-redisslave:v3'
        },
        {
          created: '2019-08-14T00:27:14Z',
          container: 'redis',
          cluster: 'search-squad-remote',
          selfLink:
            '/api/v1/namespaces/default/pods/gbchn-gbchn-redismaster-6d78d7969b-kmpwm',
          status: 'Pending',
          kind: 'pod',
          name: 'gbchn-gbchn-redismaster-6d78d7969b-kmpwm',
          namespace: 'default',
          _rbac: 'search-squad-remote_null_pods',
          _uid: 'search-squad-remote/4383c417-be2a-11e9-833e-eeeeeeeeeeee',
          _clusterNamespace: 'search-squad-remote',
          label:
            'tier=backend; app=gbchn; pod-template-hash=6d78d7969b; release=gbchn; role=master',
          restarts: 0,
          image: 'gcr.io/kubernetes-e2e-test-images/redis:1.0'
        }
      ],
      __typename: 'SearchRelatedResult'
    },
    {
      kind: 'service',
      count: 6,
      items: [
        {
          created: '2019-08-14T00:27:13Z',
          cluster: 'search-squad-remote',
          clusterIP: '10.0.72.53',
          selfLink: '/api/v1/namespaces/default/services/gbchn-gbchn',
          kind: 'service',
          name: 'gbchn-gbchn',
          namespace: 'PICKME',
          _rbac: 'search-squad-remote_null_services',
          _uid: 'search-squad-remote/4319d66a-be2a-11e9-833e-eeeeeeeeeeee',
          _hostingSubscription: 'default/apptest-gbapp-guestbook',
          _hostingDeployable: 'chn-gb/gbchn-gbchn-service',
          _clusterNamespace: 'search-squad-remote',
          label: 'release=gbchn; app=gbchn; chart=gbchn-0.1.0; heritage=Tiller',
          port: '80:30603/TCP',
          type: 'NodePort'
        }
      ],
      __typename: 'SearchRelatedResult'
    },
    {
      kind: 'replicaset',
      count: 6,
      items: [
        {
          apigroup: 'apps',
          created: '2019-08-14T00:27:14Z',
          cluster: 'search-squad-remote',
          current: 1,
          selfLink:
            '/apis/apps/v1/namespaces/default/replicasets/gbchn-gbchn-redisslave-6bfbf95955',
          kind: 'replicaset',
          name: 'gbchn-gbchn-redisslave-6bfbf95955',
          namespace: 'default',
          _rbac: 'search-squad-remote_apps_replicasets',
          _uid: 'search-squad-remote/4399a7dd-be2a-11e9-833e-eeeeeeeeeeee',
          _hostingSubscription: 'default/apptest-gbapp-guestbook',
          _hostingDeployable: 'chn-gb/gbchn-gbchn-redisslave',
          _clusterNamespace: 'search-squad-remote',
          label:
            'pod-template-hash=6bfbf95955; release=gbchn; role=slave; tier=backend; app=gbchn',
          desired: 1
        }
      ],
      __typename: 'SearchRelatedResult'
    },
    {
      kind: 'deployment',
      count: 6,
      items: [
        {
          apigroup: 'apps',
          available: 0,
          created: '2019-08-14T00:27:14Z',
          cluster: 'search-squad-remote',
          current: 1,
          selfLink:
            '/apis/apps/v1/namespaces/default/deployments/gbchn-gbchn-redisslave',
          kind: 'deployment',
          name: 'gbchn-gbchn-redisslave',
          namespace: 'PICKME',
          _rbac: 'search-squad-remote_apps_deployments',
          _uid: 'search-squad-remote/43983ef0-be2a-11e9-833e-eeeeeeeeeeee',
          _hostingSubscription: 'default/apptest-gbapp-guestbook',
          _hostingDeployable: 'chn-gb/gbchn-gbchn-redisslave',
          _clusterNamespace: 'search-squad-remote',
          label: 'release=gbchn; app=gbchn; chart=gbchn-0.1.0; heritage=Tiller',
          desired: 1,
          ready: 0
        }
      ],
      __typename: 'SearchRelatedResult'
    },
    {
      kind: 'subscription',
      count: 2,
      items: [
        {
          created: '2019-08-11T03:20:42Z',
          cluster: 'local-cluster',
          channel: 'chn-gb/gbchn',
          selfLink:
            '/apis/app.ibm.com/v1alpha1/namespaces/default/subscriptions/apptest-gbapp-guestbook',
          kind: 'subscription',
          name: 'apptest-gbapp-guestbook',
          namespace: 'PICKME',
          _rbac: 'default_null_subscriptions',
          _uid: 'local-cluster/003b9d4c-bbe7-11e9-82a0-00163e019f14',
          _hubClusterResource: 'true',
          _hostingSubscription: 'project-workspace/apptest-gbapp-guestbook',
          _hostingDeployable:
            'local-cluster/apptest-gbapp-guestbook-deployable-6gh2v',
          label:
            'chart=gbapp-0.1.0; heritage=Tiller; hosting-deployable-name=apptest-gbapp-guestbook-deployable; release=apptest; app=gbapp'
        },
        {
          created: '2019-08-11T03:20:42Z',
          cluster: 'local-cluster',
          channel: 'chn-gb/gbchn2',
          selfLink:
            '/apis/app.ibm.com/v1alpha1/namespaces/default/subscriptions/apptest-gbapp-guestbook',
          kind: 'subscription',
          name: 'apptest-gbapp-guestbook',
          namespace: 'PICKME',
          _rbac: 'default_null_subscriptions',
          _uid: 'local-cluster/003b9d4c-bbe7-11e9-82a0-00163e019f14',
          _hubClusterResource: 'true',
          _hostingSubscription: 'project-workspace/apptest-gbapp-guestbook',
          _hostingDeployable:
            'local-cluster/apptest-gbapp-guestbook-deployable-6gh2v',
          label:
            'chart=gbapp-0.1.0; heritage=Tiller; hosting-deployable-name=apptest-gbapp-guestbook-deployable; release=apptest; app=gbapp'
        },
        {
          created: '2019-08-11T02:55:06Z',
          cluster: 'local-cluster',
          channel: 'chn-gb/gbchn',
          selfLink:
            '/apis/app.ibm.com/v1alpha1/namespaces/project-workspace/subscriptions/apptest-gbapp-guestbook',
          kind: 'subscription',
          name: 'apptest-gbapp-guestbook',
          namespace: 'project-workspace',
          _rbac: 'project-workspace_null_subscriptions',
          _uid: 'local-cluster/6c563052-bbe3-11e9-82a0-00163e019f14',
          _hubClusterResource: 'true',
          label:
            'chart=gbapp-0.1.0; heritage=Tiller; release=apptest; app=gbapp'
        }
      ],
      __typename: 'SearchRelatedResult'
    }
  ]
}

const realDataSampleWithNOSubscriptions = {
  name: 'apptest-gbapp',
  namespace: 'project-workspace',
  dashboard: '',
  selfLink:
    '/apis/app.k8s.io/v1beta1/namespaces/project-workspace/applications/apptest-gbapp',
  _uid: '',
  created: '2019-08-11T02:55:06Z',
  apigroup: 'app.k8s.io',
  cluster: 'local-cluster',
  kind: 'application',
  label: 'app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=apptest',
  _hubClusterResource: 'true',
  _rbac: 'project-workspace_app.k8s.io_applications',
  related: [
    {
      kind: 'release',
      count: 1,
      items: [
        {
          cluster: 'local-cluster',
          chartName: 'gbapp',
          chartVersion: '0.1.0',
          status: 'DEPLOYED',
          kind: 'release',
          name: 'apptest',
          namespace: 'project-workspace',
          _rbac: 'project-workspace_null_releases',
          _uid: 'local-cluster/Release/apptest',
          _hubClusterResource: 'true',
          revision: 1,
          updated: '2019-08-11T02:55:05Z'
        }
      ],
      __typename: 'SearchRelatedResult'
    },
    {
      kind: 'cluster',
      count: 1,
      items: [
        {
          apigroup: 'clusterregistry.k8s.io',
          created: '2019-08-14T15:49:33Z',
          consoleURL: 'https://9.30.230.96:8443',
          cpu: 40,
          selfLink:
            '/apis/clusterregistry.k8s.io/v1alpha1/namespaces/local-cluster/clusters/local-cluster',
          storage: '2296Gi',
          status: 'OK',
          kubernetesVersion: 'v1.13.5+icp-ee',
          kind: 'cluster',
          klusterletVersion: '3.2.0-10+94ee790ac3208b',
          memory: '96327Mi',
          name: 'local-cluster',
          namespace: 'local-cluster',
          nodes: 5,
          _rbac: 'local-cluster_clusterregistry.k8s.io_clusters',
          _uid: '1c7e2439-beab-11e9-bbb3-d659679b8eb9'
        }
      ],
      __typename: 'SearchRelatedResult'
    },
    {
      kind: 'deployable',
      count: 6,
      items: [
        {
          apigroup: 'app.ibm.com',
          created: '2019-08-06T20:50:55Z',
          cluster: 'local-cluster',
          selfLink:
            '/apis/app.ibm.com/v1alpha1/namespaces/chn-gb/deployables/gbchn-gbchn-redismasterservice',
          status: 'Deployed',
          kind: 'deployable',
          name: 'PICKME',
          namespace: 'chn-gb',
          _rbac: 'chn-gb_app.ibm.com_deployables',
          _uid: 'local-cluster/e2fd5a6a-b88b-11e9-82a0-00163e019f14',
          _hubClusterResource: 'true',
          label: 'app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=gbchn'
        }
      ],
      __typename: 'SearchRelatedResult'
    },
    {
      kind: 'pod',
      count: 6,
      items: [
        {
          created: '2019-08-14T00:27:14Z',
          container: 'gbchn',
          cluster: 'search-squad-remote',
          selfLink:
            '/api/v1/namespaces/default/pods/gbchn-gbchn-redisslave-6bfbf95955-mnph5',
          status: 'Pending',
          kind: 'pod',
          name: 'gbchn-gbchn-redisslave-6bfbf95955-mnph5',
          namespace: 'PICKME',
          _rbac: 'search-squad-remote_null_pods',
          _uid: 'search-squad-remote/439ba0d5-be2a-11e9-833e-eeeeeeeeeeee',
          _clusterNamespace: 'search-squad-remote',
          label:
            'tier=backend; app=gbchn; pod-template-hash=6bfbf95955; release=gbchn; role=slave',
          restarts: 0,
          image: 'gcr.io/google_samples/gb-redisslave:v3'
        },
        {
          created: '2019-08-14T00:27:14Z',
          container: 'redis',
          cluster: 'search-squad-remote',
          selfLink:
            '/api/v1/namespaces/default/pods/gbchn-gbchn-redismaster-6d78d7969b-kmpwm',
          status: 'Pending',
          kind: 'pod',
          name: 'gbchn-gbchn-redismaster-6d78d7969b-kmpwm',
          namespace: 'default',
          _rbac: 'search-squad-remote_null_pods',
          _uid: 'search-squad-remote/4383c417-be2a-11e9-833e-eeeeeeeeeeee',
          _clusterNamespace: 'search-squad-remote',
          label:
            'tier=backend; app=gbchn; pod-template-hash=6d78d7969b; release=gbchn; role=master',
          restarts: 0,
          image: 'gcr.io/kubernetes-e2e-test-images/redis:1.0'
        }
      ],
      __typename: 'SearchRelatedResult'
    },
    {
      kind: 'service',
      count: 6,
      items: [
        {
          created: '2019-08-14T00:27:13Z',
          cluster: 'search-squad-remote',
          clusterIP: '10.0.72.53',
          selfLink: '/api/v1/namespaces/default/services/gbchn-gbchn',
          kind: 'service',
          name: 'gbchn-gbchn',
          namespace: 'default',
          _rbac: 'search-squad-remote_null_services',
          _uid: 'search-squad-remote/4319d66a-be2a-11e9-833e-eeeeeeeeeeee',
          _hostingSubscription: 'default/apptest-gbapp-guestbook',
          _hostingDeployable: 'chn-gb/gbchn-gbchn-service',
          _clusterNamespace: 'search-squad-remote',
          label: 'release=gbchn; app=gbchn; chart=gbchn-0.1.0; heritage=Tiller',
          port: '80:30603/TCP',
          type: 'NodePort'
        }
      ],
      __typename: 'SearchRelatedResult'
    },
    {
      kind: 'replicaset',
      count: 6,
      items: [
        {
          apigroup: 'apps',
          created: '2019-08-14T00:27:14Z',
          cluster: 'search-squad-remote',
          current: 1,
          selfLink:
            '/apis/apps/v1/namespaces/default/replicasets/gbchn-gbchn-redisslave-6bfbf95955',
          kind: 'replicaset',
          name: 'gbchn-gbchn-redisslave-6bfbf95955',
          namespace: 'default',
          _rbac: 'search-squad-remote_apps_replicasets',
          _uid: 'search-squad-remote/4399a7dd-be2a-11e9-833e-eeeeeeeeeeee',
          _hostingSubscription: 'default/apptest-gbapp-guestbook',
          _hostingDeployable: 'chn-gb/gbchn-gbchn-redisslave',
          _clusterNamespace: 'search-squad-remote',
          label:
            'pod-template-hash=6bfbf95955; release=gbchn; role=slave; tier=backend; app=gbchn',
          desired: 1
        }
      ],
      __typename: 'SearchRelatedResult'
    },
    {
      kind: 'deployment',
      count: 6,
      items: [
        {
          apigroup: 'apps',
          available: 0,
          created: '2019-08-14T00:27:14Z',
          cluster: 'search-squad-remote',
          current: 1,
          selfLink:
            '/apis/apps/v1/namespaces/default/deployments/gbchn-gbchn-redisslave',
          kind: 'deployment',
          name: 'gbchn-gbchn-redisslave',
          namespace: 'default',
          _rbac: 'search-squad-remote_apps_deployments',
          _uid: 'search-squad-remote/43983ef0-be2a-11e9-833e-eeeeeeeeeeee',
          _hostingSubscription: 'default/apptest-gbapp-guestbook',
          _hostingDeployable: 'chn-gb/gbchn-gbchn-redisslave',
          _clusterNamespace: 'search-squad-remote',
          label: 'release=gbchn; app=gbchn; chart=gbchn-0.1.0; heritage=Tiller',
          desired: 1,
          ready: 0
        }
      ],
      __typename: 'SearchRelatedResult'
    }
  ]
}
