/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/
"use strict";

import {
  getNodeDetails,
  inflateKubeValue
} from "../../../../../../src-web/components/Topology/viewer/defaults/details";
import moment from "moment";

const locale = "en-US";

describe("getNodeDetails no clusters or violation", () => {
  const clusterNode = {
    id: "member--clusters--c1",
    uid: "member--clusters--c1",
    name: "c2",
    cluster: null,
    clusterName: null,
    type: "cluster",
    specs: {
      clusterNames: ["c2"]
    },
    namespace: "",
    topology: null,
    labels: null,
    __typename: "Resource",
    layout: {
      uid: "member--clusters--c1",
      type: "cluster",
      label: "c1",
      compactLabel: "c1",
      nodeIcons: {},
      nodeStatus: "",
      isDisabled: false,
      title: "",
      description: "",
      tooltips: [
        {
          name: "Cluster",
          value: "c1",
          href:
            "/multicloud/search?filters={'textsearch':'kind:cluster name:c1'}"
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

  const expectedResult = [];

  it("should process the node, no clusters or violation", () => {
    expect(getNodeDetails(clusterNode, locale)).toEqual(expectedResult);
  });
});

describe("getNodeDetails application node", () => {
  const applicationNode = {
    cluster: null,
    clusterName: null,
    id: "application--nginx-app-3",
    labels: null,
    layout: {
      uid: "application--nginx-app-3",
      type: "application",
      label: "nginx-app-3",
      compactLabel: "nginx-app-3",
      nodeIcons: {
        classType: "failure",
        dx: 16,
        dy: -16,
        height: 16,
        icon: "failure",
        width: 16
      },
      nodeStatus: "",
      search: "",
      title: "",
      type: "application",
      uid: "application--nginx-app-3",
      x: 1.5,
      y: 1.5
    },
    name: "nginx-app-3",
    namespace: "ns-sub-1",
    specs: {
      isDesign: true,
      row: 0
    },
    topology: null,
    type: "application",
    uid: "application--nginx-app-3",
    __typename: "Resource"
  };

  const expectedResult = [
    {
      indent: undefined,
      isError: undefined,
      labelKey: "resource.type",
      labelValue: undefined,
      type: "label",
      value: "application"
    },
    {
      indent: undefined,
      isError: undefined,
      labelKey: "resource.namespace",
      labelValue: undefined,
      type: "label",
      value: "ns-sub-1"
    },
    {
      indent: undefined,
      isError: undefined,
      labelKey: "raw.spec.metadata.label",
      labelValue: undefined,
      type: "label",
      value: "No labels"
    },
    { type: "spacer" },
    {
      type: "link",
      value: {
        data: {
          action: "show_search",
          kind: "application",
          name: "nginx-app-3",
          namespace: "ns-sub-1"
        },
        id: "application--nginx-app-3",
        indent: true,
        label: "Show resource in Search View"
      }
    },
    {
      type: "link",
      value: {
        data: { specs: { isDesign: true, row: 0 } },
        id: "application--nginx-app-3",
        indent: true,
        label: "View Topology YAML"
      }
    },
    { type: "spacer" },
    {
      isError: true,
      labelKey: "spec.selector.matchExpressions",
      value:
        "This application has no subscription match selector (spec.selector.matchExpressions)"
    },
    { type: "spacer" },
    {
      isError: true,
      labelKey: "spec.app.channels",
      value:
        "This application has no matched subscription. Make sure the subscription match selector spec.selector.matchExpressions exists and matches a Subscription resource created in the application namespace."
    }
  ];
  it("should process the node, application node", () => {
    expect(getNodeDetails(applicationNode, locale)).toEqual(expectedResult);
  });
});

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
    },
    {
      type: "spacer"
    }
  ];

  it("should process the node, cluster node", () => {
    expect(getNodeDetails(clusterNode, locale)).toEqual(expectedResult);
  });
});

describe("getNodeDetails clusters node", () => {
  const clusterNode = {
    id: "member--clusters--braveman",
    uid: "member--clusters--braveman",
    name: "braveman",
    cluster: null,
    clusterName: null,
    type: "cluster",
    specs: {
      clusters: [
        {
          metatdata: {
            name: "braveman",
            namespace: "default",
            labels: {
              cloud: "AWS",
              env: "Dev"
            }
          },
          capacity: {
            nodes: [],
            cpu: "10",
            memory: "32Gi",
            storage: "500Gi"
          },
          usage: {
            pods: [],
            cpu: "8",
            memory: "24Ti",
            storage: "400Ei"
          }
        },
        {
          metatdata: {
            name: "possiblereptile",
            namespace: "default",
            labels: {
              cloud: "AWS",
              env: "Dev"
            }
          },
          capacity: {
            nodes: [],
            cpu: "10",
            memory: "32Gi",
            storage: "500Gi"
          },
          usage: {
            pods: [],
            cpu: "8",
            memory: "24Ti",
            storage: "400Ei"
          }
        }
      ],
      clusterNames: ["braveman", "possiblereptile"],
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
      value: "76800%"
    },
    {
      indent: undefined,
      labelKey: "resource.storage",
      labelValue: undefined,
      type: "label",
      value: "85899345920%"
    },
    {
      indent: undefined,
      labelKey: "resource.created",
      labelValue: undefined,
      type: "label",
      value: "-"
    },
    { labelKey: "resource.violations", type: "label" },
    {
      indent: undefined,
      labelKey: undefined,
      labelValue: undefined,
      type: "label",
      value: { name: "Violation1" }
    },
    {
      indent: undefined,
      labelKey: undefined,
      labelValue: undefined,
      type: "label",
      value: { name: "Violation2" }
    },
    { type: "spacer" },
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
      value: "76800%"
    },
    {
      indent: undefined,
      labelKey: "resource.storage",
      labelValue: undefined,
      type: "label",
      value: "85899345920%"
    },
    {
      indent: undefined,
      labelKey: "resource.created",
      labelValue: undefined,
      type: "label",
      value: "-"
    },
    { labelKey: "resource.violations", type: "label" },
    {
      indent: undefined,
      labelKey: undefined,
      labelValue: undefined,
      type: "label",
      value: { name: "Violation1" }
    },
    {
      indent: undefined,
      labelKey: undefined,
      labelValue: undefined,
      type: "label",
      value: { name: "Violation2" }
    },
    { type: "spacer" }
  ];

  it("should process the node", () => {
    expect(getNodeDetails(clusterNode, locale)).toEqual(expectedResult);
  });
});

describe("getNodeDetails placement node", () => {
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

  it("should process the node, more cluster nodes", () => {
    expect(getNodeDetails(placementNode, locale)).toEqual(expectedValue);
  });
});

describe("getNodeDetails deployment node", () => {
  const deploymentNode = {
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
          cluster: "feng",
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
          cluster: "feng",
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

  const expectedResult = [
    {
      indent: undefined,
      isError: undefined,
      labelKey: "resource.type",
      labelValue: undefined,
      type: "label",
      value: "deployment"
    },
    {
      indent: undefined,
      isError: undefined,
      labelKey: "raw.spec.metadata.label",
      labelValue: undefined,
      type: "label",
      value: "app=mortgage-app-mortgage"
    },
    {
      indent: undefined,
      isError: undefined,
      labelKey: "raw.spec.replicas",
      labelValue: undefined,
      type: "label",
      value: "1"
    },
    {
      indent: undefined,
      isError: undefined,
      labelKey: "raw.spec.selector",
      labelValue: undefined,
      type: "label",
      value: "app=mortgage-app-mortgage"
    },
    { type: "spacer" },
    {
      type: "link",
      value: {
        data: {
          action: "show_search",
          kind: "deployment",
          name: "mortgage-app-deploy",
          namespace: ""
        },
        id:
          "member--member--deployable--member--clusters--feng, cluster1, cluster2--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
        indent: true,
        label: "Show resource in Search View"
      }
    },
    { type: "spacer" },
    { labelKey: "resource.deploy.statuses", type: "label" },
    { isError: false, labelValue: "feng", value: "Deployed" },
    {
      indent: true,
      type: "link",
      value: {
        data: {
          action: "show_resource_yaml",
          cluster: undefined,
          selfLink: undefined
        },
        label: "View Remote Resource"
      }
    },
    { isError: false, labelValue: "cluster1", value: "Deployed" },
    {
      indent: true,
      type: "link",
      value: {
        data: {
          action: "show_resource_yaml",
          cluster: undefined,
          selfLink: undefined
        },
        label: "View Remote Resource"
      }
    },
    { isError: true, labelValue: "cluster2", value: "Not Deployed" },
    { type: "spacer" },
    { labelKey: "resource.status", type: "label", value: "Subscribed" },
    { labelKey: "resource.status.last.updated", type: "label", value: "-" },
    { labelKey: "resource.resource.status", type: "label" },
    { type: "snippet", value: { availableReplicas: 1 } }
  ];

  it("should process the node, deployment node", () => {
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

  it("should process the node, helm node", () => {
    expect(getNodeDetails(helmreleaseNode, locale)).toEqual(expectedResult);
  });
});

describe("getNodeDetails helm node", () => {
  const packageNode = {
    id: "helmrelease1",
    uid: "helmrelease1",
    name: "mortgage-helmrelease",
    cluster: null,
    clusterName: null,
    type: "package",
    specs: {
      raw: {
        apiVersion: "app.ibm.com/v1alpha1",
        kind: "Package",
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
      isError: undefined,
      labelKey: "resource.name",
      labelValue: undefined,
      type: "label",
      value: "mortgage-app-deploy"
    },
    {
      indent: undefined,
      isError: undefined,
      labelKey: "resource.message",
      labelValue: undefined,
      type: "label",
      value:
        "There is not enough information in the subscription to retrive deployed objects data."
    }
  ];

  it("should process the node, packageNode node", () => {
    expect(getNodeDetails(packageNode, locale)).toEqual(expectedResult);
  });
});

describe("getNodeDetails helm node 2", () => {
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
          creationTimestamp: `${moment().format()}`,
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
      value: "a few seconds ago"
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

  it("should process the node, helm node 2", () => {
    expect(getNodeDetails(policyNode, locale)).toEqual(expectedResult);
  });
});

describe("getNodeDetails placement rules node", () => {
  const rulesNode = {
    id: "rule1",
    uid: "rule1",
    name: "mortgage-rule",
    cluster: null,
    clusterName: null,
    type: "rules",
    specs: {
      raw: {
        apiVersion: "app.ibm.com/v1alpha1",
        kind: "PlacementRule",
        metadata: {
          labels: { app: "mortgage-app-mortgage" },
          name: "mortgage-app-deploy"
        },
        spec: {
          clusterSelector: {
            matchLabels: {
              environment: "Dev"
            }
          }
        }
      }
    }
  };

  const expectedResult = [
    {
      indent: undefined,
      isError: undefined,
      labelKey: "resource.type",
      labelValue: undefined,
      type: "label",
      value: "rules"
    },
    {
      indent: undefined,
      isError: undefined,
      labelKey: "raw.spec.metadata.label",
      labelValue: undefined,
      type: "label",
      value: "app=mortgage-app-mortgage"
    },
    {
      indent: undefined,
      isError: undefined,
      labelKey: "raw.spec.clusterSelector",
      labelValue: undefined,
      type: "label",
      value: "environment=Dev"
    },
    {
      indent: undefined,
      isError: undefined,
      labelKey: "raw.status.decisionCls",
      labelValue: undefined,
      type: "label",
      value: 0
    },
    { type: "spacer" },
    {
      type: "link",
      value: {
        data: {
          action: "show_search",
          kind: "rules",
          name: "mortgage-rule",
          namespace: undefined
        },
        id: "rule1",
        indent: true,
        label: "Show resource in Search View"
      }
    },
    { type: "spacer" }
  ];
  it("should process the node, placement rules node", () => {
    expect(getNodeDetails(rulesNode, locale)).toEqual(expectedResult);
  });
});

describe("getNodeDetails inflateKubeValue", () => {
  it("process empty kube value", () => {
    expect(inflateKubeValue()).toEqual("");
  });

  it("process Ki kube value", () => {
    expect(inflateKubeValue("10Ki")).toEqual(10240);
  });

  it("process Mi kube value", () => {
    expect(inflateKubeValue("10Mi")).toEqual(10485760);
  });

  it("process Gi kube value", () => {
    expect(inflateKubeValue("10Gi")).toEqual(10737418240);
  });

  it("process Ti kube value", () => {
    expect(inflateKubeValue("10Ti")).toEqual(10995116277760);
  });

  it("process Pi kube value", () => {
    expect(inflateKubeValue("10Pi")).toEqual(11258999068426240);
  });

  it("process Ei kube value", () => {
    expect(inflateKubeValue("10Ei")).toEqual(11529215046068470000);
  });

  it("process m kube value", () => {
    expect(inflateKubeValue("10m")).toEqual(0.01);
  });

  it("process k kube value", () => {
    expect(inflateKubeValue("10k")).toEqual(10000);
  });

  it("process M kube value", () => {
    expect(inflateKubeValue("10M")).toEqual(10000000);
  });

  it("process G kube value", () => {
    expect(inflateKubeValue("10G")).toEqual(10000000000);
  });

  it("process T kube value", () => {
    expect(inflateKubeValue("10T")).toEqual(10000000000000);
  });

  it("process P kube value", () => {
    expect(inflateKubeValue("10P")).toEqual(10000000000000000);
  });

  it("process E kube value", () => {
    expect(inflateKubeValue("10E")).toEqual(10000000000000000000);
  });
});
