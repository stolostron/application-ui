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
import TruncateText from "../../../../src-web/components/common/TruncateText";
import renderer from "react-test-renderer";

describe("TruncateText", () => {
  it("renders as expected for truncated text", () => {
    const props = { maxCharacters: 7, text: "TruncateText" };
    const component = renderer.create(<TruncateText {...props} />);
    expect(component.getInstance().render().props).toMatchSnapshot();
  });

  it("renders as expected for non truncated text", () => {
    const props = { maxCharacters: 25, text: "NonTruncateText" };
    const component = renderer.create(<TruncateText {...props} />);
    expect(component).toMatchSnapshot();
  });
});
