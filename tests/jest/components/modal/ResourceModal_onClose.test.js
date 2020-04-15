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
import React from "react";

import ResourceModal from "../../../../src-web/components/modals/ResourceModal";
import { mount } from "enzyme";
import * as reducers from "../../../../src-web/reducers";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { resourceModalLabels } from "./ModalsTestingData";
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

  const data = {
    clusterName: "",
    kind: "",
    name: "guestbook-app",
    namespace: "default",
    selfLink:
      "/apis/app.k8s.io/v1beta1/namespaces/default/applications/guestbook-app",
    _uid: "0221dae9-b6b9-40cb-8cba-473011a750e0"
  };
  it("renders as expected without mocked data, to cover this.client onClose", () => {
    const component = mount(
      <BrowserRouter>
        <ResourceModal
          handleClose={handleModalClose}
          handleSubmit={handleModalSubmit}
          label={resourceModalLabels}
          locale={"en"}
          open={true}
          resourceType={resourceType}
          store={store}
          data={data}
        />
      </BrowserRouter>
    );
    expect(toJson(component.instance())).toMatchSnapshot();
    expect(toJson(component.update())).toMatchSnapshot();
    expect(toJson(component)).toMatchSnapshot();

    component.find({ id: "resource-modal-container" }).simulate("keydown");

    component
      .find(".modal-with-editor")
      .at(0)
      .simulate("click");
    component
      .find(".modal-with-editor")
      .at(0)
      .simulate("close");
    component
      .find(".modal-with-editor")
      .at(0)
      .simulate("keydown");

    component
      .find(".bx--modal-close")
      .at(0)
      .simulate("click");

    component
      .find(".bx--btn--primary")
      .at(0)
      .simulate("click");
    component
      .find(".bx--btn--secondary")
      .at(0)
      .simulate("click");
  });
});
