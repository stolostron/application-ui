/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/
"use strict";

import {
  getNodePropery,
  addPropertyToList,
  nodeMustHavePods,
  createDeployableYamlLink,
  createResourceSearchLink,
  setupResourceModel,
  computeNodeStatus,
  setSubscriptionDeployStatus,
  setResourceDeployStatus,
  setApplicationDeployStatus,
  setPodDeployStatus,
  getPulseForData,
  getPulseForNodeWithPodStatus,
  addOCPRouteLocation,
  addNodeServiceLocation,
  processResourceActionLink,
  addNodeServiceLocationForCluster,
  addNodeOCPRouteLocationForCluster,
  computeResourceName,
  getPulseStatusForSubscription,
  addIngressNodeInfo,
  setPlacementRuleDeployStatus,
  addNodeInfoPerCluster
} from "../../../../../../src-web/components/Topology/utils/diagram-helpers";

const node = {
  specs: {
    raw: {
      metadata: {
        name: "nodeName",
        namespace: "nodeNS"
      }
    }
  }
};

const propPath = ["specs", "raw", "spec", "clusterSelector", "matchLabels"];
const propPath_found = ["specs", "raw", "metadata", "namespace"];
const key = "nskey";
const defaultValue = "test";

const resourceList = [
  {
    kind: "placementrule",
    items: [
      {
        name: "pr",
        namespace: "default",
        cluster: "braveman",
        kind: "rules"
      }
    ]
  },
  {
    kind: "pod",
    items: [
      {
        name: "mortgagedc-deploy-1-q9b5r",
        namespace: "default",
        cluster: "braveman",
        kind: "pod"
      }
    ]
  },
  {
    kind: "service",
    items: [
      {
        kind: "service",
        label: "app=mortgagedc-mortgage",
        name: "mortgagedc-svc",
        namespace: "default",
        port: "9080:32749/TCP",
        cluster: "braveman"
      }
    ]
  },
  {
    kind: '"deploymentconfig"',
    items: [
      {
        kind: "deploymentconfig",
        label: "app=mortgagedc-mortgage",
        name: "mortgagedc-deploy",
        namespace: "default",
        cluster: "braveman"
      }
    ]
  },
  {
    kind: "route",
    items: [
      {
        kind: "route",
        name: "route-unsecured",
        namespace: "default",
        cluster: "braveman"
      }
    ]
  },
  {
    kind: "subscriptions",
    items: [
      {
        kind: "subscription",
        label:
          "app=mortgagedc; hosting-deployable-name=mortgagedc-subscription-deployable; subscription-pause=false",
        name: "mortgagedc-subscription",
        namespace: "default",
        selfLink:
          "/apis/apps.open-cluster-management.io/v1/namespaces/default/subscriptions/mortgagedc-subscription",
        status: "Subscribed",
        cluster: "braveman"
      }
    ]
  },
  {
    kind: "replicationcontroller",
    items: [
      {
        created: "2020-04-20T22:03:50Z",
        kind: "replicationcontroller",
        label:
          "app=mortgagedc-mortgage; openshift.io/deployment-config.name=mortgagedc-deploy",
        name: "mortgagedc-deploy-1",
        namespace: "default",
        cluster: "braveman"
      }
    ]
  }
];

const resourceMap = {
  "mortgagedc-deploy-braveman": { type: "deploymentconfig" },
  "mortgagedc-subscription": { type: "subscription" },
  "mortgagedc-svc-braveman": {},
  "route-unsecured-braveman": {}
};

const modelResult = {
  "mortgagedc-deploy-braveman": { type: "deploymentconfig" },
  "mortgagedc-subscription": {
    specs: {
      subscriptionModel: {
        "mortgagedc-subscription-braveman": {
          cluster: "braveman",
          kind: "subscription",
          label:
            "app=mortgagedc; hosting-deployable-name=mortgagedc-subscription-deployable; subscription-pause=false",
          name: "mortgagedc-subscription",
          namespace: "default",
          selfLink:
            "/apis/apps.open-cluster-management.io/v1/namespaces/default/subscriptions/mortgagedc-subscription",
          status: "Subscribed"
        }
      }
    },
    type: "subscription"
  },
  "mortgagedc-svc-braveman": {},
  "route-unsecured-braveman": {}
};

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

describe("getPulseForNodeWithPodStatus ", () => {
  const podItem = {
    id:
      "member--member--deployable--member--clusters--feng, cluster1, cluster2--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
    uid:
      "member--member--deployable--member--clusters--feng--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
    name: "mortgage-app-deploy",
    cluster: null,
    clusterName: null,
    type: "deployment",
    specs: {
      deploymentModel: {
        "mortgage-app-deploy-feng": {
          ready: 2,
          desired: 3
        },
        "mortgage-app-deploy-cluster1": {}
      },
      raw: {
        apiVersion: "apps/v1",
        kind: "Deployment",
        metadata: {
          labels: { app: "mortgage-app-mortgage" },
          name: "mortgage-app-deploy"
        },
        spec: {
          replicas: 1,
          selector: {
            matchLabels: { app: "mortgage-app-mortgage" }
          },
          template: {
            metadata: {
              labels: { app: "mortgage-app-mortgage" }
            },
            spec: {
              containers: [
                {
                  image: "fxiang/mortgage:0.4.0",
                  imagePullPolicy: "Always",
                  name: "mortgage-app-mortgage",
                  ports: [
                    {
                      containerPort: 9080
                    }
                  ],
                  resources: {
                    limits: { cpu: "200m", memory: "256Mi" },
                    request: { cpu: "200m", memory: "256Mi" }
                  }
                }
              ]
            }
          }
        }
      },
      deployStatuses: [
        {
          phase: "Subscribed",
          resourceStatus: {
            availableReplicas: 1
          }
        }
      ]
    }
  };

  it("getPulseForNodeWithPodStatus pulse red", () => {
    expect(getPulseForNodeWithPodStatus(podItem)).toEqual("red");
  });
});

describe("getPulseForNodeWithPodStatus no replica", () => {
  const podItem = {
    id:
      "member--member--deployable--member--clusters--feng, cluster1, cluster2--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
    uid:
      "member--member--deployable--member--clusters--feng--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
    name: "mortgage-app-deploy",
    cluster: null,
    clusterName: null,
    type: "deployment",
    specs: {
      deploymentModel: {
        "mortgage-app-deploy-feng": {
          ready: 2,
          desired: 3
        },
        "mortgage-app-deploy-cluster1": {}
      },
      raw: {
        apiVersion: "apps/v1",
        kind: "Deployment",
        metadata: {
          labels: { app: "mortgage-app-mortgage" },
          name: "mortgage-app-deploy"
        },
        spec: {
          selector: {
            matchLabels: { app: "mortgage-app-mortgage" }
          },
          template: {
            metadata: {
              labels: { app: "mortgage-app-mortgage" }
            },
            spec: {
              containers: [
                {
                  image: "fxiang/mortgage:0.4.0",
                  imagePullPolicy: "Always",
                  name: "mortgage-app-mortgage",
                  ports: [
                    {
                      containerPort: 9080
                    }
                  ],
                  resources: {
                    limits: { cpu: "200m", memory: "256Mi" },
                    request: { cpu: "200m", memory: "256Mi" }
                  }
                }
              ]
            }
          }
        }
      },
      deployStatuses: [
        {
          phase: "Subscribed",
          resourceStatus: {
            availableReplicas: 1
          }
        }
      ]
    }
  };

  it("getPulseForNodeWithPodStatus pulse no replica", () => {
    expect(getPulseForNodeWithPodStatus(podItem)).toEqual("green");
  });
});

describe("getPulseForData ", () => {
  const previousPulse = "red";
  const available = 1;
  const desired = 2;
  const podsUnavailable = 3;

  it("getPulseForData pulse red", () => {
    expect(
      getPulseForData(previousPulse, available, desired, podsUnavailable)
    ).toEqual("red");
  });
});

describe("getPulseForData ", () => {
  const previousPulse = "green";
  const available = 1;
  const desired = 2;
  const podsUnavailable = 3;

  it("getPulseForData pulse red pod unavailable", () => {
    expect(
      getPulseForData(previousPulse, available, desired, podsUnavailable)
    ).toEqual("red");
  });
});

describe("getPulseForData ", () => {
  const previousPulse = "green";
  const available = 1;
  const desired = 2;
  const podsUnavailable = 0;

  it("getPulseForData pulse red pod desired less then available", () => {
    expect(
      getPulseForData(previousPulse, available, desired, podsUnavailable)
    ).toEqual("red");
  });
});

describe("getPulseForData ", () => {
  const previousPulse = "green";
  const available = 1;
  const desired = 0;
  const podsUnavailable = 0;

  it("getPulseForData pulse yellow pod desired is 0", () => {
    expect(
      getPulseForData(previousPulse, available, desired, podsUnavailable)
    ).toEqual("yellow");
  });
});

describe("getPulseForData ", () => {
  const previousPulse = "green";
  const available = 1;
  const desired = 1;
  const podsUnavailable = 0;

  it("getPulseForData pulse green pod desired is equal with available", () => {
    expect(
      getPulseForData(previousPulse, available, desired, podsUnavailable)
    ).toEqual("green");
  });
});

describe("getNodePropery ", () => {
  const result = { labelKey: "nskey", value: "test" };
  it("get property nodes, not found", () => {
    expect(getNodePropery(node, propPath, key, defaultValue)).toEqual(result);
  });
});

describe("getNodePropery ", () => {
  it("get property nodes, not found, no default value", () => {
    expect(getNodePropery(node, propPath, key)).toEqual(undefined);
  });
});

describe("getNodePropery ", () => {
  const result = { labelKey: "nskey", value: "nodeNS" };

  it("get property nodes, found", () => {
    expect(getNodePropery(node, propPath_found, key)).toEqual(result);
  });
});

const list = [];
describe("addPropertyToList ", () => {
  const result = [{ labelKey: "nskey", value: "nodeNS" }];
  const data = { labelKey: "nskey", value: "nodeNS" };
  it("addPropertyToList", () => {
    expect(addPropertyToList(list, data)).toEqual(result);
  });
});

describe("addPropertyToList undefined list", () => {
  const data = { labelKey: "nskey", value: "nodeNS" };
  it("addPropertyToList", () => {
    expect(addPropertyToList(undefined, data)).toEqual(undefined);
  });
});

describe("addPropertyToList undefined data", () => {
  it("addPropertyToList", () => {
    expect(addPropertyToList(list, undefined)).toEqual(list);
  });
});

describe("nodeMustHavePods undefined data", () => {
  it("nodeMustHavePods", () => {
    expect(nodeMustHavePods(undefined)).toEqual(false);
  });
});

describe("nodeMustHavePods node with no pods data", () => {
  const node = {
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

describe("computeResourceName node with pods no _hostingDeployable", () => {
  const node = {
    apiversion: "v1",
    cluster: "sharingpenguin",
    container: "slave",
    created: "2020-05-26T19:18:21Z",
    kind: "pod",
    label: "app; pod-template-hash=5bdcfd74c7; role=slave; tier=backend",
    name: "redis-slave-5bdcfd74c7-22ljj",
    namespace: "app-guestbook-git-ns",
    restarts: 0,
    selfLink:
      "/api/v1/namespaces/app-guestbook-git-ns/pods/redis-slave-5bdcfd74c7-22ljj",
    startedAt: "2020-05-26T19:18:21Z",
    status: "Running"
  };
  it("nodeMustHavePods POD no _hostingDeployable", () => {
    expect(
      computeResourceName(node, null, "redis-slave", { value: "true" })
    ).toEqual("pod-redis");
  });
});

describe("computeResourceName node with pods with _hostingDeployable", () => {
  const node = {
    apiversion: "v1",
    cluster: "sharingpenguin",
    container: "slave",
    created: "2020-05-26T19:18:21Z",
    kind: "pod",
    label: "app=redis; pod-template-hash=5bdcfd74c7; role=slave; tier=backend",
    name: "redis-slave-5bdcfd74c7-22ljj",
    namespace: "app-guestbook-git-ns",
    restarts: 0,
    _hostingDeployable: "aaa",
    selfLink:
      "/api/v1/namespaces/app-guestbook-git-ns/pods/redis-slave-5bdcfd74c7-22ljj",
    startedAt: "2020-05-26T19:18:21Z",
    status: "Running"
  };
  it("nodeMustHavePods POD with _hostingDeployable", () => {
    expect(
      computeResourceName(node, null, "redis-slave", { value: "true" })
    ).toEqual("pod-redis-slave");
  });
});

describe("createDeployableYamlLink for application no selflink", () => {
  const details = [];
  const node = {
    type: "application",
    id: "id",
    specs: {
      row: 20
    }
  };
  it("createDeployableYamlLink for application selflink", () => {
    expect(createDeployableYamlLink(node, details)).toEqual([]);
  });
});

describe("createDeployableYamlLink for application with selflink", () => {
  const details = [];
  const node = {
    type: "application",
    id: "id",
    specs: {
      raw: {
        metadata: {
          selfLink: "appLink"
        }
      }
    }
  };
  const result = [
    {
      type: "link",
      value: {
        data: {
          action: "show_resource_yaml",
          cluster: "local-cluster",
          selfLink: "appLink"
        },
        label: "View Resource YAML"
      }
    }
  ];
  it("createDeployableYamlLink for application with selflink", () => {
    expect(createDeployableYamlLink(node, details)).toEqual(result);
  });
});

describe("createDeployableYamlLink for other", () => {
  const details = [];
  const node = {
    id: "id",
    specs: {
      row_foo: 20
    }
  };
  it("createDeployableYamlLink for other", () => {
    expect(createDeployableYamlLink(node, details)).toEqual([]);
  });
});

describe("createResourceSearchLink for undefined details", () => {
  const node = {
    id: "id",
    specs: {
      row: 20
    }
  };
  const result = {
    type: "link",
    value: {
      data: {
        action: "show_search",
        kind: "",
        name: undefined,
        namespace: undefined
      },
      id: "id",
      indent: true,
      label: "Launch resource in Search"
    }
  };
  it("createResourceSearchLink", () => {
    expect(createResourceSearchLink(node, undefined)).toEqual(result);
  });
});

describe("createResourceSearchLink for details", () => {
  const node = {
    type: "deployment",
    name: "name",
    namespace: "ns"
  };
  const result = {
    type: "link",
    value: {
      data: {
        action: "show_search",
        kind: "deployment",
        name: "name",
        namespace: "ns"
      },
      id: undefined,
      indent: true,
      label: "Launch resource in Search"
    }
  };
  it("createResourceSearchLink", () => {
    expect(createResourceSearchLink(node, [])).toEqual(result);
  });
});

describe("setSubscriptionDeployStatus with error", () => {
  const node = {
    type: "subscription",
    name: "name",
    namespace: "ns",
    specs: {
      subscriptionModel: {
        sub1: {
          cluster: "local",
          status: "Failed"
        },
        sub2: {
          cluster: "local",
          status: "Propagated",
          _hubClusterResource: true
        }
      }
    }
  };
  const response = [
    { type: "spacer" },
    { labelKey: "resource.deploy.statuses", type: "label" },
    { type: "spacer" },
    { labelValue: "local", status: "failure", value: "Failed" },
    {
      indent: true,
      type: "link",
      value: {
        data: {
          action: "show_resource_yaml",
          cluster: "local",
          selfLink: undefined
        },
        label: "View Resource YAML"
      }
    },
    { type: "spacer" },
    { type: "spacer" }
  ];
  it("setSubscriptionDeployStatus with error", () => {
    expect(setSubscriptionDeployStatus(node, [])).toEqual(response);
  });
});

describe("setSubscriptionDeployStatus for details yellow", () => {
  const node = {
    type: "subscription",
    name: "name",
    namespace: "ns",
    specs: {
      subscriptionModel: {
        sub1: {
          cluster: "local",
          status: "Propagated"
        }
      }
    }
  };
  const response = [
    { type: "spacer" },
    { labelKey: "resource.deploy.statuses", type: "label" },
    { type: "spacer" },
    { labelValue: "local", status: "checkmark", value: "Propagated" },
    {
      indent: true,
      type: "link",
      value: {
        data: {
          action: "show_resource_yaml",
          cluster: "local",
          selfLink: undefined
        },
        label: "View Resource YAML"
      }
    },
    {
      labelValue: "Remote subscriptions",
      status: "failure",
      value:
        "This subscription has not been placed to any remote cluster. Make sure the Placement Rule resource is valid and exists in the {0} namespace."
    },
    {
      type: "link",
      value: {
        data: {
          action: "open_link",
          targetLink:
            '/multicloud/search?filters={"textsearch":"kind%3Aplacementrule%20namespace%3Ans%20cluster%3Alocal-cluster"}'
        },
        id: "undefined-subscrSearch",
        label: "View all rules in {0} namespace"
      }
    },
    { type: "spacer" }
  ];
  it("setSubscriptionDeployStatus yellow", () => {
    expect(setSubscriptionDeployStatus(node, [])).toEqual(response);
  });
});

describe("setSubscriptionDeployStatus for node type different then subscription ", () => {
  const node = {
    type: "subscription2",
    name: "name",
    namespace: "ns",
    specs: {
      subscriptionModel: {
        sub1: {
          cluster: "local",
          status: "Failed"
        }
      }
    }
  };
  it("setSubscriptionDeployStatus for node type different then subscription should return []", () => {
    expect(setSubscriptionDeployStatus(node, [])).toEqual([]);
  });
});

describe("setupResourceModel ", () => {
  it("setupResourceModel", () => {
    expect(setupResourceModel(resourceList, resourceMap, false)).toEqual(
      modelResult
    );
  });
});

describe("setupResourceModel ", () => {
  it("return setupResourceModel for grouped objects", () => {
    expect(setupResourceModel(resourceList, resourceMap, true)).toEqual(
      modelResult
    );
  });
});

describe("setupResourceModel undefined 1", () => {
  it("return setupResourceModel for undefined 1 ", () => {
    expect(setupResourceModel(undefined, resourceMap, true)).toEqual(
      modelResult
    );
  });
});

describe("setupResourceModel undefined 2", () => {
  it("return setupResourceModel for undefined 2 ", () => {
    expect(setupResourceModel(resourceList, undefined, true)).toEqual(
      undefined
    );
  });
});

describe("computeNodeStatus ", () => {
  const subscriptionInputGreen = {
    id: "member--subscription--default--mortgagedc-subscription",
    name: "mortgagedc",
    specs: {
      raw: {
        spec: { template: { spec: { containers: [{ name: "c1" }] } } }
      },
      subscriptionModel: {
        "mortgagedc-subscription-braveman": {
          apigroup: "apps.open-cluster-management.io",
          apiversion: "v1",
          channel: "mortgagedc-ch/mortgagedc-channel",
          cluster: "braveman",
          created: "2020-04-20T22:02:46Z",
          kind: "subscription",
          label:
            "app=mortgagedc; hosting-deployable-name=mortgagedc-subscription-deployable; subscription-pause=false",
          name: "mortgagedc-subscription",
          namespace: "default",
          status: "Subscribed",
          _clusterNamespace: "braveman-ns"
        },
        "mortgagedc-subscription-braveman2": {
          apigroup: "apps.open-cluster-management.io",
          apiversion: "v1",
          channel: "mortgagedc-ch/mortgagedc-channel",
          cluster: "braveman2",
          created: "2020-04-20T22:02:46Z",
          kind: "subscription",
          label:
            "app=mortgagedc; hosting-deployable-name=mortgagedc-subscription-deployable; subscription-pause=false",
          name: "mortgagedc-subscription",
          namespace: "default",
          status: "SubscribedFailed",
          _clusterNamespace: "braveman-ns"
        }
      },
      row: 12
    },
    type: "subscription"
  };
  const subscriptionInputRed = {
    id: "member--subscription--default--mortgagedc-subscription",
    name: "mortgagedc",
    specs: {
      raw: {
        spec: { template: { spec: { containers: [{ name: "c1" }] } } }
      },
      row: 12
    },
    type: "subscription"
  };
  const subscriptionInputYellow = {
    id: "member--subscription--default--mortgagedc-subscription",
    name: "mortgagedc",
    specs: {
      raw: {
        spec: { template: { spec: { containers: [{ name: "c1" }] } } }
      },
      subscriptionModel: {
        "mortgagedc-subscription-braveman": {
          apigroup: "apps.open-cluster-management.io",
          apiversion: "v1",
          channel: "mortgagedc-ch/mortgagedc-channel",
          cluster: "braveman",
          created: "2020-04-20T22:02:46Z",
          kind: "subscription",
          label:
            "app=mortgagedc; hosting-deployable-name=mortgagedc-subscription-deployable; subscription-pause=false",
          name: "mortgagedc-subscription",
          namespace: "default",
          status: "Subscribed",
          _clusterNamespace: "braveman-ns"
        },
        "mortgagedc-subscription-braveman2": {
          apigroup: "apps.open-cluster-management.io",
          apiversion: "v1",
          channel: "mortgagedc-ch/mortgagedc-channel",
          cluster: "braveman2",
          created: "2020-04-20T22:02:46Z",
          kind: "subscription",
          label:
            "app=mortgagedc; hosting-deployable-name=mortgagedc-subscription-deployable; subscription-pause=false",
          name: "mortgagedc-subscription",
          namespace: "default",
          status: "SomeOtherState",
          _clusterNamespace: "braveman-ns"
        }
      },
      row: 12
    },
    type: "subscription"
  };

  const subscriptionGreenNotPlacedYellow = {
    id: "member--subscription--default--mortgagedc-subscription",
    name: "mortgagedc",
    specs: {
      raw: {
        spec: { template: { spec: { containers: [{ name: "c1" }] } } }
      },
      subscriptionModel: {},
      row: 12
    },
    type: "subscription"
  };

  const subscriptionInputNotPlaced = {
    id: "member--subscription--default--mortgagedc-subscription",
    name: "mortgagedc",
    specs: {
      raw: {
        spec: { template: { spec: { containers: [{ name: "c1" }] } } }
      },
      subscriptionModel: {
        "mortgagedc-subscription-braveman": {
          apigroup: "apps.open-cluster-management.io",
          apiversion: "v1",
          channel: "mortgagedc-ch/mortgagedc-channel",
          cluster: "braveman",
          created: "2020-04-20T22:02:46Z",
          kind: "subscription",
          label:
            "app=mortgagedc; hosting-deployable-name=mortgagedc-subscription-deployable; subscription-pause=false",
          name: "mortgagedc-subscription",
          namespace: "default",
          status: "Subscribed",
          _clusterNamespace: "braveman-ns"
        },
        "mortgagedc-subscription-braveman2": {
          apigroup: "apps.open-cluster-management.io",
          apiversion: "v1",
          channel: "mortgagedc-ch/mortgagedc-channel",
          cluster: "braveman2",
          created: "2020-04-20T22:02:46Z",
          kind: "subscription",
          label:
            "app=mortgagedc; hosting-deployable-name=mortgagedc-subscription-deployable; subscription-pause=false",
          name: "mortgagedc-subscription",
          namespace: "default",
          status: "Propagated",
          _clusterNamespace: "braveman-ns"
        }
      },
      row: 12
    },
    type: "subscription"
  };

  const genericNodeInputRed = {
    id: "member--pod--default--mortgagedc-subscription",
    name: "mortgagedc",
    specs: {
      raw: {
        spec: { template: { spec: { containers: [{ name: "c1" }] } } }
      },
      row: 12
    },
    type: "pod"
  };

  const genericNodeInputRed2 = {
    id: "member--pod--default--mortgagedc-subscription",
    name: "mortgagedc",
    specs: {
      raw: {
        spec: { template: { spec: { containers: [{ name: "c1" }] } } }
      },
      pulse: "red",
      row: 12
    },
    type: "pod"
  };

  const deploymentNodeYellow = {
    id:
      "member--member--deployable--member--clusters--feng, cluster1, cluster2--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
    uid:
      "member--member--deployable--member--clusters--feng--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
    name: "mortgage-app-deploy",
    cluster: null,
    clusterName: null,
    type: "deployment",
    specs: {
      deploymentModel: {
        "mortgage-app-deploy-feng": {
          ready: 2,
          desired: 3
        },
        "mortgage-app-deploy-cluster1": {}
      }
    }
  };

  const deploymentNodeRed = {
    id:
      "member--member--deployable--member--clusters--feng, cluster1, cluster2--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
    uid:
      "member--member--deployable--member--clusters--feng--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
    name: "mortgage-app-deploy",
    cluster: null,
    clusterName: null,
    type: "deployment",
    specs: {
      pulse: "red",
      deploymentModel: {
        "mortgage-app-deploy-feng": {
          ready: 2,
          desired: 3
        },
        "mortgage-app-deploy-cluster1": {}
      }
    }
  };

  const deploymentNodeRed2 = {
    id:
      "member--member--deployable--member--clusters--feng, cluster1, cluster2--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
    uid:
      "member--member--deployable--member--clusters--feng--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
    name: "mortgage-app-deploy",
    cluster: null,
    clusterName: null,
    type: "deployment",
    specs: {
      pulse: "green",
      deploymentModel: {
        "mortgage-app-deployable-feng": {
          ready: 2,
          desired: 3
        },
        "mortgage-app-deploy-cluster1": {}
      }
    }
  };

  const deploymentNodeYellow2 = {
    id:
      "member--member--deployable--member--clusters--feng, cluster1, cluster2--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
    uid:
      "member--member--deployable--member--clusters--feng--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
    name: "mortgage-app-deploy",
    cluster: null,
    clusterName: null,
    type: "deployment",
    specs: {
      deploymentModel: {
        "mortgage-app-deploy-feng": {
          ready: 3,
          desired: 3
        },
        "mortgage-app-deploy-cluster1": {}
      }
    }
  };

  const deploymentNodeNoPODS = {
    id:
      "member--member--deployable--member--clusters--feng, cluster1, cluster2--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
    uid:
      "member--member--deployable--member--clusters--feng--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
    name: "mortgage-app-deploy",
    cluster: null,
    clusterName: null,
    type: "deployment",
    specs: {
      deploymentModel: {
        "mortgage-app-deploy-feng": {
          ready: 2,
          desired: 3
        },
        "mortgage-app-deploy-cluster1": {}
      },
      raw: {
        apiVersion: "apps/v1",
        kind: "Deployment",
        metadata: {
          labels: { app: "mortgage-app-mortgage" },
          name: "mortgage-app-deploy"
        },
        spec: {
          replicas: 1,
          selector: {
            matchLabels: { app: "mortgage-app-mortgage" }
          },
          template: {
            metadata: {
              labels: { app: "mortgage-app-mortgage" }
            },
            spec: {
              containers: [
                {
                  image: "fxiang/mortgage:0.4.0",
                  imagePullPolicy: "Always",
                  name: "mortgage-app-mortgage",
                  ports: [
                    {
                      containerPort: 9080
                    }
                  ],
                  resources: {
                    limits: { cpu: "200m", memory: "256Mi" },
                    request: { cpu: "200m", memory: "256Mi" }
                  }
                }
              ]
            }
          }
        }
      },
      deployStatuses: [
        {
          phase: "Subscribed",
          resourceStatus: {
            availableReplicas: 1
          }
        }
      ]
    },
    namespace: "",
    topology: null,
    labels: null,
    __typename: "Resource",
    layout: {
      hasPods: true,
      uid:
        "member--member--deployable--member--clusters--feng--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
      type: "deployment",
      label: "mortgage-app-↵deploy",
      compactLabel: "mortgage-app-↵deploy",
      nodeStatus: "",
      isDisabled: false,
      title: "",
      description: "",
      tooltips: [
        {
          name: "Deployment",
          value: "mortgage-app-deploy",
          href:
            "/multicloud/search?filters={'textsearch':'kind:deployment name:mortgage-app-deploy'}"
        }
      ],
      x: 151.5,
      y: 481.5,
      section: { name: "preset", hashCode: 872479835, x: 0, y: 0 },
      textBBox: {
        x: -39.359375,
        y: 5,
        width: 78.71875,
        height: 27.338897705078125
      },
      lastPosition: { x: 151.5, y: 481.5 },
      selected: true,
      nodeIcons: {
        status: {
          icon: "success",
          classType: "success",
          width: 16,
          height: 16,
          dx: 16,
          dy: -16
        }
      },
      pods: [
        {
          cluster: "cluster1",
          name: "pod1",
          namespace: "default",
          type: "pod",
          layout: {
            type: "layout1"
          },
          specs: {
            podModel: {
              "mortgage-app-deploy-55c65b9c8f-6v9bn": {
                cluster: "cluster1",
                hostIP: "1.1.1.1",
                status: "Running",
                startedAt: "2020-04-20T22:03:52Z",
                restarts: 0,
                podIP: "1.1.1.1",
                startedAt: "Monday"
              }
            }
          }
        }
      ]
    }
  };

  const deploymentNodeNoPODSNoRes = {
    id:
      "member--member--deployable--member--clusters--feng, cluster1, cluster2--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
    uid:
      "member--member--deployable--member--clusters--feng--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
    name: "mortgage-app-deploy",
    cluster: null,
    clusterName: null,
    type: "deployment",
    specs: {
      deploymentModel: {
        "mortgage-app-deploy-feng4": {
          ready: 2,
          desired: 3
        },
        "mortgage-app-deploy-cluster1": {}
      },
      raw: {
        apiVersion: "apps/v1",
        kind: "Deployment",
        metadata: {
          labels: { app: "mortgage-app-mortgage" },
          name: "mortgage-app-deploy"
        },
        spec: {
          replicas: 1,
          selector: {
            matchLabels: { app: "mortgage-app-mortgage" }
          },
          template: {
            metadata: {
              labels: { app: "mortgage-app-mortgage" }
            },
            spec: {
              containers: [
                {
                  image: "fxiang/mortgage:0.4.0",
                  imagePullPolicy: "Always",
                  name: "mortgage-app-mortgage",
                  ports: [
                    {
                      containerPort: 9080
                    }
                  ],
                  resources: {
                    limits: { cpu: "200m", memory: "256Mi" },
                    request: { cpu: "200m", memory: "256Mi" }
                  }
                }
              ]
            }
          }
        }
      },
      deployStatuses: [
        {
          phase: "Subscribed",
          resourceStatus: {
            availableReplicas: 1
          }
        }
      ]
    },
    namespace: "",
    topology: null,
    labels: null,
    __typename: "Resource",
    layout: {
      hasPods: true,
      uid:
        "member--member--deployable--member--clusters--feng--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
      type: "deployment",
      label: "mortgage-app-↵deploy",
      compactLabel: "mortgage-app-↵deploy",
      nodeStatus: "",
      isDisabled: false,
      title: "",
      description: "",
      tooltips: [
        {
          name: "Deployment",
          value: "mortgage-app-deploy",
          href:
            "/multicloud/search?filters={'textsearch':'kind:deployment name:mortgage-app-deploy'}"
        }
      ],
      x: 151.5,
      y: 481.5,
      section: { name: "preset", hashCode: 872479835, x: 0, y: 0 },
      textBBox: {
        x: -39.359375,
        y: 5,
        width: 78.71875,
        height: 27.338897705078125
      },
      lastPosition: { x: 151.5, y: 481.5 },
      selected: true,
      nodeIcons: {
        status: {
          icon: "success",
          classType: "success",
          width: 16,
          height: 16,
          dx: 16,
          dy: -16
        }
      },
      pods: [
        {
          cluster: "cluster1",
          name: "pod1",
          namespace: "default",
          type: "pod",
          layout: {
            type: "layout1"
          },
          specs: {
            podModel: {
              "mortgage-app-deploy-55c65b9c8f-6v9bn": {
                cluster: "cluster1",
                hostIP: "1.1.1.1",
                status: "Running",
                startedAt: "2020-04-20T22:03:52Z",
                restarts: 0,
                podIP: "1.1.1.1",
                startedAt: "Monday"
              }
            }
          }
        }
      ]
    }
  };

  const deploymentNodeGreen = {
    id:
      "member--member--deployable--member--clusters--feng, cluster1, cluster2--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
    uid:
      "member--member--deployable--member--clusters--feng--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
    name: "mortgage-app-deploy",
    cluster: null,
    clusterName: null,
    type: "deployment",
    specs: {
      deploymentModel: {
        "mortgage-app-deploy-feng": {
          ready: 3,
          desired: 3
        },
        "mortgage-app-deploy-cluster1": {}
      },
      podModel: {
        "mortgagedc-deploy-1-q9b5r-feng": {
          cluster: "cluster1",
          container: "mortgagedc-mortgage",
          created: "2020-04-20T22:03:52Z",
          hostIP: "1.1.1.1",
          image: "fxiang/mortgage:0.4.0",
          kind: "pod",
          label:
            "app=mortgagedc-mortgage; deployment=mortgagedc-deploy-1; deploymentConfig=mortgagedc-mortgage; deploymentconfig=mortgagedc-deploy",
          name: "mortgagedc-deploy-1-q9b5r",
          namespace: "default",
          podIP: "10.128.2.80",
          restarts: 0,
          selfLink: "/api/v1/namespaces/default/pods/mortgagedc-deploy-1-q9b5r",
          startedAt: "2020-04-20T22:03:52Z",
          status: "CrashLoopBackOff"
        },
        "mortgagedc-deploy-1-q9b5rr-feng": {
          cluster: "feng2",
          container: "mortgagedc-mortgage",
          created: "2020-04-20T22:03:52Z",
          hostIP: "1.1.1.1",
          image: "fxiang/mortgage:0.4.0",
          kind: "pod",
          label:
            "app=mortgagedc-mortgage; deployment=mortgagedc-deploy-1; deploymentConfig=mortgagedc-mortgage; deploymentconfig=mortgagedc-deploy",
          name: "mortgagedc-deploy-1-q9b5rr",
          namespace: "default",
          podIP: "10.128.2.80",
          restarts: 0,
          selfLink: "/api/v1/namespaces/default/pods/mortgagedc-deploy-1-q9b5r",
          startedAt: "2020-04-20",
          status: "Running"
        }
      },
      raw: {
        apiVersion: "apps/v1",
        kind: "Deployment",
        metadata: {
          labels: { app: "mortgage-app-mortgage" },
          name: "mortgage-app-deploy"
        },
        spec: {
          replicas: 1,
          selector: {
            matchLabels: { app: "mortgage-app-mortgage" }
          },
          template: {
            metadata: {
              labels: { app: "mortgage-app-mortgage" }
            },
            spec: {
              containers: [
                {
                  image: "fxiang/mortgage:0.4.0",
                  imagePullPolicy: "Always",
                  name: "mortgage-app-mortgage",
                  ports: [
                    {
                      containerPort: 9080
                    }
                  ],
                  resources: {
                    limits: { cpu: "200m", memory: "256Mi" },
                    request: { cpu: "200m", memory: "256Mi" }
                  }
                }
              ]
            }
          }
        }
      },
      deployStatuses: [
        {
          phase: "Subscribed",
          resourceStatus: {
            availableReplicas: 1
          }
        }
      ]
    },
    namespace: "",
    topology: null,
    labels: null,
    __typename: "Resource",
    layout: {
      hasPods: true,
      uid:
        "member--member--deployable--member--clusters--feng--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
      type: "deployment",
      label: "mortgage-app-↵deploy",
      compactLabel: "mortgage-app-↵deploy",
      nodeStatus: "",
      isDisabled: false,
      title: "",
      description: "",
      tooltips: [
        {
          name: "Deployment",
          value: "mortgage-app-deploy",
          href:
            "/multicloud/search?filters={'textsearch':'kind:deployment name:mortgage-app-deploy'}"
        }
      ],
      x: 151.5,
      y: 481.5,
      section: { name: "preset", hashCode: 872479835, x: 0, y: 0 },
      textBBox: {
        x: -39.359375,
        y: 5,
        width: 78.71875,
        height: 27.338897705078125
      },
      lastPosition: { x: 151.5, y: 481.5 },
      selected: true,
      nodeIcons: {
        status: {
          icon: "success",
          classType: "success",
          width: 16,
          height: 16,
          dx: 16,
          dy: -16
        }
      },
      pods: [
        {
          cluster: "cluster1",
          name: "pod1",
          namespace: "default",
          type: "pod",
          layout: {
            type: "layout1"
          },
          specs: {
            podModel: {
              "mortgage-app-deploy-55c65b9c8f-6v9bn": {
                cluster: "cluster1",
                hostIP: "1.1.1.1",
                status: "Running",
                startedAt: "2020-04-20T22:03:52Z",
                restarts: 0,
                podIP: "1.1.1.1",
                startedAt: "Monday"
              }
            }
          }
        }
      ]
    }
  };

  const deploymentNodeNoPodModel = {
    id:
      "member--member--deployable--member--clusters--feng, cluster1, cluster2--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
    uid:
      "member--member--deployable--member--clusters--feng--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
    name: "mortgage-app-deploy",
    cluster: null,
    clusterName: null,
    type: "deployment",
    specs: {
      deploymentModel: {
        "mortgage-app-deploy-feng": {
          ready: 3,
          desired: 3
        },
        "mortgage-app-deploy-cluster1": {}
      },
      raw: {
        apiVersion: "apps/v1",
        kind: "Deployment",
        metadata: {
          labels: { app: "mortgage-app-mortgage" },
          name: "mortgage-app-deploy"
        },
        spec: {
          replicas: 1,
          selector: {
            matchLabels: { app: "mortgage-app-mortgage" }
          },
          template: {
            metadata: {
              labels: { app: "mortgage-app-mortgage" }
            },
            spec: {
              containers: [
                {
                  image: "fxiang/mortgage:0.4.0",
                  imagePullPolicy: "Always",
                  name: "mortgage-app-mortgage",
                  ports: [
                    {
                      containerPort: 9080
                    }
                  ],
                  resources: {
                    limits: { cpu: "200m", memory: "256Mi" },
                    request: { cpu: "200m", memory: "256Mi" }
                  }
                }
              ]
            }
          }
        }
      },
      deployStatuses: [
        {
          phase: "Subscribed",
          resourceStatus: {
            availableReplicas: 1
          }
        }
      ]
    },
    namespace: "",
    topology: null,
    labels: null,
    __typename: "Resource"
  };

  const genericNodeGreen = {
    id:
      "member--member--service--member--clusters--feng, cluster1, cluster2--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
    uid:
      "member--member--service--member--clusters--feng--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
    name: "mortgage-app-deploy",
    cluster: null,
    clusterName: null,
    type: "service",
    specs: {
      serviceModel: {
        "mortgage-app-service-feng": {},
        "mortgage-app-service-cluster1": {}
      },
      raw: {
        apiVersion: "apps/v1",
        kind: "Service",
        metadata: {
          labels: { app: "mortgage-app-mortgage" },
          name: "mortgage-app-deploy"
        },
        spec: {
          selector: {
            matchLabels: { app: "mortgage-app-mortgage" }
          },
          template: {
            metadata: {
              labels: { app: "mortgage-app-mortgage" }
            }
          }
        }
      }
    }
  };

  const packageNodeGreen = {
    id:
      "member--member--package--member--clusters--feng, cluster1, cluster2--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
    uid:
      "member--member--package--member--clusters--feng--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
    name: "mortgage-app-deploy",
    cluster: null,
    clusterName: null,
    type: "package",
    specs: {}
  };

  const ruleNodeRed = {
    name: "mortgage-app-deploy",
    cluster: null,
    clusterName: null,
    type: "rules",
    specs: {}
  };

  const ruleNodeRed2 = {
    name: "mortgage-app-deploy2",
    cluster: null,
    clusterName: null,
    type: "rules",
    specs: {
      raw: {
        status: {
          decisions: {
            cls1: {}
          }
        }
      }
    }
  };

  const appNoChannelRed = {
    name: "mortgage-app-deploy",
    cluster: null,
    clusterName: null,
    type: "application",
    specs: {}
  };

  const appNoChannelRed1 = {
    name: "mortgage-app-deploy",
    cluster: null,
    clusterName: null,
    type: "application",
    specs: {
      channels: ["aaa"]
    }
  };

  const podCrash = {
    id:
      "member--deployable--member--clusters--possiblereptile, braveman, sharingpenguin, relievedox--deployment--frontend",
    uid:
      "member--deployable--member--clusters--possiblereptile, braveman, sharingpenguin, relievedox--deployment--frontend",
    specs: {
      podModel: {
        "frontend-6cb7f8bd65-g25j6-possiblereptile": {
          apiversion: "v1",
          cluster: "braveman",
          kind: "pod",
          label: "app=guestbook; pod-template-hash=6cb7f8bd65; tier=frontend",
          name: "frontend-6cb7f8bd65-8d9x2",
          namespace: "open-cluster-management",
          status: "CrashLoopBackOff"
        }
      },
      raw: {
        spec: {
          replicas: 1
        }
      }
    }
  };
  it("return appNnoChannelRed crash error", () => {
    expect(computeNodeStatus(podCrash)).toEqual(undefined);
  });

  it("return appNnoChannelRed red", () => {
    expect(computeNodeStatus(appNoChannelRed)).toEqual(undefined);
  });

  it("return appNnoChannelRed1 red", () => {
    expect(computeNodeStatus(appNoChannelRed1)).toEqual(undefined);
  });
  it("return computeNodeStatus green", () => {
    expect(computeNodeStatus(subscriptionInputGreen)).toEqual(undefined);
  });

  it("return computeNodeStatus red", () => {
    expect(computeNodeStatus(subscriptionInputRed)).toEqual(undefined);
  });

  it("return computeNodeStatus yellow", () => {
    expect(computeNodeStatus(subscriptionInputYellow)).toEqual(undefined);
  });

  it("return computeNodeStatus not places", () => {
    expect(computeNodeStatus(subscriptionInputNotPlaced)).toEqual(undefined);
  });

  it("return computeNodeStatus generic node red", () => {
    expect(computeNodeStatus(genericNodeInputRed)).toEqual(undefined);
  });

  it("return computeNodeStatus generic node red2", () => {
    expect(computeNodeStatus(genericNodeInputRed2)).toEqual(undefined);
  });

  it("return computeNodeStatus generic node green", () => {
    expect(computeNodeStatus(deploymentNodeGreen)).toEqual(undefined);
  });

  it("return computeNodeStatus generic no  pod", () => {
    expect(computeNodeStatus(deploymentNodeNoPodModel)).toEqual(undefined);
  });

  it("return computeNodeStatus generic node no pods", () => {
    expect(computeNodeStatus(deploymentNodeNoPODS)).toEqual(undefined);
  });

  it("return computeNodeStatus generic node no pods res", () => {
    expect(computeNodeStatus(deploymentNodeNoPODSNoRes)).toEqual(undefined);
  });

  it("return computeNodeStatus generic node green", () => {
    expect(computeNodeStatus(genericNodeGreen)).toEqual(undefined);
  });

  it("return computeNodeStatus package node green", () => {
    expect(computeNodeStatus(packageNodeGreen)).toEqual(undefined);
  });

  it("return computeNodeStatus rules node red", () => {
    expect(computeNodeStatus(ruleNodeRed)).toEqual(undefined);
  });

  it("return computeNodeStatus rules node red2", () => {
    expect(computeNodeStatus(ruleNodeRed2)).toEqual(undefined);
  });
  it("return computeNodeStatus deploymentNodeYellow", () => {
    expect(computeNodeStatus(deploymentNodeYellow)).toEqual(undefined);
  });
  it("return computeNodeStatus deploymentNodeRed", () => {
    expect(computeNodeStatus(deploymentNodeRed)).toEqual(undefined);
  });
  it("return computeNodeStatus deploymentNodeRed2", () => {
    expect(computeNodeStatus(deploymentNodeRed2)).toEqual(undefined);
  });
  it("return computeNodeStatus deploymentNodeYellow2", () => {
    expect(computeNodeStatus(deploymentNodeYellow2)).toEqual(undefined);
  });

  it("return computeNodeStatus subscriptionGreenNotPlacedYellow", () => {
    expect(computeNodeStatus(subscriptionGreenNotPlacedYellow)).toEqual(
      undefined
    );
  });
});

describe("setResourceDeployStatus 1 ", () => {
  const node = {
    type: "service",
    name: "cassandra",
    namespace: "default",
    id:
      "member--member--deployable--member--clusters--braveman, possiblereptile, sharingpenguin, relievedox--default--guestbook-app-cassandra-cassandra-service--service--cassandra",
    specs: {}
  };
  it("setResourceDeployStatus not deployed", () => {
    expect(setResourceDeployStatus(node, [])).toEqual(undefined);
  });
});

describe("setResourceDeployStatus 2 ", () => {
  const node = {
    type: "service",
    name: "mortgage-app-svc",
    namespace: "default",
    id:
      "member--member--deployable--member--clusters--possiblereptile--default--mortgage-app-subscription-mortgage-mortgage-app-svc-service--service--mortgage-app-svc",

    specs: {
      raw: {
        metadata: {
          name: "mortgage-app-svc"
        }
      },
      serviceModel: {
        "mortgage-app-svc-possiblereptile": {
          cluster: "possiblereptile",
          clusterIP: "172.30.140.196",
          created: "2020-04-20T22:03:01Z",
          kind: "service",
          label: "app=mortgage-app-mortgage",
          name: "mortgage-app-svc",
          namespace: "default",
          port: "9080:31558/TCP"
        }
      }
    }
  };
  it("setResourceDeployStatus deployed", () => {
    expect(setResourceDeployStatus(node, [])).toEqual(undefined);
  });
});

describe("setResourceDeployStatus 2 ", () => {
  const node = {
    type: "service",
    name: "cassandra",
    namespace: "default",
    id:
      "member--member--deployable--member--clusters--braveman, possiblereptile, sharingpenguin, relievedox--default--guestbook-app-cassandra-cassandra-service--service--cassandra",
    specs: {
      serviceModel: {
        service1: {
          cluster: "someOtherCluster",
          status: "Failed"
        }
      }
    }
  };
  it("setResourceDeployStatus deployed", () => {
    expect(setResourceDeployStatus(node, [])).toEqual(undefined);
  });
});

describe("setPlacementRuleDeployStatus 1 ", () => {
  const node = {
    type: "rules",
    name: "cassandra",
    namespace: "default",
    id:
      "member--member--deployable--member--clusters--braveman, possiblereptile, sharingpenguin, relievedox--default--guestbook-app-cassandra-cassandra-service--service--cassandra",
    specs: {
      raw: {
        metadata: {
          selfLink: "aaa"
        },
        spec: {
          selector: "test"
        }
      }
    }
  };
  const result = [
    {
      labelValue: "Error",
      status: "failure",
      value:
        "This Placement Rule does not match any remote clusters. Make sure the clusterSelector property is valid and matches your clusters."
    }
  ];
  it("setPlacementRuleDeployStatus deployed 1", () => {
    expect(setPlacementRuleDeployStatus(node, [])).toEqual(result);
  });
});

describe("setApplicationDeployStatus 1 ", () => {
  const node = {
    type: "service",
    name: "cassandra",
    namespace: "default",
    id:
      "member--member--deployable--member--clusters--braveman, possiblereptile, sharingpenguin, relievedox--default--guestbook-app-cassandra-cassandra-service--service--cassandra",
    specs: {
      serviceModel: {
        service1: {
          cluster: "braveman",
          status: "Failed"
        }
      }
    }
  };
  it("setApplicationDeployStatus deployed 1", () => {
    expect(setApplicationDeployStatus(node, [])).toEqual([]);
  });
});

describe("setApplicationDeployStatus 2 ", () => {
  const node = {
    type: "application",
    name: "cassandra",
    namespace: "default",
    id:
      "member--member--deployable--member--clusters--braveman, possiblereptile, sharingpenguin, relievedox--default--guestbook-app-cassandra-cassandra-service--service--cassandra",
    specs: {
      raw: {
        metadata: {
          selfLink: "aaa"
        },
        spec: {
          selector: "test"
        }
      }
    }
  };
  const result = [
    {
      labelKey: "spec.selector.matchExpressions",
      status: false,
      value: "test"
    },
    { type: "spacer" },
    {
      labelKey: "resource.rule.clusters.error.label",
      status: "failure",
      value:
        "This application has no matched subscription. Make sure the subscription match selector spec.selector.matchExpressions exists and matches a Subscription resource created in the {0} namespace."
    },
    {
      type: "link",
      value: {
        data: {
          action: "open_link",
          targetLink:
            '/multicloud/search?filters={"textsearch":"kind%3Asubscription%20namespace%3ANA%20cluster%3Alocal-cluster"}'
        },
        id:
          "member--member--deployable--member--clusters--braveman, possiblereptile, sharingpenguin, relievedox--default--guestbook-app-cassandra-cassandra-service--service--cassandra-subscrSearch",
        label: "View all subscriptions in {0} namespace"
      }
    }
  ];
  it("setApplicationDeployStatus deployed selector 2", () => {
    expect(setApplicationDeployStatus(node, [])).toEqual(result);
  });
});

describe("setApplicationDeployStatus no selector ", () => {
  const node = {
    type: "application",
    name: "cassandra",
    namespace: "default",
    id:
      "member--member--deployable--member--clusters--braveman, possiblereptile, sharingpenguin, relievedox--default--guestbook-app-cassandra-cassandra-service--service--cassandra",
    specs: {}
  };
  const result = [
    {
      labelKey: "spec.selector.matchExpressions",
      status: true,
      value:
        "This application has no subscription match selector (spec.selector.matchExpressions)"
    },
    { type: "spacer" },
    {
      labelKey: "resource.rule.clusters.error.label",
      status: "failure",
      value:
        "This application has no matched subscription. Make sure the subscription match selector spec.selector.matchExpressions exists and matches a Subscription resource created in the {0} namespace."
    },
    {
      type: "link",
      value: {
        data: {
          action: "open_link",
          targetLink:
            '/multicloud/search?filters={"textsearch":"kind%3Asubscription%20namespace%3ANA%20cluster%3Alocal-cluster"}'
        },
        id:
          "member--member--deployable--member--clusters--braveman, possiblereptile, sharingpenguin, relievedox--default--guestbook-app-cassandra-cassandra-service--service--cassandra-subscrSearch",
        label: "View all subscriptions in {0} namespace"
      }
    }
  ];
  it("setApplicationDeployStatus deployed no selector 2", () => {
    expect(setApplicationDeployStatus(node, [])).toEqual(result);
  });
});

describe("setApplicationDeployStatus channels ", () => {
  const node = {
    type: "application",
    name: "cassandra",
    namespace: "default",
    id:
      "member--member--deployable--member--clusters--braveman, possiblereptile, sharingpenguin, relievedox--default--guestbook-app-cassandra-cassandra-service--service--cassandra",
    specs: {
      channels: ["subsdata"]
    }
  };
  const result = [
    {
      labelKey: "spec.selector.matchExpressions",
      status: true,
      value:
        "This application has no subscription match selector (spec.selector.matchExpressions)"
    },
    { type: "spacer" }
  ];
  it("setApplicationDeployStatus channels", () => {
    expect(setApplicationDeployStatus(node, [])).toEqual(result);
  });
});

describe("setPodDeployStatus  node does not have pods", () => {
  const node = {
    type: "application",
    name: "cassandra",
    namespace: "default",
    id:
      "member--member--deployable--member--clusters--braveman, possiblereptile, sharingpenguin, relievedox--default--guestbook-app-cassandra-cassandra-service--service--cassandra",
    specs: {
      channels: ["subsdata"]
    }
  };
  it("setPodDeployStatus node does not have pods", () => {
    expect(setPodDeployStatus(node, [])).toEqual([]);
  });
});

describe("setPodDeployStatus  with pod less then desired", () => {
  const node = {
    type: "pod",
    name: "mortgage-app-deploy",
    namespace: "default",
    id:
      "member--member--deployable--member--clusters--possiblereptile--default--mortgage-app-subscription-mortgage-mortgage-app-deploy-deployment--deployment--mortgage-app-deploy",
    podStatusMap: {
      possiblereptile: {
        ready: 1,
        desired: 3
      }
    },
    specs: {
      raw: {
        spec: {
          replicas: 1,
          template: {
            spec: {
              containers: [{ c1: "aa" }]
            }
          }
        }
      },
      podModel: {
        "mortgage-app-deploy-55c65b9c8f-r84f4-possiblereptile": {
          cluster: "possiblereptile",
          status: "Running"
        }
      }
    }
  };
  const result = [
    { type: "spacer" },
    { labelKey: "resource.deploy.pods.statuses", type: "label" },
    { labelValue: "possiblereptile", status: "failure", value: "1/3" },
    { type: "spacer" },
    { type: "spacer" },
    { labelKey: "resource.container.logs", type: "label" },
    {
      indent: true,
      type: "link",
      value: {
        data: {
          action: "show_pod_log",
          cluster: "possiblereptile",
          name: undefined,
          namespace: undefined
        },
        label: "View Log"
      }
    },
    {
      indent: true,
      type: "link",
      value: {
        data: {
          action: "show_resource_yaml",
          cluster: "possiblereptile",
          selfLink: undefined
        },
        label: "View Resource YAML"
      }
    },
    {
      indent: undefined,
      labelKey: "resource.clustername",
      labelValue: undefined,
      status: undefined,
      type: "label",
      value: "possiblereptile"
    },
    {
      indent: undefined,
      labelKey: "resource.status",
      labelValue: undefined,
      status: "checkmark",
      type: "label",
      value: "Running"
    },
    {
      indent: undefined,
      labelKey: "resource.restarts",
      labelValue: undefined,
      status: undefined,
      type: "label",
      value: "undefined"
    },
    {
      indent: undefined,
      labelKey: "resource.hostip",
      labelValue: undefined,
      status: undefined,
      type: "label",
      value: "undefined, undefined"
    },
    {
      indent: undefined,
      labelKey: "resource.created",
      labelValue: undefined,
      status: undefined,
      type: "label",
      value: "-"
    },
    { type: "spacer" }
  ];
  it("setPodDeployStatus with pod less then desired ", () => {
    expect(setPodDeployStatus(node, [])).toEqual(result);
  });
});

describe("setPodDeployStatus  with pod as desired", () => {
  const node = {
    type: "pod",
    name: "mortgage-app-deploy",
    namespace: "default",
    id:
      "member--member--deployable--member--clusters--possiblereptile--default--mortgage-app-subscription-mortgage-mortgage-app-deploy-deployment--deployment--mortgage-app-deploy",
    podStatusMap: {
      possiblereptile: {
        ready: 3,
        desired: 3
      }
    },
    specs: {
      raw: {
        spec: {
          replicas: 1,
          template: {
            spec: {
              containers: [{ c1: "aa" }]
            }
          }
        }
      },
      podModel: {
        "mortgage-app-deploy-55c65b9c8f-r84f4-possiblereptile": {
          cluster: "possiblereptile",
          status: "Running"
        },
        "mortgage-app-deploy-55c65b9c8f-r84f4-possiblereptile2": {
          cluster: "possiblereptile",
          status: "Pending"
        },
        "mortgage-app-deploy-55c65b9c8f-r84f4-possiblereptile3": {
          cluster: "possiblereptile",
          status: "CrashLoopBackOff"
        }
      }
    }
  };
  const result = [
    { type: "spacer" },
    { labelKey: "resource.deploy.pods.statuses", type: "label" },
    { labelValue: "possiblereptile", status: "checkmark", value: "3/3" },
    { type: "spacer" },
    { type: "spacer" },
    { labelKey: "resource.container.logs", type: "label" },
    {
      indent: true,
      type: "link",
      value: {
        data: {
          action: "show_pod_log",
          cluster: "possiblereptile",
          name: undefined,
          namespace: undefined
        },
        label: "View Log"
      }
    },
    {
      indent: true,
      type: "link",
      value: {
        data: {
          action: "show_resource_yaml",
          cluster: "possiblereptile",
          selfLink: undefined
        },
        label: "View Resource YAML"
      }
    },
    {
      indent: undefined,
      labelKey: "resource.clustername",
      labelValue: undefined,
      status: undefined,
      type: "label",
      value: "possiblereptile"
    },
    {
      indent: undefined,
      labelKey: "resource.status",
      labelValue: undefined,
      status: "checkmark",
      type: "label",
      value: "Running"
    },
    {
      indent: undefined,
      labelKey: "resource.restarts",
      labelValue: undefined,
      status: undefined,
      type: "label",
      value: "undefined"
    },
    {
      indent: undefined,
      labelKey: "resource.hostip",
      labelValue: undefined,
      status: undefined,
      type: "label",
      value: "undefined, undefined"
    },
    {
      indent: undefined,
      labelKey: "resource.created",
      labelValue: undefined,
      status: undefined,
      type: "label",
      value: "-"
    },
    { type: "spacer" },
    { type: "spacer" },
    { labelKey: "resource.container.logs", type: "label" },
    {
      indent: true,
      type: "link",
      value: {
        data: {
          action: "show_pod_log",
          cluster: "possiblereptile",
          name: undefined,
          namespace: undefined
        },
        label: "View Log"
      }
    },
    {
      indent: true,
      type: "link",
      value: {
        data: {
          action: "show_resource_yaml",
          cluster: "possiblereptile",
          selfLink: undefined
        },
        label: "View Resource YAML"
      }
    },
    {
      indent: undefined,
      labelKey: "resource.clustername",
      labelValue: undefined,
      status: undefined,
      type: "label",
      value: "possiblereptile"
    },
    {
      indent: undefined,
      labelKey: "resource.status",
      labelValue: undefined,
      status: "warning",
      type: "label",
      value: "Pending"
    },
    {
      indent: undefined,
      labelKey: "resource.restarts",
      labelValue: undefined,
      status: undefined,
      type: "label",
      value: "undefined"
    },
    {
      indent: undefined,
      labelKey: "resource.hostip",
      labelValue: undefined,
      status: undefined,
      type: "label",
      value: "undefined, undefined"
    },
    {
      indent: undefined,
      labelKey: "resource.created",
      labelValue: undefined,
      status: undefined,
      type: "label",
      value: "-"
    },
    { type: "spacer" },
    { type: "spacer" },
    { labelKey: "resource.container.logs", type: "label" },
    {
      indent: true,
      type: "link",
      value: {
        data: {
          action: "show_pod_log",
          cluster: "possiblereptile",
          name: undefined,
          namespace: undefined
        },
        label: "View Log"
      }
    },
    {
      indent: true,
      type: "link",
      value: {
        data: {
          action: "show_resource_yaml",
          cluster: "possiblereptile",
          selfLink: undefined
        },
        label: "View Resource YAML"
      }
    },
    {
      indent: undefined,
      labelKey: "resource.clustername",
      labelValue: undefined,
      status: undefined,
      type: "label",
      value: "possiblereptile"
    },
    {
      indent: undefined,
      labelKey: "resource.status",
      labelValue: undefined,
      status: "failure",
      type: "label",
      value: "CrashLoopBackOff"
    },
    {
      indent: undefined,
      labelKey: "resource.restarts",
      labelValue: undefined,
      status: undefined,
      type: "label",
      value: "undefined"
    },
    {
      indent: undefined,
      labelKey: "resource.hostip",
      labelValue: undefined,
      status: undefined,
      type: "label",
      value: "undefined, undefined"
    },
    {
      indent: undefined,
      labelKey: "resource.created",
      labelValue: undefined,
      status: undefined,
      type: "label",
      value: "-"
    },
    { type: "spacer" }
  ];
  it("setPodDeployStatus with pod as desired", () => {
    expect(setPodDeployStatus(node, [])).toEqual(result);
  });
});

describe("addNodeOCPRouteLocationForCluster no host spec", () => {
  const node = {
    type: "route",
    name: "mortgage-app-deploy",
    namespace: "default",
    id:
      "member--member--deployable--member--clusters--possiblereptile--default--mortgage-app-subscription-mortgage-mortgage-app-deploy-deployment--deployment--mortgage-app-deploy",

    clusters: {
      specs: {
        clusters: [
          {
            metadata: {
              name: "possiblereptile"
            },
            clusterip: "aaa"
          }
        ]
      }
    },
    specs: {
      routeModel: {
        "mortgage-app-deploy-possiblereptile": {
          cluster: "possiblereptile"
        }
      },
      raw: {
        kind: "Route"
      }
    }
  };
  const obj = {
    id: "objID"
  };
  const result = [
    {
      indent: true,
      type: "link",
      value: {
        data: { action: "open_link", targetLink: "http://undefined/" },
        id: "objID-location",
        label: "http://undefined/"
      }
    }
  ];
  it("addNodeOCPRouteLocationForCluster no host spec", () => {
    expect(addNodeOCPRouteLocationForCluster(node, obj, [])).toEqual(result);
  });
});

describe("addOCPRouteLocation spec no tls", () => {
  const node = {
    type: "route",
    name: "mortgage-app-deploy",
    namespace: "default",
    id:
      "member--member--deployable--member--clusters--possiblereptile--default--mortgage-app-subscription-mortgage-mortgage-app-deploy-deployment--deployment--mortgage-app-deploy",
    clusters: {
      specs: {
        clusters: [
          {
            metadata: {
              name: "possiblereptile"
            },
            clusterip: "aaa"
          }
        ]
      }
    },
    specs: {
      routeModel: {
        "mortgage-app-deploy-possiblereptile": {
          kind: "route",
          cluster: "possiblereptile"
        }
      },
      raw: {
        kind: "Route",
        spec: {
          host: "1.1.1"
        }
      }
    }
  };
  const result = [];
  it("addOCPRouteLocation no tls", () => {
    expect(addOCPRouteLocation(node, "possiblereptile", [])).toEqual(result);
  });
});

describe("addNodeOCPRouteLocationForCluster spec no route", () => {
  const node = {
    type: "route",
    name: "mortgage-app-deploy",
    namespace: "default",
    id:
      "member--member--deployable--member--clusters--possiblereptile--default--mortgage-app-subscription-mortgage-mortgage-app-deploy-route--route--mortgage-app-deploy",

    specs: {
      routeModel: {
        "mortgage-app-deploy-possiblereptile": {
          kind: "route",
          cluster: "possiblereptile"
        }
      },
      raw: {
        kind: "Route",
        spec: {
          host: "1.1.1"
        }
      }
    }
  };
  const obj = {
    id: "objID"
  };
  const result = [];
  it("addNodeOCPRouteLocationForCluster no route", () => {
    expect(addNodeOCPRouteLocationForCluster(node, obj, [])).toEqual(result);
  });
});

describe("addOCPRouteLocation spec with tls", () => {
  const node = {
    type: "route",
    name: "mortgage-app-deploy",
    namespace: "default",
    id:
      "member--member--deployable--member--clusters--possiblereptile--default--mortgage-app-subscription-mortgage-mortgage-app-deploy-route--route--mortgage-app-deploy",
    specs: {
      routeModel: {
        "mortgage-app-deploy-possiblereptile": {
          kind: "route",
          cluster: "possiblereptile"
        }
      },
      raw: {
        kind: "Route",
        spec: {
          tls: {},
          host: "1.1.1"
        }
      }
    }
  };
  it("addOCPRouteLocation with tls", () => {
    expect(addOCPRouteLocation(node, "possiblereptile", [])).toEqual([]);
  });
});

describe("addNodeOCPRouteLocationForCluster", () => {
  const node = {
    type: "route",
    name: "mortgage-app-deploy",
    namespace: "default",
    id:
      "member--member--deployable--member--clusters--possiblereptile--default--mortgage-app-subscription-mortgage-mortgage-app-deploy-route--route--mortgage-app-deploy",
    specs: {
      routeModel: {
        "mortgage-app-deploy-possiblereptile": {
          kind: "route",
          cluster: "possiblereptile"
        }
      },
      raw: {
        kind: "Route",
        spec: {
          tls: {},
          host: "1.1.1"
        }
      }
    }
  };

  const obj = {
    id: "objID"
  };
  const result = [];
  it("addNodeOCPRouteLocationForCluster with tls and host", () => {
    expect(addNodeOCPRouteLocationForCluster(node, obj, [])).toEqual(result);
  });
});

describe("addNodeOCPRouteLocationForCluster", () => {
  const node = {
    type: "route",
    name: "mortgage-app-deploy",
    namespace: "default",
    id:
      "member--member--deployable--member--clusters--possiblereptile--default--mortgage-app-subscription-mortgage-mortgage-app-deploy-route--route--mortgage-app-deploy",
    specs: {
      routeModel: {
        "mortgage-app-deploy-possiblereptile": {
          kind: "route",
          cluster: "possiblereptile"
        }
      },
      raw: {
        kind: "Route",
        spec: {
          tls: {},
          host: "1.1.1"
        }
      }
    }
  };

  const result = [
    { type: "spacer" },
    { labelKey: "raw.spec.host.location", type: "label" },
    {
      indent: true,
      type: "link",
      value: {
        data: { action: "open_link", targetLink: "https://1.1.1/" },
        id: "0-location",
        label: "https://1.1.1/"
      }
    },
    { type: "spacer" }
  ];
  it("addNodeOCPRouteLocationForCluster with tls and no obj", () => {
    expect(addNodeOCPRouteLocationForCluster(node, undefined, [])).toEqual(
      result
    );
  });
});

describe("addNodeOCPRouteLocationForCluster", () => {
  const node = {
    type: "route",
    name: "mortgage-app-deploy",
    namespace: "default",
    id:
      "member--member--deployable--member--clusters--possiblereptile--default--mortgage-app-subscription-mortgage-mortgage-app-deploy-route--route--mortgage-app-deploy",
    clusters: {
      specs: {
        clusters: [
          {
            clusterip: "222",
            metadata: {
              name: "possiblereptile"
            }
          }
        ]
      }
    },
    specs: {
      routeModel: {
        "mortgage-app-deploy-possiblereptile": {
          kind: "route",
          cluster: "possiblereptile"
        }
      },
      raw: {
        kind: "Route",
        spec: {
          tls: {}
        }
      }
    }
  };

  const obj = {
    id: "objID",
    cluster: "possiblereptile"
  };
  const result = [
    {
      indent: true,
      type: "link",
      value: {
        data: {
          action: "open_link",
          targetLink: "https://mortgage-app-deploy-default.222/"
        },
        id: "objID-location",
        label: "https://mortgage-app-deploy-default.222/"
      }
    }
  ];

  it("addNodeOCPRouteLocationForCluster with tls and no host", () => {
    expect(addNodeOCPRouteLocationForCluster(node, obj, [])).toEqual(result);
  });
});

describe("addIngressNodeInfo 1", () => {
  const node = {
    type: "ingress",
    name: "mortgage-app-deploy",
    namespace: "default",
    id:
      "member--member--deployable--member--clusters--possiblereptile--default--mortgage-app-subscription-mortgage-mortgage-app-deploy-service--service--mortgage-app-deploy",
    specs: {
      raw: {
        kind: "Ingress",
        spec: {
          rules: [
            {
              host: "aaa",
              http: {
                paths: [
                  {
                    backend: {
                      serviceName: "n1",
                      servicePort: "p1"
                    }
                  },
                  {
                    backend: {
                      serviceName: "n2",
                      servicePort: "p2"
                    }
                  }
                ]
              }
            },
            {
              host: "bbb",
              http: {
                paths: [
                  {
                    backend: {
                      serviceName: "bn1",
                      servicePort: "bp1"
                    }
                  },
                  {
                    backend: {
                      serviceName: "bn2",
                      servicePort: "bp2"
                    }
                  }
                ]
              }
            }
          ],
          host: "1.1.1"
        }
      }
    }
  };
  const result = [
    { labelKey: "raw.spec.host.location", type: "label" },
    { labelKey: "raw.spec.ingress.host", value: "aaa" },
    { labelKey: "raw.spec.ingress.service", value: "n1" },
    { labelKey: "raw.spec.ingress.service.port", value: "p1" },
    { labelKey: "raw.spec.ingress.service", value: "n2" },
    { labelKey: "raw.spec.ingress.service.port", value: "p2" },
    { type: "spacer" },
    { labelKey: "raw.spec.ingress.host", value: "bbb" },
    { labelKey: "raw.spec.ingress.service", value: "bn1" },
    { labelKey: "raw.spec.ingress.service.port", value: "bp1" },
    { labelKey: "raw.spec.ingress.service", value: "bn2" },
    { labelKey: "raw.spec.ingress.service.port", value: "bp2" },
    { type: "spacer" }
  ];
  it("addIngressNodeInfo 1", () => {
    expect(addIngressNodeInfo(node, [])).toEqual(result);
  });
});

describe("addIngressNodeInfo other node type", () => {
  const node = {
    type: "ingress22",
    name: "mortgage-app-deploy",
    namespace: "default",
    id:
      "member--member--deployable--member--clusters--possiblereptile--default--mortgage-app-subscription-mortgage-mortgage-app-deploy-service--service--mortgage-app-deploy",
    specs: {
      raw: {
        kind: "Ingress22"
      }
    }
  };
  it("addIngressNodeInfo 1", () => {
    expect(addIngressNodeInfo(node, [])).toEqual([]);
  });
});

describe("addNodeServiceLocation 1", () => {
  const node = {
    type: "service",
    name: "mortgage-app-deploy",
    namespace: "default",
    id:
      "member--member--deployable--member--clusters--possiblereptile--default--mortgage-app-subscription-mortgage-mortgage-app-deploy-service--service--mortgage-app-deploy",
    specs: {
      serviceModel: {
        "mortgage-app-deploy-possiblereptile": {
          clusterIP: "1.1",
          port: "80:65/TCP"
        }
      },
      raw: {
        metadata: {
          name: "mortgage-app-deploy"
        },
        kind: "Service",
        spec: {
          tls: {},
          host: "1.1.1"
        }
      }
    }
  };
  const result = [{ labelKey: "raw.spec.host.location", value: "1.1:80" }];
  it("addNodeServiceLocation 1", () => {
    expect(addNodeServiceLocation(node, "possiblereptile", [])).toEqual(result);
  });
});

describe("addNodeInfoPerCluster 1", () => {
  const node = {
    type: "service",
    name: "mortgage-app-deploy",
    namespace: "default",
    id:
      "member--member--deployable--member--clusters--possiblereptile--default--mortgage-app-subscription-mortgage-mortgage-app-deploy-service--service--mortgage-app-deploy",
    specs: {
      serviceModel: {
        "mortgage-app-deploy-possiblereptile": {
          clusterIP: "1.1",
          port: "80:65/TCP"
        }
      },
      raw: {
        metadata: {
          name: "mortgage-app-deploy"
        },
        kind: "Service",
        spec: {
          tls: {},
          host: "1.1.1"
        }
      }
    }
  };
  const testFn = (jest.fn = () => {
    return {
      type: "label",
      labelValue: "clusterName",
      value: "location"
    };
  });
  it("addNodeInfoPerCluster 1", () => {
    expect(addNodeInfoPerCluster(node, "possiblereptile", [], testFn)).toEqual(
      []
    );
  });
});

describe("addNodeServiceLocationForCluster 1", () => {
  const node = {
    type: "service",
    name: "mortgage-app-deploy",
    namespace: "default",
    id:
      "member--member--deployable--member--clusters--possiblereptile--default--mortgage-app-subscription-mortgage-mortgage-app-deploy-service--service--mortgage-app-deploy",
    specs: {
      serviceModel: {
        "mortgage-app-deploy-possiblereptile": {
          clusterIP: "1.1",
          port: "80:65/TCP"
        }
      },
      raw: {
        metadata: {
          name: "mortgage-app-deploy"
        },
        kind: "Service",
        spec: {
          tls: {},
          host: "1.1.1"
        }
      }
    }
  };
  const obj = {
    cluster: "possiblereptile",
    clusterIP: "172.30.129.147",
    created: "2020-05-26T19:18:18Z",
    kind: "service",
    label: "app=guestbook; tier=frontend",
    name: "mortgage-app-deploy",
    namespace: "default",
    port: "80:31021/TCP",
    selfLink: "/api/v1/namespaces/app-guestbook-git-ns/services/frontend",
    type: "NodePort"
  };
  const result = [
    { labelKey: "raw.spec.host.location", value: "172.30.129.147:80" }
  ];
  it("addNodeServiceLocationForCluster 1", () => {
    expect(addNodeServiceLocationForCluster(node, obj, [])).toEqual(result);
  });
});

describe("addNodeServiceLocationForCluster 1", () => {
  const node = {
    type: "service",
    name: "mortgage-app-deploy",
    namespace: "default",
    id:
      "member--member--deployable--member--clusters--possiblereptile--default--mortgage-app-subscription-mortgage-mortgage-app-deploy-service--service--mortgage-app-deploy",
    specs: {
      serviceModel: {
        "mortgage-app-deploy-possiblereptile": {
          clusterIP: "1.1",
          port: "80:65/TCP"
        }
      },
      raw: {
        metadata: {
          name: "mortgage-app-deploy"
        },
        kind: "Service",
        spec: {
          tls: {},
          host: "1.1.1"
        }
      }
    }
  };
  const result = [];
  it("addNodeServiceLocationForCluster no obj", () => {
    expect(addNodeServiceLocationForCluster(node, undefined, [])).toEqual(
      result
    );
  });
});

describe("processResourceActionLink search view", () => {
  const openSearchView = {
    action: "show_search",
    kind: "service",
    name: "frontend",
    namespace: "open-cluster-management"
  };
  const result =
    '/multicloud/search?filters={"textsearch":"kind:service name:frontend namespace:open-cluster-management"}';
  it("processResourceActionLink opens search view", () => {
    expect(processResourceActionLink(openSearchView)).toEqual(result);
  });
});

describe("processResourceActionLink openRemoteresourceYaml", () => {
  const openRemoteresourceYaml = {
    action: "show_resource_yaml",
    cluster: "possiblereptile",
    selfLink: "/api/v1/namespaces/open-cluster-management/services/frontend"
  };
  const result =
    "/multicloud/details/possiblereptile/api/v1/namespaces/open-cluster-management/services/frontend";
  it("processResourceActionLink openRemoteresourceYaml", () => {
    expect(processResourceActionLink(openRemoteresourceYaml)).toEqual(result);
  });
});

describe("processResourceActionLink openPodLog", () => {
  const openPodLog = {
    action: "show_pod_log",
    cluster: "braveman",
    name: "frontend-6cb7f8bd65-8d9x2",
    namespace: "open-cluster-management"
  };
  const result =
    "/multicloud/details/braveman/api/v1/namespaces/open-cluster-management/pods/frontend-6cb7f8bd65-8d9x2/logs";
  it("processResourceActionLink openPodLog", () => {
    expect(processResourceActionLink(openPodLog)).toEqual(result);
  });
});

describe("processResourceActionLink search view", () => {
  const genericLink = {
    action: "open_link",
    targetLink: "http://www.example.com"
  };
  const result = "http://www.example.com";
  it("processResourceActionLink opens search view", () => {
    expect(processResourceActionLink(genericLink)).toEqual(result);
  });
});

describe("processResourceActionLink dummy link", () => {
  const genericLink = {
    action: "open_link",
    targetLink1: "http://www.example.com"
  };
  const result = "";
  it("processResourceActionLink opens search view", () => {
    expect(processResourceActionLink(genericLink)).toEqual(result);
  });
});
