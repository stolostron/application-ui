/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import {
    getAllDeployablesStatus, getNumClusters, getNumIncidents, getApplicationName, getApplicationNamespace,
    getSingleApplicationObject, getChannelsCountFromSubscriptions, getNumPlacementRules,
    getSubscriptionDataOnHub, getSubscriptionDataOnManagedClusters,
    getPodData, getPolicyViolationData, getIncidentData
} from './utils'


// getNumIncidents

// describe('getNumIncidents', () => {

//     it('abc', () => {
//         const num = getNumClusters(sampleApplicationData, sampleSubscriptionData)
//         console.log("numClusters", num)
//         expect(true).toEqual(true)

//     })

// })



//getApplicationName

// getApplicationNamespace

// getSingleApplicationObject

// getChannelsCountFromSubscriptions

// getNumPlacementRules

// getSubscriptionDataOnHub

// getSubscriptionDataOnManagedClusters

// getPodData

// getPolicyViolationData

// getIncidentData
describe('getIncidentData', () => {

    it('filled incident list', () => {
        const incidentData = getIncidentData(incidents)

        expect(incidentData.priority1).toEqual(3)
        expect(incidentData.priority2).toEqual(2)
    })

    it('empty incident list', () => {
        const incidentData = getIncidentData({ items: [] })

        expect(incidentData.priority1).toEqual(0)
        expect(incidentData.priority2).toEqual(0)
    }

    )
})

const incidents = {
    items: [
        { priority: 1 },
        { priority: 2 },
        { priority: 2 },
        { priority: 1 },
        { priority: 1 }
    ]
}


const sampleApplicationData = {
    "items": [
        {
            "name": "guestbook2-gbapp",
            "namespace": "guestbook2",
            "dashboard": "https://icp-console.apps.glad-polecat-icp-mst.fyre.ibm.com:443/grafana/dashboard/db/guestbook2-gbapp-dashboard-via-federated-prometheus?namespace=guestbook2",
            "selfLink": "/apis/app.k8s.io/v1beta1/namespaces/guestbook2/applications/guestbook2-gbapp",
            "_uid": "local-cluster/dc4f59c8-fa67-11e9-80a3-00163e01bcb4",
            "created": "2019-10-29T16:19:19Z",
            "apigroup": "app.k8s.io",
            "cluster": "local-cluster",
            "kind": "application",
            "label": "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=guestbook2",
            "_hubClusterResource": "true",
            "_rbac": "guestbook2_app.k8s.io_applications",
            "related": [
                {
                    "kind": "release",
                    "items": [
                        {
                            "name": "guestbook2",
                            "namespace": "guestbook2",
                            "cluster": "local-cluster",
                            "chartName": "gbapp",
                            "chartVersion": "0.1.0",
                            "status": "DEPLOYED",
                            "kind": "release",
                            "_rbac": "guestbook2_null_releases",
                            "_uid": "local-cluster/Release/guestbook2",
                            "_clusterNamespace": "local-cluster",
                            "revision": 1,
                            "updated": "2019-10-29T16:19:18Z"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                },
                {
                    "kind": "cluster",
                    "items": [
                        {
                            "apigroup": "clusterregistry.k8s.io",
                            "name": "local-cluster",
                            "namespace": "local-cluster",
                            "nodes": 4,
                            "consoleURL": "https://icp-console.apps.glad-polecat-icp-mst.fyre.ibm.com:443",
                            "created": "2019-10-16T17:53:15Z",
                            "cpu": 64,
                            "storage": "186Gi",
                            "status": "OK",
                            "selfLink": "/apis/clusterregistry.k8s.io/v1alpha1/namespaces/local-cluster/clusters/local-cluster",
                            "kubernetesVersion": "v1.11.0+d4cacc0.rhos",
                            "kind": "cluster",
                            "klusterletVersion": "3.2.1",
                            "memory": "128041Mi",
                            "_rbac": "local-cluster_clusterregistry.k8s.io_clusters",
                            "_uid": "d439f588-f03d-11e9-b6d7-0a580a810032"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                },
                {
                    "kind": "deployable",
                    "items": [
                        {
                            "apigroup": "app.ibm.com",
                            "name": "staging-gbchn-frontend",
                            "namespace": "staging",
                            "created": "2019-10-29T16:04:39Z",
                            "cluster": "local-cluster",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/staging/deployables/staging-gbchn-frontend",
                            "kind": "deployable",
                            "_rbac": "staging_app.ibm.com_deployables",
                            "_uid": "local-cluster/cffebce2-fa65-11e9-80a3-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "label": "app=gbchn; chart=gbchn-0.1.0; component=main; heritage=Tiller; package=guestbook; release=staging"
                        },
                        {
                            "apigroup": "app.ibm.com",
                            "name": "staging-gbchn-redismaster",
                            "namespace": "staging",
                            "created": "2019-10-29T16:04:39Z",
                            "cluster": "local-cluster",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/staging/deployables/staging-gbchn-redismaster",
                            "kind": "deployable",
                            "_rbac": "staging_app.ibm.com_deployables",
                            "_uid": "local-cluster/cffffc87-fa65-11e9-80a3-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "label": "app=gbchn; chart=gbchn-0.1.0; component=redismaster; heritage=Tiller; package=guestbook; release=staging"
                        },
                        {
                            "apigroup": "app.ibm.com",
                            "name": "staging-gbchn-redisslaveservice",
                            "namespace": "staging",
                            "created": "2019-10-29T16:04:40Z",
                            "cluster": "local-cluster",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/staging/deployables/staging-gbchn-redisslaveservice",
                            "kind": "deployable",
                            "_rbac": "staging_app.ibm.com_deployables",
                            "_uid": "local-cluster/d00607a0-fa65-11e9-80a3-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "label": "app=gbchn; chart=gbchn-0.1.0; component=main; heritage=Tiller; package=guestbook; release=staging"
                        },
                        {
                            "apigroup": "app.ibm.com",
                            "name": "staging-gbchn-service",
                            "namespace": "staging",
                            "created": "2019-10-29T16:04:39Z",
                            "cluster": "local-cluster",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/staging/deployables/staging-gbchn-service",
                            "kind": "deployable",
                            "_rbac": "staging_app.ibm.com_deployables",
                            "_uid": "local-cluster/cff92527-fa65-11e9-80a3-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "label": "app=gbchn; chart=gbchn-0.1.0; component=main; heritage=Tiller; package=guestbook; release=staging"
                        },
                        {
                            "apigroup": "app.ibm.com",
                            "name": "staging-gbchn-redisslave",
                            "namespace": "staging",
                            "created": "2019-10-29T16:04:40Z",
                            "cluster": "local-cluster",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/staging/deployables/staging-gbchn-redisslave",
                            "kind": "deployable",
                            "_rbac": "staging_app.ibm.com_deployables",
                            "_uid": "local-cluster/d005314f-fa65-11e9-80a3-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "label": "app=gbchn; chart=gbchn-0.1.0; component=main; heritage=Tiller; package=guestbook; release=staging"
                        },
                        {
                            "apigroup": "app.ibm.com",
                            "name": "staging-gbchn-redismasterservice",
                            "namespace": "staging",
                            "created": "2019-10-29T16:04:39Z",
                            "cluster": "local-cluster",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/staging/deployables/staging-gbchn-redismasterservice",
                            "kind": "deployable",
                            "_rbac": "staging_app.ibm.com_deployables",
                            "_uid": "local-cluster/d0029573-fa65-11e9-80a3-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "label": "app=gbchn; chart=gbchn-0.1.0; component=redismaster; heritage=Tiller; package=guestbook; release=staging"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                },
                {
                    "kind": "subscription",
                    "items": [
                        {
                            "name": "guestbook2-gbapp",
                            "namespace": "guestbook2",
                            "created": "2019-10-29T16:19:19Z",
                            "cluster": "local-cluster",
                            "channel": "staging/staging",
                            "status": "Propagated",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/guestbook2/subscriptions/guestbook2-gbapp",
                            "kind": "subscription",
                            "_rbac": "guestbook2_null_subscriptions",
                            "_uid": "local-cluster/dc5a3754-fa67-11e9-80a3-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "label": "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=guestbook2",
                            "packageFilterVersion": ">=1.x"
                        },
                        {
                            "name": "guestbook2-gbapp-redismaster",
                            "namespace": "guestbook2",
                            "created": "2019-10-29T16:19:19Z",
                            "cluster": "local-cluster",
                            "channel": "staging/staging",
                            "status": "Propagated",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/guestbook2/subscriptions/guestbook2-gbapp-redismaster",
                            "kind": "subscription",
                            "_rbac": "guestbook2_null_subscriptions",
                            "_uid": "local-cluster/dc5f35da-fa67-11e9-80a3-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "label": "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=guestbook2",
                            "packageFilterVersion": ">=1.x"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                }
            ],
            "deployments": [
                {
                    "name": "guestbook2",
                    "namespace": "guestbook2",
                    "cluster": "local-cluster",
                    "chartName": "gbapp",
                    "chartVersion": "0.1.0",
                    "status": "DEPLOYED",
                    "kind": "release",
                    "_rbac": "guestbook2_null_releases",
                    "_uid": "local-cluster/Release/guestbook2",
                    "_clusterNamespace": "local-cluster",
                    "revision": 1,
                    "updated": "2019-10-29T16:19:18Z"
                }
            ],
            "deployables": [
                {
                    "apigroup": "app.ibm.com",
                    "name": "staging-gbchn-frontend",
                    "namespace": "staging",
                    "created": "2019-10-29T16:04:39Z",
                    "cluster": "local-cluster",
                    "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/staging/deployables/staging-gbchn-frontend",
                    "kind": "deployable",
                    "_rbac": "staging_app.ibm.com_deployables",
                    "_uid": "local-cluster/cffebce2-fa65-11e9-80a3-00163e01bcb4",
                    "_clusterNamespace": "local-cluster",
                    "label": "app=gbchn; chart=gbchn-0.1.0; component=main; heritage=Tiller; package=guestbook; release=staging"
                },
                {
                    "apigroup": "app.ibm.com",
                    "name": "staging-gbchn-redismaster",
                    "namespace": "staging",
                    "created": "2019-10-29T16:04:39Z",
                    "cluster": "local-cluster",
                    "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/staging/deployables/staging-gbchn-redismaster",
                    "kind": "deployable",
                    "_rbac": "staging_app.ibm.com_deployables",
                    "_uid": "local-cluster/cffffc87-fa65-11e9-80a3-00163e01bcb4",
                    "_clusterNamespace": "local-cluster",
                    "_hubClusterResource": "true",
                    "label": "app=gbchn; chart=gbchn-0.1.0; component=redismaster; heritage=Tiller; package=guestbook; release=staging"
                },
                {
                    "apigroup": "app.ibm.com",
                    "name": "staging-gbchn-redisslaveservice",
                    "namespace": "staging",
                    "created": "2019-10-29T16:04:40Z",
                    "cluster": "local-cluster",
                    "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/staging/deployables/staging-gbchn-redisslaveservice",
                    "kind": "deployable",
                    "_rbac": "staging_app.ibm.com_deployables",
                    "_uid": "local-cluster/d00607a0-fa65-11e9-80a3-00163e01bcb4",
                    "_clusterNamespace": "local-cluster",
                    "label": "app=gbchn; chart=gbchn-0.1.0; component=main; heritage=Tiller; package=guestbook; release=staging"
                },
                {
                    "apigroup": "app.ibm.com",
                    "name": "staging-gbchn-service",
                    "namespace": "staging",
                    "created": "2019-10-29T16:04:39Z",
                    "cluster": "local-cluster",
                    "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/staging/deployables/staging-gbchn-service",
                    "kind": "deployable",
                    "_rbac": "staging_app.ibm.com_deployables",
                    "_uid": "local-cluster/cff92527-fa65-11e9-80a3-00163e01bcb4",
                    "_clusterNamespace": "local-cluster",
                    "_hubClusterResource": "true",
                    "label": "app=gbchn; chart=gbchn-0.1.0; component=main; heritage=Tiller; package=guestbook; release=staging"
                },
                {
                    "apigroup": "app.ibm.com",
                    "name": "staging-gbchn-redisslave",
                    "namespace": "staging",
                    "created": "2019-10-29T16:04:40Z",
                    "cluster": "local-cluster",
                    "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/staging/deployables/staging-gbchn-redisslave",
                    "kind": "deployable",
                    "_rbac": "staging_app.ibm.com_deployables",
                    "_uid": "local-cluster/d005314f-fa65-11e9-80a3-00163e01bcb4",
                    "_clusterNamespace": "local-cluster",
                    "label": "app=gbchn; chart=gbchn-0.1.0; component=main; heritage=Tiller; package=guestbook; release=staging"
                },
                {
                    "apigroup": "app.ibm.com",
                    "name": "staging-gbchn-redismasterservice",
                    "namespace": "staging",
                    "created": "2019-10-29T16:04:39Z",
                    "cluster": "local-cluster",
                    "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/staging/deployables/staging-gbchn-redismasterservice",
                    "kind": "deployable",
                    "_rbac": "staging_app.ibm.com_deployables",
                    "_uid": "local-cluster/d0029573-fa65-11e9-80a3-00163e01bcb4",
                    "_clusterNamespace": "local-cluster",
                    "_hubClusterResource": "true",
                    "label": "app=gbchn; chart=gbchn-0.1.0; component=redismaster; heritage=Tiller; package=guestbook; release=staging"
                }
            ],
            "placementRules": [],
            "subscriptions": [
                {
                    "name": "guestbook2-gbapp",
                    "namespace": "guestbook2",
                    "created": "2019-10-29T16:19:19Z",
                    "cluster": "local-cluster",
                    "channel": "staging/staging",
                    "status": "Propagated",
                    "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/guestbook2/subscriptions/guestbook2-gbapp",
                    "kind": "subscription",
                    "_rbac": "guestbook2_null_subscriptions",
                    "_uid": "local-cluster/dc5a3754-fa67-11e9-80a3-00163e01bcb4",
                    "_clusterNamespace": "local-cluster",
                    "label": "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=guestbook2",
                    "packageFilterVersion": ">=1.x"
                },
                {
                    "name": "guestbook2-gbapp-redismaster",
                    "namespace": "guestbook2",
                    "created": "2019-10-29T16:19:19Z",
                    "cluster": "local-cluster",
                    "channel": "staging/staging",
                    "status": "Propagated",
                    "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/guestbook2/subscriptions/guestbook2-gbapp-redismaster",
                    "kind": "subscription",
                    "_rbac": "guestbook2_null_subscriptions",
                    "_uid": "local-cluster/dc5f35da-fa67-11e9-80a3-00163e01bcb4",
                    "_clusterNamespace": "local-cluster",
                    "_hubClusterResource": "true",
                    "label": "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=guestbook2",
                    "packageFilterVersion": ">=1.x"
                }
            ],
            "remoteSubs": []
        }
    ],
    "itemsPerPage": 20,
    "page": 1,
    "search": "",
    "sortDirection": "asc",
    "status": "DONE",
    "putErrorMsg": "",
    "postErrorMsg": "",
    "pendingActions": []
}

const sampleSubscriptionData = {
    "items": [
        {
            "name": "cathy-gbapp-gbapp-guestbook",
            "namespace": "cathy-gbapp",
            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/cathy-gbapp/subscriptions/cathy-gbapp-gbapp-guestbook",
            "_uid": "local-cluster/64e59089-0a40-11ea-b150-00163e01bcb4",
            "created": "2019-11-18T20:17:07Z",
            "pathname": "",
            "apigroup": "",
            "cluster": "local-cluster",
            "kind": "subscription",
            "label": "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=cathy-gbapp",
            "type": "",
            "status": "Propagated",
            "_hubClusterResource": "true",
            "_rbac": "cathy-gbapp_null_subscriptions",
            "related": [
                {
                    "kind": "release",
                    "items": [
                        {
                            "cluster": "local-cluster",
                            "chartVersion": "0.1.0",
                            "chartName": "gbapp",
                            "kind": "release",
                            "status": "DEPLOYED",
                            "name": "cathy-gbapp",
                            "namespace": "cathy-gbapp",
                            "_rbac": "cathy-gbapp_null_releases",
                            "_uid": "local-cluster/Release/cathy-gbapp",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "revision": 1,
                            "updated": "2019-11-18T20:17:07Z"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                },
                {
                    "kind": "cluster",
                    "items": [
                        {
                            "created": "2019-10-30T12:58:54Z",
                            "cpu": 24,
                            "consoleURL": "https://9.30.44.139:8443",
                            "memory": "64247Mi",
                            "kubernetesVersion": "v1.13.5+icp",
                            "kind": "cluster",
                            "klusterletVersion": "3.2.1",
                            "storage": "107Gi",
                            "status": "OK",
                            "selfLink": "/apis/clusterregistry.k8s.io/v1alpha1/namespaces/datt1/clusters/datt1",
                            "name": "datt1",
                            "namespace": "datt1",
                            "nodes": 3,
                            "_rbac": "datt1_clusterregistry.k8s.io_clusters",
                            "_uid": "07156319-fb15-11e9-9e50-0a580a8100c2",
                            "apigroup": "clusterregistry.k8s.io"
                        },
                        {
                            "created": "2019-10-16T17:53:15Z",
                            "cpu": 64,
                            "consoleURL": "https://icp-console.apps.glad-polecat-icp-mst.fyre.ibm.com:443",
                            "memory": "128041Mi",
                            "kubernetesVersion": "v1.11.0+d4cacc0.rhos",
                            "kind": "cluster",
                            "klusterletVersion": "3.2.1",
                            "storage": "186Gi",
                            "status": "OK",
                            "selfLink": "/apis/clusterregistry.k8s.io/v1alpha1/namespaces/local-cluster/clusters/local-cluster",
                            "name": "local-cluster",
                            "namespace": "local-cluster",
                            "nodes": 4,
                            "_rbac": "local-cluster_clusterregistry.k8s.io_clusters",
                            "_uid": "d439f588-f03d-11e9-b6d7-0a580a810032",
                            "apigroup": "clusterregistry.k8s.io"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                },
                {
                    "kind": "subscription",
                    "items": [
                        {
                            "created": "2019-11-18T20:21:52Z",
                            "cluster": "datt1",
                            "channel": "cathy-gb-channel/gbchn",
                            "kind": "subscription",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/default/subscriptions/cathy-gbapp-gbapp-guestbook",
                            "name": "cathy-gbapp-gbapp-guestbook",
                            "namespace": "default",
                            "_rbac": "datt1_null_subscriptions",
                            "_uid": "datt1/0e8a4e8d-0a41-11ea-b6dd-00163e01b483",
                            "_clusterNamespace": "datt1",
                            "_hostingDeployable": "datt1/cathy-gbapp-gbapp-guestbook-deployable-9b827",
                            "_hostingSubscription": "cathy-gbapp/cathy-gbapp-gbapp-guestbook",
                            "label": "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; hosting-deployable-name=cathy-gbapp-gbapp-guestbook-deployable; release=cathy-gbapp"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                },
                {
                    "kind": "application",
                    "items": [
                        {
                            "created": "2019-11-18T20:17:07Z",
                            "cluster": "local-cluster",
                            "kind": "application",
                            "selfLink": "/apis/app.k8s.io/v1beta1/namespaces/cathy-gbapp/applications/cathy-gbapp-gbapp",
                            "name": "cathy-gbapp-gbapp",
                            "namespace": "cathy-gbapp",
                            "_rbac": "cathy-gbapp_app.k8s.io_applications",
                            "_uid": "local-cluster/64e10fea-0a40-11ea-b150-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "apigroup": "app.k8s.io",
                            "label": "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=cathy-gbapp",
                            "dashboard": "https://icp-console.apps.glad-polecat-icp-mst.fyre.ibm.com:443/grafana/dashboard/db/cathy-gbapp-gbapp-dashboard-via-federated-prometheus?namespace=cathy-gbapp"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                },
                {
                    "kind": "deployable",
                    "items": [
                        {
                            "created": "2019-11-18T20:14:33Z",
                            "cluster": "local-cluster",
                            "kind": "deployable",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/cathy-gb-channel/deployables/cathy-gb-channel-gbchn-service",
                            "name": "cathy-gb-channel-gbchn-service",
                            "namespace": "cathy-gb-channel",
                            "_rbac": "cathy-gb-channel_app.ibm.com_deployables",
                            "_uid": "local-cluster/08e4299f-0a40-11ea-b150-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "apigroup": "app.ibm.com",
                            "label": "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=cathy-gb-channel"
                        },
                        {
                            "created": "2019-11-18T20:14:33Z",
                            "cluster": "local-cluster",
                            "kind": "deployable",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/cathy-gb-channel/deployables/cathy-gb-channel-gbchn-redisslave",
                            "name": "cathy-gb-channel-gbchn-redisslave",
                            "namespace": "cathy-gb-channel",
                            "_rbac": "cathy-gb-channel_app.ibm.com_deployables",
                            "_uid": "local-cluster/08ebb77f-0a40-11ea-b150-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "apigroup": "app.ibm.com",
                            "label": "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=cathy-gb-channel"
                        },
                        {
                            "created": "2019-11-18T20:14:33Z",
                            "cluster": "local-cluster",
                            "kind": "deployable",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/cathy-gb-channel/deployables/cathy-gb-channel-gbchn-redismaster",
                            "name": "cathy-gb-channel-gbchn-redismaster",
                            "namespace": "cathy-gb-channel",
                            "_rbac": "cathy-gb-channel_app.ibm.com_deployables",
                            "_uid": "local-cluster/08e6348d-0a40-11ea-b150-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "apigroup": "app.ibm.com",
                            "label": "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=cathy-gb-channel"
                        },
                        {
                            "created": "2019-11-18T20:14:33Z",
                            "cluster": "local-cluster",
                            "kind": "deployable",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/cathy-gb-channel/deployables/cathy-gb-channel-gbchn-frontend",
                            "name": "cathy-gb-channel-gbchn-frontend",
                            "namespace": "cathy-gb-channel",
                            "_rbac": "cathy-gb-channel_app.ibm.com_deployables",
                            "_uid": "local-cluster/08e20bda-0a40-11ea-b150-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "apigroup": "app.ibm.com",
                            "label": "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=cathy-gb-channel"
                        },
                        {
                            "created": "2019-11-18T20:14:33Z",
                            "cluster": "local-cluster",
                            "kind": "deployable",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/cathy-gb-channel/deployables/cathy-gb-channel-gbchn-redismasterservice",
                            "name": "cathy-gb-channel-gbchn-redismasterservice",
                            "namespace": "cathy-gb-channel",
                            "_rbac": "cathy-gb-channel_app.ibm.com_deployables",
                            "_uid": "local-cluster/08e9421e-0a40-11ea-b150-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "apigroup": "app.ibm.com",
                            "label": "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=cathy-gb-channel"
                        },
                        {
                            "created": "2019-11-18T20:14:33Z",
                            "cluster": "local-cluster",
                            "kind": "deployable",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/cathy-gb-channel/deployables/cathy-gb-channel-gbchn-redisslaveservice",
                            "name": "cathy-gb-channel-gbchn-redisslaveservice",
                            "namespace": "cathy-gb-channel",
                            "_rbac": "cathy-gb-channel_app.ibm.com_deployables",
                            "_uid": "local-cluster/08ed259a-0a40-11ea-b150-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "apigroup": "app.ibm.com",
                            "label": "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=cathy-gb-channel"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                },
                {
                    "kind": "placementrule",
                    "items": [
                        {
                            "created": "2019-11-18T20:17:07Z",
                            "cluster": "local-cluster",
                            "kind": "placementrule",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/cathy-gbapp/placementrules/cathy-gbapp-gbapp",
                            "name": "cathy-gbapp-gbapp",
                            "namespace": "cathy-gbapp",
                            "_rbac": "cathy-gbapp_app.ibm.com_placementrules",
                            "_uid": "local-cluster/64e41c59-0a40-11ea-b150-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "apigroup": "app.ibm.com",
                            "label": "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=cathy-gbapp"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                }
            ]
        },
        {
            "name": "rbac-test-app-gbapp-guestbook",
            "namespace": "rbac-test",
            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/rbac-test/subscriptions/rbac-test-app-gbapp-guestbook",
            "_uid": "local-cluster/0273410d-0a56-11ea-b150-00163e01bcb4",
            "created": "2019-11-18T22:51:51Z",
            "pathname": "",
            "apigroup": "",
            "cluster": "local-cluster",
            "kind": "subscription",
            "label": "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=rbac-test-app",
            "type": "",
            "status": "Propagated",
            "_hubClusterResource": "true",
            "_rbac": "rbac-test_null_subscriptions",
            "related": [
                {
                    "kind": "release",
                    "items": [
                        {
                            "cluster": "local-cluster",
                            "chartVersion": "0.1.0",
                            "chartName": "gbapp",
                            "kind": "release",
                            "status": "DEPLOYED",
                            "name": "rbac-test-app",
                            "namespace": "rbac-test",
                            "_rbac": "rbac-test_null_releases",
                            "_uid": "local-cluster/Release/rbac-test-app",
                            "_hubClusterResource": "true",
                            "revision": 1,
                            "updated": "2019-11-18T22:51:51Z"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                },
                {
                    "kind": "cluster",
                    "items": [
                        {
                            "created": "2019-10-30T12:58:54Z",
                            "cpu": 24,
                            "consoleURL": "https://9.30.44.139:8443",
                            "memory": "64247Mi",
                            "kubernetesVersion": "v1.13.5+icp",
                            "kind": "cluster",
                            "klusterletVersion": "3.2.1",
                            "storage": "107Gi",
                            "status": "OK",
                            "selfLink": "/apis/clusterregistry.k8s.io/v1alpha1/namespaces/datt1/clusters/datt1",
                            "name": "datt1",
                            "namespace": "datt1",
                            "nodes": 3,
                            "_rbac": "datt1_clusterregistry.k8s.io_clusters",
                            "_uid": "07156319-fb15-11e9-9e50-0a580a8100c2",
                            "apigroup": "clusterregistry.k8s.io"
                        },
                        {
                            "created": "2019-10-16T17:53:15Z",
                            "cpu": 64,
                            "consoleURL": "https://icp-console.apps.glad-polecat-icp-mst.fyre.ibm.com:443",
                            "memory": "128041Mi",
                            "kubernetesVersion": "v1.11.0+d4cacc0.rhos",
                            "kind": "cluster",
                            "klusterletVersion": "3.2.1",
                            "storage": "186Gi",
                            "status": "OK",
                            "selfLink": "/apis/clusterregistry.k8s.io/v1alpha1/namespaces/local-cluster/clusters/local-cluster",
                            "name": "local-cluster",
                            "namespace": "local-cluster",
                            "nodes": 4,
                            "_rbac": "local-cluster_clusterregistry.k8s.io_clusters",
                            "_uid": "d439f588-f03d-11e9-b6d7-0a580a810032",
                            "apigroup": "clusterregistry.k8s.io"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                },
                {
                    "kind": "pod",
                    "items": [
                        {
                            "created": "2019-11-25T20:16:01Z",
                            "container": "redis",
                            "cluster": "datt1",
                            "kind": "pod",
                            "status": "Running",
                            "startedAt": "2019-11-25T20:16:02Z",
                            "selfLink": "/api/v1/namespaces/default/pods/rbac-test-channel-gbchn-redismaster-58784b5cf-vr9dj",
                            "name": "rbac-test-channel-gbchn-redismaster-58784b5cf-vr9dj",
                            "namespace": "default",
                            "_rbac": "datt1_null_pods",
                            "_uid": "datt1/66b994a6-0fc0-11ea-b6dd-00163e01b483",
                            "_clusterNamespace": "datt1",
                            "hostIP": "172.16.218.130",
                            "label": "app=gbchn; pod-template-hash=58784b5cf; release=rbac-test-channel; role=master; tier=backend",
                            "restarts": 0,
                            "podIP": "10.1.12.129",
                            "image": "gcr.io/kubernetes-e2e-test-images/redis:1.0"
                        },
                        {
                            "created": "2019-11-25T20:16:02Z",
                            "container": "gbchn",
                            "cluster": "datt1",
                            "kind": "pod",
                            "status": "Running",
                            "startedAt": "2019-11-25T20:16:02Z",
                            "selfLink": "/api/v1/namespaces/default/pods/rbac-test-channel-gbchn-redisslave-6c98bc5856-bc7z7",
                            "name": "rbac-test-channel-gbchn-redisslave-6c98bc5856-bc7z7",
                            "namespace": "default",
                            "_rbac": "datt1_null_pods",
                            "_uid": "datt1/66ed43e8-0fc0-11ea-b6dd-00163e01b483",
                            "_clusterNamespace": "datt1",
                            "hostIP": "172.16.218.130",
                            "label": "app=gbchn; pod-template-hash=6c98bc5856; release=rbac-test-channel; role=slave; tier=backend",
                            "restarts": 0,
                            "podIP": "10.1.12.147",
                            "image": "gcr.io/google_samples/gb-redisslave:v3"
                        },
                        {
                            "created": "2019-11-25T20:16:02Z",
                            "container": "frontend",
                            "cluster": "datt1",
                            "kind": "pod",
                            "status": "Running",
                            "startedAt": "2019-11-25T20:16:02Z",
                            "selfLink": "/api/v1/namespaces/default/pods/rbac-test-channel-gbchn-frontend-65c456b59f-xcf8n",
                            "name": "rbac-test-channel-gbchn-frontend-65c456b59f-xcf8n",
                            "namespace": "default",
                            "_rbac": "datt1_null_pods",
                            "_uid": "datt1/6733a880-0fc0-11ea-b6dd-00163e01b483",
                            "_clusterNamespace": "datt1",
                            "hostIP": "172.16.212.96",
                            "label": "app=gbchn; pod-template-hash=65c456b59f; release=rbac-test-channel; tier=frontend",
                            "restarts": 0,
                            "podIP": "10.1.188.11",
                            "image": "gcr.io/google-samples/gb-frontend:v6"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                },
                {
                    "kind": "secret",
                    "items": [
                        {
                            "created": "2019-09-06T20:04:24Z",
                            "cluster": "datt1",
                            "kind": "secret",
                            "selfLink": "/api/v1/namespaces/default/secrets/default-token-hrwhb",
                            "name": "default-token-hrwhb",
                            "namespace": "default",
                            "_rbac": "datt1_null_secrets",
                            "_uid": "datt1/85b20f59-d0e1-11e9-b5ae-00163e01b483",
                            "_clusterNamespace": "datt1"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                },
                {
                    "kind": "deployment",
                    "items": [
                        {
                            "created": "2019-11-25T20:16:01Z",
                            "cluster": "datt1",
                            "current": 1,
                            "kind": "deployment",
                            "selfLink": "/apis/apps/v1/namespaces/default/deployments/rbac-test-channel-gbchn-redismaster",
                            "name": "rbac-test-channel-gbchn-redismaster",
                            "namespace": "default",
                            "_rbac": "datt1_apps_deployments",
                            "_uid": "datt1/66a7b9c2-0fc0-11ea-b6dd-00163e01b483",
                            "_clusterNamespace": "datt1",
                            "_hostingDeployable": "rbac-test-chan/rbac-test-channel-gbchn-redismaster",
                            "_hostingSubscription": "default/rbac-test-app-gbapp-guestbook",
                            "apigroup": "apps",
                            "available": 1,
                            "label": "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=rbac-test-channel",
                            "ready": 1,
                            "desired": 1
                        },
                        {
                            "created": "2019-11-25T20:16:02Z",
                            "cluster": "datt1",
                            "current": 1,
                            "kind": "deployment",
                            "selfLink": "/apis/apps/v1/namespaces/default/deployments/rbac-test-channel-gbchn-redisslave",
                            "name": "rbac-test-channel-gbchn-redisslave",
                            "namespace": "default",
                            "_rbac": "datt1_apps_deployments",
                            "_uid": "datt1/66e01a6b-0fc0-11ea-b6dd-00163e01b483",
                            "_clusterNamespace": "datt1",
                            "_hostingDeployable": "rbac-test-chan/rbac-test-channel-gbchn-redisslave",
                            "_hostingSubscription": "default/rbac-test-app-gbapp-guestbook",
                            "apigroup": "apps",
                            "available": 1,
                            "label": "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=rbac-test-channel",
                            "ready": 1,
                            "desired": 1
                        },
                        {
                            "created": "2019-11-25T20:16:02Z",
                            "cluster": "datt1",
                            "current": 1,
                            "kind": "deployment",
                            "selfLink": "/apis/extensions/v1beta1/namespaces/default/deployments/rbac-test-channel-gbchn-frontend",
                            "name": "rbac-test-channel-gbchn-frontend",
                            "namespace": "default",
                            "_rbac": "datt1_apps_deployments",
                            "_uid": "datt1/67233758-0fc0-11ea-b6dd-00163e01b483",
                            "_clusterNamespace": "datt1",
                            "_hostingDeployable": "rbac-test-chan/rbac-test-channel-gbchn-frontend",
                            "_hostingSubscription": "default/rbac-test-app-gbapp-guestbook",
                            "apigroup": "apps",
                            "available": 1,
                            "label": "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=rbac-test-channel",
                            "ready": 1,
                            "desired": 1
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                },
                {
                    "kind": "replicaset",
                    "items": [
                        {
                            "created": "2019-11-25T20:16:02Z",
                            "cluster": "datt1",
                            "current": 1,
                            "kind": "replicaset",
                            "selfLink": "/apis/extensions/v1beta1/namespaces/default/replicasets/rbac-test-channel-gbchn-redisslave-6c98bc5856",
                            "name": "rbac-test-channel-gbchn-redisslave-6c98bc5856",
                            "namespace": "default",
                            "_rbac": "datt1_apps_replicasets",
                            "_uid": "datt1/66e1f58b-0fc0-11ea-b6dd-00163e01b483",
                            "_clusterNamespace": "datt1",
                            "_hostingDeployable": "rbac-test-chan/rbac-test-channel-gbchn-redisslave",
                            "_hostingSubscription": "default/rbac-test-app-gbapp-guestbook",
                            "apigroup": "apps",
                            "label": "app=gbchn; pod-template-hash=6c98bc5856; release=rbac-test-channel; role=slave; tier=backend",
                            "desired": 1
                        },
                        {
                            "created": "2019-11-25T20:16:02Z",
                            "cluster": "datt1",
                            "current": 1,
                            "kind": "replicaset",
                            "selfLink": "/apis/apps/v1/namespaces/default/replicasets/rbac-test-channel-gbchn-frontend-65c456b59f",
                            "name": "rbac-test-channel-gbchn-frontend-65c456b59f",
                            "namespace": "default",
                            "_rbac": "datt1_apps_replicasets",
                            "_uid": "datt1/67311335-0fc0-11ea-b6dd-00163e01b483",
                            "_clusterNamespace": "datt1",
                            "_hostingDeployable": "rbac-test-chan/rbac-test-channel-gbchn-frontend",
                            "_hostingSubscription": "default/rbac-test-app-gbapp-guestbook",
                            "apigroup": "apps",
                            "label": "app=gbchn; pod-template-hash=65c456b59f; release=rbac-test-channel; tier=frontend",
                            "desired": 1
                        },
                        {
                            "created": "2019-11-25T20:16:01Z",
                            "cluster": "datt1",
                            "current": 1,
                            "kind": "replicaset",
                            "selfLink": "/apis/extensions/v1beta1/namespaces/default/replicasets/rbac-test-channel-gbchn-redismaster-58784b5cf",
                            "name": "rbac-test-channel-gbchn-redismaster-58784b5cf",
                            "namespace": "default",
                            "_rbac": "datt1_apps_replicasets",
                            "_uid": "datt1/66b113b4-0fc0-11ea-b6dd-00163e01b483",
                            "_clusterNamespace": "datt1",
                            "_hostingDeployable": "rbac-test-chan/rbac-test-channel-gbchn-redismaster",
                            "_hostingSubscription": "default/rbac-test-app-gbapp-guestbook",
                            "apigroup": "apps",
                            "label": "app=gbchn; pod-template-hash=58784b5cf; release=rbac-test-channel; role=master; tier=backend",
                            "desired": 1
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                },
                {
                    "kind": "service",
                    "items": [
                        {
                            "created": "2019-11-25T20:16:04Z",
                            "cluster": "datt1",
                            "clusterIP": "10.0.204.40",
                            "kind": "service",
                            "selfLink": "/api/v1/namespaces/default/services/redis-slave",
                            "name": "redis-slave",
                            "namespace": "default",
                            "_rbac": "datt1_null_services",
                            "_uid": "datt1/68124ffc-0fc0-11ea-b6dd-00163e01b483",
                            "_clusterNamespace": "datt1",
                            "_hostingDeployable": "rbac-test-chan/rbac-test-channel-gbchn-redisslaveservice",
                            "_hostingSubscription": "default/rbac-test-app-gbapp-guestbook",
                            "label": "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=rbac-test-channel",
                            "port": "6379/TCP",
                            "type": "ClusterIP"
                        },
                        {
                            "created": "2019-11-25T20:16:04Z",
                            "cluster": "datt1",
                            "clusterIP": "10.0.42.171",
                            "kind": "service",
                            "selfLink": "/api/v1/namespaces/default/services/rbac-test-channel-gbchn",
                            "name": "rbac-test-channel-gbchn",
                            "namespace": "default",
                            "_rbac": "datt1_null_services",
                            "_uid": "datt1/68527ac3-0fc0-11ea-b6dd-00163e01b483",
                            "_clusterNamespace": "datt1",
                            "_hostingDeployable": "rbac-test-chan/rbac-test-channel-gbchn-service",
                            "_hostingSubscription": "default/rbac-test-app-gbapp-guestbook",
                            "label": "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=rbac-test-channel",
                            "port": "80:31816/TCP",
                            "type": "NodePort"
                        },
                        {
                            "created": "2019-11-25T20:16:03Z",
                            "cluster": "datt1",
                            "clusterIP": "10.0.112.42",
                            "kind": "service",
                            "selfLink": "/api/v1/namespaces/default/services/redis-master",
                            "name": "redis-master",
                            "namespace": "default",
                            "_rbac": "datt1_null_services",
                            "_uid": "datt1/67d6a676-0fc0-11ea-b6dd-00163e01b483",
                            "_clusterNamespace": "datt1",
                            "_hostingDeployable": "rbac-test-chan/rbac-test-channel-gbchn-redismasterservice",
                            "_hostingSubscription": "default/rbac-test-app-gbapp-guestbook",
                            "label": "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=rbac-test-channel",
                            "port": "6379/TCP",
                            "type": "ClusterIP"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                },
                {
                    "kind": "application",
                    "items": [
                        {
                            "created": "2019-11-18T22:51:51Z",
                            "cluster": "local-cluster",
                            "kind": "application",
                            "selfLink": "/apis/app.k8s.io/v1beta1/namespaces/rbac-test/applications/rbac-test-app-gbapp",
                            "name": "rbac-test-app-gbapp",
                            "namespace": "rbac-test",
                            "_rbac": "rbac-test_app.k8s.io_applications",
                            "_uid": "local-cluster/026f4490-0a56-11ea-b150-00163e01bcb4",
                            "_hubClusterResource": "true",
                            "apigroup": "app.k8s.io",
                            "label": "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=rbac-test-app",
                            "dashboard": "https://icp-console.apps.glad-polecat-icp-mst.fyre.ibm.com:443/grafana/dashboard/db/rbac-test-app-gbapp-dashboard-via-federated-prometheus?namespace=rbac-test"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                },
                {
                    "kind": "deployable",
                    "items": [
                        {
                            "created": "2019-11-18T22:46:42Z",
                            "cluster": "local-cluster",
                            "kind": "deployable",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/rbac-test-chan/deployables/rbac-test-channel-gbchn-frontend",
                            "name": "rbac-test-channel-gbchn-frontend",
                            "namespace": "rbac-test-chan",
                            "_rbac": "rbac-test-chan_app.ibm.com_deployables",
                            "_uid": "local-cluster/4a67ea12-0a55-11ea-b150-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "apigroup": "app.ibm.com",
                            "label": "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=rbac-test-channel"
                        },
                        {
                            "created": "2019-11-18T22:46:42Z",
                            "cluster": "local-cluster",
                            "kind": "deployable",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/rbac-test-chan/deployables/rbac-test-channel-gbchn-redismaster",
                            "name": "rbac-test-channel-gbchn-redismaster",
                            "namespace": "rbac-test-chan",
                            "_rbac": "rbac-test-chan_app.ibm.com_deployables",
                            "_uid": "local-cluster/4a6b40f5-0a55-11ea-b150-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "apigroup": "app.ibm.com",
                            "label": "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=rbac-test-channel"
                        },
                        {
                            "created": "2019-11-18T22:46:42Z",
                            "cluster": "local-cluster",
                            "kind": "deployable",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/rbac-test-chan/deployables/rbac-test-channel-gbchn-service",
                            "name": "rbac-test-channel-gbchn-service",
                            "namespace": "rbac-test-chan",
                            "_rbac": "rbac-test-chan_app.ibm.com_deployables",
                            "_uid": "local-cluster/4a69eef1-0a55-11ea-b150-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "apigroup": "app.ibm.com",
                            "label": "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=rbac-test-channel"
                        },
                        {
                            "created": "2019-11-18T22:46:42Z",
                            "cluster": "local-cluster",
                            "kind": "deployable",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/rbac-test-chan/deployables/rbac-test-channel-gbchn-redisslaveservice",
                            "name": "rbac-test-channel-gbchn-redisslaveservice",
                            "namespace": "rbac-test-chan",
                            "_rbac": "rbac-test-chan_app.ibm.com_deployables",
                            "_uid": "local-cluster/4a6fd94c-0a55-11ea-b150-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "apigroup": "app.ibm.com",
                            "label": "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=rbac-test-channel"
                        },
                        {
                            "created": "2019-11-18T22:46:42Z",
                            "cluster": "local-cluster",
                            "kind": "deployable",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/rbac-test-chan/deployables/rbac-test-channel-gbchn-redisslave",
                            "name": "rbac-test-channel-gbchn-redisslave",
                            "namespace": "rbac-test-chan",
                            "_rbac": "rbac-test-chan_app.ibm.com_deployables",
                            "_uid": "local-cluster/4a6eb9f3-0a55-11ea-b150-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "apigroup": "app.ibm.com",
                            "label": "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=rbac-test-channel"
                        },
                        {
                            "created": "2019-11-18T22:46:42Z",
                            "cluster": "local-cluster",
                            "kind": "deployable",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/rbac-test-chan/deployables/rbac-test-channel-gbchn-redismasterservice",
                            "name": "rbac-test-channel-gbchn-redismasterservice",
                            "namespace": "rbac-test-chan",
                            "_rbac": "rbac-test-chan_app.ibm.com_deployables",
                            "_uid": "local-cluster/4a6c5890-0a55-11ea-b150-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "apigroup": "app.ibm.com",
                            "label": "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=rbac-test-channel"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                },
                {
                    "kind": "placementrule",
                    "items": [
                        {
                            "created": "2019-11-18T22:51:51Z",
                            "cluster": "local-cluster",
                            "kind": "placementrule",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/rbac-test/placementrules/rbac-test-app-gbapp",
                            "name": "rbac-test-app-gbapp",
                            "namespace": "rbac-test",
                            "_rbac": "rbac-test_app.ibm.com_placementrules",
                            "_uid": "local-cluster/02723526-0a56-11ea-b150-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "apigroup": "app.ibm.com",
                            "label": "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=rbac-test-app"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                },
                {
                    "kind": "channel",
                    "items": [
                        {
                            "created": "2019-11-18T22:46:42Z",
                            "cluster": "local-cluster",
                            "kind": "channel",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/rbac-test-chan/channels/rbac-test-channel",
                            "name": "rbac-test-channel",
                            "namespace": "rbac-test-chan",
                            "_rbac": "rbac-test-chan_null_channels",
                            "_uid": "local-cluster/4a669906-0a55-11ea-b150-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "label": "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=rbac-test-channel",
                            "pathname": "rbac-test-chan",
                            "type": "Namespace"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                },
                {
                    "kind": "subscription",
                    "items": [
                        {
                            "created": "2019-11-18T22:51:56Z",
                            "cluster": "datt1",
                            "channel": "rbac-test-chan/rbac-test-channel",
                            "kind": "subscription",
                            "status": "Subscribed",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/default/subscriptions/rbac-test-app-gbapp-guestbook",
                            "name": "rbac-test-app-gbapp-guestbook",
                            "namespace": "default",
                            "_rbac": "datt1_null_subscriptions",
                            "_uid": "datt1/05c82a42-0a56-11ea-b6dd-00163e01b483",
                            "_clusterNamespace": "datt1",
                            "_hostingDeployable": "datt1/rbac-test-app-gbapp-guestbook-deployable-458n4",
                            "_hostingSubscription": "rbac-test/rbac-test-app-gbapp-guestbook",
                            "label": "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; hosting-deployable-name=rbac-test-app-gbapp-guestbook-deployable; release=rbac-test-app"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                }
            ]
        },
        {
            "name": "appmgmt-datt1",
            "namespace": "actual-app",
            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/actual-app/subscriptions/appmgmt-datt1",
            "_uid": "local-cluster/fbbc1f1e-fdce-11e9-b2a7-00163e01bcb4",
            "created": "2019-11-03T00:15:04Z",
            "pathname": "",
            "apigroup": "",
            "cluster": "local-cluster",
            "kind": "subscription",
            "label": "app=appmgmt",
            "type": "",
            "status": "Propagated",
            "_hubClusterResource": "true",
            "_rbac": "actual-app_null_subscriptions",
            "related": [
                {
                    "kind": "cluster",
                    "items": [
                        {
                            "created": "2019-10-30T12:58:54Z",
                            "cpu": 24,
                            "consoleURL": "https://9.30.44.139:8443",
                            "memory": "64247Mi",
                            "kubernetesVersion": "v1.13.5+icp",
                            "kind": "cluster",
                            "klusterletVersion": "3.2.1",
                            "storage": "107Gi",
                            "status": "OK",
                            "selfLink": "/apis/clusterregistry.k8s.io/v1alpha1/namespaces/datt1/clusters/datt1",
                            "name": "datt1",
                            "namespace": "datt1",
                            "nodes": 3,
                            "_rbac": "datt1_clusterregistry.k8s.io_clusters",
                            "_uid": "07156319-fb15-11e9-9e50-0a580a8100c2",
                            "apigroup": "clusterregistry.k8s.io"
                        },
                        {
                            "created": "2019-10-16T17:53:15Z",
                            "cpu": 64,
                            "consoleURL": "https://icp-console.apps.glad-polecat-icp-mst.fyre.ibm.com:443",
                            "memory": "128041Mi",
                            "kubernetesVersion": "v1.11.0+d4cacc0.rhos",
                            "kind": "cluster",
                            "klusterletVersion": "3.2.1",
                            "storage": "186Gi",
                            "status": "OK",
                            "selfLink": "/apis/clusterregistry.k8s.io/v1alpha1/namespaces/local-cluster/clusters/local-cluster",
                            "name": "local-cluster",
                            "namespace": "local-cluster",
                            "nodes": 4,
                            "_rbac": "local-cluster_clusterregistry.k8s.io_clusters",
                            "_uid": "d439f588-f03d-11e9-b6d7-0a580a810032",
                            "apigroup": "clusterregistry.k8s.io"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                },
                {
                    "kind": "subscription",
                    "items": [
                        {
                            "created": "2019-11-03T00:15:25Z",
                            "cluster": "datt1",
                            "channel": "actual-app-dev",
                            "kind": "subscription",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/actual-app/subscriptions/appmgmt-datt1",
                            "name": "appmgmt-datt1",
                            "namespace": "actual-app",
                            "_rbac": "datt1_null_subscriptions",
                            "_uid": "datt1/08973e05-fdcf-11e9-9307-00163e01b483",
                            "_clusterNamespace": "datt1",
                            "_hostingDeployable": "datt1/appmgmt-datt1-deployable-wr5lw",
                            "_hostingSubscription": "actual-app/appmgmt-datt1",
                            "label": "app=appmgmt; hosting-deployable-name=appmgmt-datt1-deployable"
                        },
                        {
                            "created": "2019-11-03T00:15:04Z",
                            "cluster": "local-cluster",
                            "channel": "actual-app-dev",
                            "kind": "subscription",
                            "status": "Propagated",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/actual-app/subscriptions/appmgmt-datt1",
                            "name": "appmgmt-datt1",
                            "namespace": "actual-app",
                            "_rbac": "actual-app_null_subscriptions",
                            "_uid": "local-cluster/fbbc1f1e-fdce-11e9-b2a7-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "label": "app=appmgmt"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                },
                {
                    "kind": "deployable",
                    "items": [
                        {
                            "created": "2019-11-03T18:30:55Z",
                            "cluster": "local-cluster",
                            "kind": "deployable",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/actual-app/deployables/appmgmt-server-qf6vp",
                            "name": "appmgmt-server-qf6vp",
                            "namespace": "actual-app",
                            "_rbac": "actual-app_app.ibm.com_deployables",
                            "_uid": "local-cluster/128ddab6-fe68-11e9-b2a7-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hostingDeployable": "actual-app-deployables/appmgmt-server",
                            "_hubClusterResource": "true",
                            "apigroup": "app.ibm.com"
                        },
                        {
                            "created": "2019-11-03T00:15:04Z",
                            "cluster": "local-cluster",
                            "kind": "deployable",
                            "status": "Propagated",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/actual-app/deployables/appmgmt-datt1-deployable",
                            "name": "appmgmt-datt1-deployable",
                            "namespace": "actual-app",
                            "_rbac": "actual-app_app.ibm.com_deployables",
                            "_uid": "local-cluster/fbfa65e2-fdce-11e9-b2a7-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "apigroup": "app.ibm.com"
                        },
                        {
                            "created": "2019-11-03T18:30:55Z",
                            "cluster": "local-cluster",
                            "kind": "deployable",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/actual-app/deployables/appmgmt-server-94dhd",
                            "name": "appmgmt-server-94dhd",
                            "namespace": "actual-app",
                            "_rbac": "actual-app_app.ibm.com_deployables",
                            "_uid": "local-cluster/1277f617-fe68-11e9-b2a7-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hostingDeployable": "actual-app-deployables/appmgmt-server",
                            "_hubClusterResource": "true",
                            "apigroup": "app.ibm.com"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                },
                {
                    "kind": "channel",
                    "items": [
                        {
                            "created": "2019-11-02T23:46:34Z",
                            "cluster": "local-cluster",
                            "kind": "channel",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/actual-app/channels/actual-app-dev",
                            "name": "actual-app-dev",
                            "namespace": "actual-app",
                            "_rbac": "actual-app_null_channels",
                            "_uid": "local-cluster/00aede42-fdcb-11e9-b2a7-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "label": "app=appmgmt",
                            "pathname": "actual-app",
                            "type": "Namespace"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                }
            ]
        },
        {
            "name": "guestbook2-gbapp-redismaster",
            "namespace": "guestbook2",
            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/guestbook2/subscriptions/guestbook2-gbapp-redismaster",
            "_uid": "local-cluster/dc5f35da-fa67-11e9-80a3-00163e01bcb4",
            "created": "2019-10-29T16:19:19Z",
            "pathname": "",
            "apigroup": "",
            "cluster": "local-cluster",
            "kind": "subscription",
            "label": "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=guestbook2",
            "type": "",
            "status": "Propagated",
            "_hubClusterResource": "true",
            "_rbac": "guestbook2_null_subscriptions",
            "related": [
                {
                    "kind": "release",
                    "items": [
                        {
                            "cluster": "local-cluster",
                            "chartVersion": "0.1.0",
                            "chartName": "gbapp",
                            "kind": "release",
                            "status": "DEPLOYED",
                            "name": "guestbook2",
                            "namespace": "guestbook2",
                            "_rbac": "guestbook2_null_releases",
                            "_uid": "local-cluster/Release/guestbook2",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "revision": 1,
                            "updated": "2019-10-29T16:19:18Z"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                },
                {
                    "kind": "cluster",
                    "items": [
                        {
                            "created": "2019-10-16T17:53:15Z",
                            "cpu": 64,
                            "consoleURL": "https://icp-console.apps.glad-polecat-icp-mst.fyre.ibm.com:443",
                            "memory": "128041Mi",
                            "kubernetesVersion": "v1.11.0+d4cacc0.rhos",
                            "kind": "cluster",
                            "klusterletVersion": "3.2.1",
                            "storage": "186Gi",
                            "status": "OK",
                            "selfLink": "/apis/clusterregistry.k8s.io/v1alpha1/namespaces/local-cluster/clusters/local-cluster",
                            "name": "local-cluster",
                            "namespace": "local-cluster",
                            "nodes": 4,
                            "_rbac": "local-cluster_clusterregistry.k8s.io_clusters",
                            "_uid": "d439f588-f03d-11e9-b6d7-0a580a810032",
                            "apigroup": "clusterregistry.k8s.io"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                },
                {
                    "kind": "application",
                    "items": [
                        {
                            "created": "2019-10-29T16:19:19Z",
                            "cluster": "local-cluster",
                            "kind": "application",
                            "selfLink": "/apis/app.k8s.io/v1beta1/namespaces/guestbook2/applications/guestbook2-gbapp",
                            "name": "guestbook2-gbapp",
                            "namespace": "guestbook2",
                            "_rbac": "guestbook2_app.k8s.io_applications",
                            "_uid": "local-cluster/dc4f59c8-fa67-11e9-80a3-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "apigroup": "app.k8s.io",
                            "label": "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=guestbook2",
                            "dashboard": "https://icp-console.apps.glad-polecat-icp-mst.fyre.ibm.com:443/grafana/dashboard/db/guestbook2-gbapp-dashboard-via-federated-prometheus?namespace=guestbook2"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                },
                {
                    "kind": "channel",
                    "items": [
                        {
                            "created": "2019-10-29T16:04:39Z",
                            "cluster": "local-cluster",
                            "kind": "channel",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/staging/channels/staging",
                            "name": "staging",
                            "namespace": "staging",
                            "_rbac": "staging_null_channels",
                            "_uid": "local-cluster/cff699ec-fa65-11e9-80a3-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "label": "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=staging",
                            "pathname": "staging",
                            "type": "Namespace"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                },
                {
                    "kind": "placementrule",
                    "items": [
                        {
                            "created": "2019-10-29T16:19:19Z",
                            "cluster": "local-cluster",
                            "kind": "placementrule",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/guestbook2/placementrules/guestbook2-gbapp-redismaster",
                            "name": "guestbook2-gbapp-redismaster",
                            "namespace": "guestbook2",
                            "_rbac": "guestbook2_app.ibm.com_placementrules",
                            "_uid": "local-cluster/dc57cd6f-fa67-11e9-80a3-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "apigroup": "app.ibm.com",
                            "label": "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=guestbook2"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                },
                {
                    "kind": "deployable",
                    "items": [
                        {
                            "created": "2019-10-29T16:04:39Z",
                            "cluster": "local-cluster",
                            "kind": "deployable",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/staging/deployables/staging-gbchn-redismaster",
                            "name": "staging-gbchn-redismaster",
                            "namespace": "staging",
                            "_rbac": "staging_app.ibm.com_deployables",
                            "_uid": "local-cluster/cffffc87-fa65-11e9-80a3-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "apigroup": "app.ibm.com",
                            "label": "app=gbchn; chart=gbchn-0.1.0; component=redismaster; heritage=Tiller; package=guestbook; release=staging"
                        },
                        {
                            "created": "2019-10-29T16:04:39Z",
                            "cluster": "local-cluster",
                            "kind": "deployable",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/staging/deployables/staging-gbchn-redismasterservice",
                            "name": "staging-gbchn-redismasterservice",
                            "namespace": "staging",
                            "_rbac": "staging_app.ibm.com_deployables",
                            "_uid": "local-cluster/d0029573-fa65-11e9-80a3-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "apigroup": "app.ibm.com",
                            "label": "app=gbchn; chart=gbchn-0.1.0; component=redismaster; heritage=Tiller; package=guestbook; release=staging"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                }
            ]
        },
        {
            "name": "guestbook2-gbapp",
            "namespace": "guestbook2",
            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/guestbook2/subscriptions/guestbook2-gbapp",
            "_uid": "local-cluster/dc5a3754-fa67-11e9-80a3-00163e01bcb4",
            "created": "2019-10-29T16:19:19Z",
            "pathname": "",
            "apigroup": "",
            "cluster": "local-cluster",
            "kind": "subscription",
            "label": "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=guestbook2",
            "type": "",
            "status": "Propagated",
            "_hubClusterResource": "true",
            "_rbac": "guestbook2_null_subscriptions",
            "related": [
                {
                    "kind": "release",
                    "items": [
                        {
                            "cluster": "local-cluster",
                            "chartVersion": "0.1.0",
                            "chartName": "gbapp",
                            "kind": "release",
                            "status": "DEPLOYED",
                            "name": "guestbook2",
                            "namespace": "guestbook2",
                            "_rbac": "guestbook2_null_releases",
                            "_uid": "local-cluster/Release/guestbook2",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "revision": 1,
                            "updated": "2019-10-29T16:19:18Z"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                },
                {
                    "kind": "cluster",
                    "items": [
                        {
                            "created": "2019-10-16T17:53:15Z",
                            "cpu": 64,
                            "consoleURL": "https://icp-console.apps.glad-polecat-icp-mst.fyre.ibm.com:443",
                            "memory": "128041Mi",
                            "kubernetesVersion": "v1.11.0+d4cacc0.rhos",
                            "kind": "cluster",
                            "klusterletVersion": "3.2.1",
                            "storage": "186Gi",
                            "status": "OK",
                            "selfLink": "/apis/clusterregistry.k8s.io/v1alpha1/namespaces/local-cluster/clusters/local-cluster",
                            "name": "local-cluster",
                            "namespace": "local-cluster",
                            "nodes": 4,
                            "_rbac": "local-cluster_clusterregistry.k8s.io_clusters",
                            "_uid": "d439f588-f03d-11e9-b6d7-0a580a810032",
                            "apigroup": "clusterregistry.k8s.io"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                },
                {
                    "kind": "application",
                    "items": [
                        {
                            "created": "2019-10-29T16:19:19Z",
                            "cluster": "local-cluster",
                            "kind": "application",
                            "selfLink": "/apis/app.k8s.io/v1beta1/namespaces/guestbook2/applications/guestbook2-gbapp",
                            "name": "guestbook2-gbapp",
                            "namespace": "guestbook2",
                            "_rbac": "guestbook2_app.k8s.io_applications",
                            "_uid": "local-cluster/dc4f59c8-fa67-11e9-80a3-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "apigroup": "app.k8s.io",
                            "label": "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=guestbook2",
                            "dashboard": "https://icp-console.apps.glad-polecat-icp-mst.fyre.ibm.com:443/grafana/dashboard/db/guestbook2-gbapp-dashboard-via-federated-prometheus?namespace=guestbook2"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                },
                {
                    "kind": "placementrule",
                    "items": [
                        {
                            "created": "2019-10-29T16:19:19Z",
                            "cluster": "local-cluster",
                            "kind": "placementrule",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/guestbook2/placementrules/guestbook2-gbapp",
                            "name": "guestbook2-gbapp",
                            "namespace": "guestbook2",
                            "_rbac": "guestbook2_app.ibm.com_placementrules",
                            "_uid": "local-cluster/dc50b6e0-fa67-11e9-80a3-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "apigroup": "app.ibm.com",
                            "label": "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=guestbook2"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                },
                {
                    "kind": "deployable",
                    "items": [
                        {
                            "created": "2019-10-29T16:04:39Z",
                            "cluster": "local-cluster",
                            "kind": "deployable",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/staging/deployables/staging-gbchn-service",
                            "name": "staging-gbchn-service",
                            "namespace": "staging",
                            "_rbac": "staging_app.ibm.com_deployables",
                            "_uid": "local-cluster/cff92527-fa65-11e9-80a3-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "apigroup": "app.ibm.com",
                            "label": "app=gbchn; chart=gbchn-0.1.0; component=main; heritage=Tiller; package=guestbook; release=staging"
                        },
                        {
                            "created": "2019-10-29T16:04:39Z",
                            "cluster": "local-cluster",
                            "kind": "deployable",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/staging/deployables/staging-gbchn-frontend",
                            "name": "staging-gbchn-frontend",
                            "namespace": "staging",
                            "_rbac": "staging_app.ibm.com_deployables",
                            "_uid": "local-cluster/cffebce2-fa65-11e9-80a3-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "apigroup": "app.ibm.com",
                            "label": "app=gbchn; chart=gbchn-0.1.0; component=main; heritage=Tiller; package=guestbook; release=staging"
                        },
                        {
                            "created": "2019-10-29T16:04:40Z",
                            "cluster": "local-cluster",
                            "kind": "deployable",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/staging/deployables/staging-gbchn-redisslaveservice",
                            "name": "staging-gbchn-redisslaveservice",
                            "namespace": "staging",
                            "_rbac": "staging_app.ibm.com_deployables",
                            "_uid": "local-cluster/d00607a0-fa65-11e9-80a3-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "apigroup": "app.ibm.com",
                            "label": "app=gbchn; chart=gbchn-0.1.0; component=main; heritage=Tiller; package=guestbook; release=staging"
                        },
                        {
                            "created": "2019-10-29T16:04:40Z",
                            "cluster": "local-cluster",
                            "kind": "deployable",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/staging/deployables/staging-gbchn-redisslave",
                            "name": "staging-gbchn-redisslave",
                            "namespace": "staging",
                            "_rbac": "staging_app.ibm.com_deployables",
                            "_uid": "local-cluster/d005314f-fa65-11e9-80a3-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "apigroup": "app.ibm.com",
                            "label": "app=gbchn; chart=gbchn-0.1.0; component=main; heritage=Tiller; package=guestbook; release=staging"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                },
                {
                    "kind": "channel",
                    "items": [
                        {
                            "created": "2019-10-29T16:04:39Z",
                            "cluster": "local-cluster",
                            "kind": "channel",
                            "selfLink": "/apis/app.ibm.com/v1alpha1/namespaces/staging/channels/staging",
                            "name": "staging",
                            "namespace": "staging",
                            "_rbac": "staging_null_channels",
                            "_uid": "local-cluster/cff699ec-fa65-11e9-80a3-00163e01bcb4",
                            "_clusterNamespace": "local-cluster",
                            "_hubClusterResource": "true",
                            "label": "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=staging",
                            "pathname": "staging",
                            "type": "Namespace"
                        }
                    ],
                    "__typename": "SearchRelatedResult"
                }
            ]
        }
    ],
    "itemsPerPage": 20,
    "page": 1,
    "search": "",
    "sortDirection": "asc",
    "status": "DONE",
    "putErrorMsg": "",
    "postErrorMsg": "",
    "pendingActions": []
}
