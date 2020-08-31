/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

jest.mock("../../../lib/client/apollo-client", () => ({
  getClient: jest.fn(() => {
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
  getUserAccessAllNamespaces: jest.fn(variables => {
    return Promise.resolve({
      data: {
        userAccessAnyNamespaces: true
      },
      loading: false,
      networkStatus: 7,
      stale: false
    });
  })
}));

const React = require("../../../node_modules/react");
import thunkMiddleware from "redux-thunk";

import ApplicationsTab from "../../../src-web/containers/ApplicationsTab";

import { mount } from "enzyme";
import renderer from "react-test-renderer";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import configureMockStore from "redux-mock-store";

import {
  reduxStoreAppPipeline,
  reduxStoreAllAppsPipeline,
  serverProps
} from "../components/TestingData";

const middleware = [thunkMiddleware];
const mockStore = configureMockStore(middleware);
const storeApp = mockStore(reduxStoreAppPipeline);
const storeAllApps = mockStore(reduxStoreAllAppsPipeline);

const secondaryHeaderProps = {
  title: "routes.applications",
  tabs: [],
  resourceFilters: []
};

const resourceType = {
  name: "QueryApplications",
  list: "QueryApplicationList"
};

describe("ApplicationsTab", () => {
  it("ApplicationsTab renders correctly with data on single app, create app action", () => {
    const wrapper = mount(
      <BrowserRouter>
        <Provider store={storeAllApps}>
          <ApplicationsTab
            serverProps={serverProps}
            secondaryHeaderProps={secondaryHeaderProps}
            resourceType={resourceType}
            status="DONE"
          />
        </Provider>
      </BrowserRouter>
    );
    wrapper.find(".bx--search-input").simulate("change");
    wrapper.find(".bx--search-close").simulate("click");
    wrapper
      .find(".bx--table-sort-v2--ascending")
      .at(0)
      .simulate("click");
    wrapper.find(".bx--select-input").simulate("change");
  });

  it("ApplicationsTab renders correctly with data on single app.", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <Provider store={storeApp}>
            <ApplicationsTab
              serverProps={serverProps}
              secondaryHeaderProps={secondaryHeaderProps}
              resourceType={resourceType}
              status="DONE"
            />
          </Provider>
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("ApplicationsTab renders correctly with data on all app.", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <Provider store={storeAllApps}>
            <ApplicationsTab
              serverProps={serverProps}
              secondaryHeaderProps={secondaryHeaderProps}
              resourceType={resourceType}
              status="DONE"
            />
          </Provider>
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
