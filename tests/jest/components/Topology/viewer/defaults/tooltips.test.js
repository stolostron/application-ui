/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/
"use strict";

import { getNodeTooltips } from "../../../../../../src-web/components/Topology/viewer/defaults/tooltips";

const locale = "en-US";
const searchUrl = "https://localhost/multicloud/search";

describe("getNodeTooltips pod", () => {
  const podNode = {
    id:
      "member--pod--member--deployable--member--clusters--az01--pacmangitchannel--pacmangitchannel-deployment--pacmangit--pacmangit",
    uid:
      "member--pod--member--deployable--member--clusters--az01--pacmangitchannel--pacmangitchannel-deployment--pacmangit--pacmangit",
    name: "pacmangit",
    cluster: null,
    clusterName: null,
    type: "pod",
    specs: {
      raw: {
        apiVersion: "apps/v1",
        kind: "Deployment",
        metadata: {
          labels: {
            app: "pacmangit"
          },
          name: "pacmangit"
        },
        spec: {
          replicas: 1,
          selector: {
            matchLabels: {
              name: "pacmangit"
            }
          },
          template: {
            metadata: {
              labels: {
                name: "pacmangit"
              }
            },
            spec: {
              containers: [
                {
                  env: [
                    {
                      name: "MONGO_SERVICE_HOST",
                      value:
                        "b8eec768-c48d-4022-9c32-b6083afed0c9-0.bngflf7f0ktkmkdl3jhg.databases.appdomain.cloud"
                    },
                    {
                      name: "MONGO_AUTH_USER",
                      value: "ibm_cloud_82d27531_5290_4a59_b1c4_5cbef1154ea3"
                    },
                    {
                      name: "MONGO_REPLICA_SET",
                      value: "replset"
                    },
                    {
                      name: "MONGO_AUTH_PWD",
                      value:
                        "f197cc208307f82e2e0de68b781f7a128cf6a98eed3e38e10fcf2309c6e91455"
                    },
                    {
                      name: "MONGO_DATABASE",
                      value: "admin"
                    },
                    {
                      name: "MY_MONGO_PORT",
                      value: "30692"
                    },
                    {
                      name: "MONGO_USE_SSL",
                      value: "true"
                    },
                    {
                      name: "MONGO_VALIDATE_SSL",
                      value: "false"
                    },
                    {
                      name: "MY_NODE_NAME",
                      valueFrom: {
                        fieldRef: {
                          fieldPath: "spec.nodeName"
                        }
                      }
                    },
                    {
                      name: "COLOR",
                      value: "rgb(197, 33, 33)"
                    },
                    {
                      name: "MY_IMAGE",
                      value: "RedHat"
                    },
                    {
                      name: "MESSAGE",
                      value: "Initial Version"
                    }
                  ],
                  image: "docker.io/rfontain/pacman:v1",
                  imagePullPolicy: "Always",
                  name: "pacmangit",
                  ports: [
                    {
                      containerPort: 8080
                    }
                  ]
                }
              ],
              serviceAccount: "pacmangit"
            }
          }
        }
      },
      row: 984,
      podModel: {
        "pacmangit-668ff55c4d-m2cgt": {
          name: "pacmangit-668ff55c4d-m2cgt",
          namespace: "pacmangit",
          status: "Running",
          cluster: {
            metadata: {
              name: "az01"
            }
          },
          containers: [
            {
              name: "pacmangit",
              image: "docker.io/rfontain/pacman:v1"
            }
          ],
          creationTimestamp: "2020-03-20T13:22:54Z",
          labels: {
            name: "pacmangit",
            "pod-template-hash": "2249911708"
          },
          hostIP: "10.65.71.148",
          podIP: "172.30.92.237",
          restarts: 0,
          startedAt: "2020-03-20T13:22:54Z"
        },
        "pacmangit-668ff55c4d-fmnh4": {
          name: "pacmangit-668ff55c4d-fmnh4",
          namespace: "pacmangit",
          status: "Running",
          cluster: {
            metadata: {
              name: "cluster1"
            }
          },
          containers: [
            {
              name: "pacmangit",
              image: "docker.io/rfontain/pacman:v1"
            }
          ],
          creationTimestamp: "2020-03-19T19:05:58Z",
          labels: {
            name: "pacmangit",
            "pod-template-hash": "2249911708"
          },
          hostIP: "10.126.109.199",
          podIP: "172.30.167.142",
          restarts: 0,
          startedAt: "2020-03-19T19:05:58Z"
        }
      },
      podStatus: {
        hasPending: false,
        hasFailure: false,
        hasRestarts: false,
        hostIPs: ["10.65.71.148", "10.126.109.199"]
      },
      pulse: null
    },
    namespace: "",
    topology: null,
    labels: null,
    __typename: "Resource"
  };

  const expectedResult = [
    {
      href:
        'https://localhost/multicloud/search?filters={"textsearch":"kind:deployment name:pacmangit"}&showrelated=pod',
      name: "Pod",
      value: "pacmangit"
    }
  ];

  it("should get pod node tooltips", () => {
    expect(getNodeTooltips(searchUrl, podNode, locale)).toEqual(expectedResult);
  });
});

describe("getNodeTooltips PV", () => {
  const pvNode = {
    name: "mynode",
    namspace: "default",
    type: "persistent_volume"
  };

  const expectedResult = [
    {
      href:
        'https://localhost/multicloud/search?filters={"textsearch":"kind:persistentvolume name:mynode"}',
      name: "Persistent Volume",
      value: "mynode"
    }
  ];
  it("should get PV node tooltips", () => {
    expect(getNodeTooltips(searchUrl, pvNode, locale)).toEqual(expectedResult);
  });
});

describe("getNodeTooltips PVC", () => {
  const pvcNode = {
    name: "foonode",
    namspace: "microservice",
    type: "persistent_volume_claim"
  };

  const expectedResult = [
    {
      href:
        'https://localhost/multicloud/search?filters={"textsearch":"kind:persistentvolumeclaim name:foonode"}',
      name: "Persistent Volume Claim",
      value: "foonode"
    }
  ];
  it("should get PVC node tooltips", () => {
    expect(getNodeTooltips(searchUrl, pvcNode, locale)).toEqual(expectedResult);
  });
});

describe("getNodeTooltips rules", () => {
  const rulesNode = {
    name: "barnode",
    namspace: "bar",
    type: "rules"
  };

  const expectedResult = [
    {
      href:
        'https://localhost/multicloud/search?filters={"textsearch":"kind:placementrule name:barnode"}',
      name: "Rules",
      value: "barnode"
    }
  ];
  it("should get rules node tooltips", () => {
    expect(getNodeTooltips(searchUrl, rulesNode, locale)).toEqual(
      expectedResult
    );
  });
});

describe("getNodeTooltips cluster", () => {
  const clusterNode = {
    name: "foonode",
    namspace: "foo",
    type: "cluster",
    specs: {
      cluster: {
        consoleURL: "https://localhost"
      }
    }
  };

  const expectedResult = [
    {
      href:
        'https://localhost/multicloud/search?filters={"textsearch":"kind:cluster name:foonode"}',
      name: "Cluster",
      value: "foonode"
    },
    {
      href: "https://localhost",
      name: "Console",
      value: "foonode-console"
    }
  ];
  it("should get cluster node tooltips", () => {
    expect(getNodeTooltips(searchUrl, clusterNode, locale)).toEqual(
      expectedResult
    );
  });
});

describe("getNodeTooltips clusterList", () => {
  const clusterNode = {
    name: "foonode, foonode2, foonode3",
    namspace: "foo",
    type: "cluster",
    specs: {
      cluster: {
        consoleURL: "https://localhost"
      }
    }
  };

  const expectedResult = [
    {
      href:
        'https://localhost/multicloud/search?filters={"textsearch":"kind:cluster name:foonode,foonode2,foonode3"}',
      name: "Cluster",
      value: "foonode, foonode2, foonode3"
    },
    {
      href: "https://localhost",
      name: "Console",
      value: "foonode, foonode2, foonode3-console"
    }
  ];
  it("should get cluster node tooltips", () => {
    expect(getNodeTooltips(searchUrl, clusterNode, locale)).toEqual(
      expectedResult
    );
  });
});

describe("getNodeTooltips clusters", () => {
  const clusterNode = {
    name: "foonode",
    namspace: "foo",
    type: "cluster",
    specs: {
      clusters: [
        {
          metadata: {
            name: "ocpcluster1"
          },
          consoleURL: "https://localhost"
        },
        {
          metadata: {
            name: "ekscluster2"
          },
          consoleip: "111.11.11.11"
        }
      ]
    }
  };

  const expectedResult = [
    {
      href:
        'https://localhost/multicloud/search?filters={"textsearch":"kind:cluster name:foonode"}',
      name: "Cluster",
      value: "foonode"
    },
    {
      href: "https://localhost",
      name: "Console",
      value: "ocpcluster1-console"
    }
  ];

  it("should get cluster node tooltips", () => {
    expect(getNodeTooltips(searchUrl, clusterNode, locale)).toEqual(
      expectedResult
    );
  });
});

describe("getNodeTooltips default", () => {
  const defaultNode = {
    name: "defaultnode",
    namspace: "defaultnode",
    type: "application"
  };

  const expectedResult = [
    {
      href:
        'https://localhost/multicloud/search?filters={"textsearch":"kind:application name:defaultnode"}',
      name: "Application",
      value: "defaultnode"
    }
  ];
  it("should get default node tooltips", () => {
    expect(getNodeTooltips(searchUrl, defaultNode, locale)).toEqual(
      expectedResult
    );
  });
});

describe("getNodeTooltips package", () => {
  const defaultNode = {
    name: "defaultnode",
    namspace: "defaultnode",
    type: "package"
  };

  const expectedResult = [];
  it("should get nothing", () => {
    expect(getNodeTooltips(searchUrl, defaultNode, locale)).toEqual(
      expectedResult
    );
  });
});
