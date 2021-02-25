/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 ****************************************************************************** */
"use strict";

import React from "react";
import ScrollBox from "../../../../src-web/components/modals/ScrollBox";
import renderer from "react-test-renderer";

describe("ScrollBox", () => {
  it("renders ok as expected", () => {
    const props = {
      className: "hcmapplication",
      content: "test"
    };
    const component = renderer.create(<ScrollBox {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
