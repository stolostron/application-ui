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
import {
  reduxStoreAppPipelineWithCEM,
  topologyNoChannel
} from "../../TestingData";

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
  it("has topology and app data with local deployment and time window", () => {
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
          id: "default/mortgage-app-subscription//mortgage-ch/mortgage-channel",
          resourceType: "GitHub",
          resourcePath: "https://github.com/fxiang1/app-samples.git",
          gitBranch: "master",
          gitPath: "mortgage",
          package: "",
          packageFilterVersion: "",
          timeWindowType: "active",
          timeWindowDays: ["Monday", "Tuesday", "Wednesday"],
          timeWindowTimezone: "America/Toronto",
          timeWindowRanges: [{ end: "09:10PM", start: "8:00AM" }],
          timeWindowMissingData: false
        }
      ]
    };

    expect(appOverviewCardsData).toEqual(result);
  });

  it("has missing channel data", () => {
    const targetLink =
      '/multicloud/search?filters={"textsearch":"kind%3Aapplication%20name%3Aguestbook-app%20namespace%3Adefault"}';
    const appOverviewCardsData = getAppOverviewCardsData(
      testHCMAppList,
      topologyNoChannel,
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
          id: "default/mortgage-app-subscription//mortgage-ch/mortgage-channel",
          resourceType: "",
          resourcePath: "",
          gitBranch: "master",
          gitPath: "mortgage",
          package: "",
          packageFilterVersion: "",
          timeWindowType: "active",
          timeWindowDays: ["Monday", "Tuesday", "Wednesday"],
          timeWindowTimezone: "America/Toronto",
          timeWindowRanges: [{ end: "09:10PM", start: "8:00AM" }],
          timeWindowMissingData: false
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

const testHCMAppList = {
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
              cluster: "kcormier-cluster",
              created: "2019-09-18T21:20:00Z",
              kind: "subscription",
              label:
                "app=mortgage-app-mortgage; hosting-deployable-name=mortgage-app-subscription-deployable; subscription-pause=false",
              localPlacement: "true",
              name: "mortgage-app-subscription",
              namespace: "default",
              selfLink:
                "/apis/apps.open-cluster-management.io/v1/namespaces/default/subscriptions/mortgage-app-subscription",
              status: "Failed",
              timeWindow: "none",
              _clusterNamespace: "kcormier-cluster",
              _hostingDeployable:
                "kcormier-cluster/mortgage-app-subscription-deployable-w2qpd",
              _hostingSubscription: "default/mortgage-app-subscription",
              _rbac:
                "kcormier-cluster_apps.open-cluster-management.io_subscriptions",
              _uid: "kcormier-cluster/727109c7-0742-44b2-bc19-37eccc63508b"
            },
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
              timeWindow: "active",
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
