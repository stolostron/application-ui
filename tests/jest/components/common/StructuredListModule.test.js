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
import StructuredListModule from "../../../../src-web/components/common/StructuredListModule";
import renderer from "react-test-renderer";

describe("StructuredListModule component", () => {
  it("renders as expected", () => {
    const props = {
      data: ["item1", "item2"],
      headerRows: ["header1", "header2"],
      rows: [{ cells: [{ resourceKey: "key1" }, { resourceKey: "key2" }] }],
      url: "test_url"
    };
    const component = renderer.create(<StructuredListModule {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
