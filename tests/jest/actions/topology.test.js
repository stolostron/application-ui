/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/
"use strict";

import {
  requestResource,
  receiveResourceError,
  receiveTopologySuccess,
  requestResourceDetails,
  receiveTopologyDetailsSuccess,
  restoreSavedTopologyFilters,
  updateTopologyFilters,
  getResourceData
} from "../../../src-web/actions/topology";

const resourceType = {
  name: "HCMTopology",
  list: "HCMTopology"
};

const fetchFilters = {
  application: {
    name: "mortgage-app",
    namespace: "default",
    channel: "__ALL__/__ALL__//__ALL__/__ALL__"
  }
};

const err = { err: { msg: "err" } };

describe("topology actions", () => {
  it("should return requestResource", () => {
    const expectedValue = {
      fetchFilters: {
        application: {
          channel: "__ALL__/__ALL__//__ALL__/__ALL__",
          name: "mortgage-app",
          namespace: "default"
        }
      },
      reloading: false,
      resourceType: {
        list: "HCMTopology",
        name: "HCMTopology"
      },
      status: "IN_PROGRESS",
      type: "RESOURCE_REQUEST"
    };

    expect(requestResource(resourceType, fetchFilters, false)).toEqual(
      expectedValue
    );
  });

  it("should return requestResourceError", () => {
    const expectedValue = {
      err: {
        err: {
          msg: "err"
        }
      },
      resourceType: {
        list: "HCMTopology",
        name: "HCMTopology"
      },
      status: "ERROR",
      type: "RESOURCE_RECEIVE_FAILURE"
    };

    expect(receiveResourceError(err, resourceType)).toEqual(expectedValue);
  });

  it("should return receiveTopologySuccess", () => {
    const response = {
      clusters: ["localhost"],
      labels: ["blah", "foo", "bar"],
      namespaces: ["default"],
      resourceTypes: [resourceType]
    };
    const expectedValue = {
      fetchFilters: {
        application: {
          channel: "__ALL__/__ALL__//__ALL__/__ALL__",
          name: "mortgage-app",
          namespace: "default"
        }
      },
      filters: {
        clusters: ["localhost"],
        labels: ["blah", "foo", "bar"],
        namespaces: ["default"],
        types: [{ list: "HCMTopology", name: "HCMTopology" }]
      },
      links: [],
      nodes: [],
      resourceType: {
        list: "HCMTopology",
        name: "HCMTopology"
      },
      status: "DONE",
      type: "RESOURCE_RECEIVE_SUCCESS",
      willLoadDetails: true
    };

    expect(
      receiveTopologySuccess(response, resourceType, fetchFilters, true)
    ).toEqual(expectedValue);
  });

  it("should return requestResourceDetails", () => {
    const expectedValue = {
      fetchFilters: {
        application: {
          channel: "__ALL__/__ALL__//__ALL__/__ALL__",
          name: "mortgage-app",
          namespace: "default"
        }
      },
      reloading: true,
      resourceType: {
        list: "HCMTopology",
        name: "HCMTopology"
      },
      status: "IN_PROGRESS",
      type: "RESOURCE_DETAILS_REQUEST"
    };

    expect(requestResourceDetails(resourceType, fetchFilters, true)).toEqual(
      expectedValue
    );
  });

  it("should return receiveTopologyDetailsSuccess", () => {
    const response = {
      pods: ["testpod"]
    };

    const expectedValue = {
      fetchFilters: {
        application: {
          channel: "__ALL__/__ALL__//__ALL__/__ALL__",
          name: "mortgage-app",
          namespace: "default"
        }
      },
      pods: ["testpod"],
      resourceType: {
        list: "HCMTopology",
        name: "HCMTopology"
      },
      status: "DONE",
      type: "RESOURCE_DETAILS_RECEIVE_SUCCESS"
    };

    expect(
      receiveTopologyDetailsSuccess(response, resourceType, fetchFilters)
    ).toEqual(expectedValue);
  });

  it("should return restoreSavedTopologyFilters", () => {
    const expectedValue = {
      name: "mortgage-app",
      namespace: "default",
      type: "TOPOLOGY_RESTORE_SAVED_FILTERS"
    };

    expect(restoreSavedTopologyFilters("default", "mortgage-app")).toEqual(
      expectedValue
    );
  });

  it("should return updateTopologyFilters", () => {
    const expectedValue = {
      filterType: "clusterFilter",
      filters: {
        application: {
          channel: "__ALL__/__ALL__//__ALL__/__ALL__",
          name: "mortgage-app",
          namespace: "default"
        }
      },
      name: "mortgage-app",
      namespace: "default",
      type: "TOPOLOGY_FILTERS_UPDATE"
    };

    expect(
      updateTopologyFilters(
        "clusterFilter",
        fetchFilters,
        "default",
        "mortgage-app"
      )
    ).toEqual(expectedValue);
  });

  it("should return getResourceData for one subscription, no pods", () => {
    const nodes = [
      {
        type: "application",
        name: "app1"
      },
      {
        type: "subscription",
        name: "subs1"
      },
      {
        type: "route",
        name: "routeName"
      }
    ];
    const expectedValue = {
      relatedKinds: ["application", "subscription", "route"],
      subscription: "subs1"
    };

    expect(getResourceData(nodes)).toEqual(expectedValue);
  });

  it("should return getResourceData for one subscription, with pods", () => {
    const nodes = [
      {
        type: "application",
        name: "app1"
      },
      {
        type: "subscription",
        name: "subs1"
      },
      {
        type: "deployment",
        name: "deploymentName"
      }
    ];
    const expectedValue = {
      relatedKinds: ["application", "subscription", "deployment", "pod"],
      subscription: "subs1"
    };

    expect(getResourceData(nodes)).toEqual(expectedValue);
  });

  it("should return getResourceData for one more then one subscription with no pods", () => {
    const nodes = [
      {
        type: "application",
        name: "app1"
      },
      {
        type: "subscription",
        name: "subs1"
      },
      {
        type: "subscription",
        name: "subs2"
      },
      {
        type: "route",
        name: "routeName"
      }
    ];
    const expectedValue = {
      relatedKinds: ["application", "subscription", "route"],
      subscription: null
    };

    expect(getResourceData(nodes)).toEqual(expectedValue);
  });
});
