/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

import hcmapplicationdiagram from "../../../../../src-web/components/ApplicationTopologyModule/definitions/hcm-application-diagram";
import hcmtopology from "../../../../../src-web/components/ApplicationTopologyModule/definitions/hcm-topology";

describe("hcmapplicationdiagram-tests", () => {
  it("mergeDefinitions", () => {
    const topologyDefs = { getTopologyElements: 123 };
    expect(hcmapplicationdiagram.mergeDefinitions(topologyDefs)).toMatchObject({
      getTopologyElements: 123
    });
  });

  it("mergeDefinitions2", () => {
    const topologyDefs = {};
    expect(hcmapplicationdiagram.mergeDefinitions(topologyDefs)).toMatchObject(
      {}
    );
  });

  it("getActiveChannel", () => {
    expect(hcmapplicationdiagram.getActiveChannel("key")).toBeUndefined();
  });

  it("getDiagramElements", () => {
    const topology = {
      loaded: true,
      status: "ERROR",
      reloading: false,
      fetchFilters: { application: { channel: "channel1" } }
    };
    expect(
      hcmapplicationdiagram.getDiagramElements(
        topology,
        "key",
        "name",
        "namespace"
      ).nodes
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
      hcmapplicationdiagram.getDiagramElements(
        topology,
        "key",
        "name",
        "namespace"
      ).nodes
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
      hcmapplicationdiagram.getDiagramElements(
        topology,
        "key",
        "name",
        "namespace"
      ).nodes
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
    hcmapplicationdiagram.addDiagramDetails(
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
    hcmapplicationdiagram.addDiagramDetails(
      topology,
      [],
      [],
      "channel",
      "key",
      false,
      "default"
    );
  });

  it("addDiagramDetails3", () => {
    const pods = [];
    const topology = {
      detailsLoaded: true,
      status: "IN_PROGRESS",
      detailsReloading: true,
      pods: pods
    };
    hcmapplicationdiagram.addDiagramDetails(
      topology,
      [],
      [],
      "channel",
      "key",
      true,
      "default"
    );
  });
});
