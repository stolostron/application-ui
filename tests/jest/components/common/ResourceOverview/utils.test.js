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
  getNumDeployables,
  getPoliciesLinkForOneApplication,
  getSearchLinkForOneApplication,
  getSubscriptionDataOnHub,
  getSubscriptionDataOnManagedClustersSingle,
  getPodData
} from "../../../../../src-web/components/common/ResourceOverview/utils";

const query_data1 = {
  name: "val",
  namespace: "default",
  _uid: "local-cluster/e04141c7-4377-11ea-a84e-00000a100f99",
  dashboard:
    "localhost/grafana/dashboard/db/val-dashboard-via-federated-prometheus?namespace=default",
  created: "2020-01-30T15:47:53Z",
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

describe("getNumDeployables", () => {
  it("should return deployable count", () => {
    const result = 2;
    expect(getNumDeployables(data1)).toEqual(result);
  });
  it("should return 0 if related is empty", () => {
    expect(getNumDeployables(data2)).toEqual(0);
  });
});

describe("getPoliciesLinkForOneApplication", () => {
  it("should return link to policies for one application", () => {
    const appName = "test-app";
    const result = `/multicloud/policies/all?card=false&filters=%7B"textsearch"%3A%5B"${appName}"%5D%7D&index=2`;
    expect(getPoliciesLinkForOneApplication({ name: appName })).toEqual(result);
  });
  it("should return empty string if name param is empty", () => {
    expect(getPoliciesLinkForOneApplication()).toEqual("");
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

// getSubscriptionDataOnHub
describe("getSubscriptionDataOnHub", () => {
  it("has subscription data", () => {
    const subscriptionData = getSubscriptionDataOnHub(
      subscriptionPropagatedSampleData,
      true,
      "app1",
      "default"
    );

    expect(subscriptionData.total).toEqual(5);
    expect(subscriptionData.failed).toEqual(1);
    expect(subscriptionData.noStatus).toEqual(2);
    expect(subscriptionData.channels).toEqual(2);
  });

  it("has subscription data - non-single app view", () => {
    const subscriptionData = getSubscriptionDataOnHub(
      subscriptionPropagatedSampleData,
      false,
      "app1",
      "default"
    );

    expect(subscriptionData.total).toEqual(5);
    expect(subscriptionData.failed).toEqual(1);
    expect(subscriptionData.noStatus).toEqual(2);
    expect(subscriptionData.channels).toEqual(2);
  });

  it("no subscription data", () => {
    const subscriptionData = getSubscriptionDataOnHub(
      emptyItemsData,
      true,
      "app1",
      "default"
    );

    expect(subscriptionData.total).toEqual(0);
    expect(subscriptionData.failed).toEqual(0);
    expect(subscriptionData.noStatus).toEqual(0);
    expect(subscriptionData.channels).toEqual(0);
  });

  it("no subscription data", () => {
    const subscriptionData = getSubscriptionDataOnHub(
      emptyData,
      true,
      "app1",
      "default"
    );

    // -1 to identify when skeleton text load bar should appear
    expect(subscriptionData.total).toEqual(-1);
    expect(subscriptionData.channels).toEqual(-1);
  });
});

// getSubscriptionDataOnManagedClustersSingle
describe("getSubscriptionDataOnManagedClustersSingle", () => {
  it("has subscription data", () => {
    const subscriptionData = getSubscriptionDataOnManagedClustersSingle(
      subscriptionSubscribedSampleDataSingleApp,
      "app1",
      "default"
    );

    expect(subscriptionData.clusters).toEqual(2);
    expect(subscriptionData.total).toEqual(5);
    expect(subscriptionData.failed).toEqual(1);
    expect(subscriptionData.noStatus).toEqual(1);
  });

  it("has subscription data", () => {
    const subscriptionData = getSubscriptionDataOnManagedClustersSingle(
      subscriptionSubscribedSampleDataSingleApp,
      "app2",
      "default"
    );

    expect(subscriptionData.clusters).toEqual(3);
    expect(subscriptionData.total).toEqual(8);
    expect(subscriptionData.failed).toEqual(1);
    expect(subscriptionData.noStatus).toEqual(2);
  });

  it("no subscription data", () => {
    const subscriptionData = getSubscriptionDataOnManagedClustersSingle(
      emptyItemsData,
      "app1",
      "default"
    );

    expect(subscriptionData.clusters).toEqual(0);
    expect(subscriptionData.total).toEqual(0);
    expect(subscriptionData.failed).toEqual(0);
    expect(subscriptionData.noStatus).toEqual(0);
  });

  it("no subscription data", () => {
    const subscriptionData = getSubscriptionDataOnManagedClustersSingle(
      emptyData,
      "app1",
      "default"
    );

    // -1 to identify when skeleton text load bar should appear
    expect(subscriptionData.clusters).toEqual(-1);
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

const emptyData = {};
const emptyItemsData = {
  items: []
};
const emptyItemsDataNoList = {
  items: {}
};

const placementRuleSampleData = {
  items: [
    {
      name: "app1",
      namespace: "default",
      related: [
        {
          kind: "application",
          items: [
            {
              name: "app1"
            }
          ]
        },
        {
          kind: "placementrule",
          items: [
            { name: "pr1", namespace: "default" },
            { name: "pr2", namespace: "default" },
            { name: "pr3", namespace: "default" },
            { name: "pr4", namespace: "default" },
            { name: "pr5", namespace: "default" },
            { name: "pr6", namespace: "default" }
          ]
        }
      ]
    },
    {
      name: "app2",
      namespace: "test-ns"
    }
  ]
};

const subscriptionPropagatedSampleData = {
  items: [
    {
      name: "app1",
      namespace: "default",
      hubSubscriptions: [
        {
          channel: "fake-channel",
          status: "Propagated",
          _uid: "fake-uid-1"
        },
        {
          channel: "fake-channel",
          status: "Propagated",
          _uid: "fake-uid-2"
        },
        {
          channel: "fake-channel-2",
          status: "unknown",
          _uid: "fake-uid-3"
        },
        {
          channel: "fake-channel-2",
          status: undefined,
          _uid: "fake-uid-4"
        },
        {
          channel: "fake-channel",
          status: null,
          _uid: "fake-uid-5"
        }
      ]
    }
  ]
};

const subscriptionSubscribedSampleDataSingleApp = {
  items: [
    {
      clusterCount: 2,
      name: "app1",
      namespace: "default",
      remoteSubscriptionStatusCount: {
        Subscribed: 3,
        Failed: 1,
        null: 1
      }
    },
    {
      clusterCount: 3,
      name: "app2",
      namespace: "default",
      remoteSubscriptionStatusCount: {
        Subscribed: 5,
        Failed: 1,
        undefined: 2
      }
    }
  ]
};

const subscriptionSubscribedSampleDataRootApp = {
  items: {
    clusterCount: 2,
    remoteSubscriptionStatusCount: {
      Subscribed: 7,
      Failed: 2,
      null: 3
    }
  }
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
