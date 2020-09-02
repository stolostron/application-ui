/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
"use strict";

import React from "react";
import { Icon } from "carbon-components-react";
import ChannelLabels from "../../../../src-web/components/common/ChannelLabels";
import renderer from "react-test-renderer";

describe("ChannelLabels", () => {
  it("renders as expected", () => {
    const component = renderer.create(
      <ChannelLabels
        channels={[
          { type: "GitHub", pathname: "https://github.com/org/repo.git" },
          { type: "git", pathname: "https://github.com/org/repo2.git" },
          { type: "namespace", pathname: "sample-ns" }
        ]}
      />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
