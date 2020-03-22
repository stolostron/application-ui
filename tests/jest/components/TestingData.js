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
  isGrafanaRunning: true,
  context: {
    locale: "en-US"
  },
  xsrfToken: "test"
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
      created: "2020-02-18T23:57:04Z",
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
      created: "2020-02-19T01:43:43Z",
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
      created: "2020-02-11T23:26:18Z",
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

export const HCMApplication = {
  name: "samplebook-gbapp",
  namespace: "sample",
  dashboard:
    "localhost/grafana/dashboard/db/samplebook-gbapp-dashboard-via-federated-prometheus?namespace=sample",
  selfLink:
    "/apis/app.k8s.io/v1beta1/namespaces/sample/applications/samplebook-gbapp",
  _uid: "local-cluster/42d4c013-52b9-11ea-bf05-00000a102d26",
  created: "2020-02-19T01:43:43Z",
  apigroup: "app.k8s.io",
  cluster: "local-cluster",
  kind: "application",
  label: "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=samplebook",
  _hubClusterResource: "true",
  _rbac: "sample_app.k8s.io_applications"
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

export const HCMNamespaceList = {
  status: "DONE",
  items: [
    {
      metadata: {
        annotations: {
          "kubectl.kubernetes.io/last-applied-configuration":
            '{"apiVersion":"v1","kind":"Namespace","metadata":{"annotations":{},"name":"ns-sub-1"}}\n',
          "openshift.io/sa.scc.mcs": "s0:c24,c19",
          "openshift.io/sa.scc.supplemental-groups": "1000590000/10000",
          "openshift.io/sa.scc.uid-range": "1000590000/10000",
          accountID: "111111"
        },
        name: "default",
        __typename: "Metadata"
      },
      __typename: "ApplicationNamespace"
    },
    {
      metadata: {
        annotations: {
          "kubectl.kubernetes.io/last-applied-configuration":
            '{"apiVersion":"v1","kind":"Namespace","metadata":{"annotations":{},"name":"ns-sub-1"}}\n',
          "openshift.io/sa.scc.mcs": "s0:c24,c19",
          "openshift.io/sa.scc.supplemental-groups": "1000590000/10000",
          "openshift.io/sa.scc.uid-range": "1000590000/10000",
          accountID: "111111"
        },
        name: "rbac-test",
        __typename: "Metadata"
      },
      __typename: "ApplicationNamespace"
    },
    {
      metadata: {
        annotations: {
          "kubectl.kubernetes.io/last-applied-configuration":
            '{"apiVersion":"v1","kind":"Namespace","metadata":{"annotations":{},"name":"ns-sub-1"}}\n',
          "openshift.io/sa.scc.mcs": "s0:c24,c19",
          "openshift.io/sa.scc.supplemental-groups": "1000590000/10000",
          "openshift.io/sa.scc.uid-range": "1000590000/10000"
        },
        name: "ns-sub-1",
        __typename: "Metadata"
      },
      __typename: "ApplicationNamespace"
    }
  ]
};

export const AppOverview = {
  selectedAppTab: 0,
  showAppDetails: false,
  showExpandedTopology: false,
  showICAMAction: true,
  showGrafanaAction: true,
  showCEMAction: false,
  selectedNodeId: "local-cluster/42d4c013-52b9-11ea-bf05-00000a102d26"
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
  GlobalApplicationDataList: GlobalApplicationDataList,
  AppOverview: AppOverview,
  HCMNamespaceList: HCMNamespaceList
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
  GlobalApplicationDataList: GlobalApplicationDataList,
  AppOverview: AppOverview
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
        },
        {
          cells: [
            {
              resourceKey: "description.title.selector",
              type: "i18n"
            },
            {
              resourceKey: "selector"
            }
          ]
        },
        {
          cells: [
            {
              resourceKey: "description.title.annotations",
              type: "i18n"
            },
            {
              resourceKey: "annotations"
            }
          ]
        },
        {
          cells: [
            {
              resourceKey: "description.title.resource.version",
              type: "i18n"
            },
            {
              resourceKey: "resourceVersion"
            }
          ]
        },
        {
          cells: [
            {
              resourceKey: "description.title.self.link",
              type: "i18n"
            },
            {
              resourceKey: "selfLink"
            }
          ]
        },
        {
          cells: [
            {
              resourceKey: "description.title.uid",
              type: "i18n"
            },
            {
              resourceKey: "_uid"
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
      },
      {
        cells: [
          {
            resourceKey: "description.title.selector",
            type: "i18n"
          },
          {
            resourceKey: "selector"
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: "description.title.annotations",
            type: "i18n"
          },
          {
            resourceKey: "annotations"
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: "description.title.resource.version",
            type: "i18n"
          },
          {
            resourceKey: "resourceVersion"
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: "description.title.self.link",
            type: "i18n"
          },
          {
            resourceKey: "selfLink"
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: "description.title.uid",
            type: "i18n"
          },
          {
            resourceKey: "_uid"
          }
        ]
      }
    ]
  }
};
