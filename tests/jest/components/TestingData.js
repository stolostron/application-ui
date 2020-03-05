/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 ****************************************************************************** */

export const serverProps = {
  isKibanaRunning: true,
  isICAMRunning: true,
  isCEMRunning: true,
  isGrafanaRunning: true
};

export const QueryApplicationList = {
  status: "DONE",
  items: [
    {
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
      created: "2020-02-18T23:57:04Z",
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
          _uid: "local-cluster/42d9ec27-52b9-11ea-bf05-00000a102d26",
          status: "Propagated",
          channel: "gbook-ch/guestbook",
          __typename: "Subscription"
        }
      ],
      created: "2020-02-19T01:43:43Z",
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
          _uid: "local-cluster/98dce449-52b8-11ea-bf05-00000a102d26",
          status: "Propagated",
          channel: "default/hub-local-helm-repo",
          __typename: "Subscription"
        }
      ],
      created: "2020-02-11T23:26:18Z",
      __typename: "Application"
    }
  ]
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
              created: "2020-02-18T23:57:04Z",
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
              created: "2020-02-19T01:43:43Z",
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

export const HCMSubscriptionList = {
  status: "DONE",
  items: [
    {
      kind: "subscription",
      name: "mortgage-app-subscription",
      namespace: "default",
      status: "Propagated",
      selfLink:
        "/apis/app.ibm.com/v1alpha1/namespaces/default/subscriptions/mortgage-app-subscription",
      created: "2020-02-18T23:57:04Z",
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
          kind: "deployable",
          items: [
            {
              kind: "deployable",
              name: "mortgage-app-subscription-deployable",
              namespace: "default",
              status: "Propagated",
              selfLink:
                "/apis/app.ibm.com/v1alpha1/namespaces/default/deployables/mortgage-app-subscription-deployable",
              created: "2020-02-18T23:57:04Z",
              cluster: "local-cluster",
              apigroup: "app.ibm.com",
              apiversion: "v1alpha1",
              _rbac: "default_app.ibm.com_deployables",
              _hubClusterResource: "true",
              _uid: "local-cluster/5cf2709a-52aa-11ea-bf05-00000a102d26"
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
      _uid: "local-cluster/98dce449-52b8-11ea-bf05-00000a102d26",
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

export const GlobalApplicationDataList = {
  status: "DONE",
  items: {
    clusterCount: 2
  }
};

export const namespaceAccountId = "id-mycluster-account";

export const secondaryHeader = {
  breadcrumbItems: [
    { url: "/multicloud/applications" },
    { url: "/multicloud/applications/default/mortgage-app" }
  ]
};

export const secondaryHeaderAllApps = {
  breadcrumbItems: []
};

export const reduxStoreAppPipeline = {
  AppDeployments: {
    displaySubscriptionModal: false
  },
  resourceFilters: {
    filters: {},
    selectedFilters: {}
  },
  secondaryHeader: secondaryHeader,
  namespaceAccountId: namespaceAccountId,
  QueryApplicationList: QueryApplicationList,
  HCMChannelList: HCMChannelList,
  HCMSubscriptionList: HCMSubscriptionList,
  GlobalApplicationDataList: GlobalApplicationDataList
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
  namespaceAccountId: namespaceAccountId,
  QueryApplicationList: QueryApplicationList,
  HCMChannelList: HCMChannelList,
  HCMSubscriptionList: HCMSubscriptionList,
  GlobalApplicationDataList: GlobalApplicationDataList
};

export const reduxStoreAllAppsPipelineNoChannels = {
  AppDeployments: {
    displaySubscriptionModal: false
  },
  secondaryHeader: secondaryHeaderAllApps,
  namespaceAccountId: namespaceAccountId,
  QueryApplicationList: QueryApplicationList,
  HCMChannelList: HCMChannelListEmpty,
  HCMSubscriptionList: HCMSubscriptionList,
  GlobalApplicationDataList: GlobalApplicationDataList
};

export const reduxStoreAppPipelineNoChannels = {
  AppDeployments: {
    displaySubscriptionModal: false
  },
  secondaryHeader: secondaryHeader,
  namespaceAccountId: namespaceAccountId,
  QueryApplicationList: QueryApplicationList,
  HCMChannelList: HCMChannelListEmpty,
  HCMSubscriptionList: HCMSubscriptionList,
  GlobalApplicationDataList: GlobalApplicationDataList
};
