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
  setPodDeployStatus
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

describe("createDeployableYamlLink for show logs with details", () => {
  const details = [];
  const node = {
    id: "id",
    specs: {
      row: 20
    }
  };
  const result = [
    {
      type: "link",
      value: {
        data: { specs: { isDesign: true, row: 20 } },
        id: "id",
        indent: true,
        label: "View Topology YAML"
      }
    }
  ];
  it("createDeployableYamlLink", () => {
    expect(createDeployableYamlLink(node, details)).toEqual(result);
  });
});

describe("createDeployableYamlLink for show logs with details no row", () => {
  const details = [];
  const node = {
    id: "id",
    specs: {
      row_foo: 20
    }
  };
  it("createDeployableYamlLink", () => {
    expect(createDeployableYamlLink(node, details)).toEqual([]);
  });
});

describe("createDeployableYamlLink for show logs with undefined details", () => {
  const node = {
    id: "id",
    specs: {
      row: 20
    }
  };
  it("createDeployableYamlLink", () => {
    expect(createDeployableYamlLink(node, undefined)).toEqual(undefined);
  });
});

describe("createResourceSearchLink for undefined details", () => {
  const node = {
    id: "id",
    specs: {
      row: 20
    }
  };
  it("createResourceSearchLink", () => {
    expect(createResourceSearchLink(node, undefined)).toEqual(undefined);
  });
});

describe("createResourceSearchLink for details", () => {
  const node = {
    type: "deployment",
    name: "name",
    namespace: "ns"
  };
  const result = [
    {
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
        label: "Show resource in Search View"
      }
    }
  ];
  it("createResourceSearchLink", () => {
    expect(createResourceSearchLink(node, [])).toEqual(result);
  });
});

describe("setSubscriptionDeployStatus for details", () => {
  const node = {
    type: "subscription",
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
  it("setSubscriptionDeployStatus", () => {
    expect(setSubscriptionDeployStatus(node, [])).toEqual(undefined);
  });
});

describe("setSubscriptionDeployStatus for details2 ", () => {
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
  it("setSubscriptionDeployStatus", () => {
    expect(setSubscriptionDeployStatus(node, [])).toEqual(undefined);
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
          status: "Running"
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

  it("return computeNodeStatus generic node red", () => {
    expect(computeNodeStatus(deploymentNodeGreen)).toEqual(undefined);
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
    expect(setApplicationDeployStatus(node, [])).toEqual(undefined);
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
        spec: {
          selector: "test"
        }
      }
    }
  };
  it("setApplicationDeployStatus deployed selector 2", () => {
    expect(setApplicationDeployStatus(node, [])).toEqual(undefined);
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
  it("setApplicationDeployStatus deployed no selector 2", () => {
    expect(setApplicationDeployStatus(node, [])).toEqual(undefined);
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
  it("setApplicationDeployStatus channels", () => {
    expect(setApplicationDeployStatus(node, [])).toEqual(undefined);
  });
});

describe("setPodDeployStatus  1", () => {
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
  it("setPodDeployStatus 1", () => {
    expect(setPodDeployStatus(node, [])).toEqual(undefined);
  });
});

describe("setPodDeployStatus  with pod less then desired", () => {
  const node = {
    type: "deployment",
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
  it("setPodDeployStatus with pod", () => {
    expect(setPodDeployStatus(node, [])).toEqual(undefined);
  });
});

describe("setPodDeployStatus  with pod as desired", () => {
  const node = {
    type: "deployment",
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
        }
      }
    }
  };
  it("setPodDeployStatus with pod", () => {
    expect(setPodDeployStatus(node, [])).toEqual(undefined);
  });
});
