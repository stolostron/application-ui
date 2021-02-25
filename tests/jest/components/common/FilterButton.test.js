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
import Button from "../../../../src-web/components/common/FilterButton";
import renderer from "react-test-renderer";

describe("FilterButton component", () => {
  it("renders as expected", () => {
    const component = renderer.create(<Button />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
