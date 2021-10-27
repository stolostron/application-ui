/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

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
            cluster: "local-cluster",
            dashboard:
              "https://localhost:443/grafana/dashboard/db/mortgage-app-dashboard-via-federated-prometheus?namespace=default",
            clusterCount: 1,
            hubSubscriptions: [
              {
                _uid: "local-cluster/5cdc0d8d-52aa-11ea-bf05-00000a102d26",
                status: "Propagated",
                channel: "default/mortgage-channel",
                __typename: "Subscription"
              }
            ],
            created: "2018-02-18T23:57:04Z",
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
  }),
  getArgoServerNS: jest.fn(variables => {
    return Promise.resolve({
      data: {
        argoServers: {
          argoServerNS: [
            {
              name: "argo-ns"
            }
          ]
        }
      }
    });
  })
}));

const React = require("react");
import thunkMiddleware from "redux-thunk";

import ApplicationsListPage from "../../../src-web/components/ApplicationsListPage";

import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import configureMockStore from "redux-mock-store";

import {
  reduxStoreAppPipeline,
  reduxStoreAllAppsPipeline,
  serverProps
} from "./TestingData";

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

// mock the Math.random() value
const mockMath = Object.create(global.Math);
mockMath.random = () => 0.5;
global.Math = mockMath;

describe("ApplicationsListPage", () => {
  it("ApplicationsListPage renders correctly with data on single app, create app action", () => {
    const tree = mount(
      <BrowserRouter>
        <Provider store={storeAllApps}>
          <ApplicationsListPage
            serverProps={serverProps}
            secondaryHeaderProps={secondaryHeaderProps}
            resourceType={resourceType}
            status="DONE"
          />
        </Provider>
      </BrowserRouter>
    ).render();
    expect(toJson(tree)).toMatchSnapshot();
  });

  it("ApplicationsListPage renders correctly with data on single app.", () => {
    const tree = mount(
      <BrowserRouter>
        <Provider store={storeApp}>
          <ApplicationsListPage
            serverProps={serverProps}
            secondaryHeaderProps={secondaryHeaderProps}
            resourceType={resourceType}
            status="DONE"
          />
        </Provider>
      </BrowserRouter>
    ).render();
    expect(toJson(tree)).toMatchSnapshot();
  });

  it("ApplicationsListPage renders correctly with data on all app.", () => {
    const tree = mount(
      <BrowserRouter>
        <Provider store={storeAllApps}>
          <ApplicationsListPage
            serverProps={serverProps}
            secondaryHeaderProps={secondaryHeaderProps}
            resourceType={resourceType}
            status="DONE"
          />
        </Provider>
      </BrowserRouter>
    );
    expect(toJson(tree.render())).toMatchSnapshot();
    // sort by name
    tree
      .find(".pf-c-table__button")
      .at(0)
      .simulate("click");
    // clear search
    tree
      .find('button[aria-label="Reset"]')
      .at(0)
      .simulate("click");
  });
});
