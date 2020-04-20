/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
jest.mock("../../../../lib/client/apollo-client", () => ({
  getSearchClient: jest.fn(() => {
    return null;
  }),
  getResource: jest.fn((resourceType, { namespace }) => {
    return Promise.resolve(undefined);
  })
}));

const React = require("../../../../node_modules/react");

import IncidentsTab from "../../../../src-web/containers/IncidentsTab";

import renderer from "react-test-renderer";
import * as reducers from "../../../../src-web/reducers";

import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import configureMockStore from "redux-mock-store";

import { reduxStoreAppPipelineWithCEM } from "../../components/TestingData";

const mockStore = configureMockStore();
const storeApp = mockStore(reduxStoreAppPipelineWithCEM);
const preloadedState = window.__PRELOADED_STATE__;
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = [thunkMiddleware];

const store = createStore(
  combineReducers(reducers),
  preloadedState,
  composeEnhancers(applyMiddleware(...middleware))
);

const secondaryHeaderProps = { title: "routes.applications" };

const incidents = [
  {
    createdTime: "2020-02-18T23:56:15Z",
    description: "b",
    escalated: "",
    id: "",
    lastChanged: "2020-02-19",
    owner: "",
    priority: "",
    state: "",
    summary: "",
    team: ""
  }
];
const count = 1;

describe("IncidentsTab", () => {
  it("IncidentsTab renders correctly when data.", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <Provider store={storeApp}>
            <IncidentsTab
              secondaryHeaderProps={secondaryHeaderProps}
              incidents={incidents}
              incidentCount={count}
            />
          </Provider>
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("IncidentsTab renders correctly.", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <Provider store={store}>
            <IncidentsTab
              secondaryHeaderProps={secondaryHeaderProps}
              incidents={incidents}
              incidentCount={count}
            />
          </Provider>
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
