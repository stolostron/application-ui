/*******************************************************************************
 * Licensed Materials - Property of Red Hat
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const React = require("../../../../../node_modules/react");

import ResourceDetails from "../../../../../src-web/components/common/ResourceDetails";
import { makeGetVisibleTableItemsSelector } from "../../../../../src-web/reducers/common";

import renderer from "react-test-renderer";
import * as reducers from "../../../../../src-web/reducers";

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

describe("ResourceDetails", () => {
  it("ResourceDetails renders correctly", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <Provider store={store}>
            <ResourceDetails
              resourceType={resourceType}
              staticResourceData={staticResourceData}
              tabs={detailsTabs}
              routes={routes}
              getVisibleResources={getVisibleResources}
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

const staticResourceData = {
  defaultSortField: "name",
  detailKeys: {
    title: "application.details",
    headerRows: ["type", "detail"],
    rows: [
      {
        cells: [
          { resourceKey: "description.title.name", type: "i18n" },
          { resourceKey: "name" }
        ]
      },
      {
        cells: [
          { resourceKey: "description.title.namespace", type: "i18n" },
          { resourceKey: "namespace" }
        ]
      }
    ]
  },
  primaryKey: "name",
  secondaryKey: "namespace",
  tableActions: [
    "table.actions.applications.edit",
    "table.actions.applications.remove"
  ],
  tableKeys: [
    { msgKey: "table.header.applicationName", resourceKey: "name" },
    { msgKey: "table.header.namespace", resourceKey: "namespace" }
  ],
  uriKey: "name"
};

const detailsTabs = [];

const routes = [];

const getVisibleResources = makeGetVisibleTableItemsSelector(resourceType);
