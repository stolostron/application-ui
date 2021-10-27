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
import ClusterSelector from "../../../../../src-web/components/common/ClusterSelector";
import renderer from "react-test-renderer";
import _ from "lodash";
import { shallow } from "enzyme";

const handleChange = jest.fn((value, targetName, targetID) => {
  return null;
});

const validation = jest.fn(exceptions => {
  return null;
});

const summarizeFn = jest.fn(() => {
  return null;
});

const emptyControl = {
  active: {},
  validation: validation,
  summarize: summarizeFn
};

const emptyControlShowData = {
  active: {},
  showData: [
    {
      id: 0,
      labelName: "name",
      labelValue: "ui-e2e-remote",
      validValue: true
    }
  ],
  validation: validation,
  summarize: summarizeFn
};

const controlActive = {
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
    ],
    clusterLabelsListID: 2
  },
  validation: validation,
  summarize: summarizeFn
};

describe("ClusterSelector component", () => {
  it("renders full control", () => {
    const component = renderer.create(
      <ClusterSelector
        locale="en-US"
        type="custom"
        available={[]}
        control={controlActive}
        handleChange={handleChange}
      />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("renders empty control", () => {
    const component = renderer.create(
      <ClusterSelector
        locale="en-US"
        type="custom"
        available={[]}
        control={emptyControl}
        handleChange={handleChange}
      />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("renders empty control with data set", () => {
    const component = renderer.create(
      <ClusterSelector
        locale="en-US"
        type="custom"
        available={[]}
        control={emptyControlShowData}
        handleChange={handleChange}
      />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});

describe("on control change function", () => {
  it("renders active control", () => {
    const wrapper = shallow(
      <ClusterSelector
        locale="en-US"
        type="custom"
        available={[]}
        control={controlActive}
        handleChange={handleChange}
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
      .simulate("change", true);
    wrapper
      .find("#labels-header")
      .at(0)
      .simulate("keypress", evt);

    wrapper
      .find("#labels-header")
      .at(0)
      .simulate("click", evt);

    wrapper.find(".add-label-btn").simulate("click", true, controlActive);
    wrapper.find(".add-label-btn").simulate("keypress", { type: "click" });

    wrapper.find("#labelName-0-undefined").simulate("change", true);
    wrapper.find("#labelValue-0-undefined").simulate("change", true);

    //
    wrapper
      .find(".remove-label-btn")
      .at(0)
      .simulate("click", true);
  });
});
