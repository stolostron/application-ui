/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/
"use strict";

import {
  getAllFilters,
  getAvailableFilters,
  getSearchFilter,
  filterNodes
} from "../../../../../../src-web/components/Topology/viewer/defaults/filtering";

const nodes = [
  {
    id: "application--nginx-app-3",
    uid: "application--nginx-app-3",
    name: "nginx-app-3",
    cluster: null,
    clusterName: null,
    type: "application",
    specs: {
      isDesign: true,
      raw: {
        apiVersion: "app.k8s.io/v1beta1",
        kind: "Application",
        metadata: {
          annotations: {
            "apps.open-cluster-management.io/deployables":
              "ns-sub-1/example-configmap",
            "apps.open-cluster-management.io/subscriptions": "ns-sub-1/nginx"
          },
          labels: { app: "nginx-app-details" },
          name: "nginx-app-3",
          namespace: "ns-sub-1",
          resourceVersion: "1487968",
          selfLink:
            "/apis/app.k8s.io/v1beta1/namespaces/ns-sub-1/applications/nginx-app-3",
          uid: "00bb7699-f371-43a6-8edf-5ef10f42f4ff"
        },
        spec: {
          componentKinds: [
            { group: "apps.open-cluster-management.io", kind: "Subscription" }
          ],
          descriptor: {},
          selector: {
            matchLabels: { app: "nginx-app-details" }
          }
        },
        status: {},
        activeChannel: "__ALL__/__ALL__//__ALL__/__ALL__",
        channels: ["ns-sub-1/nginx//ns-ch/predev-ch"],
        row: 0
      },
      namespace: "ns-sub-1",
      topology: null,
      labels: null,
      __typename: "Resource"
    }
  },
  {
    id: "member--subscription--ns-sub-1--nginx",
    uid: "member--subscription--ns-sub-1--nginx",
    name: "nginx",
    cluster: null,
    clusterName: null,
    type: "subscription",
    specs: {
      isDesign: true,
      hasRules: true,
      isPlaced: false,
      raw: {
        apiVersion: "apps.open-cluster-management.io/v1",
        kind: "Subscription",
        metadata: {
          labels: { app: "nginx-app-details" },
          name: "nginx",
          namespace: "ns-sub-1",
          resourceVersion: "1488006",
          selfLink:
            "/apis/apps.open-cluster-management.io/v1/namespaces/ns-sub-1/subscriptions/nginx",
          uid: "54c0d0fe-9711-462b-85ad-3d7e73e9ab89"
        },
        spec: {
          channel: "ns-ch/predev-ch",
          name: "nginx-ingress",
          packageFilter: { version: "1.20.x" },
          placement: {
            placementRef: { kind: "PlacementRule", name: "towhichcluster" }
          }
        },
        status: {
          lastUpdateTime: "2020-03-18T20:06:47Z",
          message: "Active",
          phase: "Propagated"
        }
      },
      row: 17
    },
    namespace: "ns-sub-1",
    topology: null,
    labels: null,
    __typename: "Resource"
  },
  {
    id: "member--rules--ns-sub-1--towhichcluster--0",
    uid: "member--rules--ns-sub-1--towhichcluster--0",
    name: "towhichcluster",
    cluster: null,
    clusterName: null,
    type: "rules",
    specs: {
      isDesign: true,
      raw: {
        apiVersion: "apps.open-cluster-management.io/v1",
        kind: "PlacementRule",
        metadata: {
          name: "towhichcluster",
          namespace: "ns-sub-1",
          resourceVersion: "1487942",
          selfLink:
            "/apis/apps.open-cluster-management.io/v1/namespaces/ns-sub-1/placementrules/towhichcluster",
          uid: "49788e0c-c540-49be-9e65-a1c46e4ac485"
        },
        spec: {
          clusterSelector: {}
        }
      },
      row: 35
    },
    namespace: "ns-sub-1",
    topology: null,
    labels: null,
    __typename: "Resource"
  }
];

const podNodes = [
  {
    cluster: null,
    clusterName: null,
    type: "pod",
    id:
      "member--pod--member--deployable--member--clusters--possiblereptile, braveman, sharingpenguin, relievedox--open-cluster-management--guestbook-app-guestbook-frontend-deployment--frontend",
    labels: null,
    name: "frontend",
    namespace: "",
    specs: {
      podStatus: {
        hasFailure: false,
        hasPending: false,
        hasRestarts: true,
        hostIPs: new Set([
          "10.0.130.141",
          "10.0.128.168",
          "10.0.134.47",
          "10.0.138.193",
          "10.0.135.12",
          "10.0.134.43",
          "10.0.137.176",
          "10.0.135.243",
          "10.0.132.29",
          "10.0.132.99",
          "10.0.135.34",
          "10.0.128.64"
        ])
      }
    }
  }
];
const options = {
  filtering: "application",
  layout: "application",
  showLineLabels: true,
  showGroupTitles: false,
  scrollOnScroll: true
};

const activeFilters = {
  type: ["application", "rules", "subscription", "pod"]
};

const locale = "en-US";

describe("getAllFilters", () => {
  const mockData = {
    isLoaded: true,
    knownTypes: [],
    userIsFiltering: null
  };

  const typeToShapeMap = {
    application: { shape: "application", className: "design", nodeRadius: 30 },
    deployable: { shape: "deployable", className: "design" },
    subscription: { shape: "subscription", className: "design" },
    rules: { shape: "rules", className: "design" },
    clusters: { shape: "cluster", className: "container" },
    helmrelease: { shape: "chart", className: "container" },
    package: { shape: "chart", className: "container" },
    internet: { shape: "cloud", className: "internet" },
    host: { shape: "host", className: "host" },
    policy: { shape: "roundedSq", className: "design", nodeRadius: 30 },
    placement: { shape: "placement", className: "design" },
    cluster: { shape: "cluster", className: "container" },
    service: { shape: "service", className: "service" },
    deployment: { shape: "deployment", className: "deployment" },
    daemonset: { shape: "star4", className: "daemonset" },
    statefulset: { shape: "cylinder", className: "statefulset" },
    pod: { shape: "pod", className: "pod" },
    container: { shape: "irregularHexagon", className: "container" },
    cronjob: { shape: "clock", className: "default" },
    spare1: { shape: "star4", className: "daemonset" },
    spare2: { shape: "roundedSq", className: "daemonset" },
    spare3: { shape: "hexagon", className: "daemonset" },
    spare4: { shape: "irregularHexagon", className: "daemonset" },
    spare5: { shape: "roundedRect", className: "daemonset" }
  };

  const expectedResults = {
    activeFilters: {
      type: ["application", "rules", "subscription"]
    },
    availableFilters: {
      clusterNames: {
        availableSet: new Set(),
        name: "Cluster name"
      },
      labels: {
        availableSet: new Set(),
        name: "Labels"
      },
      namespaces: {
        availableSet: new Set(["<none>", "ns-sub-1"]),
        name: "Namespaces"
      },
      resourceStatuses: {
        availableSet: new Map([
          ["green", "Success"],
          ["yellow", "Pending"],
          ["orange", "Warning"],
          ["red", "Error"]
        ]),
        name: "Resource status"
      },
      type: ["application", "rules", "subscription"]
    },
    otherTypeFilters: []
  };

  it("should get all filters", () => {
    expect(
      getAllFilters(
        "application",
        typeToShapeMap,
        mockData.isLoaded,
        nodes,
        options,
        activeFilters,
        mockData.knownTypes,
        mockData.userIsFiltering,
        locale
      )
    ).toEqual(expectedResults);
  });
});

describe("getAvailableFilters cluster", () => {
  const map = new Map([
    ["recent", "Recent"],
    ["offline", "Offline"],
    ["violations", "Violations"]
  ]);

  const set1 = new Set();
  set1.add(undefined);

  const expectedResult = {
    clusterStatuses: {
      availableSet: map,
      name: "Cluster status"
    },
    k8type: {
      availableSet: set1,
      name: "Kubernetes type"
    },
    providers: {
      availableSet: set1,
      name: "Cloud providers"
    },
    purpose: {
      availableSet: set1,
      name: "Purpose"
    },
    region: {
      availableSet: set1,
      name: "Region"
    }
  };

  it("should get available filters", () => {
    expect(
      getAvailableFilters("cluster", nodes, options, activeFilters, locale)
    ).toEqual(expectedResult);
  });
});

describe("getAvailableFilters weave", () => {
  it("should get available filters", () => {
    const expectedResult = {
      labels: {
        availableSet: new Set(),
        name: "Labels"
      },
      namespaces: {
        availableSet: new Set(["<none>", "ns-sub-1"]),
        name: "Namespaces"
      }
    };

    expect(
      getAvailableFilters("weave", nodes, options, activeFilters, locale)
    ).toEqual(expectedResult);
  });
});

describe("getAvailableFilters policy", () => {
  const set1 = new Set();

  const expectedResult = {
    k8type: {
      availableSet: set1,
      name: "Kubernetes type"
    },
    providers: {
      availableSet: set1,
      name: "Cloud providers"
    },
    purpose: {
      availableSet: set1,
      name: "Purpose"
    },
    region: {
      availableSet: set1,
      name: "Region"
    }
  };
  it("should get available filters", () => {
    expect(
      getAvailableFilters("policy", nodes, options, activeFilters, locale)
    ).toEqual(expectedResult);
  });
});

describe("getAvailableFilters application", () => {
  const set1 = new Set();

  const expectedResult = {
    clusterNames: {
      availableSet: new Set(),
      name: "Cluster name"
    },
    labels: {
      availableSet: set1,
      name: "Labels"
    },
    namespaces: {
      availableSet: new Set(["<none>"]),
      name: "Namespaces"
    },
    resourceStatuses: {
      availableSet: new Map([
        ["green", "Success"],
        ["yellow", "Pending"],
        ["orange", "Warning"],
        ["red", "Error"]
      ]),
      name: "Resource status"
    }
  };

  it("should get available filters", () => {
    expect(
      getAvailableFilters(
        "application",
        podNodes,
        options,
        activeFilters,
        locale
      )
    ).toEqual(expectedResult);
  });
});

describe("getSearchFilters cluster", () => {
  const filters = {
    type: ["clusterStatuses", "providers"]
  };

  const expectedResult = {
    filters: {
      type: ["clusterStatuses", "providers"]
    },
    search: undefined
  };

  it("should get search filters", () => {
    expect(getSearchFilter("cluster", filters)).toEqual(expectedResult);
  });
});

describe("getSearchFilters weave", () => {
  const filters = {
    type: ["podStatuses", "hostIPs"]
  };

  const expectedResult = {
    filters: {
      type: ["podStatuses", "hostIPs"]
    },
    search: undefined
  };

  it("should get search filters", () => {
    expect(getSearchFilter("weave", filters)).toEqual(expectedResult);
  });
});

describe("getSearchFilters application", () => {
  const filters = {
    type: ["podStatuses", "hostIPs"]
  };

  const expectedResult = {
    filters: {
      type: ["podStatuses", "hostIPs"]
    },
    search: undefined
  };

  it("should get search filters", () => {
    expect(getSearchFilter("application", filters)).toEqual(expectedResult);
  });
});

describe("getSearchFilters policy", () => {
  const filters = {
    type: ["providers", "purpose"]
  };

  const expectedResult = {
    filters: {
      type: ["providers", "purpose"]
    },
    search: undefined
  };

  it("should get search filters", () => {
    expect(getSearchFilter("policy", filters)).toEqual(expectedResult);
  });
});

const expectedFilterNodeResult = [
  {
    cluster: null,
    clusterName: null,
    id: "application--nginx-app-3",
    name: "nginx-app-3",
    specs: {
      __typename: "Resource",
      isDesign: true,
      labels: null,
      namespace: "ns-sub-1",
      raw: {
        activeChannel: "__ALL__/__ALL__//__ALL__/__ALL__",
        apiVersion: "app.k8s.io/v1beta1",
        channels: ["ns-sub-1/nginx//ns-ch/predev-ch"],
        kind: "Application",
        metadata: {
          annotations: {
            "apps.open-cluster-management.io/deployables":
              "ns-sub-1/example-configmap",
            "apps.open-cluster-management.io/subscriptions": "ns-sub-1/nginx"
          },
          labels: {
            app: "nginx-app-details"
          },
          name: "nginx-app-3",
          namespace: "ns-sub-1",
          resourceVersion: "1487968",
          selfLink:
            "/apis/app.k8s.io/v1beta1/namespaces/ns-sub-1/applications/nginx-app-3",
          uid: "00bb7699-f371-43a6-8edf-5ef10f42f4ff"
        },
        row: 0,
        spec: {
          componentKinds: [
            {
              group: "apps.open-cluster-management.io",
              kind: "Subscription"
            }
          ],
          descriptor: {},
          selector: {
            matchLabels: {
              app: "nginx-app-details"
            }
          }
        },
        status: {}
      },
      topology: null
    },
    type: "application",
    uid: "application--nginx-app-3"
  },
  {
    __typename: "Resource",
    cluster: null,
    clusterName: null,
    id: "member--subscription--ns-sub-1--nginx",
    labels: null,
    name: "nginx",
    namespace: "ns-sub-1",
    specs: {
      hasRules: true,
      isDesign: true,
      isPlaced: false,
      raw: {
        apiVersion: "apps.open-cluster-management.io/v1",
        kind: "Subscription",
        metadata: {
          labels: {
            app: "nginx-app-details"
          },
          name: "nginx",
          namespace: "ns-sub-1",
          resourceVersion: "1488006",
          selfLink:
            "/apis/apps.open-cluster-management.io/v1/namespaces/ns-sub-1/subscriptions/nginx",
          uid: "54c0d0fe-9711-462b-85ad-3d7e73e9ab89"
        },
        spec: {
          channel: "ns-ch/predev-ch",
          name: "nginx-ingress",
          packageFilter: {
            version: "1.20.x"
          },
          placement: {
            placementRef: {
              kind: "PlacementRule",
              name: "towhichcluster"
            }
          }
        },
        status: {
          lastUpdateTime: "2020-03-18T20:06:47Z",
          message: "Active",
          phase: "Propagated"
        }
      },
      row: 17
    },
    topology: null,
    type: "subscription",
    uid: "member--subscription--ns-sub-1--nginx"
  },
  {
    __typename: "Resource",
    cluster: null,
    clusterName: null,
    id: "member--rules--ns-sub-1--towhichcluster--0",
    labels: null,
    name: "towhichcluster",
    namespace: "ns-sub-1",
    specs: {
      isDesign: true,
      raw: {
        apiVersion: "apps.open-cluster-management.io/v1",
        kind: "PlacementRule",
        metadata: {
          name: "towhichcluster",
          namespace: "ns-sub-1",
          resourceVersion: "1487942",
          selfLink:
            "/apis/apps.open-cluster-management.io/v1/namespaces/ns-sub-1/placementrules/towhichcluster",
          uid: "49788e0c-c540-49be-9e65-a1c46e4ac485"
        },
        spec: {
          clusterSelector: {}
        }
      },
      row: 35
    },
    topology: null,
    type: "rules",
    uid: "member--rules--ns-sub-1--towhichcluster--0"
  }
];

describe("filterNodes cluster", () => {
  it("should filter cluster nodes", () => {
    expect(filterNodes("cluster", nodes, activeFilters, {})).toEqual(
      expectedFilterNodeResult
    );
  });
});

describe("filterNodes weave", () => {
  it("should filter weave nodes", () => {
    expect(filterNodes("weave", nodes, activeFilters, {})).toEqual(
      expectedFilterNodeResult
    );
  });
});

describe("filterNodes application", () => {
  it("should filter application nodes", () => {
    expect(filterNodes("application", nodes, activeFilters, {})).toEqual(
      expectedFilterNodeResult
    );
  });
});

describe("filterNodes policy", () => {
  it("should filter policy nodes", () => {
    expect(filterNodes("policy", nodes, activeFilters, {})).toEqual(
      expectedFilterNodeResult
    );
  });
});
