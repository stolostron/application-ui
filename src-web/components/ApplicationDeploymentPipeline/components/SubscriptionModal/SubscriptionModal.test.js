/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

const React = require('react')
const renderer = require('react-test-renderer')
const SubscriptionModal = require('../SubscriptionModal').default

describe('subscriptionModal', () => {
  it('subscriptionModal with empty subscription list renders correctly.', () => {
    const tree = renderer.create(<SubscriptionModal />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('subscriptionModal with bulkSubscriptionList renders correctly.', () => {
    // pass subscription info

    const label = 'rbac-test-app-gbapp'
    const subscriptionModalSubscriptionInfo = {
      status: 'Propagated',
      selfLink:
        '/apis/app.ibm.com/v1alpha1/namespaces/rbac-test/subscriptions/rbac-test-app-gbapp-guestbook',
      name: 'rbac-test-app-gbapp-guestbook',
      namespace: 'rbac-test',
      kind: 'subscription',
      created: '2019-11-18T22:51:51Z',
      cluster: 'local-cluster',
      channel: 'rbac-test-chan/rbac-test-channel',
      _rbac: 'rbac-test_null_subscriptions',
      _uid: 'local-cluster/0273410d-0a56-11ea-b150-00163e01bcb4',
      _hubClusterResource: 'true',
      _clusterNamespace: 'local-cluster',
      label:
        'app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=rbac-test-app'
    }
    const bulkSubscriptionList = [
      {
        name: 'guestbook2-gbapp-redismaster',
        namespace: 'guestbook2',
        selfLink:
          '/apis/app.ibm.com/v1alpha1/namespaces/guestbook2/subscriptions/guestbook2-gbapp-redismaster',
        _uid: 'local-cluster/dc5f35da-fa67-11e9-80a3-00163e01bcb4',
        created: '2019-10-29T16:19:19Z',
        pathname: '',
        apigroup: '',
        cluster: 'local-cluster',
        kind: 'subscription',
        label:
          'app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=guestbook2',
        type: '',
        status: 'Propagated',
        _hubClusterResource: 'true',
        _rbac: 'guestbook2_null_subscriptions',
        related: [
          {
            kind: 'cluster',
            items: [
              {
                storage: '186Gi',
                status: 'OK',
                selfLink:
                  '/apis/clusterregistry.k8s.io/v1alpha1/namespaces/local-cluster/clusters/local-cluster',
                nodes: 4,
                name: 'local-cluster',
                namespace: 'local-cluster',
                memory: '128041Mi',
                kubernetesVersion: 'v1.11.0+d4cacc0.rhos',
                klusterletVersion: '3.2.1',
                kind: 'cluster',
                created: '2019-10-16T17:53:15Z',
                consoleURL:
                  'https://icp-console.apps.glad-polecat-icp-mst.fyre.ibm.com:443',
                cpu: 64,
                apigroup: 'clusterregistry.k8s.io',
                _rbac: 'local-cluster_clusterregistry.k8s.io_clusters',
                _uid: 'd439f588-f03d-11e9-b6d7-0a580a810032'
              }
            ],
            __typename: 'SearchRelatedResult'
          },
          {
            kind: 'application',
            items: [
              {
                selfLink:
                  '/apis/app.k8s.io/v1beta1/namespaces/guestbook2/applications/guestbook2-gbapp',
                name: 'guestbook2-gbapp',
                namespace: 'guestbook2',
                kind: 'application',
                created: '2019-10-29T16:19:19Z',
                cluster: 'local-cluster',
                apigroup: 'app.k8s.io',
                _rbac: 'guestbook2_app.k8s.io_applications',
                _uid: 'local-cluster/dc4f59c8-fa67-11e9-80a3-00163e01bcb4',
                _hubClusterResource: 'true',
                _clusterNamespace: 'local-cluster',
                label:
                  'app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=guestbook2',
                dashboard:
                  'https://icp-console.apps.glad-polecat-icp-mst.fyre.ibm.com:443/grafana/dashboard/db/guestbook2-gbapp-dashboard-via-federated-prometheus?namespace=guestbook2'
              }
            ],
            __typename: 'SearchRelatedResult'
          },
          {
            kind: 'deployable',
            items: [
              {
                selfLink:
                  '/apis/app.ibm.com/v1alpha1/namespaces/staging/deployables/staging-gbchn-redismasterservice',
                name: 'staging-gbchn-redismasterservice',
                namespace: 'staging',
                kind: 'deployable',
                created: '2019-10-29T16:04:39Z',
                cluster: 'local-cluster',
                apigroup: 'app.ibm.com',
                _rbac: 'staging_app.ibm.com_deployables',
                _uid: 'local-cluster/d0029573-fa65-11e9-80a3-00163e01bcb4',
                _hubClusterResource: 'true',
                _clusterNamespace: 'local-cluster',
                label:
                  'app=gbchn; chart=gbchn-0.1.0; component=redismaster; heritage=Tiller; package=guestbook; release=staging'
              },
              {
                selfLink:
                  '/apis/app.ibm.com/v1alpha1/namespaces/staging/deployables/staging-gbchn-redismaster',
                name: 'staging-gbchn-redismaster',
                namespace: 'staging',
                kind: 'deployable',
                created: '2019-10-29T16:04:39Z',
                cluster: 'local-cluster',
                apigroup: 'app.ibm.com',
                _rbac: 'staging_app.ibm.com_deployables',
                _uid: 'local-cluster/cffffc87-fa65-11e9-80a3-00163e01bcb4',
                _hubClusterResource: 'true',
                _clusterNamespace: 'local-cluster',
                label:
                  'app=gbchn; chart=gbchn-0.1.0; component=redismaster; heritage=Tiller; package=guestbook; release=staging'
              }
            ],
            __typename: 'SearchRelatedResult'
          },
          {
            kind: 'placementrule',
            items: [
              {
                selfLink:
                  '/apis/app.ibm.com/v1alpha1/namespaces/guestbook2/placementrules/guestbook2-gbapp-redismaster',
                name: 'guestbook2-gbapp-redismaster',
                namespace: 'guestbook2',
                kind: 'placementrule',
                created: '2019-10-29T16:19:19Z',
                cluster: 'local-cluster',
                apigroup: 'app.ibm.com',
                _rbac: 'guestbook2_app.ibm.com_placementrules',
                _uid: 'local-cluster/dc57cd6f-fa67-11e9-80a3-00163e01bcb4',
                _hubClusterResource: 'true',
                _clusterNamespace: 'local-cluster',
                label:
                  'app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=guestbook2'
              }
            ],
            __typename: 'SearchRelatedResult'
          },
          {
            kind: 'channel',
            items: [
              {
                selfLink:
                  '/apis/app.ibm.com/v1alpha1/namespaces/staging/channels/staging',
                name: 'staging',
                namespace: 'staging',
                kind: 'channel',
                created: '2019-10-29T16:04:39Z',
                cluster: 'local-cluster',
                _rbac: 'staging_null_channels',
                _uid: 'local-cluster/cff699ec-fa65-11e9-80a3-00163e01bcb4',
                _hubClusterResource: 'true',
                _clusterNamespace: 'local-cluster',
                label:
                  'app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=staging',
                type: 'Namespace',
                pathname: 'staging'
              }
            ],
            __typename: 'SearchRelatedResult'
          }
        ]
      }
    ]

    const tree = renderer
      .create(
        <SubscriptionModal
          label={label}
          subscriptionModalSubscriptionInfo={subscriptionModalSubscriptionInfo}
          open={true}
          bulkSubscriptionList={bulkSubscriptionList}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
