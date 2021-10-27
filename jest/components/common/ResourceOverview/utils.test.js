/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *  Copyright (c) 2020 Red Hat, Inc.
 * Copyright Contributors to the Open Cluster Management project
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import {
  getRepoTypeForArgoApplication,
  getSearchLinkForOneApplication,
  getSearchLinkForArgoApplications,
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

describe("getRepoTypeForArgoApplication", () => {
  it("should return git repo type for Argo application", () => {
    expect(getRepoTypeForArgoApplication({ path: "helloworld" })).toEqual(
      "github"
    );
  });
  it("should return helm repo type for Argo application", () => {
    expect(getRepoTypeForArgoApplication({ chart: "redis" })).toEqual(
      "helmrepo"
    );
  });
  it("should return empty string for Argo application repo type", () => {
    expect(getRepoTypeForArgoApplication({})).toEqual("");
  });
});

describe("getSearchLinkForArgoApplications", () => {
  it("should return search link for Argo application", () => {
    const source = {
      path: "helloworld",
      repoURL: "https://github.com/fxiang1/app-samples",
      targetRevision: "HEAD"
    };
    const result =
      '/search?filters={"textsearch":"kind%3Aapplication%20apigroup%3Aargoproj.io%20path%3Ahelloworld%20repoURL%3Ahttps%3A%2F%2Fgithub.com%2Ffxiang1%2Fapp-samples%20targetRevision%3AHEAD"}';
    expect(getSearchLinkForArgoApplications(source)).toEqual(result);
  });
  it("should return search link for Argo application", () => {
    const source = {
      repoURL: "https://charts.bitnami.com/bitnami",
      targetRevision: "12.2.4",
      chart: "redis"
    };
    const result =
      '/search?filters={"textsearch":"kind%3Aapplication%20apigroup%3Aargoproj.io%20repoURL%3Ahttps%3A%2F%2Fcharts.bitnami.com%2Fbitnami%20targetRevision%3A12.2.4%20chart%3Aredis"}';
    expect(getSearchLinkForArgoApplications(source)).toEqual(result);
  });
  it("should return empty string for undefined resource", () => {
    expect(getSearchLinkForArgoApplications(undefined)).toEqual("");
  });
  it("should return basic url for empty resource", () => {
    const result =
      '/search?filters={"textsearch":"kind%3Aapplication%20apigroup%3Aargoproj.io"}';
    expect(getSearchLinkForArgoApplications({})).toEqual(result);
  });
});

describe("getSearchLinkForOneApplication", () => {
  const appName = "test-app";
  const appNamespace = "default";
  it("should return general search link for one application", () => {
    const result = `/search?filters={"textsearch":"kind%3Aapplication%20name%3A${appName}"}`;
    expect(
      getSearchLinkForOneApplication({
        name: appName
      })
    ).toEqual(result);
  });
  it("should return cluster related search link for one application", () => {
    const related = "cluster";
    const result = `/search?filters={"textsearch":"kind%3Aapplication%20name%3A${appName}"}&showrelated=${related}`;
    expect(
      getSearchLinkForOneApplication({
        name: appName,
        showRelated: related
      })
    ).toEqual(result);
  });
  it("should return subscription related search link for one application", () => {
    const related = "subscription";
    const result = `/search?filters={"textsearch":"kind%3Aapplication%20name%3A${appName}%20namespace%3A${appNamespace}"}&showrelated=${related}`;
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

describe("getAppOverviewCardsData", () => {
  it("has topology and app data with local deployment and time window", () => {
    const appOverviewCardsData = getAppOverviewCardsData(
      reduxStoreAppPipelineWithCEM.HCMApplicationList,
      reduxStoreAppPipelineWithCEM.topology,
      "mortgage-app",
      "default"
    );
    const result = {
      apiGroup: "app.k8s.io",
      argoSource: {},
      clusterNames: [],
      creationTimestamp: "Aug 13 2018, 3:23 pm",
      destinationNs: "",
      destinationCluster: "",
      editArgoSetLink: "",
      isArgoApp: false,
      lastSyncedTimestamp: "Sep 13 2020, 2:25 pm",
      remoteClusterCount: 1,
      localClusterDeploy: false,
      nodeStatuses: { green: 0, yellow: 0, red: 0, orange: 3 },
      subsList: [
        {
          name: "mortgage-app-subscription",
          resourceType: "GitHub",
          resourcePath: "https://github.com/fxiang1/app-samples.git",
          gitBranch: "main",
          gitPath: "mortgage",
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

  it("has missing channel data", () => {
    const appOverviewCardsData = getAppOverviewCardsData(
      testHCMAppList,
      topologyNoChannel,
      "mortgage-app",
      "default"
    );
    const result = {
      apiGroup: "app.k8s.io",
      argoSource: {},
      clusterNames: [],
      creationTimestamp: "Aug 13 2018, 3:23 pm",
      destinationNs: "",
      destinationCluster: "",
      editArgoSetLink: "",
      isArgoApp: false,
      lastSyncedTimestamp: "-",
      remoteClusterCount: 1,
      localClusterDeploy: false,
      nodeStatuses: { green: 0, yellow: 0, red: 0, orange: 3 },
      subsList: [
        {
          name: "mortgage-app-subscription",
          resourceType: "",
          resourcePath: "",
          gitBranch: "main",
          gitPath: "mortgage",
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
    const appOverviewCardsData = getAppOverviewCardsData(
      emptyData,
      emptyData,
      "mortgage-app",
      "default"
    );
    const result = {
      argoSource: -1,
      creationTimestamp: -1,
      destinationNs: -1,
      destinationCluster: "",
      editArgoSetLink: "",
      isArgoApp: false,
      lastSyncedTimestamp: -1,
      remoteClusterCount: -1,
      localClusterDeploy: false,
      nodeStatuses: -1,
      subsList: -1
    };

    expect(appOverviewCardsData).toEqual(result);
  });
});

const emptyData = {};
const emptyItemsData = {
  items: []
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
