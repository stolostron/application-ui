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
import { TimeWindow } from "../../../../../src-web/components/ApplicationCreationPage/components/TimeWindow";
import renderer from "react-test-renderer";
import _ from "lodash";
import { shallow } from "enzyme";

const handleChange = jest.fn((checked, event) => {
  return null;
});

const validation = jest.fn(exceptions => {
  return null;
});

const summarizeFn = jest.fn(() => {
  return null;
});

const controlNoWindow = {
  active: {
    days: [],
    mode: "",
    showTimeSection: false,
    timeList: [{ id: 0, start: "", end: "", validTime: true }],
    timeListID: 1,
    timezone: ""
  }
};

const controlActive = {
  active: {
    days: ['"Monday"'],
    mode: "active",
    showTimeSection: false,
    timeList: [
      { id: 0, start: "11:20am", end: "11:30am", validTime: true },
      { id: 1, start: "12:20am", end: "12:30am", validTime: true }
    ],
    timeListID: 2,
    timezone: '"America/Toronto"'
  },
  validation: validation,
  summarize: summarizeFn
};

describe("TimeWindow component default, no-window selected", () => {
  it("basic UI snapshot validation", () => {
    const component = renderer.create(
      <TimeWindow
        locale="en-US"
        type="custom"
        available={[]}
        control={controlNoWindow}
        handleChange={handleChange}
      />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});

describe("TimeWindow component default, window selected", () => {
  it("snapshot validation with time window set", () => {
    const component = renderer.create(
      <TimeWindow
        locale="en-US"
        type="custom"
        available={[]}
        control={controlNoWindow}
        handleChange={handleChange}
      />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});

describe("TimeWindow component, active window selected", () => {
  it("active window components coverage", () => {
    const wrapper = shallow(
      <TimeWindow
        locale="en-US"
        type="custom"
        available={[]}
        control={controlActive}
        handleChange={handleChange}
      />
    );
    const evt = {
      target: {
        name: "timeWindow-mode-container",
        value: "value-testing"
      },
      selectedItems: ["selectedItems-testing-1", "selectedItems-testing-2"]
    };

    wrapper
      .find("#default-mode-undefined")
      .at(0)
      .simulate("click", evt);
    wrapper
      .find("#active-mode-undefined")
      .at(0)
      .simulate("click", evt);
    wrapper
      .find("#blocked-mode-undefined")
      .at(0)
      .simulate("click", evt);
    wrapper
      .find("#time-window-header")
      .at(0)
      .simulate("keypress", evt);

    wrapper
      .find("#time-window-header")
      .at(0)
      .simulate("click", evt);

    const evtDaySelector = {
      target: {
        name: "days-selector",
        value: "value-testing",
        id: "day-0-input"
      },
      selectedItems: ["selectedItems-testing-1", "selectedItems-testing-2"]
    };

    wrapper
      .find("#active-mode-undefined")
      .at(0)
      .simulate("change", true, evt);

    wrapper
      .find(".config-timezone-combo-box")
      .at(0)
      .simulate("change");
    wrapper
      .find(".config-timezone-combo-box")
      .at(0)
      .simulate("change", '"America/Toronto"');

    wrapper
      .find(".config-timezone-combo-box")
      .at(0)
      .simulate("filter", evt);

    wrapper
      .find("#tue-undefined")
      .at(0)
      .simulate("change", true, evt);

    wrapper
      .find("#tue-undefined")
      .at(0)
      .simulate("change", true, evtDaySelector);

    wrapper
      .find("#tue-undefined")
      .at(0)
      .simulate("change", false, evtDaySelector);

    wrapper.find("#start-time-0-undefined").simulate("click", true, evt);

    const evtTimeSelector = {
      target: {
        name: "time-selector",
        value: "11:20am",
        id: "start-time-0-undefined-input"
      }
    };
    //test time picker
    wrapper
      .find("TimePicker")
      .at(0)
      .simulate("change", "11:20am", evtTimeSelector);
    wrapper
      .find("TimePicker")
      .at(0)
      .simulate("change", "11:20", evtTimeSelector);
    wrapper
      .find("TimePicker")
      .at(0)
      .simulate("change", "", evtTimeSelector);
    wrapper
      .find("TimePicker")
      .at(0)
      .simulate("change", "badTime", evtTimeSelector);

    wrapper.find(".add-time-btn").simulate("click", true, evtTimeSelector);

    //test time picker
    wrapper
      .find(".remove-time-btn")
      .at(0)
      .simulate("click", evtTimeSelector);

    wrapper
      .find(".remove-time-btn")
      .at(0)
      .simulate("keypress", evtTimeSelector);
  });
});
