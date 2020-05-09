/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/
"use strict";

import {
  getNodePropery,
  addPropertyToList,
  nodeMustHavePods
} from "../../../../../../src-web/components/Topology/utils/diagram-helpers";

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

describe("nodeMustHavePods undefined data", () => {
  it("nodeMustHavePods", () => {
    expect(nodeMustHavePods(undefined)).toEqual(false);
  });
});

describe("nodeMustHavePods node with no pods data", () => {
  const node = {
    specs: {
      raw: {
        spec: {}
      }
    }
  };
  it("nodeMustHavePods", () => {
    expect(nodeMustHavePods(node)).toEqual(false);
  });
});

describe("nodeMustHavePods node with pods data", () => {
  const node = {
    specs: {
      raw: {
        spec: {
          replicas: 2
        }
      }
    }
  };
  it("nodeMustHavePods", () => {
    expect(nodeMustHavePods(node)).toEqual(true);
  });
});
