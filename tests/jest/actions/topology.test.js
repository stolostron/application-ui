// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
"use strict";

import {
  requestResource,
  receiveResourceError,
  receiveTopologySuccess,
  requestResourceDetails,
  receiveTopologyDetailsSuccess,
  restoreSavedTopologyFilters,
  updateTopologyFilters,
  getResourceData,
  findMatchingCluster
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

describe("findMatchingCluster", () => {
  const argoApp = {
    targetRevision: "HEAD",
    namespace: "openshift-gitops",
    name: "vb-byurl-pod",
    _hubClusterResource: "true",
    repoURL: "https://github.com/fxiang1/app-samples.git",
    kind: "application",
    destinationServer: "https://abcd.com:6443",
    status: "Healthy",
    apiversion: "v1alpha1",
    path: "mortgagepod",
    destinationNamespace: "vb-pod-byurl",
    apigroup: "argoproj.io",
    cluster: "local-cluster"
  };

  const argoAppNoServerInfo = {
    targetRevision: "HEAD",
    namespace: "openshift-gitops",
    name: "vb-byurl-pod",
    _hubClusterResource: "true",
    repoURL: "https://github.com/fxiang1/app-samples.git",
    kind: "application",
    clusterName: "ui-managed",
    status: "Healthy",
    apiversion: "v1alpha1",
    path: "mortgagepod",
    destinationNamespace: "vb-pod-byurl",
    apigroup: "argoproj.io",
    cluster: "local-cluster"
  };

  const argoAppNoClusterFound = {
    targetRevision: "HEAD",
    namespace: "openshift-gitops",
    name: "vb-byurl-pod",
    _hubClusterResource: "true",
    repoURL: "https://github.com/fxiang1/app-samples.git",
    kind: "application",
    destinationServer: "https://abcd-unknown.com:6443",
    status: "Healthy",
    apiversion: "v1alpha1",
    path: "mortgagepod",
    destinationNamespace: "vb-pod-byurl",
    apigroup: "argoproj.io",
    cluster: "local-cluster"
  };

  const argoMappingInfo = [
    {
      _uid: "local-cluster/b3a94f33-3e43-4a0e-8a3e-7d9b855ab179",
      cluster: "local-cluster",
      _rbac: "openshift-gitops_null_secrets",
      _hubClusterResource: "true",
      label:
        "apps.open-cluster-management.io/acm-cluster=true; argocd.argoproj.io/secret-type=cluster; open-cluster-management.io/cluster-name=ui-managed; open-cluster-management.io/cluster-server=abcd.com",
      namespace: "openshift-gitops",
      apiversion: "v1",
      created: "2021-03-31T15:03:23Z",
      name: "ui-managed-cluster-secret",
      kind: "secret"
    }
  ];
  it("should return ui-managed cluster name", () => {
    expect(findMatchingCluster(argoApp, argoMappingInfo)).toEqual("ui-managed");
  });

  it("should return the cluster name directly, this is using the argo dest by name", () => {
    expect(findMatchingCluster(argoAppNoServerInfo, argoMappingInfo)).toEqual(
      undefined
    );
  });

  it("should return the sever name,  mapping not found the cluster name", () => {
    expect(findMatchingCluster(argoAppNoClusterFound, argoMappingInfo)).toEqual(
      "https://abcd-unknown.com:6443"
    );
  });

  it("should return the sever name,  there is no mapping info", () => {
    expect(findMatchingCluster(argoAppNoClusterFound, [])).toEqual(
      "https://abcd-unknown.com:6443"
    );
  });
});

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
      isArgoApp: false,
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
      isArgoApp: false,
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
      isArgoApp: false,
      relatedKinds: ["application", "subscription", "route"],
      subscription: null
    };

    expect(getResourceData(nodes)).toEqual(expectedValue);
  });
});
