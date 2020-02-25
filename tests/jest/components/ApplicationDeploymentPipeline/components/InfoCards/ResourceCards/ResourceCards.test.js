/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

const React = require("../../../../../../../node_modules/react");

import ResourceCards from "../../../../../../../src-web/components/ApplicationDeploymentPipeline/components/InfoCards/ResourceCards";

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

describe("ResourceCards", () => {
  it("ResourceCards renders correctly in root app view.", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <ResourceCards
            selectedAppName="app1"
            selectedAppNS="default"
            isSingleApplicationView={false}
            globalAppData={globalAppData}
          />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("ResourceCards renders correctly in single app view.", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <ResourceCards
            selectedAppName="app1"
            selectedAppNS="default"
            isSingleApplicationView={true}
            globalAppData={globalAppData}
          />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

const globalAppData = {
  items: {
    channelsCount: 1,
    clusterCount: 2,
    hubSubscriptionCount: 3,
    remoteSubscriptionStatusCount: {
      Subscribed: 3,
      Failed: 2,
      null: 1
    }
  }
};
