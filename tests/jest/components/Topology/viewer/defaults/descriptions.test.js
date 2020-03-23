/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/
"use strict";

import { getNodeDescription } from "../../../../../../src-web/components/Topology/viewer/defaults/descriptions";

const locale = "en-US";

describe("getNodeDescription internet node", () => {
  const internetNode = {
    type: "internet",
    namespace: "default",
    layout: {}
  };

  it("should process the node", () => {
    expect(getNodeDescription(internetNode, locale)).toEqual("default");
  });
});

describe("getNodeDescription cluster node", () => {
  const clusterNode = {
    type: "cluster",
    namespace: "default",
    layout: {},
    specs: {
      cluster: {
        clusterip: "192.168.1.1"
      }
    }
  };

  it("should process the node", () => {
    expect(getNodeDescription(clusterNode, locale)).toEqual("192.168.1.1");
  });
});

describe("getNodeDescription application node", () => {
  const applicationNode = {
    type: "application",
    namespace: "default",
    layout: {}
  };

  it("should process the node", () => {
    expect(getNodeDescription(applicationNode, locale)).toEqual("default");
  });
});

describe("getNodeDescription policy node", () => {
  const policyNode = {
    type: "policy",
    namespace: "default",
    layout: {},
    specs: {
      policy: {
        metadata: {
          annotations: {
            "policy.mcm.ibm.com/standards": "test"
          }
        }
      }
    }
  };

  it("should process the node", () => {
    expect(getNodeDescription(policyNode, locale)).toEqual("test");
  });
});

describe("getNodeDescription deployment node", () => {
  const deploymentNode = {
    type: "deployment",
    namespace: "default",
    layout: {
      hasPods: true,
      pods: [
        {
          name: "pod1"
        },
        {
          name: "pod2"
        }
      ]
    }
  };

  it("should process the node", () => {
    expect(getNodeDescription(deploymentNode, locale)).toEqual(
      "{0} of {1} pods"
    );
  });
});
