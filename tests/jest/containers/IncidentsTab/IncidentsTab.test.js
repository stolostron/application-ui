/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

const React = require("../../../../node_modules/react");

import IncidentsTab from "../../../../src-web/containers/IncidentsTab";

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
