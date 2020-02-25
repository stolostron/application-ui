/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

const React = require("../../../../../../../node_modules/react");

import OverviewCards from "../../../../../../../src-web/components/ApplicationDeploymentPipeline/components/InfoCards/OverviewCards";

import renderer from "react-test-renderer";
import * as reducers from "../../../../../../../src-web/reducers";

import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { Provider } from "react-redux";

const preloadedState = window.__PRELOADED_STATE__;
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = [thunkMiddleware];

const store = createStore(
  combineReducers(reducers),
  preloadedState,
  composeEnhancers(applyMiddleware(...middleware))
);

describe("OverviewCards", () => {
  it("OverviewCards renders correctly with data.", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <OverviewCards selectedAppName="app1" selectedAppNS="default" />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
