/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc.
*/
"use strict";

import React from "react";
import ControlPanel from "../../../../../src-web/components/TemplateEditor/components/ControlPanel";
import renderer from "react-test-renderer";

import { controlData } from "../../TestingData";

describe("ControlPanel component", () => {
  it("renders as expected", () => {
    const component = renderer.create(
      <ControlPanel
        controlData={controlData}
        notifications={[]}
        showEditor={"true"}
        locale={"en-US"}
      />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
