// Copyright (c) 2020 Red Hat, Inc.
"use strict";

import React from "react";
import { Icon } from "carbon-components-react";
import LabelWithPopover from "../../../../src-web/components/common/LabelWithPopover";
import renderer from "react-test-renderer";

describe("LabelWithPopover", () => {
  it("renders as expected", () => {
    const component = renderer.create(
      <LabelWithPopover
        labelIcon={<Icon name="icon--launch" />}
        labelContent="TheLabel"
      >
        ThePopoverContent
      </LabelWithPopover>
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
