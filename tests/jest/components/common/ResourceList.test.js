/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
const React = require("../../../../node_modules/react");

import ResourceList from "../../../../src-web/components/common/ResourceList";

import renderer from "react-test-renderer";
import * as reducers from "../../../../src-web/reducers";

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

describe("ResourceList", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <Provider store={store}>
            <ResourceList {...props} />
          </Provider>
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

const props = {
  secondaryHeaderProps: { title: "routes.applications" },
  match: {
    path: "/multicloud/applications",
    url: "/multicloud/applications",
    isExact: true,
    params: {}
  },
  location: {
    pathname: "/multicloud/applications",
    search: "",
    hash: "",
    state: undefined,
    key: "4wnt09"
  },
  history: { length: 16, action: "PUSH", location: {} },
  staticContext: undefined,
  detailsTabs: [],
  routes: [],
  resourceType: { name: "QueryApplications", list: "QueryApplicationList" },
  staticResourceData: {
    defaultSortField: "name",
    uriKey: "name",
    primaryKey: "name",
    secondaryKey: "namespace"
  },
  getVisibleResources: function getVisibleResources(state, obj) {
    return { normalizedItems: ["item1", "item2"] };
  },
  buttons: [{}],
  modules: [{}],
  tableTitle: "All applications",
  tableName: "All applications",
  tabs: undefined,
  title: "routes.applications",
  children: [{}]
};
