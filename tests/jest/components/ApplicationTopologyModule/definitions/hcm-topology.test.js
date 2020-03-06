/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

import hcmtopology from "../../../../../src-web/components/ApplicationTopologyModule/definitions/hcm-topology";

describe("hcmtopology-tests", () => {
  it("getTopologyElements", () => {
    const resourceItem = {
      nodes: [],
      links: []
    };

    expect(hcmtopology.getTopologyElements(resourceItem).links).toMatchObject(
      []
    );
    expect(
      hcmtopology.getTopologyElements(resourceItem).clusters
    ).toMatchObject([]);
  });

  it("getTopologyElements-withLinks", () => {
    const resourceItem = {
      nodes: [],
      links: [{ from: { uid: 123 }, to: { uid: 456 }, type: "testing" }]
    };

    expect(hcmtopology.getTopologyElements(resourceItem).links).toMatchObject([
      { label: "testing", source: 123, target: 456, type: "testing", uid: 579 }
    ]);
    expect(
      hcmtopology.getTopologyElements(resourceItem).clusters
    ).toMatchObject([]);
  });

  it("getTopologyElements-oneNode", () => {
    const resourceItem = {
      nodes: [{ id: 1, type: "pod" }],
      links: []
    };

    expect(hcmtopology.getTopologyElements(resourceItem).links).toMatchObject(
      []
    );
    expect(
      hcmtopology.getTopologyElements(resourceItem).clusters
    ).toMatchObject([]);
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

    expect(hcmtopology.getTopologyElements(resourceItem).links).toMatchObject(
      []
    );
    expect(
      hcmtopology.getTopologyElements(resourceItem).clusters
    ).toMatchObject([]);
  });
});
