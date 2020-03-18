/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/
"use strict";

import { getNodeDetails } from "../../../../../../src-web/components/Topology/viewer/defaults/details";
import { memo } from "react";

const locale = "en-US";

describe("getNodeDetails cluster node", () => {
  const clusterNode = {
    id: "member--clusters--feng",
    uid: "member--clusters--feng",
    name: "feng",
    cluster: null,
    clusterName: null,
    type: "cluster",
    specs: {
      clusters: [],
      clusterNames: ["feng"],
      cluster: {
        capacity: {
          nodes: [],
          cpu: "10",
          memory: "32",
          storage: "500"
        },
        usage: {
          pods: [],
          cpu: "8",
          memory: "24",
          storage: "400"
        }
      },
      violations: [
        {
          name: "Violation1"
        },
        {
          name: "Violation2"
        }
      ]
    },
    namespace: "",
    topology: null,
    labels: null,
    __typename: "Resource",
    layout: {
      uid: "member--clusters--feng",
      type: "cluster",
      label: "feng",
      compactLabel: "feng",
      nodeIcons: {},
      nodeStatus: "",
      isDisabled: false,
      title: "",
      description: "",
      tooltips: [
        {
          name: "Cluster",
          value: "feng",
          href:
            "/multicloud/search?filters={'textsearch':'kind:cluster name:feng'}"
        }
      ],
      x: 76.5,
      y: 241.5,
      section: { name: "preset", hashCode: 872479835, x: 0, y: 0 },
      testBBox: {
        x: -11.6875,
        y: 5,
        width: 23.375,
        height: 13.669448852539062
      },
      lastPosition: { x: 76.5, y: 241.5 },
      selected: true
    }
  };

  const expectedResult = [
    {
      indent: undefined,
      labelKey: "resource.pods",
      labelValue: undefined,
      type: "label",
      value: []
    },
    {
      indent: undefined,
      labelKey: "resource.nodes",
      labelValue: undefined,
      type: "label",
      value: []
    },
    {
      indent: undefined,
      labelKey: "resource.cpu",
      labelValue: undefined,
      type: "label",
      value: "80%"
    },
    {
      indent: undefined,
      labelKey: "resource.memory",
      labelValue: undefined,
      type: "label",
      value: "75%"
    },
    {
      indent: undefined,
      labelKey: "resource.storage",
      labelValue: undefined,
      type: "label",
      value: "80%"
    },
    {
      indent: undefined,
      labelKey: "resource.created",
      labelValue: undefined,
      type: "label",
      value: "-"
    },
    {
      labelKey: "resource.violations",
      type: "label"
    },
    {
      indent: undefined,
      labelKey: undefined,
      labelValue: undefined,
      type: "label",
      value: {
        name: "Violation1"
      }
    },
    {
      indent: undefined,
      labelKey: undefined,
      labelValue: undefined,
      type: "label",
      value: {
        name: "Violation2"
      }
    }
  ];

  it("should process the node", () => {
    expect(getNodeDetails(clusterNode, locale)).toEqual(expectedResult);
  });
});

describe("getNodeDetails deployment node", () => {
  const placementNode = {
    id: "placement1",
    uid: "placement1",
    name: "mortgage-placement",
    cluster: null,
    clusterName: null,
    type: "placement",
    specs: {
      placements: [
        {
          name: "placement1"
        },
        {
          name: "placement2"
        }
      ]
    }
  };

  const expectedValue = [
    {
      labelKey: "resource.placement",
      type: "label"
    },
    {
      type: "snippet",
      value: {
        name: "placement1"
      }
    },
    {
      type: "snippet",
      value: {
        name: "placement2"
      }
    }
  ];

  it("should process the node", () => {
    expect(getNodeDetails(placementNode, locale)).toEqual(expectedValue);
  });
});

describe("getNodeDetails deployment node", () => {
  const deploymentNode = {
    id:
      "member--member--deployable--member--clusters--feng--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
    uid:
      "member--member--deployable--member--clusters--feng--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
    name: "mortgage-app-deploy",
    cluster: null,
    clusterName: null,
    type: "deployment",
    specs: {
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
      }
    }
  };

  const expectedResult = [
    {
      indent: undefined,
      labelKey: "resource.type",
      labelValue: undefined,
      type: "label",
      value: "deployment"
    },
    {
      labelKey: "resource.status",
      type: "label",
      value: "Subscribed"
    },
    {
      labelKey: "resource.status.last.updated",
      type: "label",
      value: "-"
    },
    {
      labelKey: "resource.resource.status",
      type: "label"
    },
    {
      type: "snippet",
      value: {
        availableReplicas: 1
      }
    }
  ];
  it("should process the node", () => {
    expect(getNodeDetails(deploymentNode, locale)).toEqual(expectedResult);
  });
});

describe("getNodeDetails helm node", () => {
  const helmreleaseNode = {
    id: "helmrelease1",
    uid: "helmrelease1",
    name: "mortgage-helmrelease",
    cluster: null,
    clusterName: null,
    type: "helmrelease",
    specs: {
      raw: {
        apiVersion: "app.ibm.com/v1alpha1",
        kind: "HelmRelease",
        metadata: {
          labels: { app: "mortgage-app-mortgage" },
          name: "mortgage-app-deploy"
        },
        spec: {
          chartName: "mortgage-chart",
          urls: "https://mortgage-chart",
          version: "1.0.0",
          node: {
            name: "node1"
          }
        }
      }
    }
  };

  const expectedResult = [
    {
      indent: undefined,
      labelKey: "resource.name",
      labelValue: undefined,
      type: "label",
      value: "mortgage-chart"
    },
    {
      indent: undefined,
      labelKey: "resource.url",
      labelValue: undefined,
      type: "label",
      value: "https://mortgage-chart"
    },
    {
      indent: undefined,
      labelKey: "resource.version",
      labelValue: undefined,
      type: "label",
      value: "1.0.0"
    }
  ];

  it("should process the node", () => {
    expect(getNodeDetails(helmreleaseNode, locale)).toEqual(expectedResult);
  });
});

describe("getNodeDetails helm node", () => {
  const policyNode = {
    id: "helmrelease1",
    uid: "helmrelease1",
    name: "mortgage-helmrelease",
    cluster: null,
    clusterName: null,
    type: "policy",
    specs: {
      policy: {
        metadata: {
          name: "policy1",
          namespace: "default",
          creationTimestamp: "2020-03-11T17:16:44Z",
          annotations: {
            "policy.mcm.ibm.com/categories": "1,2,3,4,5",
            "policy.mcm.ibm.com/controls": "1,2,3,4,5",
            "policy.mcm.ibm.com/standards": "1,2,3,4,5"
          }
        },
        remediation: "Fix security issue",
        spec: {
          "object-templates": [
            {
              "objectDefinition.kind": "kind1"
            }
          ],
          "role-templates": [
            {
              "objectDefinition.kind": "kind2"
            }
          ],
          "policy-templates": [
            {
              "objectDefinition.kind": "kind3"
            }
          ]
        }
      }
    }
  };

  const expectedResult = [
    {
      indent: undefined,
      labelKey: "resource.name",
      labelValue: undefined,
      type: "label",
      value: "policy1"
    },
    {
      indent: undefined,
      labelKey: "resource.namespace",
      labelValue: undefined,
      type: "label",
      value: "default"
    },
    {
      indent: undefined,
      labelKey: "resource.created",
      labelValue: undefined,
      type: "label",
      value: "6 days ago"
    },
    {
      indent: undefined,
      labelKey: "resource.remediation",
      labelValue: undefined,
      type: "label",
      value: "Fix security issue"
    },
    {
      labelKey: "resource.categories",
      type: "label"
    },
    {
      indent: undefined,
      labelKey: undefined,
      labelValue: undefined,
      type: "label",
      value: "1"
    },
    {
      indent: undefined,
      labelKey: undefined,
      labelValue: undefined,
      type: "label",
      value: "2"
    },
    {
      indent: undefined,
      labelKey: undefined,
      labelValue: undefined,
      type: "label",
      value: "3"
    },
    {
      indent: undefined,
      labelKey: undefined,
      labelValue: undefined,
      type: "label",
      value: "4"
    },
    {
      indent: undefined,
      labelKey: undefined,
      labelValue: undefined,
      type: "label",
      value: "5"
    },
    {
      indent: undefined,
      labelKey: "resource.controls",
      labelValue: undefined,
      type: "label",
      value: "1,2,3,4,5"
    },
    {
      indent: undefined,
      labelKey: "resource.standards",
      labelValue: undefined,
      type: "label",
      value: "1,2,3,4,5"
    },
    {
      labelKey: "resource.object.templates",
      type: "label"
    },
    {
      indent: true,
      labelKey: undefined,
      labelValue: undefined,
      type: "label",
      value: "kind1"
    },
    {
      labelKey: "resource.role.templates",
      type: "label"
    },
    {
      indent: true,
      labelKey: undefined,
      labelValue: undefined,
      type: "label",
      value: "kind2"
    },
    {
      labelKey: "resource.policy.templates",
      type: "label"
    },
    {
      indent: true,
      labelKey: undefined,
      labelValue: undefined,
      type: "label",
      value: "kind3"
    }
  ];

  it("should process the node", () => {
    expect(getNodeDetails(policyNode, locale)).toEqual(expectedResult);
  });
});
