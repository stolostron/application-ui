// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

jest.mock("../../../../lib/client/apollo-client", () => ({
  getSearchClient: jest.fn(() => {
    return null;
  }),
  search: jest.fn((resourceType, namespace, name) => {
    if (resourceType.name && resourceType.name === "HCMApplicationList") {
      const appData = {
        items: [
          {
            kind: "application",
            name: "mortgage-channel",
            namespace: "mortgage-ch",
            _hubClusterResource: "true"
          }
        ]
      };

      return Promise.resolve(appData);
    }

    return Promise.resolve({ response: "invalid resonse" });
  }),
  getResource: jest.fn((resourceType, { namespace }) => {
    if (
      resourceType === "channel" ||
      (resourceType.name && resourceType.name === "HCMChannel")
    ) {
      const channelData = {
        data: {
          searchResult: [
            {
              items: [
                {
                  kind: "channel",
                  name: "mortgage-channel",
                  namespace: "mortgage-ch",
                  _hubClusterResource: "true"
                }
              ]
            }
          ]
        }
      };
      return Promise.resolve(channelData);
    }

    if (
      resourceType === "subscription" ||
      (resourceType.name && resourceType.name === "HCMSubscription")
    ) {
      const subscriptionData = {
        data: {
          searchResult: [
            {
              items: [
                {
                  kind: "subscription",
                  name: "orphan",
                  namespace: "default",
                  status: "Propagated",
                  cluster: "local-cluster",
                  channel: "default/mortgage-channel",
                  apigroup: "app.ibm.com",
                  apiversion: "v1alpha1",
                  _rbac: "default_app.ibm.com_subscriptions",
                  _hubClusterResource: "true",
                  _uid:
                    "local-cluster/5cdc0d8d-52aa-11ea-bf05-00000a102d26orphan",
                  packageFilterVersion: ">=1.x",
                  label:
                    "app=mortgage-app-mortgage; chart=mortgage-1.0.3; heritage=Tiller; release=mortgage-app",
                  related: []
                }
              ]
            }
          ]
        }
      };
      return Promise.resolve(subscriptionData);
    }

    if (
      resourceType === "placementrule" ||
      (resourceType.name && resourceType.name === "HCMPlacementRule")
    ) {
      const prData = {
        data: {
          searchResult: [
            {
              items: [
                {
                  kind: "subscription",
                  name: "orphan",
                  namespace: "default",
                  status: "Propagated",
                  cluster: "local-cluster",
                  channel: "default/mortgage-channel",
                  apigroup: "app.ibm.com",
                  apiversion: "v1alpha1",
                  _rbac: "default_app.ibm.com_subscriptions",
                  _hubClusterResource: "true",
                  _uid:
                    "local-cluster/5cdc0d8d-52aa-11ea-bf05-00000a102d26orphan",
                  packageFilterVersion: ">=1.x",
                  label:
                    "app=mortgage-app-mortgage; chart=mortgage-1.0.3; heritage=Tiller; release=mortgage-app",
                  related: []
                }
              ]
            }
          ]
        }
      };
      return Promise.resolve(prData);
    }

    if (resourceType.name === "HCMTopology") {
      const topoData = {
        data: {
          topology: {
            resources: [
              {
                id: "application--mortgagers",
                uid: "application--mortgagers",
                name: "mortgagers",
                cluster: null,
                clusterName: null,
                type: "application",
                specs: {
                  isDesign: true,
                  raw: {
                    apiVersion: "app.k8s.io/v1beta1",
                    kind: "Application",
                    metadata: {
                      annotations: {
                        "apps.open-cluster-management.io/deployables": "",
                        "apps.open-cluster-management.io/hosting-deployable":
                          "mortgagecm-ch/mortgagecm-channel-Application-mortgagers",
                        "apps.open-cluster-management.io/hosting-subscription":
                          "default/test-subscription-6-local",
                        "apps.open-cluster-management.io/subscriptions":
                          "default/mortgagers-subscription",
                        "apps.open-cluster-management.io/sync-source":
                          "subgbk8s-default/test-subscription-6-local",
                        "open-cluster-management.io/user-group":
                          "c3lzdGVtOnNlcnZpY2VhY2NvdW50cyxzeXN0ZW06c2VydmljZWFjY291bnRzOm9wZW4tY2x1c3Rlci1tYW5hZ2VtZW50LHN5c3RlbTphdXRoZW50aWNhdGVk",
                        "open-cluster-management.io/user-identity":
                          "c3lzdGVtOnNlcnZpY2VhY2NvdW50Om9wZW4tY2x1c3Rlci1tYW5hZ2VtZW50Om11bHRpY2x1c3Rlci1vcGVyYXRvcnM="
                      },
                      creationTimestamp: "2020-12-08T21:19:40Z",
                      generation: 2,
                      name: "mortgagers",
                      namespace: "default",
                      resourceVersion: "111170392",
                      selfLink:
                        "/apis/app.k8s.io/v1beta1/namespaces/default/applications/mortgagers",
                      uid: "ec5982b6-d619-4914-afed-1495fe2d1fe6"
                    },
                    spec: {
                      componentKinds: [
                        {
                          group: "apps.open-cluster-management.io",
                          kind: "Subscription"
                        }
                      ],
                      descriptor: {},
                      selector: {
                        matchExpressions: [
                          {
                            key: "app",
                            operator: "In",
                            values: ["mortgagers"]
                          }
                        ]
                      }
                    }
                  },
                  activeChannel:
                    "default/mortgagers-subscription//mortgagers-ch/mortgagers-channel",
                  allSubscriptions: [
                    {
                      apiVersion: "apps.open-cluster-management.io/v1",
                      kind: "Subscription",
                      metadata: {
                        annotations: {
                          "apps.open-cluster-management.io/deployables":
                            "default/mortgagers-subscription-mortgagers-mortgagers-deploy-replicaset,default/mortgagers-subscription-mortgagers-mortgagers-svc-service",
                          "apps.open-cluster-management.io/git-commit":
                            "3ef4d969fe46380e3dbe3b0e1f323f68219ccc4f",
                          "apps.open-cluster-management.io/github-branch":
                            "main",
                          "apps.open-cluster-management.io/github-path":
                            "mortgagers",
                          "apps.open-cluster-management.io/hosting-deployable":
                            "mortgagecm-ch/mortgagecm-channel-Subscription-mortgagers-subscription",
                          "apps.open-cluster-management.io/hosting-subscription":
                            "default/test-subscription-6-local",
                          "apps.open-cluster-management.io/sync-source":
                            "subgbk8s-default/test-subscription-6-local",
                          "apps.open-cluster-management.io/topo":
                            "deployable//ReplicaSet//mortgagers-deploy/1,deployable//Service//mortgagers-svc/0",
                          "open-cluster-management.io/user-group":
                            "c3lzdGVtOnNlcnZpY2VhY2NvdW50cyxzeXN0ZW06c2VydmljZWFjY291bnRzOm9wZW4tY2x1c3Rlci1tYW5hZ2VtZW50LWFnZW50LWFkZG9uLHN5c3RlbTphdXRoZW50aWNhdGVk",
                          "open-cluster-management.io/user-identity":
                            "c3lzdGVtOnNlcnZpY2VhY2NvdW50Om9wZW4tY2x1c3Rlci1tYW5hZ2VtZW50LWFnZW50LWFkZG9uOmtsdXN0ZXJsZXQtYWRkb24tYXBwbWdy"
                        },
                        creationTimestamp: "2020-12-08T21:19:37Z",
                        generation: 2,
                        labels: { app: "mortgagers" },
                        name: "mortgagers-subscription",
                        namespace: "default",
                        resourceVersion: "132199758",
                        selfLink:
                          "/apis/apps.open-cluster-management.io/v1/namespaces/default/subscriptions/mortgagers-subscription",
                        uid: "5c94b134-0057-4ad4-a3b6-1cb803054ffc"
                      },
                      spec: {
                        channel: "mortgagers-ch/mortgagers-channel",
                        placement: {
                          placementRef: {
                            kind: "PlacementRule",
                            name: "mortgagers-placement"
                          }
                        }
                      },
                      status: {
                        lastUpdateTime: "2020-12-08T21:19:44Z",
                        message: "fxiang-eks:Active",
                        phase: "Propagated",
                        statuses: {
                          "fxiang-eks": {
                            packages: {
                              "mortgagers-channel-Service-mortgagers-svc": {
                                lastUpdateTime: "2020-12-08T21:19:44Z",
                                phase: "Subscribed",
                                resourceStatus: { loadBalancer: {} }
                              }
                            }
                          }
                        }
                      }
                    }
                  ],
                  allChannels: [
                    {
                      apiVersion: "apps.open-cluster-management.io/v1",
                      kind: "Channel",
                      metadata: {
                        annotations: {
                          "kubectl.kubernetes.io/last-applied-configuration":
                            '{"apiVersion":"apps.open-cluster-management.io/v1","kind":"Channel","metadata":{"annotations":{},"name":"mortgagers-channel","namespace":"mortgagers-ch"},"spec":{"pathname":"https://github.com/fxiang1/app-samples.git","type":"GitHub"}}\n',
                          "open-cluster-management.io/user-group":
                            "c3lzdGVtOmNsdXN0ZXItYWRtaW5zLHN5c3RlbTphdXRoZW50aWNhdGVk",
                          "open-cluster-management.io/user-identity":
                            "a3ViZTphZG1pbg=="
                        },
                        creationTimestamp: "2020-12-08T21:19:21Z",
                        generation: 1,
                        name: "mortgagers-channel",
                        namespace: "mortgagers-ch",
                        resourceVersion: "111169251",
                        selfLink:
                          "/apis/apps.open-cluster-management.io/v1/namespaces/mortgagers-ch/channels/mortgagers-channel",
                        uid: "bdfd2ba6-af8d-4014-9cbf-ac5d5053c4b6"
                      },
                      spec: {
                        pathname: "https://github.com/fxiang1/app-samples.git",
                        type: "GitHub"
                      }
                    }
                  ],
                  allClusters: [
                    "fxiang-eks",
                    "vbirsan1-remote",
                    "fake-cluster7",
                    "fake-cluster6",
                    "fake-cluster5",
                    "fake-cluster1",
                    "fake-cluster2",
                    "fake-cluster3",
                    "fake-cluster4",
                    "local-cluster",
                    "console-ui-test-cluster-aws",
                    "console-ui-test-cluster-azure",
                    "testing"
                  ],
                  channels: [
                    "default/mortgagers-subscription//mortgagers-ch/mortgagers-channel"
                  ]
                },
                namespace: "default",
                topology: null,
                labels: null,
                __typename: "Resource"
              },
              {
                id: "member--subscription--default--mortgagers-subscription",
                uid: "member--subscription--default--mortgagers-subscription",
                name: "mortgagers-subscription",
                cluster: null,
                clusterName: null,
                type: "subscription",
                specs: {
                  isDesign: true,
                  hasRules: true,
                  isPlaced: true,
                  raw: {
                    apiVersion: "apps.open-cluster-management.io/v1",
                    kind: "Subscription",
                    metadata: {
                      annotations: {
                        "apps.open-cluster-management.io/deployables":
                          "default/mortgagers-subscription-mortgagers-mortgagers-deploy-replicaset,default/mortgagers-subscription-mortgagers-mortgagers-svc-service",
                        "apps.open-cluster-management.io/git-commit":
                          "3ef4d969fe46380e3dbe3b0e1f323f68219ccc4f",
                        "apps.open-cluster-management.io/github-branch": "main",
                        "apps.open-cluster-management.io/github-path":
                          "mortgagers",
                        "apps.open-cluster-management.io/hosting-deployable":
                          "mortgagecm-ch/mortgagecm-channel-Subscription-mortgagers-subscription",
                        "apps.open-cluster-management.io/hosting-subscription":
                          "default/test-subscription-6-local",
                        "apps.open-cluster-management.io/sync-source":
                          "subgbk8s-default/test-subscription-6-local",
                        "apps.open-cluster-management.io/topo":
                          "deployable//ReplicaSet//mortgagers-deploy/1,deployable//Service//mortgagers-svc/0",
                        "open-cluster-management.io/user-group":
                          "c3lzdGVtOnNlcnZpY2VhY2NvdW50cyxzeXN0ZW06c2VydmljZWFjY291bnRzOm9wZW4tY2x1c3Rlci1tYW5hZ2VtZW50LWFnZW50LWFkZG9uLHN5c3RlbTphdXRoZW50aWNhdGVk",
                        "open-cluster-management.io/user-identity":
                          "c3lzdGVtOnNlcnZpY2VhY2NvdW50Om9wZW4tY2x1c3Rlci1tYW5hZ2VtZW50LWFnZW50LWFkZG9uOmtsdXN0ZXJsZXQtYWRkb24tYXBwbWdy"
                      },
                      creationTimestamp: "2020-12-08T21:19:37Z",
                      generation: 2,
                      labels: { app: "mortgagers" },
                      name: "mortgagers-subscription",
                      namespace: "default",
                      resourceVersion: "132199758",
                      selfLink:
                        "/apis/apps.open-cluster-management.io/v1/namespaces/default/subscriptions/mortgagers-subscription",
                      uid: "5c94b134-0057-4ad4-a3b6-1cb803054ffc"
                    },
                    spec: {
                      channel: "mortgagers-ch/mortgagers-channel",
                      placement: {
                        placementRef: {
                          kind: "PlacementRule",
                          name: "mortgagers-placement"
                        }
                      }
                    },
                    status: {
                      lastUpdateTime: "2020-12-08T21:19:44Z",
                      message: "fxiang-eks:Active",
                      phase: "Propagated",
                      statuses: {
                        "fxiang-eks": {
                          packages: {
                            "mortgagers-channel-Service-mortgagers-svc": {
                              lastUpdateTime: "2020-12-08T21:19:44Z",
                              phase: "Subscribed",
                              resourceStatus: { loadBalancer: {} }
                            }
                          }
                        }
                      }
                    },
                    channels: []
                  }
                },
                namespace: "default",
                topology: null,
                labels: null,
                __typename: "Resource"
              },
              {
                id: "member--rules--default--mortgagers-placement--0",
                uid: "member--rules--default--mortgagers-placement--0",
                name: "mortgagers-placement",
                cluster: null,
                clusterName: null,
                type: "placements",
                specs: {
                  isDesign: true,
                  raw: {
                    apiVersion: "apps.open-cluster-management.io/v1",
                    kind: "PlacementRule",
                    metadata: {
                      annotations: {
                        "apps.open-cluster-management.io/hosting-deployable":
                          "mortgagecm-ch/mortgagecm-channel-PlacementRule-mortgagers-placement",
                        "apps.open-cluster-management.io/hosting-subscription":
                          "default/test-subscription-6-local",
                        "apps.open-cluster-management.io/sync-source":
                          "subgbk8s-default/test-subscription-6-local",
                        "open-cluster-management.io/user-group":
                          "c3lzdGVtOnNlcnZpY2VhY2NvdW50cyxzeXN0ZW06c2VydmljZWFjY291bnRzOm9wZW4tY2x1c3Rlci1tYW5hZ2VtZW50LWFnZW50LWFkZG9uLHN5c3RlbTphdXRoZW50aWNhdGVk",
                        "open-cluster-management.io/user-identity":
                          "c3lzdGVtOnNlcnZpY2VhY2NvdW50Om9wZW4tY2x1c3Rlci1tYW5hZ2VtZW50LWFnZW50LWFkZG9uOmtsdXN0ZXJsZXQtYWRkb24tYXBwbWdy"
                      },
                      creationTimestamp: "2020-12-08T21:19:30Z",
                      generation: 1,
                      labels: { app: "mortgagers" },
                      name: "mortgagers-placement",
                      namespace: "default",
                      resourceVersion: "111169521",
                      selfLink:
                        "/apis/apps.open-cluster-management.io/v1/namespaces/default/placementrules/mortgagers-placement",
                      uid: "4cd3833d-02d1-4154-ac8d-12aa11bbf44b"
                    },
                    spec: {
                      clusterReplicas: 1,
                      clusterSelector: { matchLabels: { environment: "Dev" } }
                    },
                    status: {
                      decisions: [
                        {
                          clusterName: "fxiang-eks",
                          clusterNamespace: "fxiang-eks"
                        }
                      ]
                    }
                  }
                },
                namespace: "default",
                topology: null,
                labels: null,
                __typename: "Resource"
              },
              {
                id: "member--clusters--fxiang-eks",
                uid: "member--clusters--fxiang-eks",
                name: "fxiang-eks",
                cluster: null,
                clusterName: null,
                type: "cluster",
                specs: {
                  cluster: {
                    metadata: {
                      creationTimestamp: "2020-10-26T18:21:11Z",
                      finalizers: [
                        "agent.open-cluster-management.io/klusterletaddonconfig-cleanup",
                        "cluster.open-cluster-management.io/api-resource-cleanup",
                        "managedclusterinfo.finalizers.open-cluster-management.io",
                        "open-cluster-management.io/managedclusterrole",
                        "managedcluster-import-controller.open-cluster-management.io/cleanup"
                      ],
                      generation: 1,
                      labels: {
                        cloud: "AWS",
                        environment: "Dev",
                        name: "fxiang-eks",
                        vendor: "EKS"
                      },
                      name: "fxiang-eks",
                      resourceVersion: "73374146",
                      selfLink:
                        "/apis/cluster.open-cluster-management.io/v1/managedclusters/fxiang-eks",
                      uid: "7a839fc3-3cdd-446e-aa3f-6130616577fc",
                      namespace: "fxiang-eks"
                    },
                    rawCluster: {
                      apiVersion: "cluster.open-cluster-management.io/v1",
                      kind: "ManagedCluster",
                      metadata: {
                        creationTimestamp: "2020-10-26T18:21:11Z",
                        finalizers: [
                          "agent.open-cluster-management.io/klusterletaddonconfig-cleanup",
                          "cluster.open-cluster-management.io/api-resource-cleanup",
                          "managedclusterinfo.finalizers.open-cluster-management.io",
                          "open-cluster-management.io/managedclusterrole",
                          "managedcluster-import-controller.open-cluster-management.io/cleanup"
                        ],
                        generation: 1,
                        labels: {
                          cloud: "AWS",
                          environment: "Dev",
                          name: "fxiang-eks",
                          vendor: "EKS"
                        },
                        name: "fxiang-eks",
                        resourceVersion: "73374146",
                        selfLink:
                          "/apis/cluster.open-cluster-management.io/v1/managedclusters/fxiang-eks",
                        uid: "7a839fc3-3cdd-446e-aa3f-6130616577fc",
                        namespace: "fxiang-eks"
                      },
                      spec: {
                        hubAcceptsClient: true,
                        leaseDurationSeconds: 60
                      },
                      status: {
                        allocatable: { cpu: "11580m", memory: "20056Mi" },
                        capacity: { cpu: "12", memory: "23308Mi" },
                        conditions: [
                          {
                            lastTransitionTime: "2020-10-26T18:21:12Z",
                            message: "Accepted by hub cluster admin",
                            reason: "HubClusterAdminAccepted",
                            status: "True",
                            type: "HubAcceptedManagedCluster"
                          },
                          {
                            lastTransitionTime: "2020-11-09T04:21:35Z",
                            message: "Managed cluster is available",
                            reason: "ManagedClusterAvailable",
                            status: "True",
                            type: "ManagedClusterConditionAvailable"
                          },
                          {
                            lastTransitionTime: "2020-10-26T18:21:48Z",
                            message: "Managed cluster joined",
                            reason: "ManagedClusterJoined",
                            status: "True",
                            type: "ManagedClusterJoined"
                          }
                        ],
                        version: { kubernetes: "v1.17.12-eks-7684af" }
                      }
                    },
                    rawStatus: {
                      apiVersion: "internal.open-cluster-management.io/v1beta1",
                      kind: "ManagedClusterInfo",
                      metadata: {
                        creationTimestamp: "2020-10-26T18:21:12Z",
                        generation: 1,
                        labels: {
                          cloud: "AWS",
                          environment: "Dev",
                          name: "fxiang-eks",
                          vendor: "EKS"
                        },
                        name: "fxiang-eks",
                        namespace: "fxiang-eks",
                        resourceVersion: "123077446",
                        selfLink:
                          "/apis/internal.open-cluster-management.io/v1beta1/namespaces/fxiang-eks/managedclusterinfos/fxiang-eks",
                        uid: "607c5385-2603-4326-9418-18e5664ee678"
                      },
                      spec: {
                        loggingCA:
                          "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURGakNDQWY2Z0F3SUJBZ0lRSU0rdisycDB0NXNaSEs1czRreEtGVEFOQmdrcWhraUc5dzBCQVFzRkFEQWwKTVNNd0lRWURWUVFERXhwdGRXeDBhV05zZFhOMFpYSm9kV0l0YTJ4MWMzUmxjbXhsZERBZUZ3MHlNREV3TWpJeApOREF4TWpoYUZ3MHlNVEV3TWpJeE5EQXhNamhhTUNVeEl6QWhCZ05WQkFNVEdtMTFiSFJwWTJ4MWMzUmxjbWgxCllpMXJiSFZ6ZEdWeWJHVjBNSUlCSWpBTkJna3Foa2lHOXcwQkFRRUZBQU9DQVE4QU1JSUJDZ0tDQVFFQTdnb2wKRDV4S3ZjQk0xZCtnYzVSMjlvalBBMVB2Nmo3MDJGK3lxNDZ4QU1nVUI3L2JqUk80WS80SDFoZS94M2c5N3hPTApPYnBWWkdmNGhFNEZFVU05OXRXekcwTlZPMm0vNEFNa010MDI3a3l5S0VhbXJMQlQwTTFJbWs0QzRlMzhib0RYCldHZit1ckw4NmoxeW4vV2xDNDFrOVNpWVlSaFVoNXE4RWJZUXY5UDZEQm1lSVJ4azk5NktMcEtIdmdKVDFMVEcKcFRhZmVYOFgxU1JjSEZZT0JXaW1Fbm9GNThXQ1JYSFY3ZW5oeHVCRnVjcUdsaWpaTEpjMkowNTA1THEzYVVGQQpscklWZHRXdFNmUHlna0lnSUQ4UlpwTXJzOGdVSnFtNzhxSWt1M2FUYlVxaVJjY3ZnQ25RTEtiNzVqcGxwN3B2Ck9hYmp4c2xyVWE2RjE0ZTR1d0lEQVFBQm8wSXdRREFPQmdOVkhROEJBZjhFQkFNQ0FxUXdIUVlEVlIwbEJCWXcKRkFZSUt3WUJCUVVIQXdFR0NDc0dBUVVGQndNQ01BOEdBMVVkRXdFQi93UUZNQU1CQWY4d0RRWUpLb1pJaHZjTgpBUUVMQlFBRGdnRUJBSjhTRFZ2QTZEM1dTb1k3aHU2SkNxaXl1QW84Z0ZnZVIrT3VXZUROQ1d3bmtOVzErb0g1CllrT0NxZk00dDlFNFNiSTJCY3oyaHlSRW5OR1Vobk5vazYyL0x6K2ZGQ25uK0hsSnRiU2ZJOWVyQ0xRMWF2M00KMndBTlMrajBMdFp5Wk4rWExFcE1PZkNkZGN6TW9Ydm1RWTdZWHB0aFpmM3FuTit0NlRZckZjNlBMSFZYSFcxNgowWUhRNklXTCs3REtyWWJTSmVvZGZOd2Z5N1hBTjVDNmpRcGlrSmtMN0RCbk5EdUVuUnZCUmtCcmdqQnZ0WWZaCmVRbWkzS2Fmc01HTDlWN0NTWXNOME9zV2J5bEJmMW9BS2NXYUpaSjRvQVZqTnVIcWJrL3ZCRHNWaVJpaUFaT3QKb0F1SWNCR0lsVWphNm5kOTgzeHBvTVlwSHJVWUpsY25vYnM9Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K"
                      },
                      status: {
                        cloudVendor: "Amazon",
                        conditions: [
                          {
                            lastTransitionTime: "2020-10-26T18:21:12Z",
                            message: "Accepted by hub cluster admin",
                            reason: "HubClusterAdminAccepted",
                            status: "True",
                            type: "HubAcceptedManagedCluster"
                          },
                          {
                            lastTransitionTime: "2020-11-09T04:21:35Z",
                            message: "Managed cluster is available",
                            reason: "ManagedClusterAvailable",
                            status: "True",
                            type: "ManagedClusterConditionAvailable"
                          },
                          {
                            lastTransitionTime: "2020-10-26T18:21:48Z",
                            message: "Managed cluster joined",
                            reason: "ManagedClusterJoined",
                            status: "True",
                            type: "ManagedClusterJoined"
                          },
                          {
                            lastTransitionTime: "2020-12-15T02:53:47Z",
                            message: "Managed cluster info is synced",
                            reason: "ManagedClusterInfoSynced",
                            status: "True",
                            type: "ManagedClusterInfoSynced"
                          }
                        ],
                        distributionInfo: { ocp: {}, type: "Unknow" },
                        kubeVendor: "EKS",
                        loggingEndpoint: {
                          hostname:
                            "a366319b4f5644df9a0881749f9175b8-1347255169.us-east-1.elb.amazonaws.com",
                          ip: ""
                        },
                        loggingPort: {
                          name: "https",
                          port: 443,
                          protocol: "TCP"
                        },
                        nodeList: [
                          {
                            capacity: { cpu: "2", memory: "3977904Ki" },
                            conditions: [{ status: "True", type: "Ready" }],
                            labels: {
                              "beta.kubernetes.io/instance-type": "t3.medium",
                              "failure-domain.beta.kubernetes.io/region":
                                "us-east-1",
                              "failure-domain.beta.kubernetes.io/zone":
                                "us-east-1b",
                              "node.kubernetes.io/instance-type": "t3.medium"
                            },
                            name: "ip-192-168-192-201.ec2.internal"
                          },
                          {
                            capacity: { cpu: "2", memory: "3977904Ki" },
                            conditions: [{ status: "True", type: "Ready" }],
                            labels: {
                              "beta.kubernetes.io/instance-type": "t3.medium",
                              "failure-domain.beta.kubernetes.io/region":
                                "us-east-1",
                              "failure-domain.beta.kubernetes.io/zone":
                                "us-east-1a",
                              "node.kubernetes.io/instance-type": "t3.medium"
                            },
                            name: "ip-192-168-2-31.ec2.internal"
                          },
                          {
                            capacity: { cpu: "2", memory: "3977904Ki" },
                            conditions: [{ status: "True", type: "Ready" }],
                            labels: {
                              "beta.kubernetes.io/instance-type": "t3.medium",
                              "failure-domain.beta.kubernetes.io/region":
                                "us-east-1",
                              "failure-domain.beta.kubernetes.io/zone":
                                "us-east-1b",
                              "node.kubernetes.io/instance-type": "t3.medium"
                            },
                            name: "ip-192-168-228-214.ec2.internal"
                          },
                          {
                            capacity: { cpu: "2", memory: "3977904Ki" },
                            conditions: [{ status: "True", type: "Ready" }],
                            labels: {
                              "beta.kubernetes.io/instance-type": "t3.medium",
                              "failure-domain.beta.kubernetes.io/region":
                                "us-east-1",
                              "failure-domain.beta.kubernetes.io/zone":
                                "us-east-1a",
                              "node.kubernetes.io/instance-type": "t3.medium"
                            },
                            name: "ip-192-168-23-125.ec2.internal"
                          },
                          {
                            capacity: { cpu: "2", memory: "3977904Ki" },
                            conditions: [{ status: "True", type: "Ready" }],
                            labels: {
                              "beta.kubernetes.io/instance-type": "t3.medium",
                              "failure-domain.beta.kubernetes.io/region":
                                "us-east-1",
                              "failure-domain.beta.kubernetes.io/zone":
                                "us-east-1b",
                              "node.kubernetes.io/instance-type": "t3.medium"
                            },
                            name: "ip-192-168-247-133.ec2.internal"
                          },
                          {
                            capacity: { cpu: "2", memory: "3977904Ki" },
                            conditions: [{ status: "True", type: "Ready" }],
                            labels: {
                              "beta.kubernetes.io/instance-type": "t3.medium",
                              "failure-domain.beta.kubernetes.io/region":
                                "us-east-1",
                              "failure-domain.beta.kubernetes.io/zone":
                                "us-east-1a",
                              "node.kubernetes.io/instance-type": "t3.medium"
                            },
                            name: "ip-192-168-34-41.ec2.internal"
                          }
                        ],
                        version: "v1.17.12-eks-7684af"
                      }
                    },
                    status: "ok",
                    capacity: { cpu: "12", memory: "23308Mi" },
                    allocatable: { cpu: "11580m", memory: "20056Mi" }
                  },
                  clusters: [
                    {
                      metadata: {
                        creationTimestamp: "2020-10-26T18:21:11Z",
                        finalizers: [
                          "agent.open-cluster-management.io/klusterletaddonconfig-cleanup",
                          "cluster.open-cluster-management.io/api-resource-cleanup",
                          "managedclusterinfo.finalizers.open-cluster-management.io",
                          "open-cluster-management.io/managedclusterrole",
                          "managedcluster-import-controller.open-cluster-management.io/cleanup"
                        ],
                        generation: 1,
                        labels: {
                          cloud: "AWS",
                          environment: "Dev",
                          name: "fxiang-eks",
                          vendor: "EKS"
                        },
                        name: "fxiang-eks",
                        resourceVersion: "73374146",
                        selfLink:
                          "/apis/cluster.open-cluster-management.io/v1/managedclusters/fxiang-eks",
                        uid: "7a839fc3-3cdd-446e-aa3f-6130616577fc",
                        namespace: "fxiang-eks"
                      },
                      rawCluster: {
                        apiVersion: "cluster.open-cluster-management.io/v1",
                        kind: "ManagedCluster",
                        metadata: {
                          creationTimestamp: "2020-10-26T18:21:11Z",
                          finalizers: [
                            "agent.open-cluster-management.io/klusterletaddonconfig-cleanup",
                            "cluster.open-cluster-management.io/api-resource-cleanup",
                            "managedclusterinfo.finalizers.open-cluster-management.io",
                            "open-cluster-management.io/managedclusterrole",
                            "managedcluster-import-controller.open-cluster-management.io/cleanup"
                          ],
                          generation: 1,
                          labels: {
                            cloud: "AWS",
                            environment: "Dev",
                            name: "fxiang-eks",
                            vendor: "EKS"
                          },
                          name: "fxiang-eks",
                          resourceVersion: "73374146",
                          selfLink:
                            "/apis/cluster.open-cluster-management.io/v1/managedclusters/fxiang-eks",
                          uid: "7a839fc3-3cdd-446e-aa3f-6130616577fc",
                          namespace: "fxiang-eks"
                        },
                        spec: {
                          hubAcceptsClient: true,
                          leaseDurationSeconds: 60
                        },
                        status: {
                          allocatable: { cpu: "11580m", memory: "20056Mi" },
                          capacity: { cpu: "12", memory: "23308Mi" },
                          conditions: [
                            {
                              lastTransitionTime: "2020-10-26T18:21:12Z",
                              message: "Accepted by hub cluster admin",
                              reason: "HubClusterAdminAccepted",
                              status: "True",
                              type: "HubAcceptedManagedCluster"
                            },
                            {
                              lastTransitionTime: "2020-11-09T04:21:35Z",
                              message: "Managed cluster is available",
                              reason: "ManagedClusterAvailable",
                              status: "True",
                              type: "ManagedClusterConditionAvailable"
                            },
                            {
                              lastTransitionTime: "2020-10-26T18:21:48Z",
                              message: "Managed cluster joined",
                              reason: "ManagedClusterJoined",
                              status: "True",
                              type: "ManagedClusterJoined"
                            }
                          ],
                          version: { kubernetes: "v1.17.12-eks-7684af" }
                        }
                      },
                      rawStatus: {
                        apiVersion:
                          "internal.open-cluster-management.io/v1beta1",
                        kind: "ManagedClusterInfo",
                        metadata: {
                          creationTimestamp: "2020-10-26T18:21:12Z",
                          generation: 1,
                          labels: {
                            cloud: "AWS",
                            environment: "Dev",
                            name: "fxiang-eks",
                            vendor: "EKS"
                          },
                          name: "fxiang-eks",
                          namespace: "fxiang-eks",
                          resourceVersion: "123077446",
                          selfLink:
                            "/apis/internal.open-cluster-management.io/v1beta1/namespaces/fxiang-eks/managedclusterinfos/fxiang-eks",
                          uid: "607c5385-2603-4326-9418-18e5664ee678"
                        },
                        spec: {
                          loggingCA:
                            "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURGakNDQWY2Z0F3SUJBZ0lRSU0rdisycDB0NXNaSEs1czRreEtGVEFOQmdrcWhraUc5dzBCQVFzRkFEQWwKTVNNd0lRWURWUVFERXhwdGRXeDBhV05zZFhOMFpYSm9kV0l0YTJ4MWMzUmxjbXhsZERBZUZ3MHlNREV3TWpJeApOREF4TWpoYUZ3MHlNVEV3TWpJeE5EQXhNamhhTUNVeEl6QWhCZ05WQkFNVEdtMTFiSFJwWTJ4MWMzUmxjbWgxCllpMXJiSFZ6ZEdWeWJHVjBNSUlCSWpBTkJna3Foa2lHOXcwQkFRRUZBQU9DQVE4QU1JSUJDZ0tDQVFFQTdnb2wKRDV4S3ZjQk0xZCtnYzVSMjlvalBBMVB2Nmo3MDJGK3lxNDZ4QU1nVUI3L2JqUk80WS80SDFoZS94M2c5N3hPTApPYnBWWkdmNGhFNEZFVU05OXRXekcwTlZPMm0vNEFNa010MDI3a3l5S0VhbXJMQlQwTTFJbWs0QzRlMzhib0RYCldHZit1ckw4NmoxeW4vV2xDNDFrOVNpWVlSaFVoNXE4RWJZUXY5UDZEQm1lSVJ4azk5NktMcEtIdmdKVDFMVEcKcFRhZmVYOFgxU1JjSEZZT0JXaW1Fbm9GNThXQ1JYSFY3ZW5oeHVCRnVjcUdsaWpaTEpjMkowNTA1THEzYVVGQQpscklWZHRXdFNmUHlna0lnSUQ4UlpwTXJzOGdVSnFtNzhxSWt1M2FUYlVxaVJjY3ZnQ25RTEtiNzVqcGxwN3B2Ck9hYmp4c2xyVWE2RjE0ZTR1d0lEQVFBQm8wSXdRREFPQmdOVkhROEJBZjhFQkFNQ0FxUXdIUVlEVlIwbEJCWXcKRkFZSUt3WUJCUVVIQXdFR0NDc0dBUVVGQndNQ01BOEdBMVVkRXdFQi93UUZNQU1CQWY4d0RRWUpLb1pJaHZjTgpBUUVMQlFBRGdnRUJBSjhTRFZ2QTZEM1dTb1k3aHU2SkNxaXl1QW84Z0ZnZVIrT3VXZUROQ1d3bmtOVzErb0g1CllrT0NxZk00dDlFNFNiSTJCY3oyaHlSRW5OR1Vobk5vazYyL0x6K2ZGQ25uK0hsSnRiU2ZJOWVyQ0xRMWF2M00KMndBTlMrajBMdFp5Wk4rWExFcE1PZkNkZGN6TW9Ydm1RWTdZWHB0aFpmM3FuTit0NlRZckZjNlBMSFZYSFcxNgowWUhRNklXTCs3REtyWWJTSmVvZGZOd2Z5N1hBTjVDNmpRcGlrSmtMN0RCbk5EdUVuUnZCUmtCcmdqQnZ0WWZaCmVRbWkzS2Fmc01HTDlWN0NTWXNOME9zV2J5bEJmMW9BS2NXYUpaSjRvQVZqTnVIcWJrL3ZCRHNWaVJpaUFaT3QKb0F1SWNCR0lsVWphNm5kOTgzeHBvTVlwSHJVWUpsY25vYnM9Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K"
                        },
                        status: {
                          cloudVendor: "Amazon",
                          conditions: [
                            {
                              lastTransitionTime: "2020-10-26T18:21:12Z",
                              message: "Accepted by hub cluster admin",
                              reason: "HubClusterAdminAccepted",
                              status: "True",
                              type: "HubAcceptedManagedCluster"
                            },
                            {
                              lastTransitionTime: "2020-11-09T04:21:35Z",
                              message: "Managed cluster is available",
                              reason: "ManagedClusterAvailable",
                              status: "True",
                              type: "ManagedClusterConditionAvailable"
                            },
                            {
                              lastTransitionTime: "2020-10-26T18:21:48Z",
                              message: "Managed cluster joined",
                              reason: "ManagedClusterJoined",
                              status: "True",
                              type: "ManagedClusterJoined"
                            },
                            {
                              lastTransitionTime: "2020-12-15T02:53:47Z",
                              message: "Managed cluster info is synced",
                              reason: "ManagedClusterInfoSynced",
                              status: "True",
                              type: "ManagedClusterInfoSynced"
                            }
                          ],
                          distributionInfo: { ocp: {}, type: "Unknow" },
                          kubeVendor: "EKS",
                          loggingEndpoint: {
                            hostname:
                              "a366319b4f5644df9a0881749f9175b8-1347255169.us-east-1.elb.amazonaws.com",
                            ip: ""
                          },
                          loggingPort: {
                            name: "https",
                            port: 443,
                            protocol: "TCP"
                          },
                          nodeList: [
                            {
                              capacity: { cpu: "2", memory: "3977904Ki" },
                              conditions: [{ status: "True", type: "Ready" }],
                              labels: {
                                "beta.kubernetes.io/instance-type": "t3.medium",
                                "failure-domain.beta.kubernetes.io/region":
                                  "us-east-1",
                                "failure-domain.beta.kubernetes.io/zone":
                                  "us-east-1b",
                                "node.kubernetes.io/instance-type": "t3.medium"
                              },
                              name: "ip-192-168-192-201.ec2.internal"
                            },
                            {
                              capacity: { cpu: "2", memory: "3977904Ki" },
                              conditions: [{ status: "True", type: "Ready" }],
                              labels: {
                                "beta.kubernetes.io/instance-type": "t3.medium",
                                "failure-domain.beta.kubernetes.io/region":
                                  "us-east-1",
                                "failure-domain.beta.kubernetes.io/zone":
                                  "us-east-1a",
                                "node.kubernetes.io/instance-type": "t3.medium"
                              },
                              name: "ip-192-168-2-31.ec2.internal"
                            },
                            {
                              capacity: { cpu: "2", memory: "3977904Ki" },
                              conditions: [{ status: "True", type: "Ready" }],
                              labels: {
                                "beta.kubernetes.io/instance-type": "t3.medium",
                                "failure-domain.beta.kubernetes.io/region":
                                  "us-east-1",
                                "failure-domain.beta.kubernetes.io/zone":
                                  "us-east-1b",
                                "node.kubernetes.io/instance-type": "t3.medium"
                              },
                              name: "ip-192-168-228-214.ec2.internal"
                            },
                            {
                              capacity: { cpu: "2", memory: "3977904Ki" },
                              conditions: [{ status: "True", type: "Ready" }],
                              labels: {
                                "beta.kubernetes.io/instance-type": "t3.medium",
                                "failure-domain.beta.kubernetes.io/region":
                                  "us-east-1",
                                "failure-domain.beta.kubernetes.io/zone":
                                  "us-east-1a",
                                "node.kubernetes.io/instance-type": "t3.medium"
                              },
                              name: "ip-192-168-23-125.ec2.internal"
                            },
                            {
                              capacity: { cpu: "2", memory: "3977904Ki" },
                              conditions: [{ status: "True", type: "Ready" }],
                              labels: {
                                "beta.kubernetes.io/instance-type": "t3.medium",
                                "failure-domain.beta.kubernetes.io/region":
                                  "us-east-1",
                                "failure-domain.beta.kubernetes.io/zone":
                                  "us-east-1b",
                                "node.kubernetes.io/instance-type": "t3.medium"
                              },
                              name: "ip-192-168-247-133.ec2.internal"
                            },
                            {
                              capacity: { cpu: "2", memory: "3977904Ki" },
                              conditions: [{ status: "True", type: "Ready" }],
                              labels: {
                                "beta.kubernetes.io/instance-type": "t3.medium",
                                "failure-domain.beta.kubernetes.io/region":
                                  "us-east-1",
                                "failure-domain.beta.kubernetes.io/zone":
                                  "us-east-1a",
                                "node.kubernetes.io/instance-type": "t3.medium"
                              },
                              name: "ip-192-168-34-41.ec2.internal"
                            }
                          ],
                          version: "v1.17.12-eks-7684af"
                        }
                      },
                      status: "ok",
                      capacity: { cpu: "12", memory: "23308Mi" },
                      allocatable: { cpu: "11580m", memory: "20056Mi" }
                    }
                  ],
                  sortedClusterNames: ["fxiang-eks"]
                },
                namespace: "",
                topology: null,
                labels: null,
                __typename: "Resource"
              },
              {
                id:
                  "member--member--deployable--member--clusters--fxiang-eks--default--mortgagers-subscription-mortgagers-mortgagers-svc-service--service--mortgagers-svc",
                uid:
                  "member--member--deployable--member--clusters--fxiang-eks--default--mortgagers-subscription-mortgagers-mortgagers-svc-service--service--mortgagers-svc",
                name: "mortgagers-svc",
                cluster: null,
                clusterName: null,
                type: "service",
                specs: {
                  raw: {
                    apiVersion: "v1",
                    kind: "Service",
                    metadata: {
                      labels: { app: "mortgagers-mortgage" },
                      name: "mortgagers-svc"
                    },
                    spec: {
                      ports: [
                        { port: 9080, protocol: "TCP", targetPort: 9080 }
                      ],
                      selector: { app: "mortgagers-mortgage" },
                      type: "NodePort"
                    }
                  },
                  deployStatuses: [],
                  isDesign: false,
                  parent: {
                    parentId: "member--clusters--fxiang-eks",
                    parentName: "fxiang-eks",
                    parentType: "cluster"
                  }
                },
                namespace: "default",
                topology: null,
                labels: null,
                __typename: "Resource"
              },
              {
                id:
                  "member--member--deployable--member--clusters--fxiang-eks--default--mortgagers-subscription-mortgagers-mortgagers-deploy-replicaset--replicaset--mortgagers-deploy",
                uid:
                  "member--member--deployable--member--clusters--fxiang-eks--default--mortgagers-subscription-mortgagers-mortgagers-deploy-replicaset--replicaset--mortgagers-deploy",
                name: "mortgagers-deploy",
                cluster: null,
                clusterName: null,
                type: "replicaset",
                specs: {
                  raw: {
                    apiVersion: "apps/v1",
                    kind: "ReplicaSet",
                    metadata: {
                      labels: { app: "mortgagers-mortgage" },
                      name: "mortgagers-deploy"
                    },
                    spec: {
                      replicas: 1,
                      selector: { matchLabels: { app: "mortgagers-mortgage" } },
                      template: {
                        metadata: { labels: { app: "mortgagers-mortgage" } },
                        spec: {
                          containers: [
                            {
                              image: "fxiang/mortgage:0.4.0",
                              imagePullPolicy: "Always",
                              name: "mortgagers-mortgage",
                              ports: [{ containerPort: 9080, protocol: "TCP" }],
                              resources: {
                                limits: { cpu: "200m", memory: "256Mi" }
                              }
                            }
                          ],
                          terminationGracePeriodSeconds: 30
                        }
                      }
                    }
                  },
                  deployStatuses: [],
                  isDesign: false,
                  parent: {
                    parentId: "member--clusters--fxiang-eks",
                    parentName: "fxiang-eks",
                    parentType: "cluster"
                  }
                },
                namespace: "default",
                topology: null,
                labels: null,
                __typename: "Resource"
              }
            ],
            relationships: [
              {
                type: "",
                specs: { isDesign: true },
                to: {
                  uid: "member--subscription--default--mortgagers-subscription",
                  __typename: "Resource"
                },
                from: {
                  uid: "application--mortgagers",
                  __typename: "Resource"
                },
                __typename: "Relationship"
              },
              {
                type: "",
                specs: { isDesign: true },
                to: {
                  uid: "member--rules--default--mortgagers-placement--0",
                  __typename: "Resource"
                },
                from: {
                  uid: "member--subscription--default--mortgagers-subscription",
                  __typename: "Resource"
                },
                __typename: "Relationship"
              },
              {
                type: "",
                specs: { isDesign: true },
                to: {
                  uid: "member--clusters--fxiang-eks",
                  __typename: "Resource"
                },
                from: {
                  uid: "member--subscription--default--mortgagers-subscription",
                  __typename: "Resource"
                },
                __typename: "Relationship"
              },
              {
                type: "",
                specs: null,
                to: {
                  uid:
                    "member--member--deployable--member--clusters--fxiang-eks--default--mortgagers-subscription-mortgagers-mortgagers-svc-service--service--mortgagers-svc",
                  __typename: "Resource"
                },
                from: {
                  uid: "member--clusters--fxiang-eks",
                  __typename: "Resource"
                },
                __typename: "Relationship"
              },
              {
                type: "",
                specs: null,
                to: {
                  uid:
                    "member--member--deployable--member--clusters--fxiang-eks--default--mortgagers-subscription-mortgagers-mortgagers-deploy-replicaset--replicaset--mortgagers-deploy",
                  __typename: "Resource"
                },
                from: {
                  uid: "member--clusters--fxiang-eks",
                  __typename: "Resource"
                },
                __typename: "Relationship"
              }
            ],
            __typename: "Topology"
          }
        }
      };
      return Promise.resolve(topoData);
    }

    return Promise.resolve({ response: "invalid resonse" });
  })
}));

const React = require("../../../../node_modules/react");

import ApplicationTopologyModule from "../../../../src-web/components/ApplicationTopologyModule/ApplicationTopologyModule.js";

import renderer from "react-test-renderer";
import * as reducers from "../../../../src-web/reducers";
import { mount, shallow } from "enzyme";

import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

const preloadedState = window.__PRELOADED_STATE__;
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = [thunkMiddleware];

const store = createStore(
  combineReducers(reducers),
  preloadedState,
  composeEnhancers(applyMiddleware(...middleware))
);

// need to mock a div w/i a div to be parent of monaco editor
function createNodeMock() {
  var iDiv = document.createElement("div");
  var innerDiv = document.createElement("div");
  iDiv.appendChild(innerDiv);
  return innerDiv;
}

const locale = "en-US";
describe("ApplicationTopologyModule with selected node ID", () => {
  it("ApplicationTopologyModule renders correctly when topology is not expanded---aaa", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <Provider store={store}>
            <ApplicationTopologyModule
              selectedNodeId={nodeID}
              showExpandedTopology={false}
              params={params}
              locale={locale}
            />
          </Provider>
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("ApplicationTopologyModule renders correctly when topology is expanded---bbb", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <Provider store={store}>
            <ApplicationTopologyModule
              selectedNodeId={nodeID}
              showExpandedTopology={true}
              params={params}
              locale={locale}
            />
          </Provider>
        </BrowserRouter>,
        { createNodeMock }
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  const actions = {
    setShowExpandedTopology: jest.fn()
  };
  it("ApplicationTopologyModule renders correctly when topology is expanded click---ccc", () => {
    mount(
      <BrowserRouter>
        <Provider store={store}>
          <ApplicationTopologyModule
            selectedNodeId={nodeID}
            showExpandedTopology={true}
            params={params}
            locale={locale}
            actions={actions}
          />
        </Provider>
      </BrowserRouter>
    );
  });
});

const nodeID = "acb123";

const params = {
  name: "app1",
  namespace: "default"
};
