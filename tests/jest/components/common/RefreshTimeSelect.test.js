/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

"use strict";

import React from "react";
// import Tag from "../../../../src-web/components/common/FilterTag";
// import renderer from "react-test-renderer";
import { mount, shallow } from "enzyme";
// import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
// import { BrowserRouter } from "react-router-dom";
import { REFRESH_TIMES } from "../../../../lib/shared/constants";
import { reduxStoreAppPipeline } from "../../components/TestingData";
import RefreshTimeSelect from "../../../../src-web/components/common/RefreshTimeSelect";
import renderer from "react-test-renderer";

const mockStore = configureMockStore();
const storeApp = mockStore(reduxStoreAppPipeline);

describe("RefreshTimeSelect component", () => {
  const refetchIntervalUpdate = jest.fn();

  it("renders as expected", () => {
    const component = renderer.create(
      <RefreshTimeSelect
        locale="en"
        isReloading={false}
        refetchIntervalUpdate={refetchIntervalUpdate}
        refreshValues={REFRESH_TIMES}
      />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("renders as expected - reloading = true", () => {
    const component = renderer.create(
      <RefreshTimeSelect
        locale="en"
        isReloading={true}
        refetchIntervalUpdate={refetchIntervalUpdate}
        refreshValues={REFRESH_TIMES}
      />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it("Click and Keydown actions", () => {
    const refreshTimeSelect = shallow(
      <RefreshTimeSelect
        locale="en"
        isReloading={false}
        refetchIntervalUpdate={refetchIntervalUpdate}
        refreshValues={REFRESH_TIMES}
      />
    );

    // manually trigger a props update
    refreshTimeSelect.setProps({ abc: 123 });

    refreshTimeSelect.find("#refreshButton").simulate("click");
    refreshTimeSelect.update();

    refreshTimeSelect
      .find("#refreshButton")
      .simulate("keyPress", { key: "Enter" });
    refreshTimeSelect.update();
    // not enter key
    refreshTimeSelect.find("#refreshButton").simulate("keyPress", { key: "x" });
    refreshTimeSelect.update();

    refreshTimeSelect.find("DropdownV2").simulate("change", {
      selectedItem: { label: "Refresh every 5m", pollInterval: 300000 }
    });
    refreshTimeSelect.update();

    refreshTimeSelect.find("#refreshButton").simulate("click");
    refreshTimeSelect.update();
  });

  it("renders as expected - empty refresh values", () => {
    const component = renderer.create(
      <RefreshTimeSelect
        locale="en"
        isReloading={true}
        refetchIntervalUpdate={refetchIntervalUpdate}
        refreshValues={null}
      />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
