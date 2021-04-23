// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
"use strict";

import {
  getClusterName,
  nodeMustHavePods,
  isDeployableResource,
  getRouteNameWithoutIngressHash,
  getOnlineClusters,
  getActiveFilterCodes,
  filterSubscriptionObject,
  getClusterHost,
  getPulseStatusForSubscription,
  getExistingResourceMapKey,
  syncControllerRevisionPodStatusMap,
  fixMissingStateOptions,
  namespaceMatchTargetServer,
  updateAppClustersMatchingSearch,
  getTargetNsForNode
} from "../../../../../../src-web/components/Topology/utils/diagram-helpers-utils";

describe("getTargetNsForNode", () => {
  const v1 = {
    cluster: "local-cluster",
    kind: "namespace",
    name: "helloworld-123"
  };
  const v2 = {
    cluster: "local-cluster",
    kind: "namespace",
    name: "helloworld-456"
  };
  const inputNodeNS = {
    id:
      "member--member--deployable--member--clusters--local-cluster--vb-crash-ns--vb-app-crash-subscription-1-seeds-managed-acm-hello-world-helloworld-namespace--namespace--helloworld",
    name: "helloworld",
    clusters: {
      specs: {
        targetNamespaces: {
          "local-cluster": ["helloworld", "helloworld1"]
        }
      }
    },
    cluster: null,
    clusterName: null,
    type: "namespace",
    specs: {
      raw: {
        apiVersion: "v1",
        kind: "Namespace",
        metadata: {
          name: "helloworld"
        }
      },
      deployStatuses: [],
      isDesign: false,
      parent: {
        parentId: "member--clusters--local-cluster",
        parentName: "local-cluster",
        parentType: "cluster"
      },
      clustersNames: ["local-cluster"],
      searchClusters: [
        {
          _clusterNamespace: "local-cluster",
          name: "local-cluster",
          kind: "cluster",
          HubAcceptedManagedCluster: "True",
          ManagedClusterConditionAvailable: "True",
          status: "OK"
        }
      ],
      namespaceModel: {
        "helloworld-123-local-cluster": [v1],
        "helloworld-45-local-cluster": [v2]
      },
      pulse: "green",
      shapeType: "namespace"
    },
    namespace: "vb-crash-ns"
  };

  it("return local-cluster namespace for namespace node type ", () => {
    expect(
      getTargetNsForNode(inputNodeNS, [v1, v2], "local-cluster", "*")
    ).toEqual([
      "helloworld",
      "helloworld1",
      "helloworld-123",
      "helloworld-456"
    ]);
  });

  const polModel = {
    "openshift-gitops-installed-local-cluster": [
      {
        name: "openshift-gitops-installed",
        cluster: "local-cluster",
        kind: "policy",
        namespace: "vb-crash-ns"
      }
    ]
  };

  const inputNodePolicy = {
    id:
      "member--member--deployable--member--clusters--local-cluster--vb-crash-ns--vb-app-crash-subscription-1-seeds-managed-configuration-openshift-gitops-installed-policy--policy--openshift-gitops-installed",
    uid:
      "member--member--deployable--member--clusters--local-cluster--vb-crash-ns--vb-app-crash-subscription-1-seeds-managed-configuration-openshift-gitops-installed-policy--policy--openshift-gitops-installed",
    name: "openshift-gitops-installed",
    cluster: null,
    clusterName: null,
    type: "policy",
    specs: {
      raw: {
        apiVersion: "policy.open-cluster-management.io/v1",
        kind: "Policy",
        metadata: {
          name: "openshift-gitops-installed",
          namespace: "policy"
        }
      },
      deployStatuses: [],
      isDesign: false,
      parent: {
        parentId: "member--clusters--local-cluster",
        parentName: "local-cluster",
        parentType: "cluster"
      },
      clustersNames: ["local-cluster"],
      searchClusters: [
        {
          name: "local-cluster",
          kind: "cluster",
          ManagedClusterConditionAvailable: "True",
          status: "OK"
        }
      ],
      policyModel: polModel,
      pulse: "green",
      shapeType: "policy"
    },
    namespace: "vb-crash-ns"
  };

  it("return local-cluster namespace for policy node type ", () => {
    expect(
      getTargetNsForNode(
        inputNodePolicy,
        Object.values(polModel)[0],
        "local-cluster",
        "openshift-gitops-installed",
        "*"
      )
    ).toEqual(["vb-crash-ns"]);
  });
});

describe("updateAppClustersMatchingSearch", () => {
  const searchClusters = [
    {
      name: "local-cluster",
      consoleURL: "https://console-openshift-console.apps.app-abcd.com"
    },
    {
      name: "ui-managed",
      consoleURL: "https://console-openshift-console.apps.app-abcd.managed.com"
    },
    {
      HubAcceptedManagedCluster: "True",
      ManagedClusterConditionAvailable: "True",
      kind: "cluster",
      label: "cloud=Amazon; environment=Dev; name=fxiang-eks; vendor=EKS",
      name: "fxiang-eks"
    }
  ];
  const clsNode1 = {
    id: "member--clusters--",
    specs: {
      appClusters: [
        "local-cluster",
        "ui-managed",
        "https://api.app-abcd.com:1234",
        "https://api.app-abcd.managed_no_match.com:6999",
        "https://api.app-abcd.managed.com:6999",
        "https://ABCD.gr7.123.eks.amazonaws.com",
        "abcd:aws:eks:123:456:cluster/fxiang-eks",
        "abcd:aws:eks:123:456:cluster/fxiang-eks-cluster"
      ],
      targetNamespaces: {
        "https://ABCD.gr7.123.eks.amazonaws.com": ["default"],
        "abcd:aws:eks:123:456:cluster/fxiang-eks": ["helloworld-eks2"],
        "abcd:aws:eks:123:456:cluster/fxiang-eks-cluster": ["helloworld-eks3"],
        "https://api.app-abcd.com:1234": ["localNS1", "localNS2"],
        "https://api.app-abcd.managed_no_match.com:6999": ["a", "b"],
        "https://api.app-abcd.managed.com:6999": ["namespace1", "namespace2"],
        "ui-managed": ["namespace1", "namespace3"],
        "local-cluster": ["namespace4"]
      }
    }
  };
  const resultNode1 = {
    id: "member--clusters--",
    specs: {
      clusters: searchClusters,
      appClusters: [
        "fxiang-eks",
        "https://api.app-abcd.managed_no_match.com:6999",
        "local-cluster",
        "ui-managed"
      ],
      targetNamespaces: {
        "https://ABCD.gr7.123.eks.amazonaws.com": ["default"],
        "abcd:aws:eks:123:456:cluster/fxiang-eks": ["helloworld-eks2"],
        "abcd:aws:eks:123:456:cluster/fxiang-eks-cluster": ["helloworld-eks3"],
        "https://api.app-abcd.com:1234": ["localNS1", "localNS2"],
        "https://api.app-abcd.managed_no_match.com:6999": ["a", "b"],
        "https://api.app-abcd.managed.com:6999": ["namespace1", "namespace2"],
        "ui-managed": ["namespace1", "namespace2", "namespace3"],
        "local-cluster": ["localNS1", "localNS2", "namespace4"],
        "fxiang-eks": ["helloworld-eks2", "helloworld-eks3"]
      }
    }
  };
  it("groups namespaces to clusters; adds namespace2 ns to ui-managed; adds localNS1,localNS2 to local cluster", () => {
    expect(updateAppClustersMatchingSearch(clsNode1, searchClusters)).toEqual(
      resultNode1
    );
  });
});

describe("updateAppClustersMatchingSearch", () => {
  const searchClusters = [
    {
      name: "local-cluster",
      consoleURL: "https://console-openshift-console.apps.app-abcd.com"
    },
    {
      name: "ui-managed",
      consoleURL: "https://console-openshift-console.apps.app-abcd.managed.com"
    },
    {
      HubAcceptedManagedCluster: "True",
      ManagedClusterConditionAvailable: "True",
      kind: "cluster",
      label: "cloud=Amazon; environment=Dev; name=fxiang-eks; vendor=EKS",
      name: "fxiang-eks"
    }
  ];
  const clsNode1 = {
    id: "member--clusters--feng",
    specs: {
      appClusters: ["local-cluster", "ui-managed"],
      targetNamespaces: {
        "ui-managed": ["namespace1", "namespace3"],
        "local-cluster": ["namespace4"]
      }
    }
  };
  const resultNode1 = {
    id: "member--clusters--feng",
    specs: {
      appClusters: ["local-cluster", "ui-managed"],
      targetNamespaces: {
        "ui-managed": ["namespace1", "namespace3"],
        "local-cluster": ["namespace4"]
      },
      clusters: searchClusters
    }
  };
  it("acm clusters should return as is", () => {
    expect(updateAppClustersMatchingSearch(clsNode1, searchClusters)).toEqual(
      resultNode1
    );
  });
});

describe("getOnlineClusters", () => {
  const inputNodeOffLineRemote = {
    id: "member--clusters--",
    specs: {
      searchClusters: [
        {
          name: "local-cluster",
          status: "OK"
        },
        {
          name: "ui-managed",
          ManagedClusterConditionAvailable: "Unknown"
        }
      ],
      clustersNames: ["local-cluster", "ui-managed"]
    }
  };
  const inputNodeAllAvailable = {
    id: "member--clusters--",
    specs: {
      searchClusters: [
        {
          name: "local-cluster",
          status: "OK"
        },
        {
          name: "ui-managed",
          ManagedClusterConditionAvailable: "True"
        }
      ],
      clustersNames: ["local-cluster", "ui-managed"]
    }
  };
  it("returns only local cluster", () => {
    expect(getOnlineClusters(inputNodeOffLineRemote)).toEqual([
      "local-cluster"
    ]);
  });
  it("returns all clusters", () => {
    expect(getOnlineClusters(inputNodeAllAvailable)).toEqual([
      "local-cluster",
      "ui-managed"
    ]);
  });
});

describe("getClusterName node returns clustersNames", () => {
  it("should return empty string", () => {
    const clsNode1 = {
      id: "member--clusters--feng,feng2--",
      specs: {
        clustersNames: ["local-cluster", "ui-managed"]
      }
    };
    expect(getClusterName(clsNode1.id, clsNode1)).toEqual(
      "local-cluster,ui-managed"
    );
  });
});

describe("getClusterName node returns union of clustersNames and appClusters", () => {
  it("should return empty string", () => {
    const clsNode1 = {
      id: "member--clusters--feng,feng2--",
      clusters: {
        specs: {
          appClusters: ["appCls1", "appCls2"]
        }
      },
      specs: {
        clustersNames: ["local-cluster", "ui-managed"]
      }
    };
    expect(getClusterName(undefined, clsNode1, true)).toEqual(
      "local-cluster,ui-managed,appCls1,appCls2"
    );
  });
});

describe("getClusterName node clusters from nodeId", () => {
  it("should return empty string", () => {
    const clsNode1 = {
      id: "member--clusters--feng,feng2--",
      clusters: {
        specs: {
          appClusters: ["appCls1", "appCls2"]
        }
      },
      specs: {
        clustersNames: ["local-cluster", "ui-managed"]
      }
    };
    expect(getClusterName(clsNode1.id)).toEqual("feng,feng2");
  });
});

describe("getClusterName node clusters from nodeId, local cluster", () => {
  it("should return empty string", () => {
    const clsNode1 = {
      id: "member--",
      clusters: {
        specs: {
          appClusters: ["appCls1", "appCls2"]
        }
      },
      specs: {
        clustersNames: ["local-cluster", "ui-managed"]
      }
    };
    expect(getClusterName(clsNode1.id)).toEqual("local-cluster");
  });
});

describe("nodeMustHavePods undefined data", () => {
  it("nodeMustHavePods", () => {
    expect(nodeMustHavePods(undefined)).toEqual(false);
  });
});

describe("nodeMustHavePods node with no pods data", () => {
  const node = {
    type: "daemonset1",
    specs: {
      raw: {
        spec: {}
      }
    }
  };
  it("nodeMustHavePods", () => {
    expect(nodeMustHavePods(node)).toEqual(false);
  });
});

describe("nodeMustHavePods node with replicas", () => {
  const node = {
    type: "daemonset3",
    specs: {
      raw: {
        spec: {
          replicas: 3
        }
      }
    }
  };
  it("nodeMustHavePods with replicas", () => {
    expect(nodeMustHavePods(node)).toEqual(true);
  });
});

describe("nodeMustHavePods node has desired", () => {
  const node = {
    type: "daemonset",
    specs: {
      raw: {
        spec: {
          desired: 3
        }
      }
    }
  };
  it("nodeMustHavePods has desired", () => {
    expect(nodeMustHavePods(node)).toEqual(true);
  });
});

describe("nodeMustHavePods node with pods data", () => {
  const node = {
    type: "deployment",
    specs: {
      raw: {
        spec: {
          template: {
            spec: {
              containers: [
                {
                  name: "c1"
                }
              ]
            }
          }
        }
      }
    }
  };
  it("nodeMustHavePods", () => {
    expect(nodeMustHavePods(node)).toEqual(true);
  });
});
describe("nodeMustHavePods node with pods POD object", () => {
  const node = {
    type: "pod"
  };
  it("nodeMustHavePods POD object", () => {
    expect(nodeMustHavePods(node)).toEqual(true);
  });
});

describe("isDeployableResource for regular subscription", () => {
  const node = {
    id: "member--subscription--default--mortgagedc-subscription",
    name: "mortgagedcNOStatus",
    specs: {
      raw: { spec: {} },
      subscriptionModel: {
        "mortgagedc-subscription-braveman": {},
        "mortgagedc-subscription-braveman2": {}
      }
    },
    type: "subscription"
  };

  it("returns false for regular subscription ", () => {
    expect(isDeployableResource(node)).toEqual(false);
  });
});

describe("isDeployableResource for deployable subscription", () => {
  const node = {
    id:
      "member--member--deployable--member--clusters--birsan2-remote--default--val-op-subscription-1-tmp-val-op-subscription-1-master-operators-config-cert-manager-operator-rhmp-test-subscription--subscription--cert-manager-operator-rhmp-test",
    name: "cert-manager-operator-rhmp-test",
    namespace: "default",
    specs: {
      raw: {
        spec: {
          apiVersion: "operators.coreos.com/v1alpha1",
          kind: "Subscription"
        }
      }
    },
    type: "subscription"
  };

  it("returns true for deployable subscription ", () => {
    expect(isDeployableResource(node)).toEqual(true);
  });
});

describe("getRouteNameWithoutIngressHash", () => {
  const node = {
    apigroup: "apps.open-cluster-management.io",
    apiversion: "v1",
    channel: "ggithubcom-fxiang1-app-samples-ns/ggithubcom-fxiang1-app-samples",
    cluster: "local-cluster",
    kind: "subscription",
    label:
      "app=ingress-nginx; hosting-deployable-name=ingress-nginx-subscription-1-deployable; subscription-pause=false",
    localPlacement: "true",
    name: "ingress-nginx-subscription-1-local",
    namespace: "default",
    selfLink:
      "/apis/apps.open-cluster-management.io/v1/namespaces/default/subscriptions/ingress-nginx-subscription-1-local",
    status: "Subscribed",
    timeWindow: "none",
    _gitbranch: "master",
    _gitpath: "nginx",
    _hostingDeployable:
      "local-cluster/ingress-nginx-subscription-1-deployable-66dlk",
    _hostingSubscription: "default/ingress-nginx-subscription-1",
    _hubClusterResource: "true",
    _rbac: "default_apps.open-cluster-management.io_subscriptions",
    _uid: "local-cluster/748df82d-cf54-4044-96b6-eb10d8705952"
  };

  it("returns same name since this is not Route object ", () => {
    expect(getRouteNameWithoutIngressHash(node, node.name)).toEqual(node.name);
  });
});

describe("getRouteNameWithoutIngressHash", () => {
  const node = {
    apigroup: "route.openshift.io",
    apiversion: "v1",
    cluster: "local-cluster",
    kind: "route",
    name: "nginx-virtual-host-ingress-placement-t28kg",
    namespace: "default",
    selfLink:
      "/apis/route.openshift.io/v1/namespaces/default/routes/nginx-virtual-host-ingress-placement-t28kg",
    _hostingDeployable:
      "ggithubcom-fxiang1-app-samples-ns/ggithubcom-fxiang1-app-samples-Ingress-nginx-virtual-host-ingress-placement",
    _hostingSubscription: "default/ingress-nginx-subscription-1-local",
    _hubClusterResource: "true",
    _rbac: "default_route.openshift.io_routes",
    _uid: "local-cluster/317a533e-95f5-4a7e-b450-9437ea4dc7ee"
  };

  it("returns name without hash since this is a Route object generated from Ingress", () => {
    expect(getRouteNameWithoutIngressHash(node, node.name)).toEqual(
      "nginx-virtual-host-ingress-placement"
    );
  });
});

describe("getRouteNameWithoutIngressHash", () => {
  const node = {
    apigroup: "route.openshift.io",
    apiversion: "v1",
    cluster: "local-cluster",
    kind: "route",
    name: "nginx",
    namespace: "default",
    selfLink: "/apis/route.openshift.io/v1/namespaces/default/routes/nginx",
    _hostingDeployable:
      "ggithubcom-open-cluster-management-demo-subscription-gitops-ns/ggithubcom-open-cluster-management-demo-subscription-gitops-Route-nginx",
    _hostingSubscription: "default/route-ingress-subscription-1-local",
    _hubClusterResource: "true",
    _rbac: "default_route.openshift.io_routes",
    _uid: "local-cluster/a5790b59-7555-4805-8596-4b901bb824d0"
  };

  it("returns same name since this is a Route object but not generated by Ingress", () => {
    expect(getRouteNameWithoutIngressHash(node, node.name)).toEqual("nginx");
  });
});

describe("getOnlineCluster ok and pending", () => {
  //const clusterNamesA = ["cluster1", "cluster2", "cluster3"];
  const clusterObjs = [
    {
      metadata: {
        name: "cluster1"
      },
      status: "ok"
    },
    {
      metadata: {
        name: "cluster2"
      },
      status: "pendingimport"
    },
    {
      metadata: {
        name: "cluster3"
      },
      status: "offline"
    }
  ];
  const node = {
    specs: {
      clustersNames: ["cluster1", "cluster2", "cluster3"],
      searchClusters: clusterObjs
    }
  };
  it("should process cluster node status", () => {
    expect(getOnlineClusters(node)).toEqual(["cluster1", "cluster2"]);
  });
});

describe("getActiveFilterCodes all statuses filtered", () => {
  const resourceStatuses = new Set(["green", "yellow", "orange", "red"]);

  it("should get filter codes", () => {
    expect(getActiveFilterCodes(resourceStatuses)).toEqual(
      new Set([3, 2, 1, 0])
    );
  });
});

describe("filterSubscriptionObject simple subscription object", () => {
  const subs = {
    sub1: [
      {
        status: "Subscribed"
      }
    ],
    sub2: [
      {
        status: "Propagated"
      }
    ],
    sub3: [
      {
        status: "Fail"
      }
    ]
  };
  const resultSubs = {
    sub1: { status: "Subscribed" },
    sub2: { status: "Propagated" },
    sub3: { status: "Fail" }
  };

  it("should filter object", () => {
    expect(filterSubscriptionObject(subs, new Set([3, 2, 0]))).toEqual(
      resultSubs
    );
  });
});

describe("getClusterHost", () => {
  it("should host from cluster URL", () => {
    expect(getClusterHost("https://console-openshift-console.222")).toEqual(
      "222"
    );
  });
});

describe("getPulseStatusForSubscription no subscriptionItem.status", () => {
  const node = {
    id: "member--subscription--default--mortgagedc-subscription",
    name: "mortgagedcNOStatus",
    specs: {
      raw: { spec: {} },
      subscriptionModel: {
        "mortgagedc-subscription-braveman": [],
        "mortgagedc-subscription-braveman2": []
      },
      row: 12
    },
    type: "subscription"
  };

  it("getPulseStatusForSubscription no subscriptionItem.status", () => {
    expect(getPulseStatusForSubscription(node)).toEqual("yellow");
  });
});

describe("getExistingResourceMapKey", () => {
  const resourceMap = {
    "replicaset-nginx-placement-cluster1, cluster2": "test"
  };

  const relatedKind = {
    cluster: "cluster1",
    kind: "replicaset"
  };

  const relatedKindBadCluster = {
    cluster: "cluster3"
  };

  it("should get key from resourceMap", () => {
    expect(
      getExistingResourceMapKey(
        resourceMap,
        "replicaset-nginx-placement",
        relatedKind
      )
    ).toEqual("replicaset-nginx-placement-cluster1, cluster2");
  });

  it("should not get key from resourceMap", () => {
    expect(
      getExistingResourceMapKey(resourceMap, "non-existent-name", relatedKind)
    ).toEqual(null);
  });

  it("should not get key from resourceMap - non-existent cluster", () => {
    expect(
      getExistingResourceMapKey(
        resourceMap,
        "replicaset-nginx-placement",
        relatedKindBadCluster
      )
    ).toEqual(null);
  });
});

describe("syncControllerRevisionPodStatusMap", () => {
  const resourceMap = {
    "daemonset-mortgageds-deploy-fxiang-eks": {
      specs: {
        daemonsetModel: {
          "mortgageds-deploy-fxiang-eks": {
            apigroup: "apps",
            apiversion: "v1",
            available: 6,
            cluster: "fxiang-eks",
            created: "2021-01-25T21:53:12Z",
            current: 6,
            desired: 6,
            kind: "daemonset",
            label: "app=mortgageds-mortgage",
            name: "mortgageds-deploy",
            namespace: "feng",
            ready: 6,
            selfLink:
              "/apis/apps/v1/namespaces/feng/daemonsets/mortgageds-deploy",
            updated: 6,
            _clusterNamespace: "fxiang-eks",
            _hostingDeployable:
              "mortgageds-ch/mortgageds-channel-DaemonSet-mortgageds-deploy",
            _hostingSubscription: "feng/mortgageds-subscription",
            _rbac: "fxiang-eks_apps_daemonsets",
            _uid: "fxiang-eks/ff6fb8f2-d3ec-433a-93d4-3d4389a8c4b4"
          }
        }
      }
    },
    "controllerrevision-mortgageds-deploy-fxiang-eks": {
      specs: {
        parent: {
          parentId:
            "member--member--deployable--member--clusters--fxiang-eks--feng--mortgageds-subscription-mortgageds-mortgageds-deploy-daemonset--daemonset--mortgageds-deploy",
          parentName: "mortgageds-deploy",
          parentType: "daemonset"
        }
      }
    }
  };

  const resourceMap2 = {
    "daemonset-mortgageds-deploy-": {
      specs: {
        daemonsetModel: {
          "mortgageds-deploy-fxiang-eks": {
            apigroup: "apps",
            apiversion: "v1",
            available: 6,
            cluster: "fxiang-eks",
            created: "2021-01-25T21:53:12Z",
            current: 6,
            desired: 6,
            kind: "daemonset",
            label: "app=mortgageds-mortgage",
            name: "mortgageds-deploy",
            namespace: "feng",
            ready: 6,
            selfLink:
              "/apis/apps/v1/namespaces/feng/daemonsets/mortgageds-deploy",
            updated: 6,
            _clusterNamespace: "fxiang-eks",
            _hostingDeployable:
              "mortgageds-ch/mortgageds-channel-DaemonSet-mortgageds-deploy",
            _hostingSubscription: "feng/mortgageds-subscription",
            _rbac: "fxiang-eks_apps_daemonsets",
            _uid: "fxiang-eks/ff6fb8f2-d3ec-433a-93d4-3d4389a8c4b4"
          }
        }
      }
    },
    "controllerrevision-mortgageds-deploy-fxiang-eks": {
      specs: {
        parent: {
          parentId:
            "member--member--deployable--member--clusters--fxiang-eks--feng--mortgageds-subscription-mortgageds-mortgageds-deploy-daemonset--daemonset--mortgageds-deploy",
          parentName: "mortgageds-deploy",
          parentType: "daemonset"
        }
      }
    }
  };

  const resourceMapNoParentPodModel = {
    "daemonset-mortgageds-deploy-fxiang-eks": {
      specs: {
        daemonsetModel: {
          "mortgageds-deploy-fxiang-eks": {
            apigroup: "apps",
            apiversion: "v1",
            available: 6,
            cluster: "fxiang-eks",
            created: "2021-01-25T21:53:12Z",
            current: 6,
            desired: 6,
            kind: "daemonset",
            label: "app=mortgageds-mortgage",
            name: "mortgageds-deploy",
            namespace: "feng",
            ready: 6,
            selfLink:
              "/apis/apps/v1/namespaces/feng/daemonsets/mortgageds-deploy",
            updated: 6,
            _clusterNamespace: "fxiang-eks",
            _hostingDeployable:
              "mortgageds-ch/mortgageds-channel-DaemonSet-mortgageds-deploy",
            _hostingSubscription: "feng/mortgageds-subscription",
            _rbac: "fxiang-eks_apps_daemonsets",
            _uid: "fxiang-eks/ff6fb8f2-d3ec-433a-93d4-3d4389a8c4b4"
          }
        }
      }
    },
    "controllerrevision-mortgageds-deploy-fxiang-eks": {
      specs: {
        parent: {
          parentId:
            "member--member--deployable--member--clusters--fxiang-eks--feng--mortgageds-subscription-mortgageds-mortgageds-deploy-daemonset--daemonset--mortgageds-deploy",
          parentName: "mortgageds-deploy",
          parentType: "daemonset"
        }
      }
    }
  };

  it("should sync controllerRevision resource", () => {
    expect(syncControllerRevisionPodStatusMap(resourceMap)).toEqual(undefined);
  });

  it("should sync controllerRevision resource, no cluster on map key", () => {
    expect(syncControllerRevisionPodStatusMap(resourceMap2)).toEqual(undefined);
  });

  it("should not sync controllerRevision resource", () => {
    expect(
      syncControllerRevisionPodStatusMap(resourceMapNoParentPodModel)
    ).toEqual(undefined);
  });
});

describe("fixMissingStateOptions", () => {
  const itemNoAvailableReady = [
    {
      _uid: "fxiang-eks/7c30f5d2-a522-40be-a8a6-5e833012b17b",
      apiversion: "v1",
      created: "2021-01-28T19:24:10Z",
      current: 1,
      apigroup: "apps",
      kind: "statefulset",
      name: "mariadb",
      namespace: "val-mariadb-helm",
      selfLink:
        "/apis/apps/v1/namespaces/val-mariadb-helm/statefulsets/mariadb",
      cluster: "fxiang-eks",
      desired: 1,
      label:
        "app.kubernetes.io/component=primary; app.kubernetes.io/instance=mariadb; app.kubernetes.io/managed-by=Helm; app.kubernetes.io/name=mariadb; helm.sh/chart=mariadb-9.3.0",
      _clusterNamespace: "fxiang-eks",
      _rbac: "fxiang-eks_apps_statefulsets"
    }
  ];

  const itemNoAvailable = [
    {
      _uid: "fxiang-eks/7c30f5d2-a522-40be-a8a6-5e833012b17b",
      apiversion: "v1",
      created: "2021-01-28T19:24:10Z",
      current: 1,
      apigroup: "apps",
      kind: "statefulset",
      name: "mariadb",
      namespace: "val-mariadb-helm",
      selfLink:
        "/apis/apps/v1/namespaces/val-mariadb-helm/statefulsets/mariadb",
      cluster: "fxiang-eks",
      desired: 1,
      ready: 1,
      label:
        "app.kubernetes.io/component=primary; app.kubernetes.io/instance=mariadb; app.kubernetes.io/managed-by=Helm; app.kubernetes.io/name=mariadb; helm.sh/chart=mariadb-9.3.0",
      _clusterNamespace: "fxiang-eks",
      _rbac: "fxiang-eks_apps_statefulsets"
    }
  ];

  const itemComplete = [
    {
      _uid: "fxiang-eks/7c30f5d2-a522-40be-a8a6-5e833012b17b",
      apiversion: "v1",
      created: "2021-01-28T19:24:10Z",
      current: 1,
      apigroup: "apps",
      kind: "statefulset",
      name: "mariadb",
      namespace: "val-mariadb-helm",
      selfLink:
        "/apis/apps/v1/namespaces/val-mariadb-helm/statefulsets/mariadb",
      cluster: "fxiang-eks",
      desired: 1,
      ready: 1,
      label:
        "app.kubernetes.io/component=primary; app.kubernetes.io/instance=mariadb; app.kubernetes.io/managed-by=Helm; app.kubernetes.io/name=mariadb; helm.sh/chart=mariadb-9.3.0",
      _clusterNamespace: "fxiang-eks",
      _rbac: "fxiang-eks_apps_statefulsets",
      available: 1
    }
  ];

  it("should get complete item when no available and ready set", () => {
    expect(fixMissingStateOptions(itemNoAvailableReady)).toEqual(itemComplete);
  });

  it("should get complete item when no available", () => {
    expect(fixMissingStateOptions(itemNoAvailable)).toEqual(itemComplete);
  });

  it("should get complete item when full data set", () => {
    expect(fixMissingStateOptions(itemComplete)).toEqual(itemComplete);
  });
});

describe("namespaceMatchTargetServer", () => {
  const relatedKind = {
    apigroup: "route.openshift.io",
    apiversion: "v1",
    cluster: "ui-dev-remote",
    created: "2021-02-10T02:32:02Z",
    kind: "route",
    label: "app.kubernetes.io/instance=helloworld-remote; app=helloworld-app",
    name: "helloworld-app-route",
    namespace: "argo-helloworld",
    selfLink:
      "/apis/route.openshift.io/v1/namespaces/argo-helloworld/routes/helloworld-app-route",
    _clusterNamespace: "ui-dev-remote",
    _rbac: "ui-dev-remote_route.openshift.io_routes",
    _uid: "ui-dev-remote/ee84f8f5-bb3e-4c67-a918-2804e74f3f67"
  };

  const resourceMapForObject = {
    clusters: {
      specs: {
        clusters: [
          {
            destination: {
              namespace: "argo-helloworld",
              server: "https://kubernetes.default.svc"
            },
            metadata: {
              name: "local-cluster",
              namespace: "local-cluster"
            },
            status: "ok"
          },
          {
            destination: {
              namespace: "argo-helloworld",
              server:
                "https://api.app-aws-4615-zhl45.dev06.red-chesterfield.com:6443"
            },
            metadata: {
              name: "app-aws-4615-zhl45",
              namespace: "app-aws-4615-zhl45"
            },
            status: "ok"
          },
          {
            destination: {
              name: "ui-dev-remote",
              namespace: "argo-helloworld2"
            },
            metadata: {
              name: "ui-dev-remote",
              namespace: "ui-dev-remote"
            },
            status: "ok"
          }
        ]
      }
    }
  };

  it("should match the target server", () => {
    expect(
      namespaceMatchTargetServer(relatedKind, resourceMapForObject)
    ).toEqual(true);
  });
});
