// Copyright (c) 2020 Red Hat, Inc.
"use strict";

import React from "react";
import ChannelLabels from "../../../../src-web/components/common/ChannelLabels";
import renderer from "react-test-renderer";

const channels = [
  {
    type: "GitHub",
    pathname: "https://github.com/org/repo.git",
    gitBranch: "master",
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

describe("ChannelLabels", () => {
  const component = renderer.create(<ChannelLabels channels={channels} />);
  it("renders as expected", () => {
    expect(component.toJSON()).toMatchSnapshot();
  });

  const componentWithoutAttributes = renderer.create(
    <ChannelLabels channels={channels} showSubscriptionAttributes={false} />
  );
  it("renders as expected without subscription attributes", () => {
    expect(componentWithoutAttributes.toJSON()).toMatchSnapshot();
  });
});
