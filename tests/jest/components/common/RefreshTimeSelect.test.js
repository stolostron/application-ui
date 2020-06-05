/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

"use strict";

import React from "react";
// import Tag from "../../../../src-web/components/common/FilterTag";
// import renderer from "react-test-renderer";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { BrowserRouter } from "react-router-dom";
import { REFRESH_TIMES } from "../../../../lib/shared/constants";
import { reduxStoreAppPipeline } from "../../components/TestingData";
import RefreshTimeSelect from "../../../../src-web/components/common/RefreshTimeSelect";

const mockStore = configureMockStore();
const storeApp = mockStore(reduxStoreAppPipeline);

describe("RefreshTimeSelect component", () => {
  it("Click and Keydown actions", () => {
    const refetchIntervalUpdate = jest.fn();

    const wrapper = mount(
      <BrowserRouter>
        <Provider store={storeApp}>
          <RefreshTimeSelect
            locale="en"
            isReloading={false}
            refetchIntervalUpdate={refetchIntervalUpdate}
            refreshCookie="test-cookie-refresh"
            refreshValues={REFRESH_TIMES}
          />
        </Provider>
      </BrowserRouter>
    );

    wrapper.find("#refreshButton").simulate("click");
    wrapper.find("#refreshButton").simulate("keydown", { keyCode: 13 });

    // not enter key
    wrapper.find("#refreshButton").simulate("keydown", { keyCode: 11 });

    // wrapper.find("#refreshDropdown").simulate('change',{ selectedItem:  {label: "Refresh every 5m", pollInterval: 300000}} );
  });
});
