/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
"use strict";
jest.mock("../../../../lib/client/apollo-client", () => ({
  getClient: jest.fn(() => {
    return null;
  }),
  getLogs: jest.fn(() => {
    const data = {
      data: {
        logs: [{ name: "aa" }]
      }
    };
    return Promise.resolve(data);
  }),
  getResource: jest.fn(() => {
    const data = {
      data: {
        items: [
          {
            containers: [{ name: "contName" }],
            cluster: {
              metadata: {
                name: "clsName"
              }
            },
            metadata: {
              name: "guestbook-app",
              namespace: "default"
            }
          }
        ]
      }
    };

    return Promise.resolve(data);
  })
}));

import React from "react";
import LogsModal from "../../../../src-web/components/modals/LogsModal";
import { mount } from "enzyme";
import * as reducers from "../../../../src-web/reducers";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { resourceModalData, resourceModalLabels } from "./ModalsTestingData";
import toJson from "enzyme-to-json";
import { BrowserRouter } from "react-router-dom";

describe("LogsModal test", () => {
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
        <LogsModal
          data={resourceModalData}
          handleClose={handleModalClose}
          handleSubmit={handleModalSubmit}
          label={resourceModalLabels}
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

    component
      .find(".bx--modal")
      .at(0)
      .simulate("click");
    component
      .find(".bx--modal")
      .at(0)
      .simulate("keydown");

    component
      .find(".bx--modal-close")
      .at(0)
      .simulate("click");

    component
      .find(".bx--dropdown")
      .at(0)
      .simulate("click");
    component
      .find(".bx--dropdown")
      .at(0)
      .simulate("keydown");

    component
      .find(".bx--list-box__field")
      .at(0)
      .simulate("click");
    component
      .find(".bx--list-box__field")
      .at(0)
      .simulate("keydown");
  });
});
