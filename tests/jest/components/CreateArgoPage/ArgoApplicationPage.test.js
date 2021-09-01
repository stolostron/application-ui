// Copyright (c) 2021 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

const React = require("react");

import renderer from "react-test-renderer";
import * as reducers from "../../../../src-web/reducers";

import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import ArgoCreationPage from "../../../../src-web/components/ArgoCreationPage/ArgoCreationPage";

const middleware = [thunkMiddleware];
const preloadedState = window.__PRELOADED_STATE__;
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  combineReducers(reducers),
  preloadedState,
  composeEnhancers(applyMiddleware(...middleware))
);

const locale = "en-US";
describe("ArgoCreationPage creating application set", () => {
  it("ArgoCreationPage renders correctly when creating application", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <Provider store={store}>
            <ArgoCreationPage
              params={params}
              serverProps={{
                title: "Red Hat Advanced Cluster Management for Kubernetes",
                context: { locale: "en-US" }
              }}
              secondaryHeaderProps={{ title: "title: 'argo.create.title' " }}
            />
          </Provider>
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

const params = {
  name: "appset1",
  namespace: "default"
};
