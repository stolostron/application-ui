/*******************************************************************************
 * Licensed Materials - Property of Red Hat
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const React = require("../../../../../node_modules/react");

import ResourceOverview from "../../../../../src-web/components/common/ResourceOverview/";

import renderer from "react-test-renderer";
import * as reducers from "../../../../../src-web/reducers";

import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import configureMockStore from "redux-mock-store";

import {
  reduxStoreAppPipeline,
  staticResourceDataApp
} from "../../../components/TestingData";

const mockStore = configureMockStore();
reduxStoreAppPipeline.AppDeployments.openEditApplicationModal = true;
reduxStoreAppPipeline.topology = {
  activeFilters: {
    application: {
      name: "samplebook-gbapp",
      namespace: "sample"
    }
  }
};
const storeApp = mockStore(reduxStoreAppPipeline);

const preloadedState = window.__PRELOADED_STATE__;
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = [thunkMiddleware];

const store = createStore(
  combineReducers(reducers),
  preloadedState,
  composeEnhancers(applyMiddleware(...middleware))
);

describe("ResourceOverview", () => {
  it("ResourceOverview renders ", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <Provider store={storeApp}>
            <ResourceOverview
              resourceType={resourceType}
              params={params}
              userRole={role}
              staticResourceData={staticResourceDataApp}
              showExpandedTopology={false}
              showICAMAction={true}
              namespaceAccountId={111}
              match={match}
            />
          </Provider>
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("ResourceOverview renders spinner", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <Provider store={store}>
            <ResourceOverview
              resourceType={resourceType}
              params={emptyParams}
              role={role}
            />
          </Provider>
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

const resourceType = {
  name: "QueryApplications",
  list: "QueryApplicationList"
};

const match = {
  path: "/multicloud/applications/sample/samplebook-gbapp",
  url: "/multicloud/applications/sample/samplebook-gbapp",
  isExact: true
};

const params = {
  name: "samplebook-gbapp",
  namespace: "sample"
};

const emptyParams = {
  name: undefined,
  namespace: undefined
};

const role = {
  role: "ClusterAdministrator",
  status: "DONE",
  type: "ROLE_RECEIVE_SUCCESS"
};
