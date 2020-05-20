/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import {
  getNumIncidents,
  getSingleApplicationObject,
  getNumPlacementRules,
  getSubscriptionDataOnHub,
  getSubscriptionDataOnManagedClustersSingle,
  getSubscriptionDataOnManagedClustersRoot,
  getPodData,
  getIncidentsData
} from "../../../../../../src-web/components/ApplicationDeploymentPipeline/components/InfoCards/utils";

describe("getNumIncidents", () => {
  it("has application object", () => {
    const num = getNumIncidents(placementRuleSampleData);
    expect(num).toEqual(2);
  });
  it("empty items list", () => {
    const num = getNumIncidents(emptyItemsData);
    expect(num).toEqual(0); // empty string returned
  });
  it("empty items obj", () => {
    const num = getNumIncidents(emptyItemsDataNoList);
    expect(num).toEqual(0);
  });
  it("empty list", () => {
    const num = getNumIncidents(emptyData);
    expect(num).toEqual(-1); // -1 to identify when skeleton text load bar should appear
  });
});

// getSingleApplicationObject
describe("getSingleApplicationObject", () => {
  it("has application object", () => {
    const firstAppObject = getSingleApplicationObject(placementRuleSampleData);
    // check if it equals the first one in the list
    expect(firstAppObject.name).toEqual("app1");
    expect(firstAppObject.namespace).toEqual("default");
  });
  it("empty items list", () => {
    const firstAppObject = getSingleApplicationObject(emptyItemsData);
    expect(firstAppObject).toHaveLength(0); // empty string returned
  });
});

// getNumPlacementRules
describe("getNumPlacementRules", () => {
  it("has subscription data", () => {
    const placementRuleCount = getNumPlacementRules(
      placementRuleSampleData,
      true,
      "app1",
      "default"
    );

    expect(placementRuleCount).toEqual(6);
  });

  it("has subscription data - non-single app view", () => {
    const placementRuleCount = getNumPlacementRules(
      placementRuleSampleData,
      false,
      "app1",
      "default"
    );

    expect(placementRuleCount).toEqual(6);
  });

  it("no subscription data", () => {
    const placementRuleCount = getNumPlacementRules(
      emptyItemsData,
      true,
      "app1",
      "default"
    );

    expect(placementRuleCount).toEqual(0);
  });

  it("no subscription data", () => {
    const placementRuleCount = getNumPlacementRules(
      emptyData,
      true,
      "app1",
      "default"
    );

    // -1 to identify when skeleton text load bar should appear
    expect(placementRuleCount).toEqual(-1);
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

// getSubscriptionDataOnManagedClustersRoot
describe("getSubscriptionDataOnManagedClustersRoot", () => {
  it("has subscription data", () => {
    const subscriptionData = getSubscriptionDataOnManagedClustersRoot(
      subscriptionSubscribedSampleDataRootApp
    );

    expect(subscriptionData.clusters).toEqual(2);
    expect(subscriptionData.total).toEqual(12);
    expect(subscriptionData.failed).toEqual(2);
    expect(subscriptionData.noStatus).toEqual(3);
  });

  it("no subscription data", () => {
    const subscriptionData = getSubscriptionDataOnManagedClustersRoot(
      emptyItemsData
    );

    expect(subscriptionData.clusters).toEqual(0);
    expect(subscriptionData.total).toEqual(0);
    expect(subscriptionData.failed).toEqual(0);
    expect(subscriptionData.noStatus).toEqual(0);
  });

  it("no subscription data", () => {
    const subscriptionData = getSubscriptionDataOnManagedClustersRoot(
      emptyData
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

// getIncidentsData
describe("getIncidentsData", () => {
  it("get incidents from list", () => {
    const incidentData = getIncidentsData(incidentsData);

    expect(incidentData.priority1).toEqual(3);
    expect(incidentData.priority2).toEqual(2);
  });

  it("empty incident list", () => {
    const incidentData = getIncidentsData(emptyItemsData);

    expect(incidentData.priority1).toEqual(0);
    expect(incidentData.priority2).toEqual(0);
  });

  it("empty incident list", () => {
    const incidentData = getIncidentsData(emptyData);

    expect(incidentData.priority1).toEqual(0);
    expect(incidentData.priority2).toEqual(0);
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

const incidentsData = {
  items: [
    { priority: 1 },
    { priority: 2 },
    { priority: 2 },
    { priority: 1 },
    { priority: 1 }
  ]
};
