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
import RefreshTime from "../../../../src-web/components/common/RefreshTime";
import renderer from "react-test-renderer";

describe("RefreshTime component", () => {
  it("renders as expected", () => {
    const component = renderer.create(<RefreshTime />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("renders as expected", () => {
    const props = {
      reloading: true,
      timestamp: "03:34:07",
      refetch() {}
    };
    const component = renderer.create(<RefreshTime {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
