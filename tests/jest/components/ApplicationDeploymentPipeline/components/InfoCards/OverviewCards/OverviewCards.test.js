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
    return Promise.resolve({
      data: {
        applications: {
          "mortgage-app-default": {
            _uid: "local-cluster/5cd1d4c7-52aa-11ea-bf05-00000a102d26",
            name: "mortgage-app",
            namespace: "default",
            dashboard:
              "https://localhost:443/grafana/dashboard/db/mortgage-app-dashboard-via-federated-prometheus?namespace=default",
            clusterCount: 1,
            remoteSubscriptionStatusCount: {
              Subscribed: 1
            },
            podStatusCount: {
              Running: 1
            },
            hubSubscriptions: [
              {
                _uid: "local-cluster/5cdc0d8d-52aa-11ea-bf05-00000a102d26",
                status: "Propagated",
                channel: "default/mortgage-channel",
                __typename: "Subscription"
              }
            ],
            created: "2020-02-18T23:57:04Z",
            __typename: "Application"
          }
        }
      }
    });
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

  it("has functioning onclick, one app", () => {
    const wrapper = mount(
      <Provider store={storeApp}>
        <OverviewCards
          selectedAppName="mortgage-app"
          selectedAppNS="default"
          CEMIncidentList={CEMIncidentList}
          serverProps={serverProps}
        />
      </Provider>
    );

    wrapper.find({ id: "0_overviewCardsData" }).simulate("click");
    wrapper.find({ id: "3_overviewCardsData" }).simulate(
      //CEM
      "click"
    );
    wrapper
      .find({ id: "0_overviewCardsData" })
      .simulate("keypress", { key: "Enter" });
  });

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
