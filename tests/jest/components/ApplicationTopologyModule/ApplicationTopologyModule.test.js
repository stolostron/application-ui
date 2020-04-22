/*******************************************************************************
 * Licensed Materials - Property of Red Hat
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const React = require("../../../../node_modules/react");

import ApplicationTopologyModule from "../../../../src-web/components/ApplicationTopologyModule/ApplicationTopologyModule.js";

import renderer from "react-test-renderer";
import * as reducers from "../../../../src-web/reducers";
import { mount } from "enzyme";

import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

const preloadedState = window.__PRELOADED_STATE__;
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = [thunkMiddleware];

const store = createStore(
  combineReducers(reducers),
  preloadedState,
  composeEnhancers(applyMiddleware(...middleware))
);

describe("ApplicationTopologyModule with selected node ID", () => {
  it("ApplicationTopologyModule renders correctly when topology is not expanded", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <Provider store={store}>
            <ApplicationTopologyModule
              selectedNodeId={nodeID}
              showExpandedTopology={false}
              params={params}
              locale={"en-US"}
            />
          </Provider>
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("ApplicationTopologyModule renders correctly when topology is expanded", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <Provider store={store}>
            <ApplicationTopologyModule
              selectedNodeId={nodeID}
              showExpandedTopology={true}
              params={params}
              locale={"en-US"}
            />
          </Provider>
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("ApplicationTopologyModule renders correctly when topology is expanded click", () => {
    const wrapper = mount(
      <BrowserRouter>
        <Provider store={store}>
          <ApplicationTopologyModule
            selectedNodeId={nodeID}
            showExpandedTopology={true}
            params={params}
            locale={"en-US"}
          />
        </Provider>
      </BrowserRouter>
    );

    wrapper
      .find(".bx--search-input")
      .at(0)
      .simulate("change");
  });
});

const nodeID = "acb123";

const params = {
  name: "app1",
  namespace: "default"
};
