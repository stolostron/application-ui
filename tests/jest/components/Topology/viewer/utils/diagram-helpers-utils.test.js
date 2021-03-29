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
  setArgoApplicationDeployStatus,
  getStatusForArgoApp,
  translateArgoHealthStatus,
  getPulseStatusForArgoApp
} from "../../../../../../src-web/components/Topology/utils/diagram-helpers-utils";

describe("getOnlineClusters", () => {
  const clusterNames = ["local-cluster", "ui-managed"];
  const clusterObjectsFromSearchOffLine = [
    {
      name: "local-cluster",
      status: "OK"
    },
    {
      name: "ui-managed",
      ManagedClusterConditionAvailable: "Unknown"
    }
  ];
  const clusterObjectsFromSearchAllAvailable = [
    {
      name: "local-cluster",
      status: "OK"
    },
    {
      name: "ui-managed",
      ManagedClusterConditionAvailable: "True"
    }
  ];
  it("returns only local cluster", () => {
    expect(
      getOnlineClusters(clusterNames, clusterObjectsFromSearchOffLine)
    ).toEqual(["local-cluster"]);
  });
  it("returns all clusters", () => {
    expect(
      getOnlineClusters(clusterNames, clusterObjectsFromSearchAllAvailable)
    ).toEqual(["local-cluster", "ui-managed"]);
  });
});

describe("getClusterName node id undefined", () => {
  it("should return empty string", () => {
    expect(getClusterName(undefined)).toEqual("");
  });
});

describe("getClusterName node id doesn't have cluster info", () => {
  it("should return empty string", () => {
    const nodeId =
      "member--deployable--member--subscription--default--ansible-tower-job-app-subscription--ansiblejob--bigjoblaunch";
    expect(getClusterName(nodeId)).toEqual("local-cluster");
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
  const clusterNames = ["cluster1", "cluster2", "cluster3"];
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
  it("should process cluster node status", () => {
    expect(getOnlineClusters(clusterNames, clusterObjs)).toEqual([
      "cluster1",
      "cluster2"
    ]);
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
    sub1: {
      status: "Subscribed"
    },
    sub2: {
      status: "Propagated"
    },
    sub3: {
      status: "Fail"
    }
  };

  it("should filter object", () => {
    expect(filterSubscriptionObject(subs, new Set([3, 2, 0]))).toEqual(subs);
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
        "mortgagedc-subscription-braveman": {},
        "mortgagedc-subscription-braveman2": {}
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

  it("should not sync controllerRevision resource", () => {
    expect(
      syncControllerRevisionPodStatusMap(resourceMapNoParentPodModel)
    ).toEqual(undefined);
  });
});

describe("fixMissingStateOptions", () => {
  const itemNoAvailableReady = {
    _uid: "fxiang-eks/7c30f5d2-a522-40be-a8a6-5e833012b17b",
    apiversion: "v1",
    created: "2021-01-28T19:24:10Z",
    current: 1,
    apigroup: "apps",
    kind: "statefulset",
    name: "mariadb",
    namespace: "val-mariadb-helm",
    selfLink: "/apis/apps/v1/namespaces/val-mariadb-helm/statefulsets/mariadb",
    cluster: "fxiang-eks",
    desired: 1,
    label:
      "app.kubernetes.io/component=primary; app.kubernetes.io/instance=mariadb; app.kubernetes.io/managed-by=Helm; app.kubernetes.io/name=mariadb; helm.sh/chart=mariadb-9.3.0",
    _clusterNamespace: "fxiang-eks",
    _rbac: "fxiang-eks_apps_statefulsets"
  };

  const itemNoAvailable = {
    _uid: "fxiang-eks/7c30f5d2-a522-40be-a8a6-5e833012b17b",
    apiversion: "v1",
    created: "2021-01-28T19:24:10Z",
    current: 1,
    apigroup: "apps",
    kind: "statefulset",
    name: "mariadb",
    namespace: "val-mariadb-helm",
    selfLink: "/apis/apps/v1/namespaces/val-mariadb-helm/statefulsets/mariadb",
    cluster: "fxiang-eks",
    desired: 1,
    ready: 1,
    label:
      "app.kubernetes.io/component=primary; app.kubernetes.io/instance=mariadb; app.kubernetes.io/managed-by=Helm; app.kubernetes.io/name=mariadb; helm.sh/chart=mariadb-9.3.0",
    _clusterNamespace: "fxiang-eks",
    _rbac: "fxiang-eks_apps_statefulsets"
  };

  const itemComplete = {
    _uid: "fxiang-eks/7c30f5d2-a522-40be-a8a6-5e833012b17b",
    apiversion: "v1",
    created: "2021-01-28T19:24:10Z",
    current: 1,
    apigroup: "apps",
    kind: "statefulset",
    name: "mariadb",
    namespace: "val-mariadb-helm",
    selfLink: "/apis/apps/v1/namespaces/val-mariadb-helm/statefulsets/mariadb",
    cluster: "fxiang-eks",
    desired: 1,
    ready: 1,
    label:
      "app.kubernetes.io/component=primary; app.kubernetes.io/instance=mariadb; app.kubernetes.io/managed-by=Helm; app.kubernetes.io/name=mariadb; helm.sh/chart=mariadb-9.3.0",
    _clusterNamespace: "fxiang-eks",
    _rbac: "fxiang-eks_apps_statefulsets",
    available: 1
  };

  it("should get complete item when no available and ready set", () => {
    expect(fixMissingStateOptions(itemNoAvailableReady)).toEqual(itemComplete);
  });

  it("should get complete item when no available", () => {
    expect(fixMissingStateOptions(itemNoAvailable)).toEqual(itemComplete);
  });

  it("should get complete item when full data set", () => {
    expect(fixMissingStateOptions(itemComplete)).toEqual(itemComplete);
  });

  it("should return undefined", () => {
    expect(fixMissingStateOptions(undefined)).toEqual(undefined);
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
