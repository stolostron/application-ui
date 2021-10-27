// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

import {
  getActiveChannel,
  getDiagramElements,
  addDiagramDetails
} from "../../../../../src-web/components/ApplicationTopologyModule/definitions/hcm-application-diagram";

describe("hcm-application-diagram-tests", () => {
  it("getActiveChannel", () => {
    expect(getActiveChannel("key")).toBeUndefined();
  });

  it("getDiagramElements", () => {
    const topology = {
      loaded: true,
      status: "ERROR",
      reloading: false,
      fetchFilters: { application: { channel: "channel1" } }
    };
    expect(
      getDiagramElements(topology, "key", "name", "namespace").nodes
    ).toMatchObject([
      {
        name: "name",
        namespace: "namespace",
        specs: { isDesign: true },
        type: "application",
        uid: "application--name"
      }
    ]);
  });

  it("getDiagramElements2", () => {
    const topology = { loaded: true, status: "ERROR", reloading: true };
    expect(
      getDiagramElements(topology, "key", "name", "namespace").nodes
    ).toMatchObject([
      {
        name: "name",
        namespace: "namespace",
        specs: { isDesign: true },
        type: "application",
        uid: "application--name"
      }
    ]);
  });

  it("getDiagramElements3", () => {
    const topology = { loaded: false, status: "IN_PROGRESS", reloading: true };
    expect(
      getDiagramElements(topology, "key", "name", "namespace").nodes
    ).toMatchObject([
      {
        name: "name",
        namespace: "namespace",
        specs: { isDesign: true },
        type: "application",
        uid: "application--name"
      }
    ]);
  });

  // following function have no return as it is meant to be called in getDiagramElements as a helper function
  it("addDiagramDetails", () => {
    const topology = {
      detailsLoaded: true,
      status: "IN_PROGRESS",
      detailsReloading: false
    };
    const podMap = {
      "mortgagedc-deploy-braveman": {
        id:
          "member--member--deployable--member--clusters--braveman--default--mortgagedc-subscription-mortgagedc-mortgagedc-deploy-deploymentconfig--deploymentconfig--mortgagedc-deploy",
        name: "mortgagedc-deploy",
        namespace: "default",
        type: "deploymentconfig"
      }
    };

    const applicationDetails = {
      items: [
        {
          related: [
            {
              kind: "pod",
              items: [
                {
                  name: "mortgagedc-deploy-1111",
                  namespace: "default",
                  cluster: "braveman"
                }
              ]
            }
          ]
        }
      ]
    };
    addDiagramDetails(
      topology,
      podMap,
      "__ALL__/__ALL__//__ALL__/__ALL__ mcm-diagram-query-cookiedefaultmortgagedc",
      "",
      false,
      applicationDetails
    );
  });

  // following function have no return as it is meant to be called in getDiagramElements as a helper function
  it("addDiagramDetails", () => {
    const pods = [
      {
        name: "p1-abc",
        cluster: {
          metadata: {
            name: "cluster1"
          }
        },
        namespace: "default"
      },
      {
        name: "p2-def",
        cluster: {
          metadata: {
            name: "cluster2"
          }
        },
        namespace: "default"
      }
    ];
    const topology = {
      detailsLoaded: true,
      status: "IN_PROGRESS",
      detailsReloading: false,
      pods: pods
    };
    addDiagramDetails(
      topology,
      [],
      { p1: 1, p2: 2 },
      "channel",
      "key",
      true,
      "default"
    );
  });

  it("addDiagramDetails2", () => {
    const pods = [
      {
        name: "p1",
        cluster: {
          metadata: {
            name: "cluster1"
          }
        },
        namespace: "default"
      },
      {
        name: "p2",
        cluster: {
          metadata: {
            name: "cluster2"
          }
        },
        namespace: "default"
      }
    ];
    const topology = {
      detailsLoaded: true,
      status: "IN_PROGRESS",
      detailsReloading: true,
      pods: pods
    };
    addDiagramDetails(topology, [], [], "channel", "key", false, "default");
  });

  it("addDiagramDetails3", () => {
    const pods = [];
    const topology = {
      detailsLoaded: true,
      status: "IN_PROGRESS",
      detailsReloading: true,
      pods: pods
    };
    addDiagramDetails(topology, [], [], "channel", "key", true, "default");
  });

  it("getDiagramElements with pods container info", () => {
    const nodes = [
      {
        id: "member--clusters--",
        type: "cluster"
      },
      {
        id:
          "member--clusters--possiblereptile,braveman,sharingpenguin,relievedox",
        type: "cluster",
        specs: {
          clustersNames: [
            "possiblereptile",
            "braveman",
            "sharingpenguin",
            "relievedox"
          ],
          clusters: [
            {
              metadata: {
                name: "possiblereptile"
              },
              status: "ok"
            },
            {
              metadata: {
                name: "braveman"
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
      {
        id:
          "application--clusters--possiblereptile,braveman,sharingpenguin,relievedox--app",
        type: "application",
        name: "aa",
        namespace: "ns",
        clusters: {
          specs: {
            clusters: []
          }
        },
        specs: {
          clustersNames: [
            "possiblereptile",
            "braveman",
            "sharingpenguin",
            "relievedox"
          ]
        }
      },
      {
        type: "deployment",
        id: "--clusters--depl",
        name: "depl",
        cluster: null,
        clusterName: null,
        clusters: {
          specs: {
            clusters: [
              {
                name: "possiblereptile",
                status: "ok"
              },
              {
                metadata: {
                  name: "braveman"
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
      },
      {
        type: "deployment",
        id:
          "--clusters--possiblereptile,braveman,sharingpenguin,relievedox--depl",
        name: "depl2",
        clusters: {
          specs: {
            clusters: [
              {
                metadata: {
                  name: "braveman"
                },
                status: "ok"
              }
            ]
          }
        },
        specs: {
          clustersNames: [
            "possiblereptile",
            "braveman",
            "sharingpenguin",
            "relievedox"
          ],
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
      },
      {
        type: "subscription",
        id:
          "--clusters--possiblereptile,braveman,sharingpenguin,relievedox--subs",
        name: "subsname",
        clusters: {
          specs: {
            clusters: []
          }
        },
        specs: {
          clustersNames: [
            "possiblereptile",
            "braveman",
            "sharingpenguin",
            "relievedox"
          ],
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
      }
    ];

    const topology = {
      loaded: true,
      detailsLoaded: true,
      status: "DONE",
      nodes: nodes
    };

    const applicationDetails = {
      forceReload: false,
      items: [
        {
          apigroup: "app.k8s.io",
          cluster: "local-cluster",
          created: "2020-04-20T22:02:05Z",
          dashboard: "",
          kind: "application",
          label: "",
          name: "mortgage-app",
          namespace: "default",
          related: [
            {
              kind: "cluster",
              items: [
                {
                  name: "sharingpenguin",
                  status: "ok"
                }
              ]
            },
            {
              items: [
                {
                  apiversion: "v1",
                  cluster: "sharingpenguin",
                  container: "mortgage-app-mortgage",
                  created: "2020-05-19T13:58:48Z",
                  hostIP: "10.0.135.34",
                  image: "fxiang/mortgage:0.4.0",
                  kind: "pod",
                  label:
                    "app=mortgage-app-mortgage; pod-template-hash=55c65b9c8f",
                  name: "mortgage-app-deploy-55c65b9c8f-nbwtj",
                  namespace: "default",
                  podIP: "10.131.0.243",
                  restarts: 0,
                  selfLink:
                    "/api/v1/namespaces/default/pods/mortgage-app-deploy-55c65b9c8f-nbwtj",
                  startedAt: "2020-05-19T13:58:48Z",
                  status: "Running",
                  _clusterNamespace: "sharingpenguin-ns",
                  _rbac: "sharingpenguin-ns_null_pods",
                  _uid: "sharingpenguin/1681eca1-10a4-451d-903b-26c2ed6e1cd6"
                },
                {
                  apiversion: "v1",
                  cluster: "sharingpenguin",
                  container: "mortgage-app-mortgage",
                  created: "2020-05-19T13:58:48Z",
                  hostIP: "10.0.135.34",
                  image: "fxiang/mortgage:0.4.0",
                  kind: "pod",
                  label:
                    "app=mortgage-app-mortgage; pod-template-hash=55c65b9c8f",
                  name: "mortgage-app-deploy-55c65b9c8f",
                  namespace: "default",
                  podIP: "10.131.0.243",
                  restarts: 0,
                  selfLink:
                    "/api/v1/namespaces/default/pods/mortgage-app-deploy-55c65b9c8f",
                  startedAt: "2020-05-19T13:58:48Z",
                  status: "Running",
                  _clusterNamespace: "sharingpenguin-ns",
                  _rbac: "sharingpenguin-ns_null_pods",
                  _uid: "sharingpenguin/1681eca1-10a4-451d-903b-26c2ed6e1cd6"
                }
              ],
              kind: "pod",
              __typename: "SearchRelatedResult"
            },
            {
              items: [
                {
                  apigroup: "apps",
                  apiversion: "v1",
                  available: 1,
                  cluster: "sharingpenguin",
                  created: "2020-05-19T13:58:48Z",
                  current: 1,
                  desired: 1,
                  kind: "deployment",
                  label: "app=mortgage-app-mortgage",
                  name: "mortgage-app-deploy",
                  namespace: "default",
                  ready: 1,
                  selfLink:
                    "/apis/apps/v1/namespaces/default/deployments/mortgage-app-deploy",
                  _clusterNamespace: "sharingpenguin-ns",
                  _hostingDeployable:
                    "mortgage-ch/mortgage-channel-Deployment-mortgage-app-deploy",
                  _hostingSubscription: "default/mortgage-app-subscription",
                  _rbac: "sharingpenguin-ns_apps_deployments",
                  _uid: "sharingpenguin/77b0f670-9335-4b62-aee3-95ba0d01c848"
                }
              ],
              kind: "deployment",
              __typename: "SearchRelatedResult"
            },
            {
              items: [
                {
                  apigroup: "apps",
                  apiversion: "v1",
                  available: 1,
                  cluster: "sharingpenguin",
                  created: "2020-05-19T13:58:48Z",
                  current: 1,
                  desired: 1,
                  kind: "subscription",
                  label: "app=mortgage-app-mortgage-subs",
                  name: "mortgage-app-deploy-subs",
                  namespace: "default",
                  ready: 1,
                  selfLink:
                    "/apis/apps/v1/namespaces/default/deployments/mortgage-app-deploy",
                  _clusterNamespace: "sharingpenguin-ns",
                  _hostingDeployable:
                    "mortgage-ch/mortgage-channel-Deployment-mortgage-app-deploy",
                  _hostingSubscription: "default/mortgage-app-subscription",
                  _rbac: "sharingpenguin-ns_apps_deployments",
                  _uid: "sharingpenguin/77b0f670-9335-4b62-aee3-95ba0d01c848"
                }
              ],
              kind: "subscription",
              __typename: "SearchRelatedResult"
            },
            {
              items: [
                {
                  apiversion: "v1",
                  cluster: "sharingpenguin",
                  clusterIP: "172.30.8.11",
                  created: "2020-05-19T13:59:49Z",
                  kind: "service",
                  label: "app=mortgage-app-mortgage",
                  name: "mortgage-app-svc",
                  namespace: "default",
                  port: "9080:30871/TCP",
                  selfLink:
                    "/api/v1/namespaces/default/services/mortgage-app-svc",
                  type: "NodePort",
                  _clusterNamespace: "sharingpenguin-ns",
                  _hostingDeployable:
                    "mortgage-ch/mortgage-channel-Service-mortgage-app-svc",
                  _hostingSubscription: "default/mortgage-app-subscription",
                  _rbac: "sharingpenguin-ns_null_services",
                  _uid: "sharingpenguin/ae883b30-a91c-43cb-a5fd-786799bc9d18"
                }
              ],
              kind: "service",
              __typename: "SearchRelatedResult"
            },
            {
              items: [
                {
                  apigroup: "apps",
                  apiversion: "v1",
                  cluster: "sharingpenguin",
                  created: "2020-05-19T13:58:48Z",
                  current: 1,
                  desired: 1,
                  kind: "replicaset",
                  label:
                    "app=mortgage-app-mortgage; pod-template-hash=55c65b9c8f",
                  name: "mortgage-app-deploy-55c65b9c8f",
                  namespace: "default",
                  selfLink:
                    "/apis/apps/v1/namespaces/default/replicasets/mortgage-app-deploy-55c65b9c8f",
                  _clusterNamespace: "sharingpenguin-ns",
                  _hostingDeployable:
                    "mortgage-ch/mortgage-channel-Deployment-mortgage-app-deploy",
                  _hostingSubscription: "default/mortgage-app-subscription",
                  _rbac: "sharingpenguin-ns_apps_replicasets",
                  _uid: "sharingpenguin/fe832e17-aa0d-455c-b893-579da494ca82"
                }
              ],
              kind: "replicaset",
              __typename: "SearchRelatedResult"
            }
          ],
          selfLink:
            "/apis/app.k8s.io/v1beta1/namespaces/default/applications/mortgage-app",
          _hubClusterResource: "true",
          _rbac: "default_app.k8s.io_applications",
          _uid: "local-cluster/687cfa53-db56-4744-b3a1-046045d8f338"
        }
      ],
      page: 1,
      pendingActions: [],
      postErrorMsg: "",
      putErrorMsg: "",
      resourceVersion: undefined,
      search: "",
      sortDirection: "asc",
      status: "DONE"
    };
    const res = [
      {
        id: "member--clusters--",
        specs: {
          appClusters: [],
          clusters: [
            {
              name: "sharingpenguin",
              status: "ok"
            }
          ],
          clustersNames: ["sharingpenguin"],
          searchClusters: [
            {
              name: "sharingpenguin",
              status: "ok"
            }
          ],
          pulse: "green",
          shapeType: "cluster"
        },
        type: "cluster"
      },
      {
        id:
          "member--clusters--possiblereptile,braveman,sharingpenguin,relievedox",
        specs: {
          clusters: [
            {
              metadata: {
                name: "possiblereptile"
              },
              status: "ok"
            },
            {
              metadata: {
                name: "braveman"
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
          ],
          clustersNames: [
            "braveman",
            "possiblereptile",
            "relievedox",
            "sharingpenguin"
          ],
          pulse: "green",
          shapeType: "cluster"
        },
        type: "cluster"
      },
      {
        clusters: {
          specs: {
            clusters: []
          }
        },
        id:
          "application--clusters--possiblereptile,braveman,sharingpenguin,relievedox--app",
        name: "aa",
        namespace: "ns",
        specs: {
          allClusters: { isLocal: false, remoteCount: 1 },
          clustersNames: [
            "braveman",
            "possiblereptile",
            "relievedox",
            "sharingpenguin"
          ],
          pulse: "red",
          shapeType: "application"
        },
        type: "application"
      },
      {
        cluster: null,
        clusterName: null,
        id: "--clusters--depl",
        name: "depl",
        specs: {
          clustersNames: ["depl", "sharingpenguin"],
          pulse: "orange",
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
          },
          row: 0,
          shapeType: "deployment"
        },
        type: "deployment"
      },
      {
        clusters: {
          id:
            "member--clusters--possiblereptile,braveman,sharingpenguin,relievedox",
          specs: {
            clusters: [
              {
                metadata: {
                  name: "possiblereptile"
                },
                status: "ok"
              },
              {
                metadata: {
                  name: "braveman"
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
            ],
            clustersNames: [
              "braveman",
              "possiblereptile",
              "relievedox",
              "sharingpenguin"
            ],
            pulse: "green",
            shapeType: "cluster"
          },
          type: "cluster"
        },
        id:
          "--clusters--possiblereptile,braveman,sharingpenguin,relievedox--depl",
        name: "depl2",
        specs: {
          clustersNames: [
            "braveman",
            "possiblereptile",
            "relievedox",
            "sharingpenguin"
          ],
          pulse: "orange",
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
          },
          row: 6,
          shapeType: "deployment"
        },
        type: "deployment"
      },
      {
        clusters: {
          id:
            "member--clusters--possiblereptile,braveman,sharingpenguin,relievedox",
          specs: {
            clusters: [
              {
                metadata: {
                  name: "possiblereptile"
                },
                status: "ok"
              },
              {
                metadata: {
                  name: "braveman"
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
            ],
            clustersNames: [
              "braveman",
              "possiblereptile",
              "relievedox",
              "sharingpenguin"
            ],
            pulse: "green",
            shapeType: "cluster"
          },
          type: "cluster"
        },
        id:
          "--clusters--possiblereptile,braveman,sharingpenguin,relievedox--subs",
        name: "subsname",
        specs: {
          clustersNames: [
            "braveman",
            "possiblereptile",
            "relievedox",
            "sharingpenguin"
          ],
          pulse: "orange",
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
          },
          row: 12,
          shapeType: "subscription"
        },
        type: "subscription"
      }
    ];
    expect(
      getDiagramElements(
        topology,
        "key",
        "name",
        "namespace",
        applicationDetails
      ).nodes
    ).toMatchObject(res);
  });
});
