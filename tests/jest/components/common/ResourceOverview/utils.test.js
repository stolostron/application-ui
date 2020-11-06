/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *  Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import {
  getNumClustersForApp,
  getSearchLinkForOneApplication,
  getPodData,
  getAppOverviewCardsData
} from "../../../../../src-web/components/common/ResourceOverview/utils";
import { reduxStoreAppPipelineWithCEM } from "../../TestingData";

const query_data1 = {
  name: "val",
  namespace: "default",
  _uid: "local-cluster/e04141c7-4377-11ea-a84e-00000a100f99",
  dashboard:
    "localhost/grafana/dashboard/db/val-dashboard-via-federated-prometheus?namespace=default",
  created: "2018-01-30T15:47:53Z",
  remoteSubscriptionStatusCount: {
    Subscribed: 4,
    Failed: 5,
    null: 3
  },
  podStatusCount: {
    Running: 4,
    Error: 5,
    ImagePullBackOff: 3,
    ContainerCreating: 6,
    Ready: 8
  },
  clusterCount: 4,
  hubSubscriptions: [
    {
      _uid: "local-cluster/66426f24-3bd3-11ea-a488-00000a100f99",
      status: "Propagated",
      channel: "dev1/dev1"
    },
    {
      _uid: "local-cluster/bdced01f-3bd4-11ea-a488-00000a100f99",
      status: null,
      channel: "dev1/dev1"
    },
    {
      _uid: "local-cluster/b218636d-3d5e-11ea-8ed1-00000a100f99",
      status: "Propagated",
      channel: "default/mortgage-channel"
    }
  ]
};

const query_data2 = {
  name: "appdemo-gbapp",
  namespace: "ibmcom"
};

const data1 = {
  name: "appdemo-gbapp",
  namespace: "ibmcom",
  selfLink:
    "/apis/app.k8s.io/v1beta1/namespaces/ibmcom/applications/appdemo-gbapp",
  _uid: "",
  created: "2019-08-10T12:14:24Z",
  apigroup: "app.k8s.io",
  cluster: "local-cluster",
  kind: "application",
  label: "release=appdemo; app=gbapp; chart=gbapp-0.1.0; heritage=Tiller",
  _hubClusterResource: "true",
  _rbac: "ibmcom_app.k8s.io_applications",
  related: [
    {
      kind: "release",
      count: 5,
      items: [
        {
          name: "appdemo",
          status: "Deployed"
        },
        {
          name: "appdemo2",
          status: "PENDING"
        },
        {
          name: "appdemo3",
          status: "In Progress"
        },
        {
          name: "appdemo4",
          status: "FAILED"
        },
        {
          name: "appdemo5",
          status: "CreationError"
        }
      ],
      __typename: "SearchRelatedResult"
    },
    {
      kind: "deployable",
      count: 2,
      items: [
        {
          name: "appdemo"
        },
        {
          name: "appdemo2"
        }
      ]
    },
    {
      kind: "placementbinding",
      count: 1,
      items: [
        {
          name: "appdemo"
        }
      ]
    },
    {
      kind: "subscription",
      count: 1,
      items: [
        {
          name: "appdemo"
        }
      ]
    },
    {
      kind: "cluster",
      count: 1,
      items: [
        {
          name: "appdemo"
        },
        {
          name: "local-cluster"
        }
      ]
    },
    {
      kind: "vulnerabilitypolicy",
      items: [
        {
          kind: "vulnerabilitypolicy",
          name: "policy-vulnerabilitypolicy-example",
          vulnerableResources: 2
        },
        {
          kind: "vulnerabilitypolicy",
          name: "va-policy-release-check",
          vulnerableResources: 2
        },
        {
          kind: "vulnerabilitypolicy",
          name: "policy-f8-example",
          vulnerableResources: 2
        }
      ]
    },
    {
      kind: "mutationpolicy",
      items: [
        {
          kind: "mutationpolicy",
          name: "policy-mutationpolicy-example",
          vulnerableResources: 2
        },
        {
          kind: "mutationpolicy",
          name: "va-policy-release-check",
          vulnerableResources: 2
        }
      ]
    }
  ],
  remoteSubs: [
    {
      kind: "subscription",
      name: "appdemo1",
      status: "Subscribed"
    },
    {
      kind: "subscription",
      name: "appdemo2",
      status: "Failed"
    },
    {
      kind: "subscription",
      name: "appdemo3",
      status: null
    },
    {
      kind: "subscription",
      name: "appdemo4",
      status: ""
    },
    {
      kind: "subscription",
      name: "appdemo5"
    }
  ]
};

const data2 = {
  name: "appdemo-gbapp",
  namespace: "ibmcom",
  selfLink:
    "/apis/app.k8s.io/v1beta1/namespaces/ibmcom/applications/appdemo-gbapp",
  _uid: "",
  created: "2019-08-10T12:14:24Z",
  apigroup: "app.k8s.io",
  cluster: "local-cluster",
  kind: "application",
  label: "release=appdemo; app=gbapp; chart=gbapp-0.1.0; heritage=Tiller",
  _hubClusterResource: "true",
  _rbac: "ibmcom_app.k8s.io_applications",
  related: []
};

describe("getNumClustersForApp", () => {
  it("should return cluster count", () => {
    const result = 4;
    expect(getNumClustersForApp(query_data1)).toEqual(result);
  });
  it("should return 0 if related is empty", () => {
    expect(getNumClustersForApp(query_data2)).toEqual(0);
  });

  it("should return 0 if no data", () => {
    expect(getNumClustersForApp(null)).toEqual(0);
  });
});

describe("getSearchLinkForOneApplication", () => {
  const appName = "test-app";
  const appNamespace = "default";
  it("should return general search link for one application", () => {
    const result = `/multicloud/search?filters={"textsearch":"kind%3Aapplication%20name%3A${appName}"}`;
    expect(
      getSearchLinkForOneApplication({
        name: appName
      })
    ).toEqual(result);
  });
  it("should return cluster related search link for one application", () => {
    const related = "cluster";
    const result = `/multicloud/search?filters={"textsearch":"kind%3Aapplication%20name%3A${appName}"}&showrelated=${related}`;
    expect(
      getSearchLinkForOneApplication({
        name: appName,
        showRelated: related
      })
    ).toEqual(result);
  });
  it("should return subscription related search link for one application", () => {
    const related = "subscription";
    const result = `/multicloud/search?filters={"textsearch":"kind%3Aapplication%20name%3A${appName}%20namespace%3A${appNamespace}"}&showrelated=${related}`;
    expect(
      getSearchLinkForOneApplication({
        name: appName,
        namespace: appNamespace,
        showRelated: related
      })
    ).toEqual(result);
  });
  it("should return empty string if name param is empty", () => {
    expect(getSearchLinkForOneApplication()).toEqual("");
  });
});

// getPodData
describe("getPodData", () => {
  it("has pod data", () => {
    const podData = getPodData(podSampleData, "app1", "default");

    expect(podData.total).toEqual(14);
    expect(podData.running).toEqual(4);
    expect(podData.failed).toEqual(5);
    expect(podData.inProgress).toEqual(2);
  });
  it("no pod data", () => {
    const podData = getPodData(emptyItemsData, "app1", "default");

    expect(podData.total).toEqual(0);
    expect(podData.running).toEqual(0);
    expect(podData.failed).toEqual(0);
    expect(podData.inProgress).toEqual(0);
  });
  it("no pod data", () => {
    const podData = getPodData(emptyData, "app1", "default");

    // -1 to identify when skeleton text load bar should appear
    expect(podData.total).toEqual(-1);
  });
});

describe("getAppOverviewCardsData", () => {
  it("has topology and app data", () => {
    const targetLink =
      '/multicloud/search?filters={"textsearch":"kind%3Aapplication%20name%3Aguestbook-app%20namespace%3Adefault"}';
    const appOverviewCardsData = getAppOverviewCardsData(
      reduxStoreAppPipelineWithCEM.HCMApplicationList,
      reduxStoreAppPipelineWithCEM.topology,
      "mortgage-app",
      "default",
      targetLink
    );
    const result = {
      appName: "mortgage-app",
      appNamespace: "default",
      creationTimestamp: "Aug 13 2018, 3:23 pm",
      remoteClusterCount: 1,
      localClusterDeploy: false,
      nodeStatuses: { green: 0, yellow: 0, red: 0, orange: 3 },
      targetLink: targetLink,
      subsList: [
        {
          name: "mortgage-app-subscription",
          id: "member--subscription--default--mortgage-app-subscription",
          resourceType: "GitHub",
          resourcePath: "https://github.com/fxiang1/app-samples.git",
          gitBranch: "master",
          gitPath: "mortgage",
          package: "",
          packageFilterVersion: "",
          timeWindowType: undefined,
          timeWindowDays: undefined,
          timeWindowTimezone: undefined,
          timeWindowRanges: undefined
        }
      ]
    };

    expect(appOverviewCardsData).toEqual(result);
  });

  it("has topology and app data with local deployment and time window", () => {
    const targetLink =
      '/multicloud/search?filters={"textsearch":"kind%3Aapplication%20name%3Aguestbook-app%20namespace%3Adefault"}';
    const appOverviewCardsData = getAppOverviewCardsData(
      reduxStoreAppPipelineWithCEM.HCMApplicationList,
      customTopologyData,
      "mortgage-app",
      "default",
      targetLink
    );
    const result = {
      appName: "mortgage-app",
      appNamespace: "default",
      creationTimestamp: "Aug 13 2018, 3:23 pm",
      remoteClusterCount: 1,
      localClusterDeploy: false,
      nodeStatuses: { green: 2, yellow: 1, red: 0, orange: 0 },
      targetLink: targetLink,
      subsList: [
        {
          name: "mortgage-app-subscription",
          id: "member--subscription--default--mortgage-app-subscription",
          resourceType: "GitHub",
          resourcePath: "https://github.com/fxiang1/app-samples.git",
          gitBranch: undefined,
          gitPath: undefined,
          package: "",
          packageFilterVersion: "",
          timeWindowType: "active",
          timeWindowDays: ["Monday", "Tuesday", "Wednesday"],
          timeWindowTimezone: "America/Toronto",
          timeWindowRanges: [{ end: "09:10PM", start: "8:00AM" }]
        }
      ]
    };

    expect(appOverviewCardsData).toEqual(result);
  });

  it("has no data", () => {
    const targetLink =
      '/multicloud/search?filters={"textsearch":"kind%3Aapplication%20name%3Aguestbook-app%20namespace%3Adefault"}';
    const appOverviewCardsData = getAppOverviewCardsData(
      emptyData,
      emptyData,
      "mortgage-app",
      "default",
      targetLink
    );
    const result = {
      appName: "mortgage-app",
      appNamespace: "default",
      creationTimestamp: -1,
      remoteClusterCount: -1,
      localClusterDeploy: false,
      nodeStatuses: -1,
      targetLink: targetLink,
      subsList: -1
    };

    expect(appOverviewCardsData).toEqual(result);
  });
});

const emptyData = {};
const emptyItemsData = {
  items: []
};

// total: 12, running: 4, failed: 5
const podSampleData = {
  items: [
    {
      name: "app1",
      namespace: "default",
      podStatusCount: {
        Running: 2,
        Pass: 1,
        Deployed: 1,
        Pending: 1,
        InProgress: 1,
        Failed: 2,
        Error: 2,
        ImagePullBackoff: 1,
        ContainerCreating: 1,
        Ready: 2
      }
    }
  ]
};

const customTopologyData = {
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
            annotations: {
              "apps.open-cluster-management.io/git-commit":
                "0660bd66c02d09a4c8813d3ae2e711fc98b6426b"
            },
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
            creationTimestamp: "2018-08-13T19:23:01Z",
            generation: 2,
            name: "mortgage-app-subscription"
          },
          spec: {
            channel: "mortgage-ch/mortgage-channel",
            placement: {
              local: true
            },
            timewindow: {
              hours: [{ end: "09:10PM", start: "8:00AM" }],
              location: "America/Toronto",
              daysofweek: ["Monday", "Tuesday", "Wednesday"],
              windowtype: "active"
            }
          },
          status: {
            lastUpdateTime: "2018-08-15T09:11:11Z",
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
            creationTimestamp: "2018-08-13T18:17:34Z",
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
              creationTimestamp: "2018-08-13T18:17:34Z",
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
        pulse: "green",
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
        pulse: "yellow",
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
        pulse: "green",
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
