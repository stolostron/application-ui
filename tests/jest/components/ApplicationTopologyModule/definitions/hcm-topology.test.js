// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

import { getTopologyElements } from "../../../../../src-web/components/ApplicationTopologyModule/definitions/hcm-topology";

describe("hcmtopology-tests", () => {
  it("getTopologyElements", () => {
    const resourceItem = {
      nodes: [],
      links: []
    };

    expect(getTopologyElements(resourceItem).topo_links).toMatchObject([]);
    expect(getTopologyElements(resourceItem).topo_clusters).toMatchObject([]);
  });

  it("getTopologyElements-withLinks", () => {
    const resourceItem = {
      nodes: [],
      links: [{ from: { uid: 123 }, to: { uid: 456 }, type: "testing" }]
    };

    expect(getTopologyElements(resourceItem).topo_links).toMatchObject([
      { label: "testing", source: 123, target: 456, type: "testing", uid: 579 }
    ]);
    expect(getTopologyElements(resourceItem).topo_clusters).toMatchObject([]);
  });

  it("getTopologyElements-oneNode", () => {
    const resourceItem = {
      nodes: [{ id: 1, type: "pod" }],
      links: []
    };

    expect(getTopologyElements(resourceItem).topo_links).toMatchObject([]);
    expect(getTopologyElements(resourceItem).topo_clusters).toMatchObject([]);
  });

  it("getTopologyElements-withNodes", () => {
    const resourceItem = {
      nodes: [
        { id: 1, name: "n1", type: "application" },
        { id: 2, name: "n2", type: "unmanaged" },
        { id: 3, name: "n1", type: "application" },
        { id: 4, name: "n2", type: "unmanaged" }
      ],
      links: []
    };

    expect(getTopologyElements(resourceItem).topo_links).toMatchObject([]);
    expect(getTopologyElements(resourceItem).topo_clusters).toMatchObject([]);
  });
});
