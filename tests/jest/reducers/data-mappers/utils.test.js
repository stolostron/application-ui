/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import {
  getRelatedItems,
  filterRemoteClusterSubscriptions
} from "../../../../src-web/reducers/data-mappers/utils";

const application = {
  count: 1,
  items: [
    {
      kind: "application",
      name: "apptest-gbapp",
      namespace: "project-workspace",
      selfLink:
        "/apis/app.k8s.io/v1beta1/namespaces/project-workspace/applications/apptest-gbapp",
      apigroup: "app.k8s.io",
      created: "2019-08-11T02:55:06Z",
      cluster: "local-cluster",
      _rbac: "project-workspace_app.k8s.io_applications",
      _uid: "local-cluster/6c54a629-bbe3-11e9-82a0-00163e019f14",
      _hubClusterResource: "true",
      label: "chart=gbapp-0.1.0; heritage=Tiller; release=apptest; app=gbapp"
    }
  ],
  related: [
    {
      kind: "release",
      count: 1,
      items: [
        {
          kind: "release",
          name: "apptest",
          namespace: "project-workspace",
          status: "DEPLOYED",
          cluster: "local-cluster",
          chartVersion: "0.1.0",
          chartName: "gbapp",
          _rbac: "project-workspace_null_releases",
          _uid: "local-cluster/Release/apptest",
          _hubClusterResource: "true",
          revision: 1,
          updated: "2019-08-11T02:55:05Z"
        }
      ],
      __typename: "SearchRelatedResult"
    },
    {
      kind: "cluster",
      count: 1,
      items: [
        {
          kind: "cluster",
          klusterletVersion: "3.2.0-10+94ee790ac3208b",
          kubernetesVersion: "v1.13.5+icp-ee",
          memory: "96327Mi",
          nodes: 5,
          name: "local-cluster",
          namespace: "local-cluster",
          storage: "2296Gi",
          status: "OK",
          selfLink:
            "/apis/clusterregistry.k8s.io/v1alpha1/namespaces/local-cluster/clusters/local-cluster",
          apigroup: "clusterregistry.k8s.io",
          created: "2019-08-12T19:17:46Z",
          cpu: 40,
          consoleURL: "https://9.30.230.96:8443",
          _rbac: "local-cluster_clusterregistry.k8s.io_clusters",
          _uid: "ddf4b95f-bd35-11e9-8061-4e341860d790"
        }
      ],
      __typename: "SearchRelatedResult"
    },
    {
      kind: "pod",
      count: 3,
      items: [
        {
          kind: "pod",
          name: "gbchn-gbchn-redisslave-6bfbf95955-jqhp4",
          namespace: "project-workspace",
          status: "CreateContainerConfigError",
          startedAt: "2019-08-11T05:28:18Z",
          selfLink:
            "/api/v1/namespaces/project-workspace/pods/gbchn-gbchn-redisslave-6bfbf95955-jqhp4",
          created: "2019-08-11T05:28:17Z",
          container: "gbchn",
          cluster: "local-cluster",
          _rbac: "project-workspace_null_pods",
          _uid: "local-cluster/d30a9e4f-bbf8-11e9-82a0-00163e019f14",
          _hubClusterResource: "true",
          label:
            "app=gbchn; pod-template-hash=6bfbf95955; release=gbchn; role=slave; tier=backend",
          podIP: "10.1.211.185",
          restarts: 0,
          image: "gcr.io/google_samples/gb-redisslave:v3",
          hostIP: "172.16.185.220"
        },
        {
          kind: "pod",
          name: "gbchn-gbchn-redismaster-6d78d7969b-7jv8r",
          namespace: "project-workspace",
          status: "CreateContainerConfigError",
          startedAt: "2019-08-11T05:28:17Z",
          selfLink:
            "/api/v1/namespaces/project-workspace/pods/gbchn-gbchn-redismaster-6d78d7969b-7jv8r",
          created: "2019-08-11T05:28:17Z",
          container: "redis",
          cluster: "local-cluster",
          _rbac: "project-workspace_null_pods",
          _uid: "local-cluster/d304d6aa-bbf8-11e9-82a0-00163e019f14",
          _hubClusterResource: "true",
          label:
            "app=gbchn; pod-template-hash=6d78d7969b; release=gbchn; role=master; tier=backend",
          podIP: "10.1.114.144",
          restarts: 0,
          image: "gcr.io/kubernetes-e2e-test-images/redis:1.0",
          hostIP: "172.16.180.82"
        },
        {
          kind: "pod",
          name: "gbchn-gbchn-frontend-75db88bdd6-kbmhk",
          namespace: "project-workspace",
          status: "CreateContainerConfigError",
          startedAt: "2019-08-11T05:28:17Z",
          selfLink:
            "/api/v1/namespaces/project-workspace/pods/gbchn-gbchn-frontend-75db88bdd6-kbmhk",
          created: "2019-08-11T05:28:17Z",
          container: "frontend",
          cluster: "local-cluster",
          _rbac: "project-workspace_null_pods",
          _uid: "local-cluster/d3050ac2-bbf8-11e9-82a0-00163e019f14",
          _hubClusterResource: "true",
          label:
            "tier=frontend; app=gbchn; pod-template-hash=75db88bdd6; release=gbchn",
          podIP: "10.1.94.49",
          restarts: 0,
          image: "gcr.io/google-samples/gb-frontend:v6",
          hostIP: "172.16.185.176"
        }
      ],
      __typename: "SearchRelatedResult"
    },
    {
      kind: "deployable",
      count: 1,
      items: [
        {
          kind: "deployable",
          name: "gbchn-gbchn-frontend",
          namespace: "chn-gb",
          status: "Deployed",
          selfLink:
            "/apis/app.ibm.com/v1alpha1/namespaces/chn-gb/deployables/gbchn-gbchn-frontend",
          apigroup: "app.ibm.com",
          created: "2019-08-06T20:50:55Z",
          cluster: "local-cluster",
          _rbac: "chn-gb_app.ibm.com_deployables",
          _uid: "local-cluster/e2f8c589-b88b-11e9-82a0-00163e019f14",
          _hubClusterResource: "true",
          label: "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=gbchn"
        }
      ],
      __typename: "SearchRelatedResult"
    },
    {
      kind: "replicaset",
      count: 3,
      items: [
        {
          kind: "replicaset",
          name: "gbchn-gbchn-redisslave-6bfbf95955",
          namespace: "project-workspace",
          selfLink:
            "/apis/extensions/v1beta1/namespaces/project-workspace/replicasets/gbchn-gbchn-redisslave-6bfbf95955",
          apigroup: "apps",
          created: "2019-08-11T05:28:17Z",
          cluster: "local-cluster",
          current: 1,
          _rbac: "project-workspace_apps_replicasets",
          _uid: "local-cluster/d3078069-bbf8-11e9-82a0-00163e019f14",
          _hubClusterResource: "true",
          _hostingSubscription: "project-workspace/apptest-gbapp-guestbook",
          _hostingDeployable: "chn-gb/gbchn-gbchn-redisslave",
          label:
            "app=gbchn; pod-template-hash=6bfbf95955; release=gbchn; role=slave; tier=backend",
          desired: 1
        },
        {
          kind: "replicaset",
          name: "gbchn-gbchn-redismaster-6d78d7969b",
          namespace: "project-workspace",
          selfLink:
            "/apis/extensions/v1beta1/namespaces/project-workspace/replicasets/gbchn-gbchn-redismaster-6d78d7969b",
          apigroup: "apps",
          created: "2019-08-11T05:28:17Z",
          cluster: "local-cluster",
          current: 1,
          _rbac: "project-workspace_apps_replicasets",
          _uid: "local-cluster/d2f408e0-bbf8-11e9-82a0-00163e019f14",
          _hubClusterResource: "true",
          _hostingSubscription: "project-workspace/apptest-gbapp-guestbook",
          _hostingDeployable: "chn-gb/gbchn-gbchn-redismaster",
          label:
            "release=gbchn; role=master; tier=backend; app=gbchn; pod-template-hash=6d78d7969b",
          desired: 1
        },
        {
          kind: "replicaset",
          name: "gbchn-gbchn-frontend-75db88bdd6",
          namespace: "project-workspace",
          selfLink:
            "/apis/extensions/v1beta1/namespaces/project-workspace/replicasets/gbchn-gbchn-frontend-75db88bdd6",
          apigroup: "apps",
          created: "2019-08-11T05:28:17Z",
          cluster: "local-cluster",
          current: 1,
          _rbac: "project-workspace_apps_replicasets",
          _uid: "local-cluster/d2efe8d6-bbf8-11e9-82a0-00163e019f14",
          _hubClusterResource: "true",
          _hostingSubscription: "project-workspace/apptest-gbapp-guestbook",
          _hostingDeployable: "chn-gb/gbchn-gbchn-frontend",
          label:
            "release=gbchn; tier=frontend; app=gbchn; pod-template-hash=75db88bdd6",
          desired: 1
        }
      ],
      __typename: "SearchRelatedResult"
    },
    {
      kind: "service",
      count: 3,
      items: [
        {
          kind: "service",
          name: "redis-slave",
          namespace: "project-workspace",
          selfLink: "/api/v1/namespaces/project-workspace/services/redis-slave",
          created: "2019-08-11T05:28:17Z",
          cluster: "local-cluster",
          clusterIP: "10.0.26.188",
          _rbac: "project-workspace_null_services",
          _uid: "local-cluster/d2bd19fc-bbf8-11e9-82a0-00163e019f14",
          _hubClusterResource: "true",
          _hostingSubscription: "project-workspace/apptest-gbapp-guestbook",
          _hostingDeployable: "chn-gb/gbchn-gbchn-redisslaveservice",
          label: "heritage=Tiller; release=gbchn; app=gbchn; chart=gbchn-0.1.0",
          port: "6379/TCP",
          type: "ClusterIP"
        },
        {
          kind: "service",
          name: "gbchn-gbchn",
          namespace: "project-workspace",
          selfLink: "/api/v1/namespaces/project-workspace/services/gbchn-gbchn",
          created: "2019-08-11T05:28:17Z",
          cluster: "local-cluster",
          clusterIP: "10.0.197.16",
          _rbac: "project-workspace_null_services",
          _uid: "local-cluster/d2c60527-bbf8-11e9-82a0-00163e019f14",
          _hubClusterResource: "true",
          _hostingSubscription: "project-workspace/apptest-gbapp-guestbook",
          _hostingDeployable: "chn-gb/gbchn-gbchn-service",
          label: "heritage=Tiller; release=gbchn; app=gbchn; chart=gbchn-0.1.0",
          port: "80:31324/TCP",
          type: "NodePort"
        },
        {
          kind: "service",
          name: "redis-master",
          namespace: "project-workspace",
          selfLink:
            "/api/v1/namespaces/project-workspace/services/redis-master",
          created: "2019-08-11T05:28:17Z",
          cluster: "local-cluster",
          clusterIP: "10.0.51.61",
          _rbac: "project-workspace_null_services",
          _uid: "local-cluster/d2d13e98-bbf8-11e9-82a0-00163e019f14",
          _hubClusterResource: "true",
          _hostingSubscription: "project-workspace/apptest-gbapp-guestbook",
          _hostingDeployable: "chn-gb/gbchn-gbchn-redismasterservice",
          label: "chart=gbchn-0.1.0; heritage=Tiller; release=gbchn; app=gbchn",
          port: "6379/TCP",
          type: "ClusterIP"
        }
      ],
      __typename: "SearchRelatedResult"
    },
    {
      kind: "deployment",
      count: 3,
      items: [
        {
          kind: "deployment",
          name: "gbchn-gbchn-redisslave",
          namespace: "project-workspace",
          selfLink:
            "/apis/apps/v1/namespaces/project-workspace/deployments/gbchn-gbchn-redisslave",
          apigroup: "apps",
          available: 0,
          created: "2019-08-11T05:28:17Z",
          cluster: "local-cluster",
          current: 1,
          _rbac: "project-workspace_apps_deployments",
          _uid: "local-cluster/d304407b-bbf8-11e9-82a0-00163e019f14",
          _hubClusterResource: "true",
          _hostingSubscription: "project-workspace/apptest-gbapp-guestbook",
          _hostingDeployable: "chn-gb/gbchn-gbchn-redisslave",
          label: "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=gbchn",
          ready: 0,
          desired: 1
        },
        {
          kind: "deployment",
          name: "gbchn-gbchn-frontend",
          namespace: "project-workspace",
          selfLink:
            "/apis/apps/v1/namespaces/project-workspace/deployments/gbchn-gbchn-frontend",
          apigroup: "apps",
          available: 0,
          created: "2019-08-11T05:28:17Z",
          cluster: "local-cluster",
          current: 1,
          _rbac: "project-workspace_apps_deployments",
          _uid: "local-cluster/d2e16627-bbf8-11e9-82a0-00163e019f14",
          _hubClusterResource: "true",
          _hostingSubscription: "project-workspace/apptest-gbapp-guestbook",
          _hostingDeployable: "chn-gb/gbchn-gbchn-frontend",
          label: "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=gbchn",
          ready: 0,
          desired: 1
        },
        {
          kind: "deployment",
          name: "gbchn-gbchn-redismaster",
          namespace: "project-workspace",
          selfLink:
            "/apis/apps/v1/namespaces/project-workspace/deployments/gbchn-gbchn-redismaster",
          apigroup: "apps",
          available: 0,
          created: "2019-08-11T05:28:17Z",
          cluster: "local-cluster",
          current: 1,
          _rbac: "project-workspace_apps_deployments",
          _uid: "local-cluster/d2ee88f7-bbf8-11e9-82a0-00163e019f14",
          _hubClusterResource: "true",
          _hostingSubscription: "project-workspace/apptest-gbapp-guestbook",
          _hostingDeployable: "chn-gb/gbchn-gbchn-redismaster",
          label: "release=gbchn; app=gbchn; chart=gbchn-0.1.0; heritage=Tiller",
          ready: 0,
          desired: 1
        }
      ],
      __typename: "SearchRelatedResult"
    },
    {
      kind: "subscription",
      count: 2,
      items: [
        {
          kind: "subscription",
          name: "apptest-gbapp-guestbook",
          namespace: "project-workspace",
          selfLink:
            "/apis/app.ibm.com/v1alpha1/namespaces/project-workspace/subscriptions/apptest-gbapp-guestbook",
          created: "2019-08-11T02:55:06Z",
          cluster: "local-cluster",
          channel: "chn-gb/gbchn",
          _rbac: "project-workspace_null_subscriptions",
          _uid: "local-cluster/6c563052-bbe3-11e9-82a0-00163e019f14",
          _hubClusterResource: "true",
          label:
            "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=apptest"
        },
        {
          kind: "subscription",
          name: "apptest-gbapp-guestbook",
          namespace: "default",
          selfLink:
            "/apis/app.ibm.com/v1alpha1/namespaces/default/subscriptions/apptest-gbapp-guestbook",
          created: "2019-08-11T03:20:42Z",
          cluster: "local-cluster",
          channel: "chn-gb/gbchn",
          _rbac: "default_null_subscriptions",
          _uid: "local-cluster/003b9d4c-bbe7-11e9-82a0-00163e019f14",
          _hubClusterResource: "true",
          _hostingSubscription: "project-workspace/apptest-gbapp-guestbook",
          _hostingDeployable:
            "local-cluster/apptest-gbapp-guestbook-deployable-6gh2v",
          label:
            "heritage=Tiller; hosting-deployable-name=apptest-gbapp-guestbook-deployable; release=apptest; app=gbapp; chart=gbapp-0.1.0"
        }
      ],
      __typename: "SearchRelatedResult"
    }
  ],
  __typename: "SearchResult"
};

describe("getRelatedItems", () => {
  it("should return correct deployment count", () => {
    const result = [
      {
        kind: "release",
        name: "apptest",
        namespace: "project-workspace",
        status: "DEPLOYED",
        cluster: "local-cluster",
        chartVersion: "0.1.0",
        chartName: "gbapp",
        _rbac: "project-workspace_null_releases",
        _uid: "local-cluster/Release/apptest",
        _hubClusterResource: "true",
        revision: 1,
        updated: "2019-08-11T02:55:05Z"
      },
      {
        kind: "pod",
        name: "gbchn-gbchn-redisslave-6bfbf95955-jqhp4",
        namespace: "project-workspace",
        status: "CreateContainerConfigError",
        startedAt: "2019-08-11T05:28:18Z",
        selfLink:
          "/api/v1/namespaces/project-workspace/pods/gbchn-gbchn-redisslave-6bfbf95955-jqhp4",
        created: "2019-08-11T05:28:17Z",
        container: "gbchn",
        cluster: "local-cluster",
        _rbac: "project-workspace_null_pods",
        _uid: "local-cluster/d30a9e4f-bbf8-11e9-82a0-00163e019f14",
        _hubClusterResource: "true",
        label:
          "app=gbchn; pod-template-hash=6bfbf95955; release=gbchn; role=slave; tier=backend",
        podIP: "10.1.211.185",
        restarts: 0,
        image: "gcr.io/google_samples/gb-redisslave:v3",
        hostIP: "172.16.185.220"
      },
      {
        kind: "pod",
        name: "gbchn-gbchn-redismaster-6d78d7969b-7jv8r",
        namespace: "project-workspace",
        status: "CreateContainerConfigError",
        startedAt: "2019-08-11T05:28:17Z",
        selfLink:
          "/api/v1/namespaces/project-workspace/pods/gbchn-gbchn-redismaster-6d78d7969b-7jv8r",
        created: "2019-08-11T05:28:17Z",
        container: "redis",
        cluster: "local-cluster",
        _rbac: "project-workspace_null_pods",
        _uid: "local-cluster/d304d6aa-bbf8-11e9-82a0-00163e019f14",
        _hubClusterResource: "true",
        label:
          "app=gbchn; pod-template-hash=6d78d7969b; release=gbchn; role=master; tier=backend",
        podIP: "10.1.114.144",
        restarts: 0,
        image: "gcr.io/kubernetes-e2e-test-images/redis:1.0",
        hostIP: "172.16.180.82"
      },
      {
        kind: "pod",
        name: "gbchn-gbchn-frontend-75db88bdd6-kbmhk",
        namespace: "project-workspace",
        status: "CreateContainerConfigError",
        startedAt: "2019-08-11T05:28:17Z",
        selfLink:
          "/api/v1/namespaces/project-workspace/pods/gbchn-gbchn-frontend-75db88bdd6-kbmhk",
        created: "2019-08-11T05:28:17Z",
        container: "frontend",
        cluster: "local-cluster",
        _rbac: "project-workspace_null_pods",
        _uid: "local-cluster/d3050ac2-bbf8-11e9-82a0-00163e019f14",
        _hubClusterResource: "true",
        label:
          "tier=frontend; app=gbchn; pod-template-hash=75db88bdd6; release=gbchn",
        podIP: "10.1.94.49",
        restarts: 0,
        image: "gcr.io/google-samples/gb-frontend:v6",
        hostIP: "172.16.185.176"
      },
      {
        kind: "replicaset",
        name: "gbchn-gbchn-redisslave-6bfbf95955",
        namespace: "project-workspace",
        selfLink:
          "/apis/extensions/v1beta1/namespaces/project-workspace/replicasets/gbchn-gbchn-redisslave-6bfbf95955",
        apigroup: "apps",
        created: "2019-08-11T05:28:17Z",
        cluster: "local-cluster",
        current: 1,
        _rbac: "project-workspace_apps_replicasets",
        _uid: "local-cluster/d3078069-bbf8-11e9-82a0-00163e019f14",
        _hubClusterResource: "true",
        _hostingSubscription: "project-workspace/apptest-gbapp-guestbook",
        _hostingDeployable: "chn-gb/gbchn-gbchn-redisslave",
        label:
          "app=gbchn; pod-template-hash=6bfbf95955; release=gbchn; role=slave; tier=backend",
        desired: 1
      },
      {
        kind: "replicaset",
        name: "gbchn-gbchn-redismaster-6d78d7969b",
        namespace: "project-workspace",
        selfLink:
          "/apis/extensions/v1beta1/namespaces/project-workspace/replicasets/gbchn-gbchn-redismaster-6d78d7969b",
        apigroup: "apps",
        created: "2019-08-11T05:28:17Z",
        cluster: "local-cluster",
        current: 1,
        _rbac: "project-workspace_apps_replicasets",
        _uid: "local-cluster/d2f408e0-bbf8-11e9-82a0-00163e019f14",
        _hubClusterResource: "true",
        _hostingSubscription: "project-workspace/apptest-gbapp-guestbook",
        _hostingDeployable: "chn-gb/gbchn-gbchn-redismaster",
        label:
          "release=gbchn; role=master; tier=backend; app=gbchn; pod-template-hash=6d78d7969b",
        desired: 1
      },
      {
        kind: "replicaset",
        name: "gbchn-gbchn-frontend-75db88bdd6",
        namespace: "project-workspace",
        selfLink:
          "/apis/extensions/v1beta1/namespaces/project-workspace/replicasets/gbchn-gbchn-frontend-75db88bdd6",
        apigroup: "apps",
        created: "2019-08-11T05:28:17Z",
        cluster: "local-cluster",
        current: 1,
        _rbac: "project-workspace_apps_replicasets",
        _uid: "local-cluster/d2efe8d6-bbf8-11e9-82a0-00163e019f14",
        _hubClusterResource: "true",
        _hostingSubscription: "project-workspace/apptest-gbapp-guestbook",
        _hostingDeployable: "chn-gb/gbchn-gbchn-frontend",
        label:
          "release=gbchn; tier=frontend; app=gbchn; pod-template-hash=75db88bdd6",
        desired: 1
      },
      {
        kind: "service",
        name: "redis-slave",
        namespace: "project-workspace",
        selfLink: "/api/v1/namespaces/project-workspace/services/redis-slave",
        created: "2019-08-11T05:28:17Z",
        cluster: "local-cluster",
        clusterIP: "10.0.26.188",
        _rbac: "project-workspace_null_services",
        _uid: "local-cluster/d2bd19fc-bbf8-11e9-82a0-00163e019f14",
        _hubClusterResource: "true",
        _hostingSubscription: "project-workspace/apptest-gbapp-guestbook",
        _hostingDeployable: "chn-gb/gbchn-gbchn-redisslaveservice",
        label: "heritage=Tiller; release=gbchn; app=gbchn; chart=gbchn-0.1.0",
        port: "6379/TCP",
        type: "ClusterIP"
      },
      {
        kind: "service",
        name: "gbchn-gbchn",
        namespace: "project-workspace",
        selfLink: "/api/v1/namespaces/project-workspace/services/gbchn-gbchn",
        created: "2019-08-11T05:28:17Z",
        cluster: "local-cluster",
        clusterIP: "10.0.197.16",
        _rbac: "project-workspace_null_services",
        _uid: "local-cluster/d2c60527-bbf8-11e9-82a0-00163e019f14",
        _hubClusterResource: "true",
        _hostingSubscription: "project-workspace/apptest-gbapp-guestbook",
        _hostingDeployable: "chn-gb/gbchn-gbchn-service",
        label: "heritage=Tiller; release=gbchn; app=gbchn; chart=gbchn-0.1.0",
        port: "80:31324/TCP",
        type: "NodePort"
      },
      {
        kind: "service",
        name: "redis-master",
        namespace: "project-workspace",
        selfLink: "/api/v1/namespaces/project-workspace/services/redis-master",
        created: "2019-08-11T05:28:17Z",
        cluster: "local-cluster",
        clusterIP: "10.0.51.61",
        _rbac: "project-workspace_null_services",
        _uid: "local-cluster/d2d13e98-bbf8-11e9-82a0-00163e019f14",
        _hubClusterResource: "true",
        _hostingSubscription: "project-workspace/apptest-gbapp-guestbook",
        _hostingDeployable: "chn-gb/gbchn-gbchn-redismasterservice",
        label: "chart=gbchn-0.1.0; heritage=Tiller; release=gbchn; app=gbchn",
        port: "6379/TCP",
        type: "ClusterIP"
      },
      {
        kind: "deployment",
        name: "gbchn-gbchn-redisslave",
        namespace: "project-workspace",
        selfLink:
          "/apis/apps/v1/namespaces/project-workspace/deployments/gbchn-gbchn-redisslave",
        apigroup: "apps",
        available: 0,
        created: "2019-08-11T05:28:17Z",
        cluster: "local-cluster",
        current: 1,
        _rbac: "project-workspace_apps_deployments",
        _uid: "local-cluster/d304407b-bbf8-11e9-82a0-00163e019f14",
        _hubClusterResource: "true",
        _hostingSubscription: "project-workspace/apptest-gbapp-guestbook",
        _hostingDeployable: "chn-gb/gbchn-gbchn-redisslave",
        label: "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=gbchn",
        ready: 0,
        desired: 1
      },
      {
        kind: "deployment",
        name: "gbchn-gbchn-frontend",
        namespace: "project-workspace",
        selfLink:
          "/apis/apps/v1/namespaces/project-workspace/deployments/gbchn-gbchn-frontend",
        apigroup: "apps",
        available: 0,
        created: "2019-08-11T05:28:17Z",
        cluster: "local-cluster",
        current: 1,
        _rbac: "project-workspace_apps_deployments",
        _uid: "local-cluster/d2e16627-bbf8-11e9-82a0-00163e019f14",
        _hubClusterResource: "true",
        _hostingSubscription: "project-workspace/apptest-gbapp-guestbook",
        _hostingDeployable: "chn-gb/gbchn-gbchn-frontend",
        label: "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=gbchn",
        ready: 0,
        desired: 1
      },
      {
        kind: "deployment",
        name: "gbchn-gbchn-redismaster",
        namespace: "project-workspace",
        selfLink:
          "/apis/apps/v1/namespaces/project-workspace/deployments/gbchn-gbchn-redismaster",
        apigroup: "apps",
        available: 0,
        created: "2019-08-11T05:28:17Z",
        cluster: "local-cluster",
        current: 1,
        _rbac: "project-workspace_apps_deployments",
        _uid: "local-cluster/d2ee88f7-bbf8-11e9-82a0-00163e019f14",
        _hubClusterResource: "true",
        _hostingSubscription: "project-workspace/apptest-gbapp-guestbook",
        _hostingDeployable: "chn-gb/gbchn-gbchn-redismaster",
        label: "release=gbchn; app=gbchn; chart=gbchn-0.1.0; heritage=Tiller",
        ready: 0,
        desired: 1
      }
    ];
    expect(getRelatedItems(application.related, "deployment")).toEqual(result);
  });
  it("should return correct deployable count", () => {
    const result = [
      {
        kind: "deployable",
        name: "gbchn-gbchn-frontend",
        namespace: "chn-gb",
        status: "Deployed",
        selfLink:
          "/apis/app.ibm.com/v1alpha1/namespaces/chn-gb/deployables/gbchn-gbchn-frontend",
        apigroup: "app.ibm.com",
        created: "2019-08-06T20:50:55Z",
        cluster: "local-cluster",
        _rbac: "chn-gb_app.ibm.com_deployables",
        _uid: "local-cluster/e2f8c589-b88b-11e9-82a0-00163e019f14",
        _hubClusterResource: "true",
        label: "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=gbchn"
      }
    ];
    expect(getRelatedItems(application.related, "deployable")).toEqual(result);
  });
  it("should return correct hub subscriptions only, the ones that dos not have the hosting-subscription annotation", () => {
    const result = [
      {
        kind: "subscription",
        name: "apptest-gbapp-guestbook",
        namespace: "project-workspace",
        selfLink:
          "/apis/app.ibm.com/v1alpha1/namespaces/project-workspace/subscriptions/apptest-gbapp-guestbook",
        created: "2019-08-11T02:55:06Z",
        cluster: "local-cluster",
        channel: "chn-gb/gbchn",
        _rbac: "project-workspace_null_subscriptions",
        _uid: "local-cluster/6c563052-bbe3-11e9-82a0-00163e019f14",
        _hubClusterResource: "true",
        label: "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=apptest"
      }
    ];
    expect(getRelatedItems(application.related, "subscription")).toEqual(
      result
    );
  });
  it("should handle empty related array", () => {
    expect(getRelatedItems([], "deployment")).toEqual([]);
  });
});

describe("filterRemoteClusterSubscriptions", () => {
  it("should return related array, with subscriptions filtered out to remove the remote cluster ones, where _hostingSubscription is not null", () => {
    const result = [
      {
        kind: "release",
        count: 1,
        items: [
          {
            kind: "release",
            name: "apptest",
            namespace: "project-workspace",
            status: "DEPLOYED",
            cluster: "local-cluster",
            chartVersion: "0.1.0",
            chartName: "gbapp",
            _rbac: "project-workspace_null_releases",
            _uid: "local-cluster/Release/apptest",
            _hubClusterResource: "true",
            revision: 1,
            updated: "2019-08-11T02:55:05Z"
          }
        ],
        __typename: "SearchRelatedResult"
      },
      {
        kind: "cluster",
        count: 1,
        items: [
          {
            kind: "cluster",
            klusterletVersion: "3.2.0-10+94ee790ac3208b",
            kubernetesVersion: "v1.13.5+icp-ee",
            memory: "96327Mi",
            nodes: 5,
            name: "local-cluster",
            namespace: "local-cluster",
            storage: "2296Gi",
            status: "OK",
            selfLink:
              "/apis/clusterregistry.k8s.io/v1alpha1/namespaces/local-cluster/clusters/local-cluster",
            apigroup: "clusterregistry.k8s.io",
            created: "2019-08-12T19:17:46Z",
            cpu: 40,
            consoleURL: "https://9.30.230.96:8443",
            _rbac: "local-cluster_clusterregistry.k8s.io_clusters",
            _uid: "ddf4b95f-bd35-11e9-8061-4e341860d790"
          }
        ],
        __typename: "SearchRelatedResult"
      },
      {
        kind: "pod",
        count: 3,
        items: [
          {
            kind: "pod",
            name: "gbchn-gbchn-redisslave-6bfbf95955-jqhp4",
            namespace: "project-workspace",
            status: "CreateContainerConfigError",
            startedAt: "2019-08-11T05:28:18Z",
            selfLink:
              "/api/v1/namespaces/project-workspace/pods/gbchn-gbchn-redisslave-6bfbf95955-jqhp4",
            created: "2019-08-11T05:28:17Z",
            container: "gbchn",
            cluster: "local-cluster",
            _rbac: "project-workspace_null_pods",
            _uid: "local-cluster/d30a9e4f-bbf8-11e9-82a0-00163e019f14",
            _hubClusterResource: "true",
            label:
              "app=gbchn; pod-template-hash=6bfbf95955; release=gbchn; role=slave; tier=backend",
            podIP: "10.1.211.185",
            restarts: 0,
            image: "gcr.io/google_samples/gb-redisslave:v3",
            hostIP: "172.16.185.220"
          },
          {
            kind: "pod",
            name: "gbchn-gbchn-redismaster-6d78d7969b-7jv8r",
            namespace: "project-workspace",
            status: "CreateContainerConfigError",
            startedAt: "2019-08-11T05:28:17Z",
            selfLink:
              "/api/v1/namespaces/project-workspace/pods/gbchn-gbchn-redismaster-6d78d7969b-7jv8r",
            created: "2019-08-11T05:28:17Z",
            container: "redis",
            cluster: "local-cluster",
            _rbac: "project-workspace_null_pods",
            _uid: "local-cluster/d304d6aa-bbf8-11e9-82a0-00163e019f14",
            _hubClusterResource: "true",
            label:
              "app=gbchn; pod-template-hash=6d78d7969b; release=gbchn; role=master; tier=backend",
            podIP: "10.1.114.144",
            restarts: 0,
            image: "gcr.io/kubernetes-e2e-test-images/redis:1.0",
            hostIP: "172.16.180.82"
          },
          {
            kind: "pod",
            name: "gbchn-gbchn-frontend-75db88bdd6-kbmhk",
            namespace: "project-workspace",
            status: "CreateContainerConfigError",
            startedAt: "2019-08-11T05:28:17Z",
            selfLink:
              "/api/v1/namespaces/project-workspace/pods/gbchn-gbchn-frontend-75db88bdd6-kbmhk",
            created: "2019-08-11T05:28:17Z",
            container: "frontend",
            cluster: "local-cluster",
            _rbac: "project-workspace_null_pods",
            _uid: "local-cluster/d3050ac2-bbf8-11e9-82a0-00163e019f14",
            _hubClusterResource: "true",
            label:
              "tier=frontend; app=gbchn; pod-template-hash=75db88bdd6; release=gbchn",
            podIP: "10.1.94.49",
            restarts: 0,
            image: "gcr.io/google-samples/gb-frontend:v6",
            hostIP: "172.16.185.176"
          }
        ],
        __typename: "SearchRelatedResult"
      },
      {
        kind: "deployable",
        count: 1,
        items: [
          {
            kind: "deployable",
            name: "gbchn-gbchn-frontend",
            namespace: "chn-gb",
            status: "Deployed",
            selfLink:
              "/apis/app.ibm.com/v1alpha1/namespaces/chn-gb/deployables/gbchn-gbchn-frontend",
            apigroup: "app.ibm.com",
            created: "2019-08-06T20:50:55Z",
            cluster: "local-cluster",
            _rbac: "chn-gb_app.ibm.com_deployables",
            _uid: "local-cluster/e2f8c589-b88b-11e9-82a0-00163e019f14",
            _hubClusterResource: "true",
            label:
              "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=gbchn"
          }
        ],
        __typename: "SearchRelatedResult"
      },
      {
        kind: "replicaset",
        count: 3,
        items: [
          {
            kind: "replicaset",
            name: "gbchn-gbchn-redisslave-6bfbf95955",
            namespace: "project-workspace",
            selfLink:
              "/apis/extensions/v1beta1/namespaces/project-workspace/replicasets/gbchn-gbchn-redisslave-6bfbf95955",
            apigroup: "apps",
            created: "2019-08-11T05:28:17Z",
            cluster: "local-cluster",
            current: 1,
            _rbac: "project-workspace_apps_replicasets",
            _uid: "local-cluster/d3078069-bbf8-11e9-82a0-00163e019f14",
            _hubClusterResource: "true",
            _hostingSubscription: "project-workspace/apptest-gbapp-guestbook",
            _hostingDeployable: "chn-gb/gbchn-gbchn-redisslave",
            label:
              "app=gbchn; pod-template-hash=6bfbf95955; release=gbchn; role=slave; tier=backend",
            desired: 1
          },
          {
            kind: "replicaset",
            name: "gbchn-gbchn-redismaster-6d78d7969b",
            namespace: "project-workspace",
            selfLink:
              "/apis/extensions/v1beta1/namespaces/project-workspace/replicasets/gbchn-gbchn-redismaster-6d78d7969b",
            apigroup: "apps",
            created: "2019-08-11T05:28:17Z",
            cluster: "local-cluster",
            current: 1,
            _rbac: "project-workspace_apps_replicasets",
            _uid: "local-cluster/d2f408e0-bbf8-11e9-82a0-00163e019f14",
            _hubClusterResource: "true",
            _hostingSubscription: "project-workspace/apptest-gbapp-guestbook",
            _hostingDeployable: "chn-gb/gbchn-gbchn-redismaster",
            label:
              "release=gbchn; role=master; tier=backend; app=gbchn; pod-template-hash=6d78d7969b",
            desired: 1
          },
          {
            kind: "replicaset",
            name: "gbchn-gbchn-frontend-75db88bdd6",
            namespace: "project-workspace",
            selfLink:
              "/apis/extensions/v1beta1/namespaces/project-workspace/replicasets/gbchn-gbchn-frontend-75db88bdd6",
            apigroup: "apps",
            created: "2019-08-11T05:28:17Z",
            cluster: "local-cluster",
            current: 1,
            _rbac: "project-workspace_apps_replicasets",
            _uid: "local-cluster/d2efe8d6-bbf8-11e9-82a0-00163e019f14",
            _hubClusterResource: "true",
            _hostingSubscription: "project-workspace/apptest-gbapp-guestbook",
            _hostingDeployable: "chn-gb/gbchn-gbchn-frontend",
            label:
              "release=gbchn; tier=frontend; app=gbchn; pod-template-hash=75db88bdd6",
            desired: 1
          }
        ],
        __typename: "SearchRelatedResult"
      },
      {
        kind: "service",
        count: 3,
        items: [
          {
            kind: "service",
            name: "redis-slave",
            namespace: "project-workspace",
            selfLink:
              "/api/v1/namespaces/project-workspace/services/redis-slave",
            created: "2019-08-11T05:28:17Z",
            cluster: "local-cluster",
            clusterIP: "10.0.26.188",
            _rbac: "project-workspace_null_services",
            _uid: "local-cluster/d2bd19fc-bbf8-11e9-82a0-00163e019f14",
            _hubClusterResource: "true",
            _hostingSubscription: "project-workspace/apptest-gbapp-guestbook",
            _hostingDeployable: "chn-gb/gbchn-gbchn-redisslaveservice",
            label:
              "heritage=Tiller; release=gbchn; app=gbchn; chart=gbchn-0.1.0",
            port: "6379/TCP",
            type: "ClusterIP"
          },
          {
            kind: "service",
            name: "gbchn-gbchn",
            namespace: "project-workspace",
            selfLink:
              "/api/v1/namespaces/project-workspace/services/gbchn-gbchn",
            created: "2019-08-11T05:28:17Z",
            cluster: "local-cluster",
            clusterIP: "10.0.197.16",
            _rbac: "project-workspace_null_services",
            _uid: "local-cluster/d2c60527-bbf8-11e9-82a0-00163e019f14",
            _hubClusterResource: "true",
            _hostingSubscription: "project-workspace/apptest-gbapp-guestbook",
            _hostingDeployable: "chn-gb/gbchn-gbchn-service",
            label:
              "heritage=Tiller; release=gbchn; app=gbchn; chart=gbchn-0.1.0",
            port: "80:31324/TCP",
            type: "NodePort"
          },
          {
            kind: "service",
            name: "redis-master",
            namespace: "project-workspace",
            selfLink:
              "/api/v1/namespaces/project-workspace/services/redis-master",
            created: "2019-08-11T05:28:17Z",
            cluster: "local-cluster",
            clusterIP: "10.0.51.61",
            _rbac: "project-workspace_null_services",
            _uid: "local-cluster/d2d13e98-bbf8-11e9-82a0-00163e019f14",
            _hubClusterResource: "true",
            _hostingSubscription: "project-workspace/apptest-gbapp-guestbook",
            _hostingDeployable: "chn-gb/gbchn-gbchn-redismasterservice",
            label:
              "chart=gbchn-0.1.0; heritage=Tiller; release=gbchn; app=gbchn",
            port: "6379/TCP",
            type: "ClusterIP"
          }
        ],
        __typename: "SearchRelatedResult"
      },
      {
        kind: "deployment",
        count: 3,
        items: [
          {
            kind: "deployment",
            name: "gbchn-gbchn-redisslave",
            namespace: "project-workspace",
            selfLink:
              "/apis/apps/v1/namespaces/project-workspace/deployments/gbchn-gbchn-redisslave",
            apigroup: "apps",
            available: 0,
            created: "2019-08-11T05:28:17Z",
            cluster: "local-cluster",
            current: 1,
            _rbac: "project-workspace_apps_deployments",
            _uid: "local-cluster/d304407b-bbf8-11e9-82a0-00163e019f14",
            _hubClusterResource: "true",
            _hostingSubscription: "project-workspace/apptest-gbapp-guestbook",
            _hostingDeployable: "chn-gb/gbchn-gbchn-redisslave",
            label:
              "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=gbchn",
            ready: 0,
            desired: 1
          },
          {
            kind: "deployment",
            name: "gbchn-gbchn-frontend",
            namespace: "project-workspace",
            selfLink:
              "/apis/apps/v1/namespaces/project-workspace/deployments/gbchn-gbchn-frontend",
            apigroup: "apps",
            available: 0,
            created: "2019-08-11T05:28:17Z",
            cluster: "local-cluster",
            current: 1,
            _rbac: "project-workspace_apps_deployments",
            _uid: "local-cluster/d2e16627-bbf8-11e9-82a0-00163e019f14",
            _hubClusterResource: "true",
            _hostingSubscription: "project-workspace/apptest-gbapp-guestbook",
            _hostingDeployable: "chn-gb/gbchn-gbchn-frontend",
            label:
              "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=gbchn",
            ready: 0,
            desired: 1
          },
          {
            kind: "deployment",
            name: "gbchn-gbchn-redismaster",
            namespace: "project-workspace",
            selfLink:
              "/apis/apps/v1/namespaces/project-workspace/deployments/gbchn-gbchn-redismaster",
            apigroup: "apps",
            available: 0,
            created: "2019-08-11T05:28:17Z",
            cluster: "local-cluster",
            current: 1,
            _rbac: "project-workspace_apps_deployments",
            _uid: "local-cluster/d2ee88f7-bbf8-11e9-82a0-00163e019f14",
            _hubClusterResource: "true",
            _hostingSubscription: "project-workspace/apptest-gbapp-guestbook",
            _hostingDeployable: "chn-gb/gbchn-gbchn-redismaster",
            label:
              "release=gbchn; app=gbchn; chart=gbchn-0.1.0; heritage=Tiller",
            ready: 0,
            desired: 1
          }
        ],
        __typename: "SearchRelatedResult"
      },
      {
        kind: "subscription",
        count: 2,
        items: [
          {
            kind: "subscription",
            name: "apptest-gbapp-guestbook",
            namespace: "project-workspace",
            selfLink:
              "/apis/app.ibm.com/v1alpha1/namespaces/project-workspace/subscriptions/apptest-gbapp-guestbook",
            created: "2019-08-11T02:55:06Z",
            cluster: "local-cluster",
            channel: "chn-gb/gbchn",
            _rbac: "project-workspace_null_subscriptions",
            _uid: "local-cluster/6c563052-bbe3-11e9-82a0-00163e019f14",
            _hubClusterResource: "true",
            label:
              "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=apptest"
          }
        ],
        __typename: "SearchRelatedResult"
      }
    ];
    expect(filterRemoteClusterSubscriptions(application.related)).toEqual(
      result
    );
  });
  it("should handle empty related array on filterRemoteClusterSubscriptions", () => {
    expect(filterRemoteClusterSubscriptions([])).toEqual([]);
  });
});
