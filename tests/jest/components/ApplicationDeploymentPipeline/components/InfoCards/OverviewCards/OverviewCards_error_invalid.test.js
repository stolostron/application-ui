/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *  Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
jest.mock("../../../../../../../lib/client/apollo-client", () => ({
  getSearchClient: jest.fn(() => {
    return null;
  }),
  get: jest.fn(resourceType => {
    //resourceType.list is always ApplicationsList
    return Promise.resolve(undefined);
  }),
  search: jest.fn(resourceType => Promise.resolve({ response: resourceType }))
}));
const React = require("../../../../../../../node_modules/react");

import OverviewCards from "../../../../../../../src-web/components/ApplicationDeploymentPipeline/components/InfoCards/OverviewCards";

import { mount } from "enzyme";
import renderer from "react-test-renderer";
import * as reducers from "../../../../../../../src-web/reducers";

import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { Provider } from "react-redux";

import configureMockStore from "redux-mock-store";
import { MockedProvider } from "react-apollo/test-utils";

import {
  reduxStoreAppPipelineWithCEM,
  CEMIncidentList,
  serverProps
} from "../../../../TestingData";

const preloadedState = window.__PRELOADED_STATE__;
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = [thunkMiddleware];

const store = createStore(
  combineReducers(reducers),
  preloadedState,
  composeEnhancers(applyMiddleware(...middleware))
);

const mockStore = configureMockStore(middleware);
const storeApp = mockStore(reduxStoreAppPipelineWithCEM);

window.open = () => {}; // provide an empty implementation for window.open

describe("OverviewCards", () => {
  it("OverviewCards makes apollo calls with success return", () => {
    renderer.create(
      <MockedProvider mocks={[]} addTypename={false}>
        <Provider store={storeApp}>
          <OverviewCards
            selectedAppName="mortgage-app"
            selectedAppNS="default"
            CEMIncidentList={CEMIncidentList}
            serverProps={serverProps}
          />
        </Provider>
      </MockedProvider>
    );
  });
});
