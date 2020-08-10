/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

"use strict";

import React from "react";
import { TimeWindow } from "../../../../../src-web/components/ApplicationCreationPage/components/TimeWindow";
import renderer from "react-test-renderer";
import _ from "lodash";
import { mount } from "enzyme";

const control = {
  active: {}
};

describe("TimeWindow component", () => {
  it("renders as expected", () => {
    const component = renderer.create(
      <TimeWindow
        locale="en-US"
        type="custom"
        available={[]}
        control={control}
      />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});

describe("on control change function", () => {
  it("renders as expected", () => {
    const wrapper = mount(
      <TimeWindow
        locale="en-US"
        type="custom"
        available={[]}
        control={control}
      />
    );
    const evt = {
      target: {
        value: "value-testing"
      },
      selectedItems: ["selectedItems-testing-1", "selectedItems-testing-2"]
    };

    wrapper
      .find("#default-mode")
      .at(0)
      .simulate("click", evt);
    wrapper
      .find("#active-mode")
      .at(0)
      .simulate("click", evt);
    wrapper
      .find("#block-mode")
      .at(0)
      .simulate("click", evt);
    wrapper
      .find(".bx--accordion__item")
      .at(0)
      .simulate("keypress", evt);

    wrapper
      .find(".bx--accordion__heading")
      .at(0)
      .simulate("click", evt);

    wrapper
      .find("#tues")
      .at(0)
      .simulate("click", evt);
  });
});
