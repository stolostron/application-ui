/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *  Copyright (c) 2020 Red Hat, Inc
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

const React = require("../../../../../../../node_modules/react");

import ResourceCards from "../../../../../../../src-web/components/ApplicationDeploymentPipeline/components/InfoCards/ResourceCards";

import renderer from "react-test-renderer";
import * as reducers from "../../../../../../../src-web/reducers";

import { mount } from "enzyme";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { Provider } from "react-redux";

import configureMockStore from "redux-mock-store";

import {
  reduxStoreAppPipeline,
  reduxStoreAllAppsPipeline
} from "../../../../TestingData";

const mockStore = configureMockStore();
const storeApp = mockStore(reduxStoreAppPipeline);
const storeAllApps = mockStore(reduxStoreAllAppsPipeline);

const preloadedState = window.__PRELOADED_STATE__;
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = [thunkMiddleware];

const store = createStore(
  combineReducers(reducers),
  preloadedState,
  composeEnhancers(applyMiddleware(...middleware))
);

window.open = () => {}; // provide an empty implementation for window.alert

describe("ResourceCards", () => {
  it("has functioning onclick, one app", () => {
    const wrapper = mount(
      <Provider store={storeApp}>
        <ResourceCards
          selectedAppName="mortgage-app"
          selectedAppNS="default"
          isSingleApplicationView={true}
          globalAppData={globalAppData}
        />
      </Provider>
    );
    wrapper.find({ id: "0_resourceCardsData" }).simulate(
      "click",
      {},
      {
        msgKey: "Subscriptions",
        count: 0,
        targetLink: "link",
        textKey: "On hub cluster",
        subtextKeyFirst: "",
        subtextKeySecond: ""
      }
    );
    wrapper.find({ id: "0_resourceCardsData" }).simulate(
      "keypress",
      { key: "Enter" },
      {
        msgKey: "Subscriptions",
        count: 0,
        targetLink: "link",
        textKey: "On hub cluster",
        subtextKeyFirst: "",
        subtextKeySecond: ""
      }
    );
  });

  it("has functioning onclick, one app with no channel", () => {
    const wrapper = mount(
      <Provider store={storeApp}>
        <ResourceCards
          selectedAppName="app-no-channel"
          selectedAppNS="default"
          isSingleApplicationView={true}
          globalAppData={globalAppData}
        />
      </Provider>
    );
    wrapper.find({ id: "0_resourceCardsData" }).simulate(
      "click",
      {},
      {
        msgKey: "Subscriptions",
        count: 0,
        targetLink: "link",
        textKey: "On hub cluster",
        subtextKeyFirst: "",
        subtextKeySecond: ""
      }
    );
    wrapper.find({ id: "0_resourceCardsData" }).simulate(
      "keypress",
      { key: "Enter" },
      {
        msgKey: "Subscriptions",
        count: 0,
        targetLink: "link",
        textKey: "On hub cluster",
        subtextKeyFirst: "",
        subtextKeySecond: ""
      }
    );
  });

  it("has functioning onclick, all apps", () => {
    const wrapper = mount(
      <Provider store={storeAllApps}>
        <ResourceCards
          selectedAppName="app1"
          selectedAppNS="default"
          isSingleApplicationView={false}
          globalAppData={globalAppData}
        />
      </Provider>
    );
    wrapper.find({ id: "0_resourceCardsData" }).simulate(
      "click",
      {},
      {
        msgKey: "Subscriptions",
        count: 0,
        targetLink: "link",
        textKey: "On hub cluster",
        subtextKeyFirst: "",
        subtextKeySecond: ""
      }
    );
    wrapper.find({ id: "0_resourceCardsData" }).simulate(
      "keypress",
      { key: "Enter" },
      {
        msgKey: "Subscriptions",
        count: 0,
        targetLink: "link",
        textKey: "On hub cluster",
        subtextKeyFirst: "",
        subtextKeySecond: ""
      }
    );
  });

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
