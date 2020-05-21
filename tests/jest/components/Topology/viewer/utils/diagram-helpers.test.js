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
  setupResourceModel
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
  "mortgagedc-deploy-braveman": {
    specs: {
      deploymentconfigModel: {
        "mortgagedc-deploy-braveman": {
          cluster: "braveman",
          kind: "deploymentconfig",
          label: "app=mortgagedc-mortgage",
          name: "mortgagedc-deploy",
          namespace: "default"
        }
      },
      replicationcontrollerModel: {
        "mortgagedc-deploy-1-braveman": {
          cluster: "braveman",
          created: "2020-04-20T22:03:50Z",
          kind: "replicationcontroller",
          label:
            "app=mortgagedc-mortgage; openshift.io/deployment-config.name=mortgagedc-deploy",
          name: "mortgagedc-deploy-1",
          namespace: "default"
        }
      }
    },
    type: "deploymentconfig"
  },
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
  "mortgagedc-svc-braveman": {
    specs: {
      serviceModel: {
        "mortgagedc-svc-braveman": {
          cluster: "braveman",
          kind: "service",
          label: "app=mortgagedc-mortgage",
          name: "mortgagedc-svc",
          namespace: "default",
          port: "9080:32749/TCP"
        }
      }
    }
  },
  "route-unsecured-braveman": {
    specs: {
      routeModel: {
        "route-unsecured-braveman": {
          cluster: "braveman",
          kind: "route",
          name: "route-unsecured",
          namespace: "default"
        }
      }
    }
  }
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
        label: "View Deployable YAML"
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
