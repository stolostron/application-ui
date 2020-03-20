/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
"use strict";

import React from "react";
import ResourceModal from "../../../../src-web/components/modals/ResourceModalRedux";
import { mount } from "enzyme";
import * as reducers from "../../../../src-web/reducers";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import {
  resourceModalData,
  resourceModalReduxLabels
} from "./ModalsTestingData";
import toJson from "enzyme-to-json";
import { BrowserRouter } from "react-router-dom";

describe("ResourceModal test", () => {
  const handleModalClose = jest.fn();
  const handleModalSubmit = jest.fn();
  const resourceType = { name: "HCMApplication", list: "HCMApplicationList" };
  const preloadedState = window.__PRELOADED_STATE__;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const middleware = [thunkMiddleware];
  const store = createStore(
    combineReducers(reducers),
    preloadedState,
    composeEnhancers(applyMiddleware(...middleware))
  );

  it("renders as expected 1", () => {
    const component = mount(
      <BrowserRouter>
        <ResourceModal
          data={resourceModalData}
          handleClose={handleModalClose}
          handleSubmit={handleModalSubmit}
          label={resourceModalReduxLabels}
          locale={"en"}
          open={true}
          resourceType={resourceType}
          store={store}
        />
      </BrowserRouter>
    );
    expect(toJson(component.instance())).toMatchSnapshot();
    expect(toJson(component.update())).toMatchSnapshot();
    expect(toJson(component)).toMatchSnapshot();
  });
});
