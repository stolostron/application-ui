/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
"use strict";

import React from "react";
import Page from "../../../../src-web/components/common/Page";
import renderer from "react-test-renderer";

describe("NoResource component", () => {
  it("renders as expected", () => {
    const component = renderer.create(
      <Page>
        <div className="child">Test</div>
      </Page>
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
