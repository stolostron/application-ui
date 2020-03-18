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
import Notification from "../../../../src-web/components/common/Notification";
import renderer from "react-test-renderer";

describe("Notification component", () => {
  it("renders as expected", () => {
    const component = renderer.create(<Notification />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("renders as expected", () => {
    const props = {
      allowClose: true,
      renderNotificationContent() {}
    };
    const component = renderer.create(<Notification {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
