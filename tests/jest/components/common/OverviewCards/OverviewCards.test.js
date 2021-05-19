/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *  Copyright (c) 2020 Red Hat, Inc.
 * Copyright Contributors to the Open Cluster Management project
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
jest.mock("../../../../../lib/client/apollo-client", () => ({
  getSearchClient: jest.fn(() => {
    return null;
  }),
  getResource: jest.fn((resourceType, { namespace }) => {
    if (
      resourceType === "channel" ||
      (resourceType.name && resourceType.name === "HCMChannel")
    ) {
      const channelData = {
        data: {
          searchResult: [
            {
              items: [
                {
                  kind: "channel",
                  name: "mortgage-channel",
                  namespace: "mortgage-ch",
                  _hubClusterResource: "true"
                }
              ]
            }
          ]
        }
      };
      return Promise.resolve(channelData);
    }

    if (
      resourceType === "subscription" ||
      (resourceType.name && resourceType.name === "HCMSubscription")
    ) {
      const subscriptionData = {
        data: {
          searchResult: [
            {
              items: [
                {
                  kind: "subscription",
                  name: "orphan",
                  namespace: "default",
                  status: "Propagated",
                  cluster: "local-cluster",
                  channel: "default/mortgage-channel",
                  apigroup: "app.ibm.com",
                  apiversion: "v1alpha1",
                  _rbac: "default_app.ibm.com_subscriptions",
                  _hubClusterResource: "true",
                  _uid:
                    "local-cluster/5cdc0d8d-52aa-11ea-bf05-00000a102d26orphan",
                  packageFilterVersion: ">=1.x",
                  label:
                    "app=mortgage-app-mortgage; chart=mortgage-1.0.3; heritage=Tiller; release=mortgage-app",
                  related: []
                }
              ]
            }
          ]
        }
      };
      return Promise.resolve(subscriptionData);
    }

    if (
      resourceType === "placementrule" ||
      (resourceType.name && resourceType.name === "HCMPlacementRule")
    ) {
      const prData = {
        data: {
          searchResult: [
            {
              items: [
                {
                  kind: "subscription",
                  name: "orphan",
                  namespace: "default",
                  status: "Propagated",
                  cluster: "local-cluster",
                  channel: "default/mortgage-channel",
                  apigroup: "app.ibm.com",
                  apiversion: "v1alpha1",
                  _rbac: "default_app.ibm.com_subscriptions",
                  _hubClusterResource: "true",
                  _uid:
                    "local-cluster/5cdc0d8d-52aa-11ea-bf05-00000a102d26orphan",
                  packageFilterVersion: ">=1.x",
                  label:
                    "app=mortgage-app-mortgage; chart=mortgage-1.0.3; heritage=Tiller; release=mortgage-app",
                  related: []
                }
              ]
            }
          ]
        }
      };
      return Promise.resolve(prData);
    }

    return Promise.resolve({ response: "invalid resonse" });
  }),
  search: jest.fn(resourceType => Promise.resolve({ response: resourceType }))
}));

jest.mock("../../../../../lib/client/access-helper.js", () => ({
  canCreateActionAllNamespaces: jest.fn(() => {
    const data = {
      data: {
        userAccessAnyNamespaces: true
      }
    };
    return Promise.resolve(data);
  })
}));

const React = require("../../../../../node_modules/react");

import OverviewCards from "../../../../../src-web/components/common/OverviewCards";

import { mount } from "enzyme";
import renderer from "react-test-renderer";
import * as reducers from "../../../../../src-web/reducers";
import { BrowserRouter } from "react-router-dom";

import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { Provider } from "react-redux";

import configureMockStore from "redux-mock-store";
import { MockedProvider } from "react-apollo/test-utils";

import { reduxStoreAppPipelineWithCEM, serverProps } from "../../TestingData";

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
      <BrowserRouter>
        <MockedProvider mocks={[]} addTypename={false}>
          <Provider store={storeApp}>
            <OverviewCards
              selectedAppName="mortgage-app"
              selectedAppNS="default"
              serverProps={serverProps}
            />
          </Provider>
        </MockedProvider>
      </BrowserRouter>
    );
  });

  it("has functioning onclick, one app", () => {
    const wrapper = mount(
      <BrowserRouter>
        <Provider store={storeApp}>
          <OverviewCards
            selectedAppName="mortgage-app"
            selectedAppNS="default"
            serverProps={serverProps}
          />
        </Provider>
      </BrowserRouter>
    );

    wrapper
      .find({ id: "app-search-link" })
      .simulate("keypress", { key: "Enter" });
  });
});
