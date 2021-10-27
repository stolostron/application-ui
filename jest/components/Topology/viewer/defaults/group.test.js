// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
"use strict";

import { getNodeGroups } from "../../../../../../src-web/components/Topology/viewer/defaults/grouping";

const activeFilters = {
  type: ["application", "placements", "subscription"]
};

describe("getNodeGroups cluster", () => {
  const clusterNodes = [
    {
      id: "member--clusters--cluster1",
      uid: "member--clusters--cluster1",
      name: "cluster1",
      cluster: null,
      clusterName: null,
      type: "cluster",
      specs: {
        cluster: {
          metadata: {
            name: "cluster1",
            namespace: "cluster1",
            selfLink:
              "/apis/clusterregistry.k8s.io/v1alpha1/namespaces/cluster1/clusters/cluster1",
            uid: "98a0e1b0-519c-11ea-9c87-965ebc50d5a3",
            resourceVersion: "796601",
            creationTimestamp: "2020-02-17T15:46:00Z",
            labels: {
              cloud: "IBM",
              env: "prod",
              name: "cluster1",
              region: "paris",
              vendor: "RHOCP"
            }
          }
        },
        clusterNames: ["cluster1", "cluster2"],
        clusterStatus: {
          isOffline: false,
          hasViolations: false,
          hasFailure: false,
          isRecent: false,
          isDisabled: false
        },
        scale: 1
      },
      namespace: "",
      topology: null,
      labels: null,
      __typename: "Resource"
    },
    {
      id: "member--clusters--azure",
      uid: "member--clusters--azure",
      name: "azure",
      cluster: null,
      clusterName: null,
      type: "cluster",
      specs: {
        cluster: {
          metadata: {
            name: "azure",
            namespace: "azure",
            selfLink:
              "/apis/clusterregistry.k8s.io/v1alpha1/namespaces/azure/clusters/azure",
            uid: "d4ba3b1a-51c9-11ea-a26b-42ea56303957",
            resourceVersion: "80891",
            creationTimestamp: "2020-02-17T21:09:48Z",
            labels: {
              cloud: "Azure",
              env: "prod",
              name: "azure",
              vendor: "RHOCP"
            }
          }
        },
        clusterNames: ["azure"],
        clusterStatus: {
          isOffline: true,
          hasViolations: false,
          hasFailure: true,
          isRecent: false,
          isDisabled: true,
          status: "!cluster.status.offline!"
        },
        scale: 0.8
      },
      namespace: "",
      topology: null,
      labels: null,
      __typename: "Resource"
    }
  ];

  const expectedResult = {
    allNodeMap: {
      "member--clusters--azure": {
        __typename: "Resource",
        cluster: null,
        clusterName: null,
        id: "member--clusters--azure",
        labels: null,
        layout: {
          compactLabel: "azure",
          label: "azure",
          type: "cluster",
          uid: "member--clusters--azure"
        },
        name: "azure",
        namespace: "",
        specs: {
          cluster: {
            metadata: {
              creationTimestamp: "2020-02-17T21:09:48Z",
              labels: {
                cloud: "Azure",
                env: "prod",
                name: "azure",
                vendor: "RHOCP"
              },
              name: "azure",
              namespace: "azure",
              resourceVersion: "80891",
              selfLink:
                "/apis/clusterregistry.k8s.io/v1alpha1/namespaces/azure/clusters/azure",
              uid: "d4ba3b1a-51c9-11ea-a26b-42ea56303957"
            }
          },
          clusterNames: ["azure"],
          clusterStatus: {
            hasFailure: true,
            hasViolations: false,
            isDisabled: true,
            isOffline: true,
            isRecent: false,
            status: "!cluster.status.offline!"
          },
          scale: 0.8
        },
        topology: null,
        type: "cluster",
        uid: "member--clusters--azure"
      },
      "member--clusters--cluster1": {
        __typename: "Resource",
        cluster: null,
        clusterName: null,
        id: "member--clusters--cluster1",
        labels: null,
        layout: {
          compactLabel: "cluster1",
          label: "cluster1",
          type: "cluster",
          uid: "member--clusters--cluster1"
        },
        name: "cluster1",
        namespace: "",
        specs: {
          cluster: {
            metadata: {
              creationTimestamp: "2020-02-17T15:46:00Z",
              labels: {
                cloud: "IBM",
                env: "prod",
                name: "cluster1",
                region: "paris",
                vendor: "RHOCP"
              },
              name: "cluster1",
              namespace: "cluster1",
              resourceVersion: "796601",
              selfLink:
                "/apis/clusterregistry.k8s.io/v1alpha1/namespaces/cluster1/clusters/cluster1",
              uid: "98a0e1b0-519c-11ea-9c87-965ebc50d5a3"
            }
          },
          clusterNames: ["cluster1", "cluster2"],
          clusterStatus: {
            hasFailure: false,
            hasViolations: false,
            isDisabled: false,
            isOffline: false,
            isRecent: false
          },
          scale: 1
        },
        topology: null,
        type: "cluster",
        uid: "member--clusters--cluster1"
      }
    },
    nodeGroups: {
      "": {
        nodes: [
          {
            __typename: "Resource",
            cluster: null,
            clusterName: null,
            id: "member--clusters--cluster1",
            labels: null,
            layout: {
              compactLabel: "cluster1",
              label: "cluster1",
              type: "cluster",
              uid: "member--clusters--cluster1"
            },
            name: "cluster1",
            namespace: "",
            specs: {
              cluster: {
                metadata: {
                  creationTimestamp: "2020-02-17T15:46:00Z",
                  labels: {
                    cloud: "IBM",
                    env: "prod",
                    name: "cluster1",
                    region: "paris",
                    vendor: "RHOCP"
                  },
                  name: "cluster1",
                  namespace: "cluster1",
                  resourceVersion: "796601",
                  selfLink:
                    "/apis/clusterregistry.k8s.io/v1alpha1/namespaces/cluster1/clusters/cluster1",
                  uid: "98a0e1b0-519c-11ea-9c87-965ebc50d5a3"
                }
              },
              clusterNames: ["cluster1", "cluster2"],
              clusterStatus: {
                hasFailure: false,
                hasViolations: false,
                isDisabled: false,
                isOffline: false,
                isRecent: false
              },
              scale: 1
            },
            topology: null,
            type: "cluster",
            uid: "member--clusters--cluster1"
          },
          {
            __typename: "Resource",
            cluster: null,
            clusterName: null,
            id: "member--clusters--azure",
            labels: null,
            layout: {
              compactLabel: "azure",
              label: "azure",
              type: "cluster",
              uid: "member--clusters--azure"
            },
            name: "azure",
            namespace: "",
            specs: {
              cluster: {
                metadata: {
                  creationTimestamp: "2020-02-17T21:09:48Z",
                  labels: {
                    cloud: "Azure",
                    env: "prod",
                    name: "azure",
                    vendor: "RHOCP"
                  },
                  name: "azure",
                  namespace: "azure",
                  resourceVersion: "80891",
                  selfLink:
                    "/apis/clusterregistry.k8s.io/v1alpha1/namespaces/azure/clusters/azure",
                  uid: "d4ba3b1a-51c9-11ea-a26b-42ea56303957"
                }
              },
              clusterNames: ["azure"],
              clusterStatus: {
                hasFailure: true,
                hasViolations: false,
                isDisabled: true,
                isOffline: true,
                isRecent: false,
                status: "!cluster.status.offline!"
              },
              scale: 0.8
            },
            topology: null,
            type: "cluster",
            uid: "member--clusters--azure"
          }
        ]
      }
    }
  };

  it("should group cluster nodes", () => {
    expect(getNodeGroups("cluster", clusterNodes, activeFilters)).toEqual(
      expectedResult
    );
  });
});

describe("getNodeGroups other", () => {
  const subscriptionNodes = [
    {
      id: "applicationpacmangit",
      uid: "applicationpacmangit",
      name: "applicationpacmangit",
      cluster: null,
      clusterName: null,
      type: "cluster",
      specs: {
        clusterNames: ["a", "b"],
        isDesign: true,
        raw: {},
        isDivider: true,
        row: 45
      },
      namespace: "pacmangitchannel",
      topology: null,
      labels: {
        cloud: "Azure",
        env: "prod",
        name: "azure",
        vendor: "RHOCP"
      },
      __typename: "Resource"
    },
    {
      id: "applicationpacmangit",
      uid: "applicationpacmangit",
      name: "applicationpacmangit",
      cluster: null,
      clusterName: null,
      type: "cluster",
      specs: {
        clusterNames: ["a"],
        isDesign: true,
        raw: {},
        isDivider: true,
        row: 45
      },
      namespace: "pacmangitchannel",
      topology: null,
      labels: {
        cloud: "Azure",
        env: "prod",
        name: "azure",
        vendor: "RHOCP"
      },
      __typename: "Resource"
    },
    {
      id: "applicationpacmangit",
      uid: "applicationpacmangit",
      name: "applicationpacmangit",
      cluster: null,
      clusterName: null,
      type: "deployment",
      specs: {
        isDesign: true,
        raw: {},
        isDivider: true,
        row: 45
      },
      namespace: "pacmangitchannel",
      topology: null,
      labels: {
        cloud: "Azure",
        env: "prod",
        name: "azure",
        vendor: "RHOCP"
      },
      __typename: "Resource"
    },
    {
      id: "deploymentpacmangit",
      uid: "deploymentpacmangit",
      name: "deploymentpacmangit",
      cluster: null,
      clusterName: null,
      type: "pod",
      specs: {
        isDesign: true,
        raw: {},
        isDivider: true,
        row: 95
      },
      namespace: "pacmangitchannel",
      topology: null,
      labels: {
        cloud: "Azure",
        env: "prod",
        name: "azure",
        vendor: "RHOCP"
      },
      __typename: "Resource"
    }
  ];

  const expectedResult = {
    allNodeMap: {
      applicationpacmangit: {
        __typename: "Resource",
        cluster: null,
        clusterName: null,
        id: "applicationpacmangit",
        labels: { cloud: "Azure", env: "prod", name: "azure", vendor: "RHOCP" },
        layout: {
          compactLabel: "Deployment",
          label: "Deployment",
          type: "deployment",
          uid: "applicationpacmangit"
        },
        name: "applicationpacmangit",
        namespace: "pacmangitchannel",
        specs: { isDesign: true, isDivider: true, raw: {}, row: 45 },
        topology: null,
        type: "deployment",
        uid: "applicationpacmangit"
      },
      deploymentpacmangit: {
        __typename: "Resource",
        cluster: null,
        clusterName: null,
        id: "deploymentpacmangit",
        labels: { cloud: "Azure", env: "prod", name: "azure", vendor: "RHOCP" },
        layout: {
          compactLabel: "Pod",
          label: "Pod",
          type: "pod",
          uid: "deploymentpacmangit"
        },
        name: "deploymentpacmangit",
        namespace: "pacmangitchannel",
        specs: { isDesign: true, isDivider: true, raw: {}, row: 95 },
        topology: null,
        type: "pod",
        uid: "deploymentpacmangit"
      }
    },
    nodeGroups: {
      cluster: {
        nodes: [
          {
            __typename: "Resource",
            cluster: null,
            clusterName: null,
            id: "applicationpacmangit",
            labels: {
              cloud: "Azure",
              env: "prod",
              name: "azure",
              vendor: "RHOCP"
            },
            layout: {
              compactLabel: "2 Clusters",
              label: "2 Clusters",
              type: "cluster",
              uid: "applicationpacmangit"
            },
            name: "applicationpacmangit",
            namespace: "pacmangitchannel",
            specs: {
              clusterNames: ["a", "b"],
              isDesign: true,
              isDivider: true,
              raw: {},
              row: 45
            },
            topology: null,
            type: "cluster",
            uid: "applicationpacmangit"
          },
          {
            __typename: "Resource",
            cluster: null,
            clusterName: null,
            id: "applicationpacmangit",
            labels: {
              cloud: "Azure",
              env: "prod",
              name: "azure",
              vendor: "RHOCP"
            },
            layout: {
              compactLabel: "Cluster",
              label: "Cluster",
              type: "cluster",
              uid: "applicationpacmangit"
            },
            name: "applicationpacmangit",
            namespace: "pacmangitchannel",
            specs: {
              clusterNames: ["a"],
              isDesign: true,
              isDivider: true,
              raw: {},
              row: 45
            },
            topology: null,
            type: "cluster",
            uid: "applicationpacmangit"
          }
        ]
      },
      deployment: {
        nodes: [
          {
            __typename: "Resource",
            cluster: null,
            clusterName: null,
            id: "applicationpacmangit",
            labels: {
              cloud: "Azure",
              env: "prod",
              name: "azure",
              vendor: "RHOCP"
            },
            layout: {
              compactLabel: "Deployment",
              label: "Deployment",
              type: "deployment",
              uid: "applicationpacmangit"
            },
            name: "applicationpacmangit",
            namespace: "pacmangitchannel",
            specs: { isDesign: true, isDivider: true, raw: {}, row: 45 },
            topology: null,
            type: "deployment",
            uid: "applicationpacmangit"
          }
        ]
      },
      pod: {
        nodes: [
          {
            __typename: "Resource",
            cluster: null,
            clusterName: null,
            id: "deploymentpacmangit",
            labels: {
              cloud: "Azure",
              env: "prod",
              name: "azure",
              vendor: "RHOCP"
            },
            layout: {
              compactLabel: "Pod",
              label: "Pod",
              type: "pod",
              uid: "deploymentpacmangit"
            },
            name: "deploymentpacmangit",
            namespace: "pacmangitchannel",
            specs: { isDesign: true, isDivider: true, raw: {}, row: 95 },
            topology: null,
            type: "pod",
            uid: "deploymentpacmangit"
          }
        ]
      }
    }
  };

  it("should group other nodes", () => {
    expect(
      getNodeGroups("subscription", subscriptionNodes, {
        embedPodsInDeployments: false
      })
    ).toEqual(expectedResult);
  });
});
