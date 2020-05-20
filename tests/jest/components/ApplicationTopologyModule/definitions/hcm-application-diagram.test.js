/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

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
        id: "--clusters--app",
        type: "application",
        name: "aa",
        namespace: "ns"
      },
      {
        type: "deployment",
        id: "--clusters--depl",
        name: "depl",
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
      }
    ];

    const topology = {
      loaded: true,
      detailsLoaded: true,
      status: "DONE",
      nodes: nodes
    };
    expect(
      getDiagramElements(topology, "key", "name", "namespace").nodes
    ).toMatchObject([
      {
        id: "--clusters--app",
        name: "aa",
        namespace: "ns",
        type: "application"
      },
      {
        id: "--clusters--depl",
        name: "depl",
        specs: {
          raw: {
            spec: { template: { spec: { containers: [{ name: "c1" }] } } }
          },
          row: 0
        },
        type: "deployment"
      }
    ]);
  });
});
