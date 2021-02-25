/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 ****************************************************************************** */
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

"use strict";

import React from "react";
import { ClusterSelector } from "../../../../../src-web/components/ApplicationCreationPage/components/ClusterSelector";
import renderer from "react-test-renderer";
import _ from "lodash";
import { mount } from "enzyme";

const control = {
  active: {
    mode: true,
    clusterLabelsList: [
      {
        id: 0,
        labelName: "env",
        labelValue: "Dev",
        validValue: true
      },
      {
        id: 1,
        labelName: "cloud",
        labelValue: "AWS",
        validValue: true
      }
    ]
  }
};

describe("ClusterSelector component", () => {
  it("renders as expected", () => {
    const component = renderer.create(
      <ClusterSelector
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
      <ClusterSelector
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
      .find("#clusterSelector-checkbox-undefined")
      .at(0)
      .simulate("change", evt);
    wrapper
      .find(".bx--accordion__item")
      .at(0)
      .simulate("keypress", evt);

    wrapper
      .find(".bx--accordion__heading")
      .at(0)
      .simulate("click", evt);
  });
});
