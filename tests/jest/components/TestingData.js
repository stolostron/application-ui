/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 ****************************************************************************** */

export const serverProps = {
  context: {
    locale: "en-US"
  },
  xsrfToken: "test"
};

export const selectedApp = {
  isSingleApplicationView: true,
  selectedAppName: "mortgage-app",
  selectedAppNamespace: "default"
};

export const resourceType = {
  name: "QueryApplications",
  list: "QueryApplicationList"
};

export const appNormalizedItems = {
  items: [
    "mortgage-app-default",
    "samplebook-gbapp-sample",
    "stocktrader-app-stock-trader",
    "subscribed-guestbook-application-kube-system"
  ],
  totalResults: 4,
  totalPages: 1,
  normalizedItems: {
    "mortgage-app-default": {
      _uid: "local-cluster/5cd1d4c7-52aa-11ea-bf05-00000a102d26",
      name: "mortgage-app",
      namespace: "default",
      dashboard:
        "https://localhost:443/grafana/dashboard/db/mortgage-app-dashboard-via-federated-prometheus?namespace=default",
      clusterCount: 1,
      remoteSubscriptionStatusCount: {
        Subscribed: 1
      },
      podStatusCount: {
        Running: 1
      },
      hubSubscriptions: [
        {
          _uid: "local-cluster/5cdc0d8d-52aa-11ea-bf05-00000a102d26",
          status: "Propagated",
          channel: "default/mortgage-channel",
          __typename: "Subscription"
        }
      ],
      created: "2018-02-18T23:57:04Z",
      __typename: "Application"
    },
    "samplebook-gbapp-sample": {
      _uid: "local-cluster/42d4c013-52b9-11ea-bf05-00000a102d26",
      name: "samplebook-gbapp",
      namespace: "sample",
      dashboard:
        "https://localhost:443/grafana/dashboard/db/samplebook-gbapp-dashboard-via-federated-prometheus?namespace=sample",
      clusterCount: 1,
      remoteSubscriptionStatusCount: {
        Subscribed: 1
      },
      podStatusCount: {
        Running: 3
      },
      hubSubscriptions: [
        {
          _uid: "local-cluster/42d9ec27-52b9-11ea-bf05-00000a102d26",
          status: "Propagated",
          channel: "gbook-ch/guestbook",
          __typename: "Subscription"
        }
      ],
      created: "2018-02-19T01:43:43Z",
      __typename: "Application"
    },
    "stocktrader-app-stock-trader": {
      _uid: "local-cluster/8f4799db-4cf4-11ea-a229-00000a102d26",
      name: "stocktrader-app",
      namespace: "stock-trader",
      dashboard: null,
      clusterCount: 0,
      remoteSubscriptionStatusCount: {},
      podStatusCount: {},
      hubSubscriptions: [],
      created: "2020-02-11T17:33:04Z",
      __typename: "Application"
    },
    "subscribed-guestbook-application-kube-system": {
      _uid: "local-cluster/e77e69a7-4d25-11ea-a229-00000a102d26",
      name: "subscribed-guestbook-application",
      namespace: "kube-system",
      dashboard: null,
      clusterCount: 2,
      remoteSubscriptionStatusCount: {
        Failed: 1,
        Subscribed: 1
      },
      podStatusCount: {
        Running: 3
      },
      hubSubscriptions: [
        {
          _uid: "local-cluster/98dce449-52b8-11ea-bf05-00000a102d26",
          status: "Propagated",
          channel: "default/hub-local-helm-repo",
          __typename: "Subscription"
        }
      ],
      created: "2019-02-11T23:26:18Z",
      __typename: "Application"
    }
  }
};
export const QueryApplicationList = {
  status: "DONE",
  itemsPerPage: 20,
  page: 1,
  search: "aa",
  sortDirection: "asc",
  sortColumn: "name",
  mutateStatus: "DONE",
  deleteStatus: "DONE",
  deleteMsg: "app123",
  items: [
    {
      _uid: "local-cluster/96218695-3798-4dac-b3d3-179fb86b6715",
      name: "mortgage-app",
      namespace: "default",
      dashboard:
        "https://localhost:443/grafana/dashboard/db/mortgage-app-dashboard-via-federated-prometheus?namespace=default",
      clusterCount: 1,
      remoteSubscriptionStatusCount: {
        Subscribed: 1,
        null: 3,
        Failed: 6
      },
      podStatusCount: {
        Running: 1
      },
      hubSubscriptions: [
        {
          _uid: "local-cluster/5cdc0d8d-52aa-11ea-bf05-00000a102d26",
          status: "Propagated",
          channel: "default/mortgage-channel",
          __typename: "Subscription"
        }
      ],
      created: "2018-02-18T23:57:04Z",
      __typename: "Application"
    },
    {
      _uid: "local-cluster/42d4c013-52b9-11ea-bf05-00000a102d26",
      name: "samplebook-gbapp",
      namespace: "sample",
      dashboard:
        "https://localhost:443/grafana/dashboard/db/samplebook-gbapp-dashboard-via-federated-prometheus?namespace=sample",
      clusterCount: 1,
      remoteSubscriptionStatusCount: {
        Subscribed: 1
      },
      podStatusCount: {
        Running: 3
      },
      hubSubscriptions: [
        {
          _uid: "local-cluster/98dce449-52b8-11ea-bf05-00000a102d26gbook",
          status: "Propagated",
          channel: "gbook-ch/guestbook",
          __typename: "Subscription"
        }
      ],
      created: "2018-02-19T01:43:43Z",
      __typename: "Application"
    },
    {
      _uid: "local-cluster/8f4799db-4cf4-11ea-a229-00000a102d26",
      name: "stocktrader-app",
      namespace: "stock-trader",
      dashboard: null,
      clusterCount: 0,
      remoteSubscriptionStatusCount: {},
      podStatusCount: {},
      hubSubscriptions: [],
      created: "2020-02-11T17:33:04Z",
      __typename: "Application"
    },
    {
      _uid: "local-cluster/e77e69a7-4d25-11ea-a229-00000a102d26",
      name: "subscribed-guestbook-application",
      namespace: "kube-system",
      dashboard: null,
      clusterCount: 2,
      remoteSubscriptionStatusCount: {
        Failed: 1,
        Subscribed: 1
      },
      podStatusCount: {
        Running: 3
      },
      hubSubscriptions: [
        {
          _uid: "local-cluster/98dce449-52b8-11ea-bf05-00000a102d26gbook",
          status: "Propagated",
          channel: "default/hub-local-helm-repo",
          __typename: "Subscription"
        }
      ],
      created: "2019-02-11T23:26:18Z",
      __typename: "Application"
    },
    {
      _uid: "local-cluster/e77e69a7-4d25-11ea-a229-00000a100",
      name: "app-no-channel",
      namespace: "default",
      dashboard: null,
      clusterCount: 0,
      created: "2019-02-11T23:26:18Z",
      __typename: "Application",
      hubSubscriptions: []
    }
  ]
};

const QueryApplicationList_singleApp = {
  forceReload: false,
  items: [
    {
      apigroup: "app.k8s.io",
      cluster: "local-cluster",
      created: "2018-08-13T19:23:00Z",
      custom: { clusters: 0, created: "13 days ago" },
      dashboard: "",
      kind: "application",
      label: "",
      name: "mortgage-app",
      namespace: "default",
      related: [
        {
          items: [
            {
              HubAcceptedManagedCluster: "True",
              ManagedClusterConditionAvailable: "True",
              ManagedClusterInfoSynced: "True",
              ManagedClusterJoined: "True",
              apigroup: "internal.open-cluster-management.io",
              consoleURL:
                "https://console-openshift-console.apps.fxiang.dev06.red-chesterfield.com",
              cpu: 36,
              created: "2018-08-13T18:17:34Z",
              kind: "cluster",
              kubernetesVersion: "v1.17.1+9d33dd3",
              label:
                "cloud=AWS; environment=Dev; name=fxiang; vendor=OpenShift",
              memory: "144591Mi",
              name: "fxiang",
              nodes: 6,
              _clusterNamespace: "fxiang",
              _rbac:
                "fxiang_internal.open-cluster-management.io_managedclusterinfos",
              _uid: "cluster__fxiang"
            }
          ],
          kind: "cluster",
          __typename: "SearchRelatedResult"
        },
        {
          items: [
            {
              apiversion: "v1",
              cluster: "fxiang",
              container: "mortgage-app-mortgage",
              created: "2018-08-25T16:31:41Z",
              hostIP: "10.0.164.61",
              image: "fxiang/mortgage:0.4.0",
              kind: "pod",
              label: "app=mortgage-app-mortgage; pod-template-hash=55c65b9c8f",
              name: "mortgage-app-deploy-55c65b9c8f-dqclq",
              namespace: "default",
              podIP: "10.128.3.9",
              restarts: 0,
              selfLink:
                "/api/v1/namespaces/default/pods/mortgage-app-deploy-55c65b9c8f-dqclq",
              startedAt: "2018-08-25T16:31:41Z",
              status: "Running",
              _clusterNamespace: "fxiang",
              _rbac: "fxiang_null_pods",
              _uid: "fxiang/88348f1c-de2d-4be7-86c4-c45affaab3b1"
            }
          ],
          kind: "pod",
          __typename: "SearchRelatedResult"
        },
        {
          items: [
            {
              apigroup: "apps.open-cluster-management.io",
              apiversion: "v1",
              cluster: "local-cluster",
              created: "2018-08-26T15:04:26Z",
              kind: "deployable",
              label:
                "apps.open-cluster-management.io/channel-type=GitHub; apps.open-cluster-management.io/channel=mortgage-channel; apps.open-cluster-management.io/subscription=default-mortgage-app-subscription",
              name:
                "mortgage-app-subscription-mortgage-mortgage-app-svc-service",
              namespace: "default",
              selfLink:
                "/apis/apps.open-cluster-management.io/v1/namespaces/default/deployables/mortgage-app-subscription-mortgage-mortgage-app-svc-service",
              _hubClusterResource: "true",
              _rbac: "default_apps.open-cluster-management.io_deployables",
              _uid: "local-cluster/bb8cea4d-e06c-490c-8d53-629203b4f2a0"
            },
            {
              apigroup: "apps.open-cluster-management.io",
              apiversion: "v1",
              cluster: "local-cluster",
              created: "2018-08-26T15:04:26Z",
              kind: "deployable",
              label:
                "apps.open-cluster-management.io/channel-type=GitHub; apps.open-cluster-management.io/channel=mortgage-channel; apps.open-cluster-management.io/subscription=default-mortgage-app-subscription",
              name:
                "mortgage-app-subscription-mortgage-mortgage-app-deploy-deployment",
              namespace: "default",
              selfLink:
                "/apis/apps.open-cluster-management.io/v1/namespaces/default/deployables/mortgage-app-subscription-mortgage-mortgage-app-deploy-deployment",
              _hubClusterResource: "true",
              _rbac: "default_apps.open-cluster-management.io_deployables",
              _uid: "local-cluster/5c164372-0ec3-489c-b0fa-677a4d2564ef"
            }
          ],
          kind: "deployable",
          __typename: "SearchRelatedResult"
        },
        {
          items: [
            {
              apigroup: "apps",
              apiversion: "v1",
              available: 1,
              cluster: "fxiang",
              created: "2018-08-25T16:31:41Z",
              current: 1,
              desired: 1,
              kind: "deployment",
              label: "app=mortgage-app-mortgage",
              name: "mortgage-app-deploy",
              namespace: "default",
              ready: 1,
              selfLink:
                "/apis/apps/v1/namespaces/default/deployments/mortgage-app-deploy",
              _clusterNamespace: "fxiang",
              _hostingDeployable:
                "mortgage-ch/mortgage-channel-Deployment-mortgage-app-deploy",
              _hostingSubscription: "default/mortgage-app-subscription",
              _rbac: "fxiang_apps_deployments",
              _uid: "fxiang/59ec5165-1924-4b05-ac35-70d38d367c13"
            }
          ],
          kind: "deployment",
          __typename: "SearchRelatedResult"
        },
        {
          items: [
            {
              apiversion: "v1",
              cluster: "fxiang",
              clusterIP: "172.30.95.86",
              created: "2018-08-25T16:31:46Z",
              kind: "service",
              label: "app=mortgage-app-mortgage",
              name: "mortgage-app-svc",
              namespace: "default",
              port: "9080:30240/TCP",
              selfLink: "/api/v1/namespaces/default/services/mortgage-app-svc",
              type: "NodePort",
              _clusterNamespace: "fxiang",
              _hostingDeployable:
                "mortgage-ch/mortgage-channel-Service-mortgage-app-svc",
              _hostingSubscription: "default/mortgage-app-subscription",
              _rbac: "fxiang_null_services",
              _uid: "fxiang/27be449b-e536-4c6a-8b52-0cc42f21cd15"
            }
          ],
          kind: "service",
          __typename: "SearchRelatedResult"
        },
        {
          items: [
            {
              apigroup: "apps",
              apiversion: "v1",
              cluster: "fxiang",
              created: "2020-08-25T16:31:41Z",
              current: 1,
              desired: 1,
              kind: "replicaset",
              label: "app=mortgage-app-mortgage; pod-template-hash=55c65b9c8f",
              name: "mortgage-app-deploy-55c65b9c8f",
              namespace: "default",
              selfLink:
                "/apis/apps/v1/namespaces/default/replicasets/mortgage-app-deploy-55c65b9c8f",
              _clusterNamespace: "fxiang",
              _hostingDeployable:
                "mortgage-ch/mortgage-channel-Deployment-mortgage-app-deploy",
              _hostingSubscription: "default/mortgage-app-subscription",
              _rbac: "fxiang_apps_replicasets",
              _uid: "fxiang/9fab09f8-127a-4edc-a01a-1a6adc01d34a"
            }
          ],
          kind: "replicaset",
          __typename: "SearchRelatedResult"
        },
        {
          items: [
            {
              apigroup: "apps.open-cluster-management.io",
              apiversion: "v1",
              cluster: "local-cluster",
              created: "2018-08-13T19:23:00Z",
              kind: "channel",
              name: "mortgage-channel",
              namespace: "mortgage-ch",
              pathname: "https://github.com/fxiang1/app-samples.git",
              selfLink:
                "/apis/apps.open-cluster-management.io/v1/namespaces/mortgage-ch/channels/mortgage-channel",
              type: "GitHub",
              _hubClusterResource: "true",
              _rbac: "mortgage-ch_apps.open-cluster-management.io_channels",
              _uid: "local-cluster/54bb2ff5-7545-49fa-9020-6ea14b47f346"
            },
            {
              apigroup: "apps.open-cluster-management.io",
              apiversion: "v1",
              cluster: "fxiang",
              created: "2020-08-25T15:52:19Z",
              kind: "channel",
              name: "mortgage-channel",
              namespace: "mortgage-ch",
              pathname: "https://github.com/fxiang1/app-samples.git",
              selfLink:
                "/apis/apps.open-cluster-management.io/v1/namespaces/mortgage-ch/channels/mortgage-channel",
              type: "GitHub",
              _clusterNamespace: "fxiang",
              _rbac: "fxiang_apps.open-cluster-management.io_channels",
              _uid: "fxiang/5effe27c-4ca2-4508-9051-e2a0a1e77358"
            }
          ],
          kind: "channel",
          __typename: "SearchRelatedResult"
        },
        {
          items: [
            {
              apigroup: "apps.open-cluster-management.io",
              apiversion: "v1",
              channel: "mortgage-ch/mortgage-channel",
              cluster: "local-cluster",
              created: "2018-08-13T19:23:01Z",
              kind: "subscription",
              label: "app=mortgage-app-mortgage",
              name: "mortgage-app-subscription",
              namespace: "default",
              selfLink:
                "/apis/apps.open-cluster-management.io/v1/namespaces/default/subscriptions/mortgage-app-subscription",
              status: "Propagated",
              _gitcommit: "0660bd66c02d09a4c8813d3ae2e711fc98b6426b",
              _hubClusterResource: "true",
              _rbac: "default_apps.open-cluster-management.io_subscriptions",
              _uid: "local-cluster/e5a9d3e2-a5df-43de-900c-c15a2079f760"
            },
            {
              apigroup: "apps.open-cluster-management.io",
              apiversion: "v1",
              channel: "mortgage-ch/mortgage-channel",
              cluster: "fxiang",
              created: "2020-08-13T19:24:02Z",
              kind: "subscription",
              label:
                "app=mortgage-app-mortgage; hosting-deployable-name=mortgage-app-subscription-deployable; subscription-pause=false",
              name: "mortgage-app-subscription",
              namespace: "default",
              selfLink:
                "/apis/apps.open-cluster-management.io/v1/namespaces/default/subscriptions/mortgage-app-subscription",
              status: "Subscribed",
              _clusterNamespace: "fxiang",
              _gitbranch: "master",
              _gitpath: "mortgage",
              _hostingDeployable:
                "fxiang/mortgage-app-subscription-deployable-th2bj",
              _hostingSubscription: "default/mortgage-app-subscription",
              _rbac: "fxiang_apps.open-cluster-management.io_subscriptions",
              _uid: "fxiang/4125419b-0b70-4e4b-8c94-b8b23c166410"
            }
          ],
          kind: "subscription",
          __typename: "SearchRelatedResult"
        },
        {
          items: [
            {
              apigroup: "apps.open-cluster-management.io",
              apiversion: "v1",
              cluster: "local-cluster",
              created: "2018-08-13T19:23:00Z",
              kind: "placementrule",
              label: "app=mortgage-app-mortgage",
              name: "mortgage-app-placement",
              namespace: "default",
              replicas: 1,
              selfLink:
                "/apis/apps.open-cluster-management.io/v1/namespaces/default/placementrules/mortgage-app-placement",
              _hubClusterResource: "true",
              _rbac: "default_apps.open-cluster-management.io_placementrules",
              _uid: "local-cluster/0533baf0-e272-4db6-ae00-b99f1d4e2e1c"
            }
          ],
          kind: "placementrule",
          __typename: "SearchRelatedResult"
        }
      ],
      selfLink:
        "/apis/app.k8s.io/v1beta1/namespaces/default/applications/mortgage-app",
      _hubClusterResource: "true",
      _rbac: "default_app.k8s.io_applications",
      _uid: "local-cluster/dc9499ab-d23f-4dac-ba9d-9232218a383f"
    }
  ],
  itemsPerPage: 20,
  page: 1,
  pendingActions: [],
  postErrorMsg: "",
  putErrorMsg: "",
  resourceVersion: undefined,
  search: "",
  sortDirection: "asc",
  status: "DONE"
};

export const QueryApplicationList_INCEPTION = {
  status: "INCEPTION",
  itemsPerPage: 20,
  page: 1,
  search: "aa",
  sortDirection: "asc",
  sortColumn: "name",
  items: []
};
export const HCMChannelList = {
  status: "DONE",
  items: [
    {
      kind: "channel",
      name: "mortgage-channel",
      namespace: "default",
      selfLink:
        "/apis/app.ibm.com/v1alpha1/namespaces/default/channels/mortgage-channel",
      created: "2020-02-18T23:56:15Z",
      cluster: "local-cluster",
      apigroup: "app.ibm.com",
      apiversion: "v1alpha1",
      _rbac: "default_app.ibm.com_channels",
      _hubClusterResource: "true",
      _uid: "local-cluster/3fc2a87a-52aa-11ea-bf05-00000a102d26",
      pathname: "default",
      label:
        "app=mortgage-channel-mortgage; chart=mortgage-channel-1.0.0; heritage=Tiller; release=mortgage-channel",
      type: "Namespace",
      data: {},
      related: [
        {
          kind: "subscription",
          items: [
            {
              kind: "subscription",
              name: "mortgage-app-subscription",
              namespace: "default",
              status: "Propagated",
              selfLink:
                "/apis/app.ibm.com/v1alpha1/namespaces/default/subscriptions/mortgage-app-subscription",
              created: "2018-02-18T23:57:04Z",
              cluster: "local-cluster",
              channel: "default/mortgage-channel",
              apigroup: "app.ibm.com",
              apiversion: "v1alpha1",
              _rbac: "default_app.ibm.com_subscriptions",
              _hubClusterResource: "true",
              _uid: "local-cluster/5cdc0d8d-52aa-11ea-bf05-00000a102d26",
              packageFilterVersion: ">=1.x",
              label:
                "app=mortgage-app-mortgage; chart=mortgage-1.0.3; heritage=Tiller; release=mortgage-app"
            },
            {
              kind: "subscription",
              name: "orphan",
              namespace: "default",
              status: "Propagated",
              selfLink:
                "/apis/app.ibm.com/v1alpha1/namespaces/default/subscriptions/mortgage-app-subscription",
              created: "2018-02-18T23:57:04Z",
              cluster: "local-cluster",
              channel: "default/mortgage-channel",
              apigroup: "app.ibm.com",
              apiversion: "v1alpha1",
              _rbac: "default_app.ibm.com_subscriptions",
              _hubClusterResource: "true",
              _uid: "local-cluster/5cdc0d8d-52aa-11ea-bf05-00000a102d26orphan",
              packageFilterVersion: ">=1.x",
              label:
                "app=mortgage-app-mortgage; chart=mortgage-1.0.3; heritage=Tiller; release=mortgage-app"
            }
          ],
          __typename: "SearchRelatedResult"
        }
      ]
    },
    {
      kind: "channel",
      name: "hub-local-helm-repo",
      namespace: "default",
      selfLink:
        "/apis/app.ibm.com/v1alpha1/namespaces/default/channels/hub-local-helm-repo",
      created: "2020-02-19T01:38:29Z",
      cluster: "local-cluster",
      apigroup: "app.ibm.com",
      apiversion: "v1alpha1",
      _rbac: "default_app.ibm.com_channels",
      _hubClusterResource: "true",
      _uid: "local-cluster/87f95c96-52b8-11ea-bf05-00000a102d26",
      pathname: "https://localhost:8443/helm-repo/charts",
      type: "HelmRepo",
      related: [
        {
          kind: "subscription",
          items: [
            {
              kind: "subscription",
              name: "guestbook-subscription",
              namespace: "kube-system",
              status: "Propagated",
              selfLink:
                "/apis/app.ibm.com/v1alpha1/namespaces/kube-system/subscriptions/guestbook-subscription",
              created: "2020-02-19T01:38:58Z",
              cluster: "local-cluster",
              channel: "default/hub-local-helm-repo",
              apigroup: "app.ibm.com",
              apiversion: "v1alpha1",
              _rbac: "kube-system_app.ibm.com_subscriptions",
              _hubClusterResource: "true",
              _uid: "local-cluster/98dce449-52b8-11ea-bf05-00000a102d26",
              package: "gbapp",
              packageFilterVersion: "0.1.0",
              label: "app=subscribed-guestbook-application"
            }
          ],
          __typename: "SearchRelatedResult"
        }
      ]
    },
    {
      kind: "channel",
      name: "guestbook",
      namespace: "gbook-ch",
      selfLink:
        "/apis/app.ibm.com/v1alpha1/namespaces/gbook-ch/channels/guestbook",
      created: "2020-02-19T01:43:38Z",
      cluster: "local-cluster",
      apigroup: "app.ibm.com",
      apiversion: "v1alpha1",
      _rbac: "gbook-ch_app.ibm.com_channels",
      _hubClusterResource: "true",
      _uid: "local-cluster/4019f8d8-52b9-11ea-bf05-00000a102d26",
      pathname: "gbook-ch",
      label: "app=gbchn; chart=gbchn-0.1.0; heritage=Tiller; release=guestbook",
      type: "Namespace",
      related: [
        {
          kind: "subscription",
          items: [
            {
              kind: "subscription",
              name: "samplebook-gbapp-guestbook",
              namespace: "sample",
              status: "Propagated",
              selfLink:
                "/apis/app.ibm.com/v1alpha1/namespaces/sample/subscriptions/samplebook-gbapp-guestbook",
              created: "2018-02-19T01:43:43Z",
              cluster: "local-cluster",
              channel: "gbook-ch/guestbook",
              apigroup: "app.ibm.com",
              apiversion: "v1alpha1",
              _rbac: "sample_app.ibm.com_subscriptions",
              _hubClusterResource: "true",
              _uid: "local-cluster/42d9ec27-52b9-11ea-bf05-00000a102d26",
              label:
                "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=samplebook"
            }
          ]
        }
      ]
    }
  ]
};

export const HCMChannelListEmpty = {
  status: "DONE",
  items: []
};

export const HCMApplication = {
  name: "samplebook-gbapp",
  namespace: "sample",
  dashboard:
    "localhost/grafana/dashboard/db/samplebook-gbapp-dashboard-via-federated-prometheus?namespace=sample",
  selfLink:
    "/apis/app.k8s.io/v1beta1/namespaces/sample/applications/samplebook-gbapp",
  _uid: "local-cluster/42d4c013-52b9-11ea-bf05-00000a102d26",
  created: "2018-02-19T01:43:43Z",
  apigroup: "app.k8s.io",
  cluster: "local-cluster",
  kind: "application",
  label: "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=samplebook",
  _hubClusterResource: "true",
  _rbac: "sample_app.k8s.io_applications"
};

export const HCMChannel = {
  name: "samplebook-gbapp",
  namespace: "sample",
  dashboard:
    "localhost/grafana/dashboard/db/samplebook-gbapp-dashboard-via-federated-prometheus?namespace=sample",
  selfLink:
    "/apis/app.k8s.io/v1beta1/namespaces/sample/applications/samplebook-gbapp",
  _uid: "local-cluster/42d4c013-52b9-11ea-bf05-00000a102d26",
  created: "2018-02-19T01:43:43Z",
  apigroup: "app.k8s.io",
  cluster: "local-cluster",
  kind: "channel",
  label: "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=samplebook",
  _hubClusterResource: "true",
  _rbac: "sample_app.k8s.io_applications"
};

export const HCMApplicationList = {
  forceReload: false,
  items: [
    {
      apigroup: "app.k8s.io",
      cluster: "local-cluster",
      created: "2018-08-13T19:23:00Z",
      dashboard: "",
      kind: "application",
      label: "",
      name: "mortgage-app",
      namespace: "default",
      related: [
        {
          items: [
            {
              kind: "cluster",
              kubernetesVersion: "",
              name: "local-cluster",
              status: "OK"
            }
          ],
          kind: "cluster",
          __typename: "SearchRelatedResult"
        },
        {
          items: [
            {
              apigroup: "apps.open-cluster-management.io",
              apiversion: "v1",
              channel: "mortgage-ch/mortgage-channel",
              cluster: "local-cluster",
              created: "2018-08-13T19:23:01Z",
              kind: "subscription",
              label: "app=mortgage-app-mortgage",
              name: "mortgage-app-subscription",
              namespace: "default",
              selfLink:
                "/apis/apps.open-cluster-management.io/v1/namespaces/default/subscriptions/mortgage-app-subscription",
              status: "Propagated",
              _gitcommit: "0660bd66c02d09a4c8813d3ae2e711fc98b6426b",
              _hubClusterResource: "true",
              _rbac: "default_apps.open-cluster-management.io_subscriptions",
              _uid: "local-cluster/e5a9d3e2-a5df-43de-900c-c15a2079f760"
            }
          ],
          kind: "subscription",
          __typename: "SearchRelatedResult"
        },
        {
          items: [
            {
              apigroup: "apps.open-cluster-management.io",
              apiversion: "v1",
              cluster: "local-cluster",
              created: "2020-08-15T09:11:11Z",
              kind: "deployable",
              label:
                "apps.open-cluster-management.io/channel-type=GitHub; apps.open-cluster-management.io/channel=mortgage-channel; apps.open-cluster-management.io/subscription=default-mortgage-app-subscription",
              name:
                "mortgage-app-subscription-mortgage-mortgage-app-svc-service",
              namespace: "default",
              selfLink:
                "/apis/apps.open-cluster-management.io/v1/namespaces/default/deployables/mortgage-app-subscription-mortgage-mortgage-app-svc-service",
              _hubClusterResource: "true",
              _rbac: "default_apps.open-cluster-management.io_deployables",
              _uid: "local-cluster/96551002-3e14-41fc-ad28-3912b51dd958"
            },
            {
              apigroup: "apps.open-cluster-management.io",
              apiversion: "v1",
              cluster: "local-cluster",
              created: "2020-08-15T09:11:11Z",
              kind: "deployable",
              label:
                "apps.open-cluster-management.io/channel-type=GitHub; apps.open-cluster-management.io/channel=mortgage-channel; apps.open-cluster-management.io/subscription=default-mortgage-app-subscription",
              name:
                "mortgage-app-subscription-mortgage-mortgage-app-deploy-deployment",
              namespace: "default",
              selfLink:
                "/apis/apps.open-cluster-management.io/v1/namespaces/default/deployables/mortgage-app-subscription-mortgage-mortgage-app-deploy-deployment",
              _hubClusterResource: "true",
              _rbac: "default_apps.open-cluster-management.io_deployables",
              _uid: "local-cluster/c2e1cc72-3ae9-4b4a-acaa-e87ca5247a73"
            }
          ],
          kind: "deployable",
          __typename: "SearchRelatedResult"
        },
        {
          items: [
            {
              apigroup: "apps.open-cluster-management.io",
              apiversion: "v1",
              cluster: "local-cluster",
              created: "2018-08-13T19:23:00Z",
              kind: "placementrule",
              label: "app=mortgage-app-mortgage",
              name: "mortgage-app-placement",
              namespace: "default",
              selfLink:
                "/apis/apps.open-cluster-management.io/v1/namespaces/default/placementrules/mortgage-app-placement",
              _hubClusterResource: "true",
              _rbac: "default_apps.open-cluster-management.io_placementrules",
              _uid: "local-cluster/0533baf0-e272-4db6-ae00-b99f1d4e2e1c"
            }
          ],
          kind: "placementrule",
          __typename: "SearchRelatedResult"
        },
        {
          items: [
            {
              apigroup: "apps.open-cluster-management.io",
              apiversion: "v1",
              cluster: "local-cluster",
              created: "2018-08-13T19:23:00Z",
              kind: "channel",
              name: "mortgage-channel",
              namespace: "mortgage-ch",
              pathname: "https://github.com/fxiang1/app-samples.git",
              selfLink:
                "/apis/apps.open-cluster-management.io/v1/namespaces/mortgage-ch/channels/mortgage-channel",
              type: "GitHub",
              _hubClusterResource: "true",
              _rbac: "mortgage-ch_apps.open-cluster-management.io_channels",
              _uid: "local-cluster/54bb2ff5-7545-49fa-9020-6ea14b47f346"
            }
          ],
          kind: "channel",
          __typename: "SearchRelatedResult"
        }
      ],
      selfLink:
        "/apis/app.k8s.io/v1beta1/namespaces/default/applications/mortgage-app",
      _hubClusterResource: "true",
      _rbac: "default_app.k8s.io_applications",
      _uid: "local-cluster/dc9499ab-d23f-4dac-ba9d-9232218a383f"
    }
  ],
  itemsPerPage: 20,
  page: 1,
  pendingActions: [],
  postErrorMsg: "",
  putErrorMsg: "",
  resourceVersion: undefined,
  search: "",
  sortDirection: "asc",
  status: "DONE"
};

export const HCMSubscriptionList = {
  status: "DONE",
  items: [
    {
      kind: "subscription",
      name: "orphan",
      namespace: "default",
      status: "Propagated",
      selfLink:
        "/apis/app.ibm.com/v1alpha1/namespaces/default/subscriptions/mortgage-app-subscription",
      created: "2018-02-18T23:57:04Z",
      cluster: "local-cluster",
      channel: "default/mortgage-channel",
      apigroup: "app.ibm.com",
      apiversion: "v1alpha1",
      _rbac: "default_app.ibm.com_subscriptions",
      _hubClusterResource: "true",
      _uid: "local-cluster/5cdc0d8d-52aa-11ea-bf05-00000a102d26orphan",
      packageFilterVersion: ">=1.x",
      label:
        "app=mortgage-app-mortgage; chart=mortgage-1.0.3; heritage=Tiller; release=mortgage-app",
      related: []
    },
    {
      kind: "subscription",
      name: "mortgage-app-subscription",
      namespace: "default",
      status: "Propagated",
      selfLink:
        "/apis/app.ibm.com/v1alpha1/namespaces/default/subscriptions/mortgage-app-subscription",
      created: "2018-02-18T23:57:04Z",
      cluster: "local-cluster",
      channel: "default/mortgage-channel",
      apigroup: "app.ibm.com",
      apiversion: "v1alpha1",
      _rbac: "default_app.ibm.com_subscriptions",
      _hubClusterResource: "true",
      _uid: "local-cluster/5cdc0d8d-52aa-11ea-bf05-00000a102d26",
      packageFilterVersion: ">=1.x",
      label:
        "app=mortgage-app-mortgage; chart=mortgage-1.0.3; heritage=Tiller; release=mortgage-app",
      related: [
        {
          kind: "placementrule",
          items: [
            {
              kind: "placementrule",
              name: "guestbook-placementrule",
              namespace: "kube-system",
              selfLink:
                "/apis/app.ibm.com/v1alpha1/namespaces/kube-system/placementrules/guestbook-placementrule",
              created: "2020-02-11T23:26:17Z",
              cluster: "local-cluster",
              apigroup: "app.ibm.com",
              apiversion: "v1alpha1",
              _rbac: "kube-system_app.ibm.com_placementrules",
              _hubClusterResource: "true",
              _uid: "local-cluster/e72e6c06-4d25-11ea-a229-00000a102d26",
              label: "app=subscribed-guestbook-application"
            }
          ],
          __typename: "SearchRelatedResult"
        },
        {
          kind: "application",
          items: [
            {
              kind: "application",
              name: "samplebook-gbapp",
              namespace: "sample",
              dashboard:
                "localhost/grafana/dashboard/db/samplebook-gbapp-dashboard-via-federated-prometheus?namespace=sample",
              selfLink:
                "/apis/app.k8s.io/v1beta1/namespaces/sample/applications/samplebook-gbapp",
              _uid: "local-cluster/96218695-3798-4dac-b3d3-179fb86b6715",
              created: "2018-02-19T01:43:43Z",
              apigroup: "app.k8s.io",
              cluster: "local-cluster",
              kind: "application",
              label:
                "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=samplebook",
              _hubClusterResource: "true",
              _rbac: "sample_app.k8s.io_applications"
            }
          ]
        },
        {
          kind: "deployable",
          items: [
            {
              kind: "deployable",
              name: "mortgage-app-subscription-deployable",
              namespace: "default",
              status: "Propagated",
              selfLink:
                "/apis/app.ibm.com/v1alpha1/namespaces/default/deployables/mortgage-app-subscription-deployable",
              created: "2018-02-18T23:57:04Z",
              cluster: "local-cluster",
              apigroup: "app.ibm.com",
              apiversion: "v1alpha1",
              _rbac: "default_app.ibm.com_deployables",
              _hubClusterResource: "true",
              _uid: "local-cluster/e2a1af5a-1830-46d3-ac8d-b481ecf6726b"
            },
            {
              kind: "deployable",
              name: "mortgage-app-subscription-deployable2",
              namespace: "default",
              status: "Propagated",
              selfLink:
                "/apis/app.ibm.com/v1alpha1/namespaces/default/deployables/mortgage-app-subscription-deployable",
              created: "2018-02-18T23:57:04Z",
              cluster: "local-cluster",
              apigroup: "app.ibm.com",
              apiversion: "v1alpha1",
              _rbac: "default_app.ibm.com_deployables",
              _hubClusterResource: "true",
              _uid: "local-cluster/e2a1af5a-1830-46d3-ac8d-b481ecf6726b"
            },
            {
              kind: "deployable",
              name: "mortgage-app-subscription-deployable3",
              namespace: "default",
              status: "Propagated",
              selfLink:
                "/apis/app.ibm.com/v1alpha1/namespaces/default/deployables/mortgage-app-subscription-deployable",
              created: "2018-02-18T23:57:04Z",
              cluster: "local-cluster",
              apigroup: "app.ibm.com",
              apiversion: "v1alpha1",
              _rbac: "default_app.ibm.com_deployables",
              _hubClusterResource: "true",
              _uid: "local-cluster/e2a1af5a-1830-46d3-ac8d-b481ecf6726b"
            },
            {
              kind: "deployable",
              name: "mortgage-app-subscription-deployable4",
              namespace: "default",
              status: "Propagated",
              selfLink:
                "/apis/app.ibm.com/v1alpha1/namespaces/default/deployables/mortgage-app-subscription-deployable",
              created: "2018-02-18T23:57:04Z",
              cluster: "local-cluster",
              apigroup: "app.ibm.com",
              apiversion: "v1alpha1",
              _rbac: "default_app.ibm.com_deployables",
              _hubClusterResource: "true",
              _uid: "local-cluster/e2a1af5a-1830-46d3-ac8d-b481ecf6726b"
            },
            {
              kind: "deployable",
              name: "mortgage-app-subscription-deployable5",
              namespace: "default",
              status: "Propagated",
              selfLink:
                "/apis/app.ibm.com/v1alpha1/namespaces/default/deployables/mortgage-app-subscription-deployable",
              created: "2018-02-18T23:57:04Z",
              cluster: "local-cluster",
              apigroup: "app.ibm.com",
              apiversion: "v1alpha1",
              _rbac: "default_app.ibm.com_deployables",
              _hubClusterResource: "true",
              _uid: "local-cluster/e2a1af5a-1830-46d3-ac8d-b481ecf6726b"
            },
            {
              kind: "deployable",
              name: "mortgage-app-subscription-deployable6",
              namespace: "default",
              status: "Propagated",
              selfLink:
                "/apis/app.ibm.com/v1alpha1/namespaces/default/deployables/mortgage-app-subscription-deployable",
              created: "2018-02-18T23:57:04Z",
              cluster: "local-cluster",
              apigroup: "app.ibm.com",
              apiversion: "v1alpha1",
              _rbac: "default_app.ibm.com_deployables",
              _hubClusterResource: "true",
              _uid: "local-cluster/e2a1af5a-1830-46d3-ac8d-b481ecf6726b"
            },
            {
              kind: "deployable",
              name: "mortgage-app-subscription-deployable7",
              namespace: "default",
              status: "Propagated",
              selfLink:
                "/apis/app.ibm.com/v1alpha1/namespaces/default/deployables/mortgage-app-subscription-deployable",
              created: "2018-02-18T23:57:04Z",
              cluster: "local-cluster",
              apigroup: "app.ibm.com",
              apiversion: "v1alpha1",
              _rbac: "default_app.ibm.com_deployables",
              _hubClusterResource: "true",
              _uid: "local-cluster/e2a1af5a-1830-46d3-ac8d-b481ecf6726b"
            }
          ]
        }
      ]
    },
    {
      kind: "subscription",
      name: "guestbook-subscription",
      namespace: "kube-system",
      status: "Propagated",
      selfLink:
        "/apis/app.ibm.com/v1alpha1/namespaces/kube-system/subscriptions/guestbook-subscription",
      created: "2020-02-19T01:38:58Z",
      cluster: "local-cluster",
      channel: "default/hub-local-helm-repo",
      apigroup: "app.ibm.com",
      apiversion: "v1alpha1",
      _rbac: "kube-system_app.ibm.com_subscriptions",
      _hubClusterResource: "true",
      _uid: "local-cluster/98dce449-52b8-11ea-bf05-00000a102d26gbook",
      package: "gbapp",
      packageFilterVersion: "0.1.0",
      label: "app=subscribed-guestbook-application",
      related: [
        {
          kind: "deployable",
          items: [
            {
              kind: "deployable",
              name: "guestbook-subscription-deployable",
              namespace: "kube-system",
              status: "Propagated",
              selfLink:
                "/apis/app.ibm.com/v1alpha1/namespaces/kube-system/deployables/guestbook-subscription-deployable",
              created: "2020-02-19T01:38:58Z",
              cluster: "local-cluster",
              apigroup: "app.ibm.com",
              apiversion: "v1alpha1",
              _rbac: "kube-system_app.ibm.com_deployables",
              _hubClusterResource: "true",
              _uid: "local-cluster/98df502a-52b8-11ea-bf05-00000a102d26"
            }
          ],
          __typename: "SearchRelatedResult"
        },
        {
          kind: "placementrule",
          items: [
            {
              kind: "placementrule",
              name: "guestbook-placementrule",
              namespace: "kube-system",
              selfLink:
                "/apis/app.ibm.com/v1alpha1/namespaces/kube-system/placementrules/guestbook-placementrule",
              created: "2020-02-11T23:26:17Z",
              cluster: "local-cluster",
              apigroup: "app.ibm.com",
              apiversion: "v1alpha1",
              _rbac: "kube-system_app.ibm.com_placementrules",
              _hubClusterResource: "true",
              _uid: "local-cluster/e72e6c06-4d25-11ea-a229-00000a102d26",
              label: "app=subscribed-guestbook-application"
            }
          ],
          __typename: "SearchRelatedResult"
        }
      ]
    }
  ]
};

export const HCMPlacementRuleList = {
  items: [],
  itemsPerPage: 20,
  page: 1,
  search: "",
  sortDirection: "asc",
  status: "INCEPTION",
  putErrorMsg: "",
  postErrorMsg: "",
  pendingActions: [],
  forceReload: false
};

export const GlobalApplicationDataList = {
  status: "DONE",
  items: {
    clusterCount: 2
  }
};

export const topology = {
  activeFilters: {
    application: {
      channel: "__ALL__/__ALL__//__ALL__/__ALL__",
      name: "mortgage-app",
      namespace: "default"
    }
  },
  availableFilters: {
    clusters: [],
    labels: [],
    namespaces: [],
    types: []
  },
  detailsLoaded: true,
  detailsReloading: false,
  diagramFilters: [],
  fetchFilters: {
    application: {
      channel: "__ALL__/__ALL__//__ALL__/__ALL__",
      name: "mortgage-app",
      namespace: "default"
    }
  },
  links: [
    {
      from: { uid: "application--mortgage-app", __typename: "Resource" },
      specs: { isDesign: true },
      to: {
        uid: "member--subscription--default--mortgage-app-subscription",
        __typename: "Resource"
      },
      type: "",
      __typename: "Relationship"
    },
    {
      from: {
        uid: "member--subscription--default--mortgage-app-subscription",
        __typename: "Resource"
      },
      specs: { isDesign: true },
      to: {
        uid: "member--rules--default--mortgage-app-placement--0",
        __typename: "Resource"
      },
      type: "uses",
      __typename: "Relationship"
    },
    {
      from: {
        uid: "member--subscription--default--mortgage-app-subscription",
        __typename: "Resource"
      },
      specs: { isDesign: true },
      to: { uid: "member--clusters--fxiang", __typename: "Resource" },
      type: "",
      __typename: "Relationship"
    },
    {
      from: { uid: "member--clusters--fxiang", __typename: "Resource" },
      specs: null,
      to: {
        uid:
          "member--member--deployable--member--clusters--fxia…rtgage-app-svc-service--service--mortgage-app-svc",
        __typename: "Resource"
      },
      type: "",
      __typename: "Relationship"
    },
    {
      from: { uid: "member--clusters--fxiang", __typename: "Resource" },
      specs: null,
      to: {
        uid:
          "member--member--deployable--member--clusters--fxia…eploy-deployment--deployment--mortgage-app-deploy",
        __typename: "Resource"
      },
      type: "",
      __typename: "Relationship"
    },
    {
      from: {
        uid:
          "member--member--deployable--member--clusters--fxia…eploy-deployment--deployment--mortgage-app-deploy",
        __typename: "Resource"
      },
      specs: null,
      to: {
        uid:
          "member--member--deployable--member--clusters--fxiang--replicaset--mortgage-app-deploy",
        __typename: "Resource"
      },
      type: "",
      __typename: "Relationship"
    }
  ],
  loaded: true,
  nodes: [
    {
      cluster: null,
      clusterName: null,
      id: "application--mortgage-app",
      labels: null,
      name: "mortgage-app",
      namespace: "default",
      specs: {
        activeChannel: "__ALL__/__ALL__//__ALL__/__ALL__",
        channels: [
          "default/mortgage-app-subscription//mortgage-ch/mortgage-channel"
        ],
        isDesign: true,
        pulse: "green",
        raw: {
          apiVersion: "app.k8s.io/v1beta1",
          kind: "Application",
          metadata: {
            creationTimestamp: "2018-08-13T19:23:00Z",
            generation: 2,
            name: "mortgage-app",
            namespace: "default",
            resourceVersion: "2349939",
            selfLink:
              "/apis/app.k8s.io/v1beta1/namespaces/default/applications/mortgage-app",
            uid: "dc9499ab-d23f-4dac-ba9d-9232218a383f"
          },
          spec: {
            componentKinds: [
              {
                group: "apps.open-cluster-management.io",
                kind: "Subscription"
              }
            ],
            descriptor: {},
            selector: {
              matchExpressions: [
                {
                  key: "app",
                  operator: "In",
                  values: ["mortgage-app-mortgage"]
                }
              ]
            }
          }
        },
        row: 0
      },
      topology: null,
      type: "application",
      uid: "application--mortgage-app",
      __typename: "Resource"
    },
    {
      cluster: null,
      clusterName: null,
      id: "member--subscription--default--mortgage-app-subscription",
      labels: null,
      name: "mortgage-app-subscription",
      namespace: "default",
      specs: {
        hasRules: true,
        isDesign: true,
        isPlaced: true,
        pulse: "yellow",
        raw: {
          apiVersion: "apps.open-cluster-management.io/v1",
          channels: [],
          kind: "Subscription",
          metadata: {
            annotations: {
              "apps.open-cluster-management.io/github-branch": "master",
              "apps.open-cluster-management.io/github-path": "mortgage"
            },
            creationTimestamp: "2018-08-13T19:23:01Z",
            generation: 2,
            name: "mortgage-app-subscription"
          },
          spec: { channel: "mortgage-ch/mortgage-channel" },
          status: {
            lastUpdateTime: "2020-08-15T09:11:11Z",
            phase: "Propagated"
          }
        },
        row: 18
      },
      topology: null,
      type: "subscription",
      uid: "member--subscription--default--mortgage-app-subscription",
      __typename: "Resource"
    },
    {
      cluster: null,
      clusterName: null,
      id: "member--rules--default--mortgage-app-placement--0",
      labels: null,
      name: "mortgage-app-placement",
      namespace: "default",
      specs: {
        isDesign: true,
        pulse: "green",
        raw: {
          apiVersion: "apps.open-cluster-management.io/v1",
          kind: "PlacementRule"
        },
        row: 34
      },
      topology: null,
      type: "placements",
      uid: "member--rules--default--mortgage-app-placement--0",
      __typename: "Resource"
    },
    {
      cluster: null,
      clusterName: null,
      id: "member--clusters--fxiang",
      labels: null,
      name: "fxiang",
      namespace: "",
      specs: {
        cluster: {
          allocatable: { cpu: "33", memory: "137847Mi" },
          capacity: { cpu: "36", memory: "144591Mi" },
          consoleURL:
            "https://console-openshift-console.apps.fxiang.dev06.red-chesterfield.com",
          metadata: {
            creationTimestamp: "2020-08-13T18:17:34Z",
            finalizers: Array(5),
            generation: 1,
            name: "fxiang"
          },
          rawCluster: {
            apiVersion: "cluster.open-cluster-management.io/v1",
            kind: "ManagedCluster"
          },
          rawStatus: {
            apiVersion: "internal.open-cluster-management.io/v1beta1",
            kind: "ManagedClusterInfo"
          },
          status: "ok"
        },
        clusterNames: ["fxiang"],
        clusters: [
          {
            allocatable: { cpu: "33", memory: "137847Mi" },
            capacity: { cpu: "36", memory: "144591Mi" },
            consoleURL:
              "https://console-openshift-console.apps.fxiang.dev06.red-chesterfield.com",
            metadata: {
              creationTimestamp: "2020-08-13T18:17:34Z",
              finalizers: Array(5),
              generation: 1,
              name: "fxiang"
            },
            rawCluster: {
              apiVersion: "cluster.open-cluster-management.io/v1",
              kind: "ManagedCluster"
            },
            rawStatus: {
              apiVersion: "internal.open-cluster-management.io/v1beta1",
              kind: "ManagedClusterInfo"
            },
            status: "ok"
          }
        ],
        pulse: "orange"
      },
      topology: null,
      type: "cluster",
      uid: "member--clusters--fxiang",
      __typename: "Resource"
    },
    {
      cluster: null,
      clusterName: null,
      id:
        "member--member--deployable--member--clusters--fxiang--default--mortgage-app-subscription-mortgage-mortgage-app-svc-service--service--mortgage-app-svc",
      labels: null,
      name: "mortgage-app-svc",
      namespace: "default",
      specs: {
        deployStatuses: [],
        isDesign: false,
        parent: {
          parentId: "member--clusters--fxiang",
          parentName: "fxiang",
          parentType: "cluster"
        },
        pulse: "orange",
        raw: { apiVersion: "v1", kind: "Service" },
        row: 48
      },
      topology: null,
      type: "service",
      uid:
        "member--member--deployable--member--clusters--fxiang--default--mortgage-app-subscription-mortgage-mortgage-app-svc-service--service--mortgage-app-svc",
      __typename: "Resource"
    },
    {
      cluster: null,
      clusterName: null,
      id:
        "member--member--deployable--member--clusters--fxiang--default--mortgage-app-subscription-mortgage-mortgage-app-deploy-deployment--deployment--mortgage-app-deploy",
      labels: null,
      name: "mortgage-app-deploy",
      namespace: "default",
      specs: {
        deployStatuses: [],
        isDesign: false,
        parent: {
          parentId: "member--clusters--fxiang",
          parentName: "fxiang",
          parentType: "cluster"
        },
        pulse: "orange",
        raw: { apiVersion: "apps/v1", kind: "Deployment" },
        row: 63
      },
      topology: null,
      type: "deployment",
      uid:
        "member--member--deployable--member--clusters--fxiang--default--mortgage-app-subscription-mortgage-mortgage-app-deploy-deployment--deployment--mortgage-app-deploy",
      __typename: "Resource"
    },
    {
      cluster: null,
      clusterName: null,
      id:
        "member--member--deployable--member--clusters--fxiang--replicaset--mortgage-app-deploy",
      labels: null,
      name: "mortgage-app-deploy",
      namespace: "default",
      specs: {
        isDesign: false,
        parent: {
          parentId:
            "member--member--deployable--member--clusters--fxia…eploy-deployment--deployment--mortgage-app-deploy",
          parentName: "mortgage-app-deploy",
          parentType: "deployment"
        },
        pulse: "orange",
        raw: { kind: "replicaset" },
        row: 93
      },
      topology: null,
      type: "replicaset",
      uid:
        "member--member--deployable--member--clusters--fxiang--replicaset--mortgage-app-deploy",
      __typename: "Resource"
    }
  ],
  otherTypeFilters: [],
  reloading: false,
  status: "DONE",
  willLoadDetails: false
};

export const channelObjectForEdit = {
  data: {
    items: [
      {
        metadata: {
          resourceVersion: "1487949",
          creationTimestamp: "2020-03-18T20:06:46Z",
          kind: "channel",
          name: "mortgage-channel",
          namespace: "default",
          selfLink:
            "/apis/app.ibm.com/v1alpha1/namespaces/default/channels/mortgage-channel",
          created: "2020-02-18T23:56:15Z",
          cluster: "local-cluster",
          apigroup: "app.ibm.com",
          apiversion: "v1alpha1",
          _rbac: "default_app.ibm.com_channels",
          _hubClusterResource: "true",
          uid: "local-cluster/3fc2a87a-52aa-11ea-bf05-00000a102d26",
          pathname: "default",
          labels: {
            app: "mortgage-channel-mortgage"
          }
        },
        type: "Namespace"
      }
    ]
  }
};

export const subscriptionObjectForEdit = {
  data: {
    items: [
      {
        metadata: {
          resourceVersion: "1487949",
          creationTimestamp: "2020-03-18T20:06:46Z",
          kind: "subscription",
          name: "mortgage-channel-subscr",
          namespace: "default",
          selfLink:
            "/apis/app.ibm.com/v1alpha1/namespaces/default/subscriptions/mortgage-subscr",
          created: "2020-02-18T23:56:15Z",
          cluster: "local-cluster",
          apigroup: "app.ibm.com",
          apiversion: "v1alpha1",
          _rbac: "default_app.ibm.com_channels",
          _hubClusterResource: "true",
          uid: "local-cluster/3fc2a87a-52aa-11ea-bf05-00000a102d26",
          pathname: "default",
          labels: {
            app: "mortgage-channel-mortgage"
          }
        }
      }
    ]
  }
};

export const appObjectForEdit = {
  data: {
    items: [
      {
        metadata: {
          resourceVersion: "1487949",
          creationTimestamp: "2020-03-18T20:06:46Z",
          kind: "application",
          name: "mortgage-channel-subscr",
          namespace: "default",
          selfLink:
            "/apis/app.ibm.com/v1alpha1/namespaces/default/subscriptions/mortgage-subscr",
          created: "2020-02-18T23:56:15Z",
          cluster: "local-cluster",
          apigroup: "app.ibm.com",
          apiversion: "v1alpha1",
          _rbac: "default_app.ibm.com_channels",
          _hubClusterResource: "true",
          uid: "local-cluster/3fc2a87a-52aa-11ea-bf05-00000a102d26",
          pathname: "default",
          labels: {
            app: "mortgage-channel-mortgage"
          }
        }
      }
    ]
  }
};

export const prObjectForEdit = {
  data: {
    items: [
      {
        metadata: {
          resourceVersion: "1487949",
          creationTimestamp: "2020-03-18T20:06:46Z",
          kind: "placementrule",
          name: "mortgage-channel-subscr",
          namespace: "default",
          selfLink:
            "/apis/app.ibm.com/v1alpha1/namespaces/default/subscriptions/mortgage-subscr",
          created: "2020-02-18T23:56:15Z",
          cluster: "local-cluster",
          apigroup: "app.ibm.com",
          apiversion: "v1alpha1",
          _rbac: "default_app.ibm.com_channels",
          _hubClusterResource: "true",
          uid: "local-cluster/3fc2a87a-52aa-11ea-bf05-00000a102d26",
          pathname: "default",
          labels: {
            app: "mortgage-channel-mortgage"
          }
        }
      }
    ]
  }
};

export const AppOverview = {
  selectedAppTab: 0,
  showAppDetails: false,
  showExpandedTopology: false,
  selectedNodeId: "local-cluster/42d4c013-52b9-11ea-bf05-00000a102d26"
};

export const AppOverviewWithCEM = {
  selectedAppTab: 0,
  showAppDetails: false,
  showExpandedTopology: false,
  selectedNodeId: "local-cluster/42d4c013-52b9-11ea-bf05-00000a102d26"
};

export const secondaryHeader = {
  breadcrumbItems: [
    { url: "/multicloud/applications" },
    { url: "/multicloud/applications/default/mortgage-app" }
  ]
};

export const secondaryHeaderAllApps = {
  breadcrumbItems: []
};

export const portals = Object.freeze({
  cancelBtn: "cancel-button-portal-id",
  createBtn: "create-button-portal-id",
  editBtn: "edit-button-portal-id"
});

const VALID_DNS_LABEL = "^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$";
export const controlData = [
  {
    id: "main",
    type: "section",
    note: "creation.view.required.mark"
  },
  {
    name: "creation.app.name",
    tooltip: "tooltip.creation.app.name",
    id: "name",
    type: "text",
    syncWith: "namespace"
  },
  {
    name: "creation.app.namespace",
    tooltip: "tooltip.creation.app.namespace",
    id: "namespace",
    type: "text",
    syncedWith: "name",
    syncedSuffix: "-ns"
  }
];

export const createAppStore = {
  controlData: controlData,
  portals: portals
};

export const reduxStoreAppPipeline = {
  AppDeployments: {
    displaySubscriptionModal: false,
    subscriptionModalHeaderInfo: {
      application: "app",
      deployable: "depp"
    }
  },
  resourceFilters: {
    filters: {},
    selectedFilters: {}
  },
  secondaryHeader: secondaryHeader,
  QueryApplicationList: QueryApplicationList,
  HCMChannelList: HCMChannelList,
  HCMSubscriptionList: HCMSubscriptionList,
  HCMPlacementRuleList: HCMPlacementRuleList,
  GlobalApplicationDataList: GlobalApplicationDataList,
  AppOverview: AppOverview
};

export const reduxStoreAppPipelineWithCEM = {
  AppDeployments: {
    displaySubscriptionModal: false
  },
  resourceFilters: {
    filters: {},
    selectedFilters: {}
  },
  secondaryHeader: secondaryHeader,
  QueryApplicationList: QueryApplicationList,
  QueryApplicationList_singleApp: QueryApplicationList_singleApp,
  HCMApplicationList: HCMApplicationList,
  HCMChannelList: HCMChannelList,
  HCMSubscriptionList: HCMSubscriptionList,
  HCMPlacementRuleList: HCMPlacementRuleList,
  GlobalApplicationDataList: GlobalApplicationDataList,
  AppOverview: AppOverviewWithCEM,
  topology: topology,
  role: {
    role: "ClusterAdministrator"
  }
};

export const reduxStoreAppPipelineWithCEM_Inception = {
  AppDeployments: {
    displaySubscriptionModal: false
  },
  topology: topology,
  resourceFilters: {
    filters: {},
    selectedFilters: {}
  },
  secondaryHeader: secondaryHeader,
  QueryApplicationList: QueryApplicationList_INCEPTION,
  HCMChannelList: HCMChannelList,
  HCMSubscriptionList: HCMSubscriptionList,
  HCMPlacementRuleList: HCMPlacementRuleList,
  GlobalApplicationDataList: GlobalApplicationDataList,
  AppOverview: AppOverviewWithCEM,
  role: {
    role: "ClusterAdministrator"
  }
};

export const reduxStoreAllAppsPipeline = {
  AppDeployments: {
    displaySubscriptionModal: false
  },
  resourceFilters: {
    filters: {},
    selectedFilters: {}
  },
  secondaryHeader: secondaryHeaderAllApps,
  QueryApplicationList: QueryApplicationList,
  HCMChannelList: HCMChannelList,
  HCMSubscriptionList: HCMSubscriptionList,
  HCMPlacementRuleList: HCMPlacementRuleList,
  GlobalApplicationDataList: GlobalApplicationDataList,
  AppOverview: AppOverview
};

export const reduxStoreAllAppsPipelineNoChannels = {
  AppDeployments: {
    displaySubscriptionModal: false
  },
  secondaryHeader: secondaryHeaderAllApps,
  QueryApplicationList: QueryApplicationList,
  HCMChannelList: HCMChannelListEmpty,
  HCMSubscriptionList: HCMSubscriptionList,
  HCMPlacementRuleList: HCMPlacementRuleList,
  GlobalApplicationDataList: GlobalApplicationDataList
};

export const reduxStoreAppPipelineNoChannels = {
  AppDeployments: {
    displaySubscriptionModal: false
  },
  secondaryHeader: secondaryHeader,
  QueryApplicationList: QueryApplicationList,
  HCMChannelList: HCMChannelListEmpty,
  HCMSubscriptionList: HCMSubscriptionList,
  HCMPlacementRuleList: HCMPlacementRuleList,
  GlobalApplicationDataList: GlobalApplicationDataList
};

export const staticResourceData = {
  defaultSortField: "name",
  uriKey: "name",
  primaryKey: "name",
  secondaryKey: "namespace",
  applicationName: {
    resourceKey: "items",
    title: "table.header.applicationName",
    defaultSortField: "name",
    normalizedKey: "name",

    defaultSortField: "name",
    uriKey: "name",
    primaryKey: "name",
    secondaryKey: "namespace",
    tableKeys: [
      {
        msgKey: "table.header.applicationName",
        resourceKey: "name"
      },
      {
        msgKey: "table.header.namespace",
        resourceKey: "namespace"
      },
      {
        msgKey: "table.header.managedClusters",
        resourceKey: "clusters"
      },
      {
        msgKey: "table.header.subscriptions",
        resourceKey: "subscriptions"
      },
      {
        msgKey: "table.header.created",
        resourceKey: "created"
      }
    ],
    tableActions: [
      "table.actions.applications.edit",
      "table.actions.applications.remove"
    ],
    detailKeys: {
      title: "application.details",
      headerRows: ["type", "detail"],
      rows: [
        {
          cells: [
            {
              resourceKey: "description.title.name",
              type: "i18n"
            },
            {
              resourceKey: "name"
            }
          ]
        },
        {
          cells: [
            {
              resourceKey: "description.title.namespace",
              type: "i18n"
            },
            {
              resourceKey: "namespace"
            }
          ]
        },
        {
          cells: [
            {
              resourceKey: "description.title.created",
              type: "i18n"
            },
            {
              resourceKey: "created"
            }
          ]
        },
        {
          cells: [
            {
              resourceKey: "description.title.labels",
              type: "i18n"
            },
            {
              resourceKey: "label"
            }
          ]
        }
      ]
    }
  }
};

export const staticResourceDataApp = {
  defaultSortField: "name",
  uriKey: "name",
  primaryKey: "name",
  secondaryKey: "namespace",

  resourceKey: "items",
  title: "table.header.applicationName",
  defaultSortField: "name",
  normalizedKey: "name",

  defaultSortField: "name",
  uriKey: "name",
  primaryKey: "name",
  secondaryKey: "namespace",
  tableKeys: [
    {
      msgKey: "table.header.applicationName",
      resourceKey: "name"
    },
    {
      msgKey: "table.header.namespace",
      resourceKey: "namespace"
    },
    {
      msgKey: "table.header.managedClusters",
      resourceKey: "clusters"
    },
    {
      msgKey: "table.header.subscriptions",
      resourceKey: "subscriptions"
    },
    {
      msgKey: "table.header.created",
      resourceKey: "created"
    }
  ],
  tableActions: [
    "table.actions.applications.edit",
    "table.actions.applications.remove"
  ],
  detailKeys: {
    title: "application.details",
    headerRows: ["type", "detail"],
    rows: [
      {
        cells: [
          {
            resourceKey: "description.title.name",
            type: "i18n"
          },
          {
            resourceKey: "name"
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: "description.title.namespace",
            type: "i18n"
          },
          {
            resourceKey: "namespace"
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: "description.title.created",
            type: "i18n"
          },
          {
            resourceKey: "created"
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: "description.title.labels",
            type: "i18n"
          },
          {
            resourceKey: "label"
          }
        ]
      }
    ]
  }
};
