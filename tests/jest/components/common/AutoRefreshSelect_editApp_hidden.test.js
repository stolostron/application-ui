// Copyright (c) 2021 Red Hat, Inc.
"use strict";
import React from "react";
import AutoRefreshSelect from "../../../../src-web/components/common/AutoRefreshSelect";
import renderer from "react-test-renderer";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import thunkMiddleware from "redux-thunk";
import configureMockStore from "redux-mock-store";

import { reduxStoreAppPipelineWithCEM } from "../TestingData";

const middleware = [thunkMiddleware];
const mockStore = configureMockStore(middleware);
const storeSingleApp = mockStore(reduxStoreAppPipelineWithCEM);

const locationEditApp = {
  pathname: "/multicloud/applications/appNS/appName/edit"
};

describe("AutoRefreshSelect hidden on edit app", () => {
  it("is hidden on edit app", () => {
    const tree = renderer.create(
      <BrowserRouter>
        <Provider store={storeSingleApp}>
          <AutoRefreshSelect route={locationEditApp} />
        </Provider>
      </BrowserRouter>
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
