// Copyright (c) 2020 Red Hat, Inc.
"use strict";

import React from "react";
import ChannelLabels from "../../../../src-web/components/common/ChannelLabels";
import renderer from "react-test-renderer";

describe("ChannelLabels", () => {
  it("renders as expected", () => {
    const component = renderer.create(
      <ChannelLabels
        channels={[
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
          { type: "namespace", pathname: "sample-ns" }
        ]}
      />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
