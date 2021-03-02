// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

export const subscriptions = {
  searchResult: [
    {
      items: [
        {
          kind: "subscription",
          name: "cert-manager-sub",
          namespace: "ocm",
          status: "Subscribed",
          selfLink:
            "/apis/apps.open-cluster-management.io/v1/namespaces/ocm/subscriptions/cert-manager-sub/",
          cluster: "local-cluster",
          created: "2020-03-23T14:33:35Z",
          channel: "ocm/charts-v1",
          _hubClusterResource: "true",
          _rbac: "ocm_apps.open-cluster-management.io_subscriptions",
          _uid: "local-cluster/997f0f30-b5a1-4a6c-825d-c9f167204fc3",
          apiversion: "v1",
          apigroup: "apps.open-cluster-management.io",
          package: "cert-manager"
        }
      ]
    },
    {
      items: [
        {
          kind: "subscription",
          name: "cert-manager-sub",
          namespace: "ocm",
          status: "Propagated",
          selfLink:
            "/apis/apps.open-cluster-management.io/v1/namespaces/ocm/subscriptions/cert-manager-sub/",
          cluster: "local-cluster",
          created: "2020-03-23T14:33:35Z",
          channel: "ocm/charts-v1",
          _hubClusterResource: "true",
          _rbac: "ocm_apps.open-cluster-management.io_subscriptions",
          _uid: "local-cluster/997f0f30-b5a1-4a6c-825d-c9f167204fc3",
          apiversion: "v1",
          apigroup: "apps.open-cluster-management.io",
          package: "cert-manager"
        }
      ]
    },
    {
      items: [
        {
          kind: "subscription",
          name: "multicluster-operators-subscription",
          namespace: "openshift-operators",
          selfLink:
            "/apis/operators.coreos.com/v1alpha1/namespaces/openshift-operators/subscriptions/multicluster-operators-subscription",
          apiversion: "v1alpha1",
          apigroup: "operators.coreos.com",
          _rbac: "openshift-operators_operators.coreos.com_subscriptions",
          _hubClusterResource: "true",
          _uid: "local-cluster/74ba7c53-04fb-4aae-83dd-8fe8d1bffbb7",
          cluster: "local-cluster",
          created: "2020-03-18T17:13:40Z"
        }
      ],
      related: [],
      __typename: "SearchResult"
    },
    {
      items: [
        {
          kind: "subscription",
          name:
            "etcd-singlenamespace-alpha-community-operators-openshift-marketplace",
          namespace: "ocm",
          selfLink:
            "/apis/operators.coreos.com/v1alpha1/namespaces/ocm/subscriptions/etcd-singlenamespace-alpha-community-operators-openshift-marketplace",
          apiversion: "v1alpha1",
          apigroup: "operators.coreos.com",
          _rbac: "ocm_operators.coreos.com_subscriptions",
          _hubClusterResource: "true",
          _uid: "local-cluster/0ce688ae-61bc-4ee9-9259-93a98a2c31c6",
          cluster: "local-cluster",
          created: "2020-03-16T20:13:49Z"
        }
      ],
      related: [],
      __typename: "SearchResult"
    },
    {
      items: [
        {
          kind: "subscription",
          name: "multiclusterhub-operator-bundle",
          namespace: "ocm",
          selfLink:
            "/apis/operators.coreos.com/v1alpha1/namespaces/ocm/subscriptions/multiclusterhub-operator-bundle",
          apiversion: "v1alpha1",
          apigroup: "operators.coreos.com",
          _rbac: "ocm_operators.coreos.com_subscriptions",
          _hubClusterResource: "true",
          _uid: "local-cluster/d4aeeb25-418e-48e1-84ed-a26aa4f9bf7c",
          cluster: "local-cluster",
          created: "2020-03-16T20:13:16Z"
        }
      ],
      related: [],
      __typename: "SearchResult"
    },
    {
      items: [
        {
          kind: "subscription",
          name: "multiclusterhub-operator-channel-no-related",
          namespace: "ocm",
          channel: "ns-ch/predev-ch",
          selfLink:
            "/apis/operators.coreos.com/v1alpha1/namespaces/ocm/subscriptions/multiclusterhub-operator-bundle",
          apiversion: "v1alpha1",
          apigroup: "operators.coreos.com",
          _rbac: "ocm_operators.coreos.com_subscriptions",
          _hubClusterResource: "true",
          _uid: "local-cluster/d4aeeb25-418e-48e1-84ed-a26aa4f9bf7c",
          cluster: "local-cluster",
          created: "2020-03-16T20:13:16Z"
        }
      ],
      __typename: "SearchResult"
    },
    {
      items: [
        {
          kind: "subscription",
          name: "nginx",
          namespace: "ns-sub-1",
          status: "Propagated",
          selfLink:
            "/apis/apps.open-cluster-management.io/v1/namespaces/ns-sub-1/subscriptions/nginx",
          label: "app=nginx-app-details",
          apiversion: "v1",
          apigroup: "apps.open-cluster-management.io",
          _rbac: "ns-sub-1_apps.open-cluster-management.io_subscriptions",
          _hubClusterResource: "true",
          _uid: "local-cluster/54c0d0fe-9711-462b-85ad-3d7e73e9ab89",
          cluster: "local-cluster",
          created: "2020-03-18T20:06:46Z",
          channel: "ns-ch/predev-ch",
          package: "nginx-ingress",
          packageFilterVersion: "1.20.x"
        }
      ],
      related: [
        {
          kind: "deployable",
          items: [
            {
              kind: "deployable",
              name: "nginx-deployable",
              namespace: "ns-sub-1",
              status: "Propagated",
              selfLink:
                "/apis/apps.open-cluster-management.io/v1/namespaces/ns-sub-1/deployables/nginx-deployable",
              label: "subscription-pause=false",
              apiversion: "v1",
              apigroup: "apps.open-cluster-management.io",
              _rbac: "ns-sub-1_apps.open-cluster-management.io_deployables",
              _hubClusterResource: "true",
              _uid: "local-cluster/b2745cdb-4d6b-4a7b-b89f-33de93850a81",
              cluster: "local-cluster",
              created: "2020-03-18T20:06:46Z"
            }
          ],
          __typename: "SearchRelatedResult"
        },
        {
          kind: "placementrule",
          items: [
            {
              kind: "placementrule",
              name: "towhichcluster",
              namespace: "ns-sub-1",
              selfLink:
                "/apis/apps.open-cluster-management.io/v1/namespaces/ns-sub-1/placementrules/towhichcluster",
              apiversion: "v1",
              apigroup: "apps.open-cluster-management.io",
              _rbac: "ns-sub-1_apps.open-cluster-management.io_placementrules",
              _hubClusterResource: "true",
              _uid: "local-cluster/49788e0c-c540-49be-9e65-a1c46e4ac485",
              cluster: "local-cluster",
              created: "2020-03-18T20:06:46Z"
            }
          ],
          __typename: "SearchRelatedResult"
        }
      ],
      __typename: "SearchResult"
    }
  ]
};

export const a = [
  {
    _hubClusterResource: "true",
    _rbac: "ns-sub-1_apps.open-cluster-management.io_subscriptions",
    _uid: "local-cluster/54c0d0fe-9711-462b-85ad-3d7e73e9ab89",
    apigroup: "apps.open-cluster-management.io",
    channel: "ns-ch/predev-ch",
    cluster: "local-cluster",
    created: "2020-03-18T20:06:46Z",
    kind: "subscription",
    label: "app=nginx-app-details",
    name: "nginx",
    namespace: "ns-sub-1",
    pathname: "",
    related: [
      {
        __typename: "SearchRelatedResult",
        items: [
          {
            _hubClusterResource: "true",
            _rbac: "ns-sub-1_apps.open-cluster-management.io_deployables",
            _uid: "local-cluster/b2745cdb-4d6b-4a7b-b89f-33de93850a81",
            apigroup: "apps.open-cluster-management.io",
            apiversion: "v1",
            cluster: "local-cluster",
            created: "2020-03-18T20:06:46Z",
            kind: "deployable",
            label: "subscription-pause=false",
            name: "nginx-deployable",
            namespace: "ns-sub-1",
            selfLink:
              "/apis/apps.open-cluster-management.io/v1/namespaces/ns-sub-1/deployables/nginx-deployable",
            status: "Propagated"
          }
        ],
        kind: "deployable"
      },
      {
        __typename: "SearchRelatedResult",
        items: [
          {
            _hubClusterResource: "true",
            _rbac: "ns-sub-1_apps.open-cluster-management.io_placementrules",
            _uid: "local-cluster/49788e0c-c540-49be-9e65-a1c46e4ac485",
            apigroup: "apps.open-cluster-management.io",
            apiversion: "v1",
            cluster: "local-cluster",
            created: "2020-03-18T20:06:46Z",
            kind: "placementrule",
            name: "towhichcluster",
            namespace: "ns-sub-1",
            selfLink:
              "/apis/apps.open-cluster-management.io/v1/namespaces/ns-sub-1/placementrules/towhichcluster"
          }
        ],
        kind: "placementrule"
      }
    ],
    selfLink:
      "/apis/apps.open-cluster-management.io/v1/namespaces/ns-sub-1/subscriptions/nginx",
    status: "Propagated",
    type: ""
  }
];

export const resultSubscriptionsWithChannel = [
  {
    _hubClusterResource: "true",
    _rbac: "ocm_operators.coreos.com_subscriptions",
    _uid: "local-cluster/d4aeeb25-418e-48e1-84ed-a26aa4f9bf7c",
    apigroup: "operators.coreos.com",
    channel: "ns-ch/predev-ch",
    cluster: "local-cluster",
    created: "2020-03-16T20:13:16Z",
    kind: "subscription",
    label: "",
    name: "multiclusterhub-operator-channel-no-related",
    namespace: "ocm",
    pathname: "",
    related: [],
    selfLink:
      "/apis/operators.coreos.com/v1alpha1/namespaces/ocm/subscriptions/multiclusterhub-operator-bundle",
    status: "",
    type: ""
  },
  {
    _hubClusterResource: "true",
    _rbac: "ns-sub-1_apps.open-cluster-management.io_subscriptions",
    _uid: "local-cluster/54c0d0fe-9711-462b-85ad-3d7e73e9ab89",
    apigroup: "apps.open-cluster-management.io",
    channel: "ns-ch/predev-ch",
    cluster: "local-cluster",
    created: "2020-03-18T20:06:46Z",
    kind: "subscription",
    label: "app=nginx-app-details",
    name: "nginx",
    namespace: "ns-sub-1",
    pathname: "",
    related: [
      {
        __typename: "SearchRelatedResult",
        items: [
          {
            _hubClusterResource: "true",
            _rbac: "ns-sub-1_apps.open-cluster-management.io_deployables",
            _uid: "local-cluster/b2745cdb-4d6b-4a7b-b89f-33de93850a81",
            apigroup: "apps.open-cluster-management.io",
            apiversion: "v1",
            cluster: "local-cluster",
            created: "2020-03-18T20:06:46Z",
            kind: "deployable",
            label: "subscription-pause=false",
            name: "nginx-deployable",
            namespace: "ns-sub-1",
            selfLink:
              "/apis/apps.open-cluster-management.io/v1/namespaces/ns-sub-1/deployables/nginx-deployable",
            status: "Propagated"
          }
        ],
        kind: "deployable"
      },
      {
        __typename: "SearchRelatedResult",
        items: [
          {
            _hubClusterResource: "true",
            _rbac: "ns-sub-1_apps.open-cluster-management.io_placementrules",
            _uid: "local-cluster/49788e0c-c540-49be-9e65-a1c46e4ac485",
            apigroup: "apps.open-cluster-management.io",
            apiversion: "v1",
            cluster: "local-cluster",
            created: "2020-03-18T20:06:46Z",
            kind: "placementrule",
            name: "towhichcluster",
            namespace: "ns-sub-1",
            selfLink:
              "/apis/apps.open-cluster-management.io/v1/namespaces/ns-sub-1/placementrules/towhichcluster"
          }
        ],
        kind: "placementrule"
      }
    ],
    selfLink:
      "/apis/apps.open-cluster-management.io/v1/namespaces/ns-sub-1/subscriptions/nginx",
    status: "Propagated",
    type: ""
  }
];

export const resultNoApps = [
  {
    _hubClusterResource: "true",
    _rbac: "ocm_operators.coreos.com_subscriptions",
    _uid: "local-cluster/d4aeeb25-418e-48e1-84ed-a26aa4f9bf7c",
    apigroup: "operators.coreos.com",
    channel: "ns-ch/predev-ch",
    cluster: "local-cluster",
    created: "2020-03-16T20:13:16Z",
    kind: "subscription",
    label: "",
    name: "multiclusterhub-operator-channel-no-related",
    namespace: "ocm",
    pathname: "",
    related: [],
    selfLink:
      "/apis/operators.coreos.com/v1alpha1/namespaces/ocm/subscriptions/multiclusterhub-operator-bundle",
    status: "",
    type: ""
  },
  {
    _hubClusterResource: "true",
    _rbac: "ns-sub-1_apps.open-cluster-management.io_subscriptions",
    _uid: "local-cluster/54c0d0fe-9711-462b-85ad-3d7e73e9ab89",
    apigroup: "apps.open-cluster-management.io",
    channel: "ns-ch/predev-ch",
    cluster: "local-cluster",
    created: "2020-03-18T20:06:46Z",
    kind: "subscription",
    label: "app=nginx-app-details",
    name: "nginx",
    namespace: "ns-sub-1",
    pathname: "",
    related: [
      {
        __typename: "SearchRelatedResult",
        items: [
          {
            _hubClusterResource: "true",
            _rbac: "ns-sub-1_apps.open-cluster-management.io_deployables",
            _uid: "local-cluster/b2745cdb-4d6b-4a7b-b89f-33de93850a81",
            apigroup: "apps.open-cluster-management.io",
            apiversion: "v1",
            cluster: "local-cluster",
            created: "2020-03-18T20:06:46Z",
            kind: "deployable",
            label: "subscription-pause=false",
            name: "nginx-deployable",
            namespace: "ns-sub-1",
            selfLink:
              "/apis/apps.open-cluster-management.io/v1/namespaces/ns-sub-1/deployables/nginx-deployable",
            status: "Propagated"
          }
        ],
        kind: "deployable"
      },
      {
        __typename: "SearchRelatedResult",
        items: [
          {
            _hubClusterResource: "true",
            _rbac: "ns-sub-1_apps.open-cluster-management.io_placementrules",
            _uid: "local-cluster/49788e0c-c540-49be-9e65-a1c46e4ac485",
            apigroup: "apps.open-cluster-management.io",
            apiversion: "v1",
            cluster: "local-cluster",
            created: "2020-03-18T20:06:46Z",
            kind: "placementrule",
            name: "towhichcluster",
            namespace: "ns-sub-1",
            selfLink:
              "/apis/apps.open-cluster-management.io/v1/namespaces/ns-sub-1/placementrules/towhichcluster"
          }
        ],
        kind: "placementrule"
      }
    ],
    selfLink:
      "/apis/apps.open-cluster-management.io/v1/namespaces/ns-sub-1/subscriptions/nginx",
    status: "Propagated",
    type: ""
  }
];

export const resultEmpty = [
  {
    name: "",
    namespace: "",
    selfLink: "",
    _uid: "",
    created: "",
    pathname: "",
    apigroup: "",
    cluster: "",
    kind: "",
    label: "",
    type: "",
    _hubClusterResource: "",
    _rbac: "",
    related: []
  }
];
