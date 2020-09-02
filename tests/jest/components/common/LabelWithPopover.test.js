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
