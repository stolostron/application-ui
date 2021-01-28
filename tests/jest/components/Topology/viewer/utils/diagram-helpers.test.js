/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/
"use strict";

import {
  getNodePropery,
  addPropertyToList,
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
  addIngressNodeInfo,
  setPlacementRuleDeployStatus,
  addNodeInfoPerCluster,
  getPodState,
  getNameWithoutChartRelease,
  removeReleaseGeneratedSuffix,
  getPulseStatusForCluster,
  checkNotOrObjects,
  checkAndObjects
} from "../../../../../../src-web/components/Topology/utils/diagram-helpers";

const ansibleSuccess = {
  type: "ansiblejob",
  name: "bigjoblaunch",
  namespace: "default",
  id:
    "member--deployable--member--subscription--default--ansible-tower-job-app-subscription--ansiblejob--bigjoblaunch",
  specs: {
    raw: {
      metadata: {
        name: "bigjoblaunch",
        namespace: "default"
      },
      spec: {
        ansibleJobResult: {
          url: "http://ansible_url/job",
          status: "successful"
        },
        conditions: [
          {
            ansibleResult: {},
            message: "Success",
            reason: "Successful"
          }
        ]
      }
    },
    ansiblejobModel: {
      "bigjoblaunch-local-cluster": {
        label: "tower_job_id=999999999"
      }
    }
  }
};
const ansibleError = {
  type: "ansiblejob",
  name: "bigjoblaunch",
  namespace: "default",
  id:
    "member--deployable--member--subscription--default--ansible-tower-job-app-subscription--ansiblejob--bigjoblaunch",
  specs: {
    raw: {
      metadata: {
        name: "bigjoblaunch",
        namespace: "default"
      }
    },
    ansiblejobModel: {
      "bigjoblaunch-local-cluster": {
        label: "tower_job_id=999999999"
      }
    }
  }
};
const ansibleError2 = {
  type: "ansiblejob",
  name: "bigjoblaunch",
  namespace: "default",
  id:
    "member--deployable--member--subscription--default--ansible-tower-job-app-subscription--ansiblejob--bigjoblaunch",
  specs: {
    raw: {
      metadata: {
        name: "bigjoblaunch",
        namespace: "default"
      },
      spec: {
        conditions: [
          {
            ansibleResult: {
              failures: 0
            },
            message: "Awaiting next reconciliation",
            reason: "Failed"
          }
        ],
        k8sJob: {
          message: "some message"
        }
      }
    },
    ansiblejobModel: {
      "bigjoblaunch-local-cluster": {
        label: "tower_job_id=999999999"
      }
    }
  }
};

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
        kind: "placements"
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

describe("getPulseForNodeWithPodStatus ", () => {
  const podItem = {
    id:
      "member--member--deployable--member--clusters--feng, cluster1, cluster2--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
    uid:
      "member--member--deployable--member--clusters--feng--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
    name: "mortgage-app-deploy",
    cluster: null,
    clusterName: null,
    clusters: {
      specs: {
        clusters: [
          {
            metadata: {
              name: "feng"
            },
            status: "ok"
          },
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
            status: "ok"
          }
        ]
      }
    },
    type: "deployment",
    specs: {
      podModel: {
        "mortgage-app-deploy-55c65b9c8f-6v9bn": {
          cluster: "feng",
          hostIP: "1.1.1.1",
          status: "Error",
          startedAt: "2020-04-20T22:03:52Z",
          restarts: 0,
          podIP: "1.1.1.1"
        }
      },
      deploymentModel: {
        "mortgage-app-deploy-feng": {
          ready: 2,
          desired: 3,
          unavailable: 1
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
    clusters: {
      specs: {
        clusters: [
          {
            metadata: {
              name: "feng"
            },
            status: "ok"
          },
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
            status: "ok"
          }
        ]
      }
    },
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
    expect(getPulseForNodeWithPodStatus(podItem)).toEqual("red");
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
    ).toEqual("yellow");
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

describe("getNameWithoutChartRelease node with pods no _hostingDeployable", () => {
  const node = {
    apiversion: "v1",
    cluster: "sharingpenguin",
    container: "slave",
    created: "2020-05-26T19:18:21Z",
    kind: "pod",
    label:
      "app=nginx-ingress; chart=nginx-ingress-1.36.3; component=default-backend; heritage=Helm; release=nginx-ingress-edafb",
    name: "nginx-ingress-edafb-default-backend",
    namespace: "app-guestbook-git-ns",
    restarts: 0,
    selfLink:
      "/api/v1/namespaces/app-guestbook-git-ns/pods/redis-slave-5bdcfd74c7-22ljj",
    startedAt: "2020-05-26T19:18:21Z",
    status: "Running"
  };

  it("getNameWithoutChartRelease for pod with no deployable", () => {
    expect(
      getNameWithoutChartRelease(node, "nginx-ingress-edafb-default-backend", {
        value: false
      })
    ).toEqual("nginx-ingress-edafb-default-backend");
  });
});

describe("getNameWithoutChartRelease node with the pod name same as the release name", () => {
  const node = {
    apiversion: "v1",
    cluster: "sharingpenguin",
    container: "slave",
    created: "2020-05-26T19:18:21Z",
    kind: "pod",
    label:
      "app=nginx-ingress; chart=nginx-ingress-1.36.3; component=default-backend; heritage=Helm; release=nginx-ingress-edafb",
    name: "nginx-ingress-edafb",
    namespace: "app-guestbook-git-ns",
    restarts: 0,
    selfLink:
      "/api/v1/namespaces/app-guestbook-git-ns/pods/redis-slave-5bdcfd74c7-22ljj",
    startedAt: "2020-05-26T19:18:21Z",
    status: "Running"
  };

  it("getNameWithoutChartRelease for pod name same as the release name", () => {
    expect(
      getNameWithoutChartRelease(node, "nginx-ingress-edafb", {
        value: true
      })
    ).toEqual("nginx-ingress");
  });
});

describe("getNameWithoutChartRelease node with release name plus pod name", () => {
  const node = {
    apiversion: "v1",
    cluster: "sharingpenguin",
    container: "slave",
    created: "2020-05-26T19:18:21Z",
    kind: "pod",
    label:
      "app=nginx-ingress; chart=nginx-ingress-1.36.3; component=default-backend; heritage=Helm; release=nginx-ingress-edafb",
    name: "nginx-ingress-edafb",
    namespace: "app-guestbook-git-ns",
    restarts: 0,
    selfLink:
      "/api/v1/namespaces/app-guestbook-git-ns/pods/redis-slave-5bdcfd74c7-22ljj",
    startedAt: "2020-05-26T19:18:21Z",
    status: "Running"
  };

  it("getNameWithoutChartRelease for pod with release name plus pod name", () => {
    expect(
      getNameWithoutChartRelease(node, "nginx-ingress-edafb-controller", {
        value: true
      })
    ).toEqual("controller");
  });
});

describe("getNameWithoutChartRelease node for helmrelease no label", () => {
  const node = {
    apigroup: "apps.open-cluster-management.io",
    apiversion: "v1",
    branch: "master",
    chartPath: "test/github/helmcharts/chart1",
    cluster: "sharingpenguin",
    created: "2020-07-07T00:11:41Z",
    kind: "helmrelease",
    name: "chart1-5a9ac",
    namespace: "git-sub-ns-helm",
    selfLink:
      "/apis/apps.open-cluster-management.io/v1/namespaces/git-sub-ns-helm/helmreleases/chart1-5a9ac",
    sourceType: "git",
    url:
      "https://github.com/open-cluster-management/multicloud-operators-subscription",
    _clusterNamespace: "sharingpenguin",
    _hostingDeployable: "ch-git-helm/git-helm-chart1-1.1.1",
    _hostingSubscription: "git-sub-ns-helm/git-helm-sub",
    _rbac: "sharingpenguin_apps.open-cluster-management.io_helmreleases",
    _uid: "sharingpenguin/c1e81dd9-6c12-443c-9300-b8da955370dc"
  };

  it("getNameWithoutChartRelease helm release  no no label", () => {
    expect(
      getNameWithoutChartRelease(node, "ch-git-helm/git-helm-chart1-1.1.1", {
        value: true
      })
    ).toEqual("chart1-1.1.1");
  });
});

describe("getNameWithoutChartRelease node for subscription, with label", () => {
  const node = {
    apigroup: "apps.open-cluster-management.io",
    apiversion: "v1",
    channel: "ch-git-helm/git-helm",
    cluster: "local-cluster",
    kind: "subscription",
    label: "app=gbapp; release=app01",
    name: "git-helm-sub",
    namespace: "git-sub-ns-helm",
    selfLink:
      "/apis/apps.open-cluster-management.io/v1/namespaces/git-sub-ns-helm/subscriptions/git-helm-sub",
    status: "Propagated",
    _hubClusterResource: "true"
  };

  it("getNameWithoutChartRelease helm release  no no label", () => {
    expect(
      getNameWithoutChartRelease(node, "git-helm-sub", { value: true })
    ).toEqual("git-helm-sub");
  });
});

describe("createDeployableYamlLink for application no selflink", () => {
  const details = [];
  const node = {
    type: "application",
    name: "test-1",
    namespace: "test-1-ns",
    id: "id",
    specs: {
      row: 20,
      raw: {
        kind: "Application"
      }
    }
  };
  it("createDeployableYamlLink for application selflink", () => {
    expect(createDeployableYamlLink(node, details)).toEqual([
      {
        type: "link",
        value: {
          data: {
            action: "show_resource_yaml",
            cluster: "local-cluster",
            selfLink:
              "apiversion=app.k8s.io%2Fv1beta1&kind=Application&name=test-1&namespace=test-1-ns"
          },
          label: "View Resource YAML"
        }
      }
    ]);
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
          selfLink: "apiversion=v1&kind="
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
      row: 20,
      pulse: "orange"
    }
  };
  const result = { type: "link", value: null };
  it("createResourceSearchLink for undefined details", () => {
    expect(createResourceSearchLink(node, undefined)).toEqual(result);
  });
});

describe("createResourceSearchLink for cluster node no name", () => {
  const node = {
    id: "id",
    type: "cluster"
  };
  const result = {
    type: "link",
    value: {
      data: { action: "show_search", kind: "cluster", name: "undefined" },
      id: "id",
      indent: true,
      label: "Launch resource in Search"
    }
  };
  it("createResourceSearchLink for cluster node no name", () => {
    expect(createResourceSearchLink(node, undefined)).toEqual(result);
  });
});

describe("createResourceSearchLink for cluster node w name", () => {
  const node = {
    id: "id",
    type: "cluster",
    name: "a, b, c"
  };
  const result = {
    type: "link",
    value: {
      data: { action: "show_search", kind: "cluster", name: "a,b,c" },
      id: "id",
      indent: true,
      label: "Launch resource in Search"
    }
  };
  it("createResourceSearchLink for cluster node w name", () => {
    expect(createResourceSearchLink(node, undefined)).toEqual(result);
  });
});

describe("createResourceSearchLink for cluster", () => {
  const node = {
    type: "cluster",
    name: "cls1, cls2, cls3",
    namespace: "ns"
  };
  const result = {
    type: "link",
    value: {
      data: { action: "show_search", kind: "cluster", name: "cls1,cls2,cls3" },
      id: undefined,
      indent: true,
      label: "Launch resource in Search"
    }
  };
  it("createResourceSearchLink for cluster", () => {
    expect(createResourceSearchLink(node, [])).toEqual(result);
  });
});

describe("createResourceSearchLink for PR", () => {
  const node = {
    type: "placements",
    name: "rule1",
    namespace: "ns",
    specs: {
      raw: {
        metadata: {
          namespace: "ns"
        }
      }
    }
  };
  const result = {
    type: "link",
    value: {
      data: {
        action: "show_search",
        kind: "placementrule",
        name: "rule1",
        namespace: "ns"
      },
      id: undefined,
      indent: true,
      label: "Launch resource in Search"
    }
  };
  it("createResourceSearchLink for PR", () => {
    expect(createResourceSearchLink(node, [])).toEqual(result);
  });
});

describe("createResourceSearchLink for details", () => {
  const node = {
    type: "deployment",
    name: "name",
    namespace: "ns",
    specs: {
      raw: {
        metadata: {
          namespace: "ns"
        }
      }
    }
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
  it("createResourceSearchLink for details", () => {
    expect(createResourceSearchLink(node, [])).toEqual(result);
  });
});

describe("createResourceSearchLink for details with model info, unique names", () => {
  const node = {
    type: "deployment",
    name: "name",
    namespace: "ns",
    specs: {
      deploymentModel: {
        obj1_cls1: {
          name: "obj1",
          namespace: "ns1"
        },
        obj2_cls1: {
          name: "obj2",
          namespace: "ns2"
        }
      }
    }
  };
  const result = {
    type: "link",
    value: {
      data: {
        action: "show_search",
        kind: "deployment",
        name: "obj1,obj2",
        namespace: "ns1,ns2"
      },
      id: undefined,
      indent: true,
      label: "Launch resource in Search"
    }
  };
  it("createResourceSearchLink for details with model info, unique names", () => {
    expect(createResourceSearchLink(node, [])).toEqual(result);
  });
});

describe("createResourceSearchLink for details with model info, same names", () => {
  const node = {
    type: "deployment",
    name: "name",
    namespace: "ns",
    specs: {
      deploymentModel: {
        obj1_cls1: {
          name: "name",
          namespace: "ns1"
        },
        obj2_cls1: {
          name: "name",
          namespace: "ns"
        }
      }
    }
  };
  const result = {
    type: "link",
    value: {
      data: {
        action: "show_search",
        kind: "deployment",
        name: "name",
        namespace: "ns1,ns"
      },
      id: undefined,
      indent: true,
      label: "Launch resource in Search"
    }
  };
  it("createResourceSearchLink for details with model info, same names", () => {
    expect(createResourceSearchLink(node, [])).toEqual(result);
  });
});

describe("setSubscriptionDeployStatus with time window ", () => {
  const node = {
    type: "subscription",
    name: "name",
    namespace: "ns",
    specs: {
      subscriptionModel: {
        sub1: {
          cluster: "local",
          status: "Failed",
          _hubClusterResource: "true"
        }
      },
      raw: {
        status: {
          message: " local:Blocked, other: Active"
        },
        spec: {
          placement: {
            local: true
          },
          timewindow: {
            location: "America/Toronto",
            windowtype: "blocked",
            hours: [{ end: "09:18PM", start: "09:18AM" }],
            daysofweek: ["Monday", "Tuesday"]
          }
        }
      }
    }
  };
  const response = [
    { labelKey: "spec.subscr.timeWindow.title", type: "label" },
    { labelKey: "spec.subscr.timeWindow.type", value: "blocked" },
    { labelKey: "spec.subscr.timeWindow.days", value: '["Monday", "Tuesday"]' },
    { labelKey: "spec.subscr.timeWindow.hours", value: "09:18AM-09:18PM" },
    { labelKey: "spec.subscr.timeWindow.timezone", value: "America/Toronto" },
    { type: "spacer" },
    { labelKey: "resource.subscription.local", value: "true" },
    { type: "spacer" },
    { labelKey: "resource.deploy.statuses", type: "label" },
    { labelValue: "local", status: "failure", value: "Failed" },
    { labelKey: "spec.subscr.timeWindow", value: "Blocked" },
    {
      indent: true,
      type: "link",
      value: {
        data: {
          action: "show_resource_yaml",
          cluster: "local",
          selfLink: "apiversion=v1&kind="
        },
        label: "View Resource YAML"
      }
    },
    { type: "spacer" },
    { type: "spacer" }
  ];
  it("setSubscriptionDeployStatuswith time window ", () => {
    expect(setSubscriptionDeployStatus(node, [], {})).toEqual(response);
  });
});

describe("setSubscriptionDeployStatus with local hub subscription error ", () => {
  const node = {
    type: "subscription",
    name: "name",
    namespace: "ns",
    specs: {
      subscriptionModel: {
        sub1: {
          cluster: "local",
          status: "Failed",
          _hubClusterResource: "true"
        }
      },
      raw: {
        spec: {
          placement: {
            local: true
          }
        }
      }
    }
  };
  const response = [
    { type: "spacer" },
    { labelKey: "resource.subscription.local", value: "true" },
    { type: "spacer" },
    { labelKey: "resource.deploy.statuses", type: "label" },
    { labelValue: "local", status: "failure", value: "Failed" },
    {
      indent: true,
      type: "link",
      value: {
        data: {
          action: "show_resource_yaml",
          cluster: "local",
          selfLink: "apiversion=v1&kind="
        },
        label: "View Resource YAML"
      }
    },
    { type: "spacer" },
    { type: "spacer" }
  ];
  it("setSubscriptionDeployStatus with local hub subscription error", () => {
    expect(setSubscriptionDeployStatus(node, [], {})).toEqual(response);
  });
});

describe("setSubscriptionDeployStatus with hub error", () => {
  const node = {
    type: "subscription",
    name: "name",
    namespace: "ns",
    specs: {
      subscriptionModel: {
        sub1: {
          cluster: "local",
          status: "Failed",
          _hubClusterResource: "true"
        }
      }
    }
  };
  const response = [
    { type: "spacer" },
    { labelKey: "resource.deploy.statuses", type: "label" },
    { labelValue: "local", status: "failure", value: "Failed" },
    {
      indent: true,
      type: "link",
      value: {
        data: {
          action: "show_resource_yaml",
          cluster: "local",
          selfLink: "apiversion=v1&kind="
        },
        label: "View Resource YAML"
      }
    },
    { type: "spacer" },
    { type: "spacer" }
  ];
  it("setSubscriptionDeployStatus with hub error", () => {
    expect(setSubscriptionDeployStatus(node, [], {})).toEqual(response);
  });
});

describe("setSubscriptionDeployStatus with no sub error", () => {
  const node = {
    type: "subscription",
    name: "name",
    namespace: "ns",
    specs: {
      subscriptionModel: {}
    }
  };
  const response = [
    { type: "spacer" },
    { labelKey: "resource.deploy.statuses", type: "label" },
    {
      labelValue: "Remote subscriptions",
      status: "failure",
      value:
        "This subscription was not added to a managed cluster. If this status does not change after waiting for initial creation, ensure the Placement Rule resource is valid and exists in the {0} namespace and that the klusterlet-addon-appmgr pod runs on the managed clusters."
    },
    {
      type: "link",
      value: {
        data: {
          action: "open_link",
          targetLink:
            '/search?filters={"textsearch":"kind%3Aplacementrule%20namespace%3Ans%20cluster%3Alocal-cluster"}'
        },
        id: "undefined-subscrSearch",
        label: "View all placement rules in {0} namespace"
      }
    },
    { type: "spacer" }
  ];
  it("setSubscriptionDeployStatus with no hub error", () => {
    expect(setSubscriptionDeployStatus(node, [], {})).toEqual(response);
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
    { labelValue: "local", status: "failure", value: "Failed" },
    {
      indent: true,
      type: "link",
      value: {
        data: {
          action: "show_resource_yaml",
          cluster: "local",
          selfLink: "apiversion=v1&kind="
        },
        label: "View Resource YAML"
      }
    },
    { type: "spacer" },
    { type: "spacer" },
    { type: "spacer" }
  ];
  it("setSubscriptionDeployStatus with error", () => {
    expect(setSubscriptionDeployStatus(node, [], {})).toEqual(response);
  });
});

describe("setSubscriptionDeployStatus with hub no status", () => {
  const node = {
    type: "subscription",
    name: "name",
    namespace: "ns",
    specs: {
      subscriptionModel: {
        sub1: {
          cluster: "local",
          _hubClusterResource: "true"
        }
      }
    }
  };
  const response = [
    { type: "spacer" },
    { labelKey: "resource.deploy.statuses", type: "label" },
    {
      labelValue: "local",
      status: "warning",
      value:
        "This subscription has no status. If the status does not change to {0} after waiting for initial creation, verify that the multicluster-operators-hub-subscription pod is running on hub."
    },
    {
      indent: true,
      type: "link",
      value: {
        data: {
          action: "show_resource_yaml",
          cluster: "local",
          selfLink: "apiversion=v1&kind="
        },
        label: "View Resource YAML"
      }
    },
    { type: "spacer" },
    { type: "spacer" }
  ];
  it("setSubscriptionDeployStatus with hub no status", () => {
    expect(setSubscriptionDeployStatus(node, [], {})).toEqual(response);
  });
});

describe("setSubscriptionDeployStatus with remote no status", () => {
  const node = {
    type: "subscription",
    name: "name",
    namespace: "ns",
    specs: {
      subscriptionModel: {
        sub1: {
          cluster: "local",
          status: "Propagated",
          _hubClusterResource: "true"
        },
        sub2: {
          cluster: "remote1"
        }
      }
    }
  };
  const response = [
    { type: "spacer" },
    { labelKey: "resource.deploy.statuses", type: "label" },
    { type: "spacer" },
    {
      labelValue: "remote1",
      status: "warning",
      value:
        "This subscription has no status. If the status does not change to {0} after waiting for initial creation, verify that the klusterlet-addon-appmgr pod is running on the remote cluster."
    },
    {
      indent: true,
      type: "link",
      value: {
        data: {
          action: "show_resource_yaml",
          cluster: "remote1",
          selfLink: "apiversion=v1&kind="
        },
        label: "View Resource YAML"
      }
    },
    { type: "spacer" },
    { type: "spacer" }
  ];
  it("setSubscriptionDeployStatus with remote no status", () => {
    expect(setSubscriptionDeployStatus(node, [], {})).toEqual(response);
  });
});

describe("setSubscriptionDeployStatus for details yellow", () => {
  const node = {
    type: "subscription",
    name: "name",
    namespace: "ns",
    specs: {
      subscriptionModel: {}
    }
  };
  const response = [
    { type: "spacer" },
    { labelKey: "resource.deploy.statuses", type: "label" },
    {
      labelValue: "Remote subscriptions",
      status: "failure",
      value:
        "This subscription was not added to a managed cluster. If this status does not change after waiting for initial creation, ensure the Placement Rule resource is valid and exists in the {0} namespace and that the klusterlet-addon-appmgr pod runs on the managed clusters."
    },
    {
      type: "link",
      value: {
        data: {
          action: "open_link",
          targetLink:
            '/search?filters={"textsearch":"kind%3Aplacementrule%20namespace%3Ans%20cluster%3Alocal-cluster"}'
        },
        id: "undefined-subscrSearch",
        label: "View all placement rules in {0} namespace"
      }
    },
    { type: "spacer" }
  ];
  it("setSubscriptionDeployStatus yellow", () => {
    expect(setSubscriptionDeployStatus(node, [], {})).toEqual(response);
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
        },
        sub2: {
          cluster: "local-cluster",
          status: "Failed",
          name: "sub2-local"
        }
      }
    }
  };
  it("setSubscriptionDeployStatus for node type different then subscription should return []", () => {
    expect(setSubscriptionDeployStatus(node, [], {})).toEqual([]);
  });
});

describe("setupResourceModel ", () => {
  it("setupResourceModel", () => {
    expect(setupResourceModel(resourceList, resourceMap, false, false)).toEqual(
      modelResult
    );
  });
});

describe("setupResourceModel ", () => {
  it("return setupResourceModel for grouped objects", () => {
    expect(setupResourceModel(resourceList, resourceMap, true, false)).toEqual(
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
    clusters: {
      specs: {
        clusters: []
      }
    },
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
    clusters: {
      specs: {
        clusters: []
      }
    },
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
    clusters: {
      specs: {
        clusters: [
          {
            metadata: {
              name: "feng"
            },
            status: "ok"
          },
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
            status: "ok"
          }
        ]
      }
    },
    type: "deployment",
    specs: {
      raw: {
        spec: {
          replicas: 3
        }
      },
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
    clusters: {
      specs: {
        clusters: [
          {
            metadata: {
              name: "feng"
            },
            status: "ok"
          },
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
            status: "ok"
          }
        ]
      }
    },
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
    clusters: {
      specs: {
        clusters: [
          {
            metadata: {
              name: "feng"
            },
            status: "ok"
          },
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
            status: "ok"
          }
        ]
      }
    },
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
    clusters: {
      specs: {
        clusters: [
          {
            metadata: {
              name: "feng"
            },
            status: "ok"
          },
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
            status: "ok"
          }
        ]
      }
    },
    type: "deployment",
    specs: {
      raw: {
        spec: {
          replicas: 3
        }
      },
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
    clusters: {
      specs: {
        clusters: [
          {
            metadata: {
              name: "feng"
            },
            status: "ok"
          },
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
            status: "ok"
          }
        ]
      }
    },
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
            "/search?filters={'textsearch':'kind:deployment name:mortgage-app-deploy'}"
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
    clusters: {
      specs: {
        clusters: [
          {
            metadata: {
              name: "feng"
            },
            status: "ok"
          },
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
            status: "ok"
          }
        ]
      }
    },
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
            "/search?filters={'textsearch':'kind:deployment name:mortgage-app-deploy'}"
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

  const deploymentNodeRed3 = {
    id:
      "member--member--deployable--member--clusters--feng, cluster1, cluster2--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
    uid:
      "member--member--deployable--member--clusters--feng--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
    name: "mortgage-app-deploy",
    cluster: null,
    clusterName: null,
    clusters: {
      specs: {
        clusters: [
          {
            metadata: {
              name: "feng"
            },
            status: "ok"
          },
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
            status: "ok"
          }
        ]
      }
    },
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
            "/search?filters={'textsearch':'kind:deployment name:mortgage-app-deploy'}"
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
    clusters: {
      specs: {
        clusters: [
          {
            metadata: {
              name: "feng"
            },
            status: "ok"
          },
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
            status: "ok"
          }
        ]
      }
    },
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
    clusters: {
      specs: {
        clusters: [
          {
            metadata: {
              name: "feng"
            },
            status: "ok"
          },
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
            status: "ok"
          }
        ]
      }
    },
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

  const packageNodeOrange = {
    id:
      "member--member--package--member--clusters--feng, cluster1, cluster2--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
    uid:
      "member--member--package--member--clusters--feng--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
    name: "mortgage-app-deploy",
    cluster: null,
    clusterName: null,
    clusters: {
      specs: {
        clusters: [
          {
            metadata: {
              name: "feng"
            },
            status: "ok"
          },
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
            status: "ok"
          }
        ]
      }
    },
    type: "package",
    specs: {}
  };

  const ruleNodeRed = {
    name: "mortgage-app-deploy",
    cluster: null,
    clusterName: null,
    type: "placements",
    specs: {}
  };

  const ruleNodeGreen2 = {
    name: "mortgage-app-deploy2",
    cluster: null,
    clusterName: null,
    type: "placements",
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
    clusters: {
      specs: {
        clusters: [
          {
            metadata: {
              name: "braveman"
            },
            status: "ok"
          },
          {
            metadata: {
              name: "possiblereptile"
            },
            status: "ok"
          },
          {
            metadata: {
              name: "sharingpenguin"
            },
            status: "ok"
          },
          {
            metadata: {
              name: "relievedox"
            },
            status: "ok"
          }
        ]
      }
    },
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

  it("return Ansible error", () => {
    expect(computeNodeStatus(ansibleError)).toEqual("orange");
  });
  it("return Ansible error2", () => {
    expect(computeNodeStatus(ansibleError2)).toEqual("red");
  });
  it("return Ansible success", () => {
    expect(computeNodeStatus(ansibleSuccess)).toEqual("green");
  });
  it("return appNnoChannelRed crash error", () => {
    expect(computeNodeStatus(podCrash)).toEqual("orange");
  });

  it("return appNnoChannelRed red", () => {
    expect(computeNodeStatus(appNoChannelRed)).toEqual("red");
  });

  it("return appNnoChannelRed1 green", () => {
    expect(computeNodeStatus(appNoChannelRed1)).toEqual("green");
  });
  it("return computeNodeStatus red", () => {
    expect(computeNodeStatus(subscriptionInputGreen)).toEqual("red");
  });

  it("return computeNodeStatus orange", () => {
    expect(computeNodeStatus(subscriptionInputRed)).toEqual("orange");
  });

  it("return computeNodeStatus yellow", () => {
    expect(computeNodeStatus(subscriptionInputYellow)).toEqual("yellow");
  });

  it("return computeNodeStatus not places", () => {
    expect(computeNodeStatus(subscriptionInputNotPlaced)).toEqual("green");
  });

  it("return computeNodeStatus generic node orange", () => {
    expect(computeNodeStatus(genericNodeInputRed)).toEqual("orange");
  });

  it("return computeNodeStatus generic node orange 2", () => {
    expect(computeNodeStatus(genericNodeInputRed2)).toEqual("orange");
  });

  it("return computeNodeStatus generic node red", () => {
    expect(computeNodeStatus(deploymentNodeRed3)).toEqual("red");
  });

  it("return computeNodeStatus generic no  pod", () => {
    expect(computeNodeStatus(deploymentNodeNoPodModel)).toEqual("yellow");
  });

  it("return computeNodeStatus generic node no pods", () => {
    expect(computeNodeStatus(deploymentNodeNoPODS)).toEqual("yellow");
  });

  it("return computeNodeStatus generic node no pods res", () => {
    expect(computeNodeStatus(deploymentNodeNoPODSNoRes)).toEqual("yellow");
  });

  it("return computeNodeStatus generic node green", () => {
    expect(computeNodeStatus(genericNodeGreen)).toEqual("yellow");
  });

  it("return computeNodeStatus package node orange", () => {
    expect(computeNodeStatus(packageNodeOrange)).toEqual("orange");
  });

  it("return computeNodeStatus rules node red", () => {
    expect(computeNodeStatus(ruleNodeRed)).toEqual("red");
  });

  it("return computeNodeStatus rules node green2", () => {
    expect(computeNodeStatus(ruleNodeGreen2)).toEqual("green");
  });
  it("return computeNodeStatus deploymentNodeYellow", () => {
    expect(computeNodeStatus(deploymentNodeYellow)).toEqual("yellow");
  });
  it("return computeNodeStatus deploymentNodeRed", () => {
    expect(computeNodeStatus(deploymentNodeRed)).toEqual("red");
  });
  it("return computeNodeStatus deploymentNodeRed2", () => {
    expect(computeNodeStatus(deploymentNodeRed2)).toEqual("red");
  });
  it("return computeNodeStatus deploymentNodeYellow2", () => {
    expect(computeNodeStatus(deploymentNodeYellow2)).toEqual("yellow");
  });

  it("return computeNodeStatus subscriptionGreenNotPlacedYellow", () => {
    expect(computeNodeStatus(subscriptionGreenNotPlacedYellow)).toEqual(
      "yellow"
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
    specs: {},
    clusters: {
      specs: {
        clusters: [
          {
            metadata: {
              name: "braveman"
            },
            status: "ok"
          },
          {
            metadata: {
              name: "possiblereptile"
            },
            status: "ok"
          },
          {
            metadata: {
              name: "sharingpenguin"
            },
            status: "ok"
          },
          {
            metadata: {
              name: "relievedox"
            },
            status: "ok"
          }
        ]
      }
    }
  };
  const result = [
    { type: "spacer" },
    { labelKey: "resource.deploy.statuses", type: "label" },
    { type: "spacer" },
    { labelValue: "braveman", status: "pending", value: "Not Deployed" },
    { type: "spacer" },
    { labelValue: "possiblereptile", status: "pending", value: "Not Deployed" },
    { type: "spacer" },
    { labelValue: "sharingpenguin", status: "pending", value: "Not Deployed" },
    { type: "spacer" },
    { labelValue: "relievedox", status: "pending", value: "Not Deployed" },
    { type: "spacer" }
  ];
  it("setResourceDeployStatus not deployed 1", () => {
    expect(setResourceDeployStatus(node, [], {})).toEqual(result);
  });
});

describe("setResourceDeployStatus ansiblejob ", () => {
  const node = {
    type: "ansiblejob",
    name: "bigjoblaunch",
    namespace: "default",
    id:
      "member--deployable--member--subscription--default--ansible-tower-job-app-subscription--ansiblejob--bigjoblaunch",
    specs: {
      raw: {
        metadata: {
          name: "bigjoblaunch",
          namespace: "default"
        },
        spec: {
          ansibleJobResult: {
            url: "http://ansible_url/job",
            status: "successful"
          },
          conditions: [
            {
              ansibleResult: {},
              message: "Success",
              reason: "Successful"
            }
          ]
        }
      }
    }
  };
  const result = [
    { type: "spacer" },
    { labelKey: "description.ansible.job.url", type: "label" },
    {
      indent: true,
      type: "link",
      value: {
        data: { action: "open_link", targetLink: "http://ansible_url/job" },
        id: "http://ansible_url/job-location",
        label: "http://ansible_url/job"
      }
    },
    { type: "spacer" },
    {
      labelValue: "AnsibleJob Initialization status",
      status: "checkmark",
      value: "Successful: Success"
    },
    { type: "spacer" },
    {
      labelValue: "Ansible Tower Job status",
      status: "checkmark",
      value: "successful"
    },
    { type: "spacer" },
    { type: "spacer" }
  ];
  it("setResourceDeployStatus ansiblejob", () => {
    expect(setResourceDeployStatus(node, [], {})).toEqual(result);
  });
});

describe("setResourceDeployStatus ansiblejob no status", () => {
  const node = {
    type: "ansiblejob",
    name: "bigjoblaunch",
    namespace: "default",
    id:
      "member--deployable--member--subscription--default--ansible-tower-job-app-subscription--ansiblejob--bigjoblaunch",
    specs: {
      raw: {
        metadata: {
          name: "bigjoblaunch",
          namespace: "default"
        }
      },
      ansiblejobModel: {
        "bigjoblaunch-local-cluster": {
          label: "tower_job_id=999999999"
        }
      }
    }
  };
  const result = [
    { type: "spacer" },
    {
      labelValue: "AnsibleJob Initialization status",
      status: "pending",
      value:
        "Ansible task was not executed. Check the Subscription YAML for status errors."
    },
    { type: "spacer" },
    {
      labelValue: "Ansible Tower Job status",
      status: "pending",
      value: "Ansible Tower job was not executed."
    }
  ];

  const result1 = [
    { type: "spacer" },
    {
      labelValue: "AnsibleJob Initialization status",
      status: "pending",
      value:
        "Ansible task was not executed. Check the Subscription YAML for status errors."
    },
    { type: "spacer" },
    {
      labelValue: "Ansible Tower Job status",
      status: "pending",
      value: "Ansible Tower job was not executed."
    }
  ];
  const result2 = [
    { type: "spacer" },
    {
      labelValue: "AnsibleJob Initialization status",
      status: "failure",
      value: "Failed: Awaiting next reconciliation"
    },
    { type: "spacer" },
    {
      labelValue: "Ansible Tower Job status",
      status: "pending",
      value: "Ansible Tower job was not executed."
    },
    {
      labelValue: "Details",
      value:
        "Use View Resource YAML link below to view the Ansible Job details. Look for the message section and follow the debug instructions available there."
    },
    { type: "spacer" },
    {
      indent: true,
      type: "link",
      value: {
        data: {
          action: "show_resource_yaml",
          cluster: undefined,
          selfLink: "apiversion=v1&kind=&name=bigjoblaunch&namespace=default"
        },
        label: "View Resource YAML"
      }
    },
    { type: "spacer" }
  ];

  it("setResourceDeployStatus ansiblejob no status", () => {
    expect(setResourceDeployStatus(node, [], {})).toEqual(result);
  });
  it("setResourceDeployStatus ansiblejob no status 1", () => {
    expect(setResourceDeployStatus(ansibleError, [], {})).toEqual(result1);
  });
  it("setResourceDeployStatus ansiblejob no status 2", () => {
    expect(setResourceDeployStatus(ansibleError2, [], {})).toEqual(result2);
  });
});

describe("setResourceDeployStatus 2 ", () => {
  const node = {
    type: "service",
    name: "mortgage-app-svc",
    namespace: "default",
    id:
      "member--member--deployable--member--clusters--possiblereptile--default--mortgage-app-subscription-mortgage-mortgage-app-svc-service--service--mortgage-app-svc",
    clusters: {
      specs: {
        clusters: [
          {
            metadata: {
              name: "possiblereptile"
            },
            status: "ok"
          }
        ]
      }
    },
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
  const result = [
    { type: "spacer" },
    { labelKey: "resource.deploy.statuses", type: "label" },
    { type: "spacer" },
    { labelValue: "possiblereptile", status: "checkmark", value: "Deployed" },
    {
      indent: true,
      type: "link",
      value: {
        data: {
          action: "show_resource_yaml",
          cluster: "possiblereptile",
          selfLink:
            "apiversion=v1&kind=&name=mortgage-app-svc&namespace=default"
        },
        label: "View Resource YAML"
      }
    },
    { type: "spacer" }
  ];
  it("setResourceDeployStatus deployed 2", () => {
    expect(setResourceDeployStatus(node, [], {})).toEqual(result);
  });
});

describe("setResourceDeployStatus 2 with filter green", () => {
  const node = {
    type: "service",
    name: "mortgage-app-svc",
    namespace: "default",
    id:
      "member--member--deployable--member--clusters--possiblereptile--default--mortgage-app-subscription-mortgage-mortgage-app-svc-service--service--mortgage-app-svc",
    clusters: {
      specs: {
        clusters: [
          {
            metadata: {
              name: "possiblereptile"
            },
            status: "ok"
          }
        ]
      }
    },
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
  const activeFilters = {
    resourceStatuses: new Set(["green"])
  };
  const result = [
    { type: "spacer" },
    { labelKey: "resource.deploy.statuses", type: "label" },
    { type: "spacer" },
    { labelValue: "possiblereptile", status: "checkmark", value: "Deployed" },
    {
      indent: true,
      type: "link",
      value: {
        data: {
          action: "show_resource_yaml",
          cluster: "possiblereptile",
          selfLink:
            "apiversion=v1&kind=&name=mortgage-app-svc&namespace=default"
        },
        label: "View Resource YAML"
      }
    },
    { type: "spacer" }
  ];
  it("setResourceDeployStatus deployed 2 - should filter resource", () => {
    expect(setResourceDeployStatus(node, [], activeFilters)).toEqual(result);
  });
});

describe("setResourceDeployStatus 2 with filter yellow", () => {
  const node = {
    type: "service",
    name: "mortgage-app-svc",
    namespace: "default",
    id:
      "member--member--deployable--member--clusters--possiblereptile--default--mortgage-app-subscription-mortgage-mortgage-app-svc-service--service--mortgage-app-svc",
    clusters: {
      specs: {
        clusters: [
          {
            metadata: {
              name: "possiblereptile"
            },
            status: "ok"
          }
        ]
      }
    },
    specs: {
      raw: {
        metadata: {
          name: "mortgage-app-svc"
        }
      },
      serviceModel: {}
    }
  };
  const activeFilters = {
    resourceStatuses: new Set(["yellow"])
  };
  const result = [
    { type: "spacer" },
    { labelKey: "resource.deploy.statuses", type: "label" },
    { type: "spacer" },
    { labelValue: "possiblereptile", status: "pending", value: "Not Deployed" },
    { type: "spacer" }
  ];
  it("setResourceDeployStatus deployed 2 - should filter resource", () => {
    expect(setResourceDeployStatus(node, [], activeFilters)).toEqual(result);
  });
});

describe("setResourceDeployStatus 2 with filter orange", () => {
  const node = {
    type: "service",
    name: "mortgage-app-svc",
    namespace: "default",
    id:
      "member--member--deployable--member--clusters--possiblereptile--default--mortgage-app-subscription-mortgage-mortgage-app-svc-service--service--mortgage-app-svc",
    clusters: {
      specs: {
        clusters: [
          {
            metadata: {
              name: "possiblereptile"
            },
            status: "ok"
          }
        ]
      }
    },
    specs: {
      raw: {
        metadata: {
          name: "mortgage-app-svc"
        }
      },
      serviceModel: {}
    }
  };
  const activeFilters = {
    resourceStatuses: new Set(["orange"])
  };
  const result = [
    { type: "spacer" },
    { labelKey: "resource.deploy.statuses", type: "label" },
    { type: "spacer" },
    { labelValue: "possiblereptile", status: "pending", value: "Not Deployed" },
    { type: "spacer" }
  ];
  it("setResourceDeployStatus deployed 2 - should filter resource", () => {
    expect(setResourceDeployStatus(node, [], activeFilters)).toEqual(result);
  });
});

describe("setResourceDeployStatus 3 ", () => {
  const node = {
    type: "service",
    name: "cassandra",
    namespace: "default",
    id:
      "member--member--deployable--member--clusters--braveman, possiblereptile, sharingpenguin, relievedox--default--guestbook-app-cassandra-cassandra-service--service--cassandra",
    clusters: {
      specs: {
        clusters: [
          {
            metadata: {
              name: "braveman"
            },
            status: "ok"
          },
          {
            metadata: {
              name: "possiblereptile"
            },
            status: "ok"
          },
          {
            metadata: {
              name: "sharingpenguin"
            },
            status: "ok"
          },
          {
            metadata: {
              name: "relievedox"
            },
            status: "ok"
          }
        ]
      }
    },
    specs: {
      serviceModel: {
        service1: {
          cluster: "someOtherCluster",
          status: "Failed"
        }
      }
    }
  };
  const result = [
    { type: "spacer" },
    { labelKey: "resource.deploy.statuses", type: "label" },
    { type: "spacer" },
    { labelValue: "braveman", status: "pending", value: "Not Deployed" },
    { type: "spacer" },
    { labelValue: "possiblereptile", status: "pending", value: "Not Deployed" },
    { type: "spacer" },
    { labelValue: "sharingpenguin", status: "pending", value: "Not Deployed" },
    { type: "spacer" },
    { labelValue: "relievedox", status: "pending", value: "Not Deployed" },
    { type: "spacer" }
  ];
  it("setResourceDeployStatus deployed 3", () => {
    expect(setResourceDeployStatus(node, [], {})).toEqual(result);
  });
});

describe("setPlacementRuleDeployStatus 1 ", () => {
  const node = {
    type: "placements",
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
        "This Placement Rule does not match any remote clusters. Make sure the clusterSelector and clusterConditions properties, when used, are valid and match your clusters. If using the clusterReplicas property make sure is being set to a positive value."
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
    { type: "spacer" }
  ];
  it("setApplicationDeployStatus deployed application as a deployable", () => {
    expect(setApplicationDeployStatus(node, [])).toEqual(result);
  });
});

describe("setApplicationDeployStatus application ", () => {
  const node = {
    type: "application",
    name: "cassandra",
    namespace: "default",
    id: "member--application",
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
            '/search?filters={"textsearch":"kind%3Asubscription%20namespace%3ANA%20cluster%3Alocal-cluster"}'
        },
        id: "member--application-subscrSearch",
        label: "View all subscriptions in {0} namespace"
      }
    }
  ];
  it("setApplicationDeployStatus deployed application", () => {
    expect(setApplicationDeployStatus(node, [])).toEqual(result);
  });
});

describe("setApplicationDeployStatus no selector ", () => {
  const node = {
    type: "application",
    name: "cassandra",
    namespace: "default",
    id:
      "member--clusters--braveman, possiblereptile, sharingpenguin, relievedox--default--guestbook-app-cassandra-cassandra-service--service--cassandra",
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
            '/search?filters={"textsearch":"kind%3Asubscription%20namespace%3ANA%20cluster%3Alocal-cluster"}'
        },
        id:
          "member--clusters--braveman, possiblereptile, sharingpenguin, relievedox--default--guestbook-app-cassandra-cassandra-service--service--cassandra-subscrSearch",
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
    expect(setPodDeployStatus(node, node, [], {})).toEqual([]);
  });
});

describe("setPodDeployStatus  with pod less then desired", () => {
  const node = {
    type: "pod",
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
            status: "ok"
          }
        ]
      }
    },
    podStatusMap: {
      possiblereptile: {
        ready: 1,
        desired: 3,
        unavailable: 2
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
          status: "err"
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
    { labelValue: "Pod details for {0}", type: "label" },
    {
      indent: undefined,
      labelKey: "resource.status",
      labelValue: undefined,
      status: "failure",
      type: "label",
      value: "err"
    },
    {
      indent: true,
      type: "link",
      value: {
        data: {
          action: "show_resource_yaml",
          cluster: "possiblereptile",
          selfLink: "apiversion=v1&kind="
        },
        label: "View Pod YAML and Logs"
      }
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
    expect(setPodDeployStatus(node, node, [], {})).toEqual(result);
  });
});

describe("setPodDeployStatus  with pod but no pod model and no podStatusMap", () => {
  const node = {
    type: "pod",
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
            status: "ok"
          }
        ]
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
      }
    }
  };
  const result = [
    { type: "spacer" },
    { labelKey: "resource.deploy.pods.statuses", type: "label" },
    { labelValue: "possiblereptile", status: "pending", value: "Not Deployed" },
    { type: "spacer" }
  ];
  it("setPodDeployStatus with pod but no pod podStatusMap ", () => {
    expect(setPodDeployStatus(node, node, [], {})).toEqual(result);
  });
});

describe("setPodDeployStatus  with pod as desired", () => {
  const node = {
    type: "pod1",
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
            status: "ok"
          }
        ]
      }
    },
    podStatusMap: {
      possiblereptile: {
        ready: 3,
        desired: 3
      }
    },
    specs: {
      raw: {
        spec: {
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
        },
        "mortgage-app-deploy-55c65b9c8f-r84f4-possiblereptile3": {
          cluster: "possiblereptile4",
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
    { labelValue: "Pod details for {0}", type: "label" },
    {
      indent: undefined,
      labelKey: "resource.status",
      labelValue: undefined,
      status: "checkmark",
      type: "label",
      value: "Running"
    },
    {
      indent: true,
      type: "link",
      value: {
        data: {
          action: "show_resource_yaml",
          cluster: "possiblereptile",
          selfLink: "apiversion=v1&kind="
        },
        label: "View Pod YAML and Logs"
      }
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
    {
      indent: undefined,
      labelKey: "resource.status",
      labelValue: undefined,
      status: "warning",
      type: "label",
      value: "Pending"
    },
    {
      indent: true,
      type: "link",
      value: {
        data: {
          action: "show_resource_yaml",
          cluster: "possiblereptile",
          selfLink: "apiversion=v1&kind="
        },
        label: "View Pod YAML and Logs"
      }
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
    expect(setPodDeployStatus(node, node, [], {})).toEqual(result);
  });
});

describe("setPodDeployStatus - pod as desired with green filter", () => {
  const node = {
    type: "pod1",
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
            status: "ok"
          }
        ]
      }
    },
    podStatusMap: {
      possiblereptile: {
        ready: 3,
        desired: 3
      }
    },
    specs: {
      raw: {
        spec: {
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
        },
        "mortgage-app-deploy-55c65b9c8f-r84f4-possiblereptile4": {
          cluster: "possiblereptile4",
          status: "CrashLoopBackOff"
        }
      }
    }
  };
  const activeFilters = {
    resourceStatuses: new Set(["green"])
  };
  const result = [
    { type: "spacer" },
    { labelKey: "resource.deploy.pods.statuses", type: "label" },
    { labelValue: "possiblereptile", status: "checkmark", value: "3/3" },
    { type: "spacer" },
    { type: "spacer" },
    { labelValue: "Pod details for {0}", type: "label" },
    {
      indent: undefined,
      labelKey: "resource.status",
      labelValue: undefined,
      status: "checkmark",
      type: "label",
      value: "Running"
    },
    {
      indent: true,
      type: "link",
      value: {
        data: {
          action: "show_resource_yaml",
          cluster: "possiblereptile",
          selfLink: "apiversion=v1&kind="
        },
        label: "View Pod YAML and Logs"
      }
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
  it("setPodDeployStatus - pod as desired green filter", () => {
    expect(setPodDeployStatus(node, node, [], activeFilters)).toEqual(result);
  });
});

describe("setPodDeployStatus  with pod as desired", () => {
  const node = {
    type: "pod1",
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
            status: "ok"
          }
        ]
      }
    },
    podStatusMap: {
      possiblereptile: {
        ready: 1,
        desired: 1
      }
    },
    specs: {
      raw: {
        spec: {
          template: {
            spec: {
              containers: [{ c1: "aa" }]
            }
          }
        }
      },
      podModel: {
        "mortgage-app-deploy-55c65b9c8f-r84f4-possiblereptile2": {
          cluster: "possiblereptile2",
          status: "Running"
        }
      }
    }
  };
  const result = [
    { type: "spacer" },
    { labelKey: "resource.deploy.pods.statuses", type: "label" },
    { labelValue: "possiblereptile", status: "checkmark", value: "1/1" },
    { type: "spacer" }
  ];
  it("setPodDeployStatus with pod as desired but no matched cluster", () => {
    expect(setPodDeployStatus(node, node, [], {})).toEqual(result);
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
            consoleURL: "https://console-openshift-console.222",
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
            consoleURL: "https://console-openshift-console.222",
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
          rules: [{}, {}]
        }
      }
    }
  };

  const obj = {
    id: "objID",
    cluster: "possiblereptile"
  };
  it("tests Routes generated from Ingress with 2 route rules", () => {
    expect(addNodeOCPRouteLocationForCluster(node, obj, [])).toEqual([]);
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
            consoleURL: "https://console-openshift-console.222",
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
          rules: [
            {
              route: "aaa"
            }
          ]
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
          targetLink: "http://mortgage-app-deploy-default.222/"
        },
        id: "objID-location",
        label: "http://mortgage-app-deploy-default.222/"
      }
    }
  ];

  it("tests Routes generated from Ingress with one route rules", () => {
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

describe("processResourceActionLink search view2", () => {
  const openSearchView = {
    action: "show_search",
    kind: "service",
    name: "frontend",
    namespace: "open-cluster-management"
  };
  const result =
    '/search?filters={"textsearch":"kind:service namespace:open-cluster-management name:frontend"}';

  it("processResourceActionLink opens search view2", () => {
    expect(processResourceActionLink(openSearchView)).toEqual(result);
  });
});

describe("processResourceActionLink openRemoteresourceYaml", () => {
  const openRemoteresourceYaml = {
    action: "show_resource_yaml",
    cluster: "possiblereptile",
    selfLink: "apiversion=abc&kind=Application&name=ui-git&namespace=ns-123"
  };
  const result =
    "/resources?cluster=possiblereptile&apiversion=abc&kind=Application&name=ui-git&namespace=ns-123";
  it("processResourceActionLink openRemoteresourceYaml", () => {
    expect(processResourceActionLink(openRemoteresourceYaml)).toEqual(result);
  });
});

describe("processResourceActionLink search view3", () => {
  const genericLink = {
    action: "open_link",
    targetLink: "http://www.example.com"
  };
  const result = "http://www.example.com";
  it("processResourceActionLink opens search view3", () => {
    expect(processResourceActionLink(genericLink)).toEqual(result);
  });
});

describe("processResourceActionLink dummy link", () => {
  const genericLink = {
    action: "open_link",
    targetLink1: "http://www.example.com"
  };
  const result = "";
  it("processResourceActionLink dummy link", () => {
    expect(processResourceActionLink(genericLink)).toEqual(result);
  });
});

describe("getPodState pod", () => {
  const podItem = {
    apiversion: "v1",
    cluster: "relievedox",
    container: "mortgagecm-mortgage",
    created: "2020-06-01T19:09:00Z",
    hostIP: "10.0.135.243",
    image: "fxiang/mortgage:0.4.0",
    kind: "pod",
    label: "app=mortgagecm-mortgage; pod-template-hash=b8d75b48f",
    name: "mortgagecm-deploy-b8d75b48f-mjsfg",
    namespace: "default",
    podIP: "10.129.2.224",
    restarts: 3,
    selfLink:
      "/api/v1/namespaces/default/pods/mortgagecm-deploy-b8d75b48f-mjsfg",
    startedAt: "2020-06-01T19:09:00Z",
    status: "Running",
    _clusterNamespace: "relievedox-ns",
    _rbac: "relievedox-ns_null_pods",
    _uid: "relievedox/20239a36-560a-4240-85ae-1663f48fec55"
  };
  const clusterName = "relievedox";
  const types = ["err", "off", "invalid", "kill"];

  const result = 0;

  it("should return getPodState pod", () => {
    expect(getPodState(podItem, clusterName, types)).toEqual(result);
  });
});

describe("getPodState pod 1", () => {
  const podItem = {
    apiversion: "v1",
    cluster: "relievedox",
    container: "mortgagecm-mortgage",
    created: "2020-06-01T19:09:00Z",
    hostIP: "10.0.135.243",
    image: "fxiang/mortgage:0.4.0",
    kind: "pod",
    label: "app=mortgagecm-mortgage; pod-template-hash=b8d75b48f",
    name: "mortgagecm-deploy-b8d75b48f-mjsfg",
    namespace: "default",
    podIP: "10.129.2.224",
    restarts: 3,
    selfLink:
      "/api/v1/namespaces/default/pods/mortgagecm-deploy-b8d75b48f-mjsfg",
    startedAt: "2020-06-01T19:09:00Z",
    status: "Running",
    _clusterNamespace: "relievedox-ns",
    _rbac: "relievedox-ns_null_pods",
    _uid: "relievedox/20239a36-560a-4240-85ae-1663f48fec55"
  };
  const types = ["err", "off", "invalid", "kill"];

  const result = 0;

  it("should return getPodState pod 1", () => {
    expect(getPodState(podItem, undefined, types)).toEqual(result);
  });
});

describe("getPodState pod 2", () => {
  const podItem = {
    apiversion: "v1",
    cluster: "relievedox",
    container: "mortgagecm-mortgage",
    created: "2020-06-01T19:09:00Z",
    hostIP: "10.0.135.243",
    image: "fxiang/mortgage:0.4.0",
    kind: "pod",
    label: "app=mortgagecm-mortgage; pod-template-hash=b8d75b48f",
    name: "mortgagecm-deploy-b8d75b48f-mjsfg",
    namespace: "default",
    podIP: "10.129.2.224",
    restarts: 3,
    selfLink:
      "/api/v1/namespaces/default/pods/mortgagecm-deploy-b8d75b48f-mjsfg",
    startedAt: "2020-06-01T19:09:00Z",
    status: "OOMKill",
    _clusterNamespace: "relievedox-ns",
    _rbac: "relievedox-ns_null_pods",
    _uid: "relievedox/20239a36-560a-4240-85ae-1663f48fec55"
  };
  const types = ["err", "off", "invalid", "kill"];
  const clusterName = "relievedox";

  const result = 1;

  it("should return getPodState pod 2", () => {
    expect(getPodState(podItem, clusterName, types)).toEqual(result);
  });
});

describe("removeReleaseGeneratedSuffix remove suffix", () => {
  it("should remove generate suffix for the helmrelease", () => {
    expect(removeReleaseGeneratedSuffix("nginx-ingress-66f46")).toEqual(
      "nginx-ingress"
    );
  });
});

describe("getPulseStatusForCluster all ok", () => {
  const clusterNode = {
    specs: {
      clusters: [{ status: "ok" }, { status: "ok" }]
    }
  };
  it("should process cluster node", () => {
    expect(getPulseStatusForCluster(clusterNode)).toEqual("green");
  });
});

describe("getPulseStatusForCluster all some offline", () => {
  const clusterNode = {
    specs: {
      clusters: [{ status: "ok" }, { status: "offline" }]
    }
  };
  it("should process cluster node", () => {
    expect(getPulseStatusForCluster(clusterNode)).toEqual("red");
  });
});

describe("getPulseStatusForCluster all pending", () => {
  const clusterNode = {
    specs: {
      clusters: [{ status: "pendingimport" }, { status: "pendingimport" }]
    }
  };
  it("should process cluster node", () => {
    expect(getPulseStatusForCluster(clusterNode)).toEqual("orange");
  });
});

describe("getPulseStatusForCluster all some ok", () => {
  const clusterNode = {
    specs: {
      clusters: [{ status: "ok" }, { status: "pending" }]
    }
  };
  it("should process cluster node", () => {
    expect(getPulseStatusForCluster(clusterNode)).toEqual("yellow");
  });
});

describe("checkNotOrObjects", () => {
  const definedObj1 = {};
  const definedObj2 = {};
  const undefinedObj = undefined;

  it("should return false", () => {
    expect(checkNotOrObjects(definedObj1, definedObj2)).toEqual(false);
  });

  it("should return true", () => {
    expect(checkNotOrObjects(definedObj1, undefinedObj)).toEqual(true);
  });
});

describe("checkAndObjects", () => {
  const definedObj1 = { name: "mortgage" };
  const definedObj2 = { name: "mortgage" };
  const undefinedObj = undefined;

  it("should check objects", () => {
    expect(checkAndObjects(definedObj1, undefinedObj)).toEqual(undefinedObj);
  });

  it("should check objects", () => {
    expect(checkAndObjects(definedObj1, definedObj2)).toEqual(definedObj1);
  });
});
