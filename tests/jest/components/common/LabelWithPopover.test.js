// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
"use strict";

import React from "react";
import { Icon } from "carbon-components-react";
import LabelWithPopover from "../../../../src-web/components/common/LabelWithPopover";
import { mount } from "enzyme";

describe("LabelWithPopover", () => {
  it("renders as expected", () => {
    const component = mount(
      <LabelWithPopover
        labelIcon={<Icon name="icon--launch" />}
        labelContent="TheLabel"
      >
        <p>ThePopoverContent</p>
      </LabelWithPopover>
    );
    component
      .find(".pf-c-label__content")
      .at(0)
      .simulate("click", { nativeEvent: { preventDefault: () => undefined } });
    expect(component.render()).toMatchSnapshot();
  });

  it("renders as expected in red", () => {
    const component = mount(
      <LabelWithPopover
        labelIcon={<Icon name="icon--launch" />}
        labelContent="TheLabel"
        labelColor="red"
      >
        <p>ThePopoverContent</p>
      </LabelWithPopover>
    );
    expect(component.render()).toMatchSnapshot();
  });
});
