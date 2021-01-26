/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/
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
  getExistingResourceMapKey
} from "../../../../../../src-web/components/Topology/utils/diagram-helpers-utils";

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
    "pod-replicaset-nginx-placement-cluster1, cluster2": "test"
  };

  const relatedKind = {
    cluster: "cluster1"
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
    ).toEqual("pod-replicaset-nginx-placement-cluster1, cluster2");
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
