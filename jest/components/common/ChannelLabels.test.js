// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
"use strict";

import React from "react";
import ChannelLabels from "../../../../src-web/components/common/ChannelLabels";
import { mount } from "enzyme";
import toJson from "enzyme-to-json";

const channels = [
  {
    type: "GitHub",
    pathname: "https://github.com/org/repo.git",
    gitBranch: "main",
    gitPath: "mortgage"
  },
  {
    type: "git",
    pathname: "https://github.com/org/repo2.git",
    gitBranch: undefined,
    gitPath: undefined
  },
  {
    type: "HelmRepo",
    pathname: "https://myhelmrepo.com/repo-index",
    package: "AppChart",
    packageFilterVersion: "0.9"
  },
  {
    type: "ObjectBucket",
    pathname: "https://myobjects.com/bucket-738938"
  },
  {
    type: "namespace",
    pathname: "sample-ns"
  },
  {
    // channel with no type (not displayed)
    pathname: "foo"
  }
];

const component = mount(<ChannelLabels channels={channels} />);

const componentWithoutAttributes = mount(<ChannelLabels channels={channels} />);

describe("ChannelLabels", () => {
  const verifyLabels = component => {
    const labels = component.find("Label");
    expect(labels.length).toBe(4);
    expect(labels.at(0).text()).toContain("Git");
    expect(labels.at(0).text()).toContain("(2)");
    expect(labels.at(1).text()).toContain("Helm");
    expect(labels.at(2).text()).toContain("Namespace");
    expect(labels.at(3).text()).toContain("Object storage");
  };

  it("renders as expected", () => {
    verifyLabels(component);
  });

  it("renders as expected without subscription attributes", () => {
    verifyLabels(componentWithoutAttributes);
  });
});
