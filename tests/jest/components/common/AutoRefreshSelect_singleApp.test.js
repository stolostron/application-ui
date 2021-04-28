// Copyright (c) 2021 Red Hat, Inc.
jest.mock("../../../../lib/client/apollo-client", () => ({
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
  search: jest.fn((searchQuery, searchInput) => {
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
  getResource: jest.fn((resourceType, variables) => {
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
  })
}));

("use strict");
import React from "react";
import AutoRefreshSelect from "../../../../src-web/components/common/AutoRefreshSelect";
import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import thunkMiddleware from "redux-thunk";
import configureMockStore from "redux-mock-store";

import { reduxStoreAppPipelineWithCEM } from "../TestingData";

const middleware = [thunkMiddleware];
const mockStore = configureMockStore(middleware);
const storeSingleApp = mockStore(reduxStoreAppPipelineWithCEM);

const locationApp = {
  pathname: "/multicloud/applications/helloworld-ns/helloworld"
};

const dateNowStub = jest.fn(() => 1530518207007);
global.Date.now = dateNowStub;

describe("AutoRefreshSelect on single app", () => {
  it("renders correctly when visible on the single app page", () => {
    const wrapper = mount(
      <BrowserRouter>
        <Provider store={storeSingleApp}>
          <AutoRefreshSelect route={locationApp} />
        </Provider>
      </BrowserRouter>
    );

    wrapper
      .find("#refresh-toggle")
      .at(0)
      .simulate("click");

    wrapper.find(".pf-c-dropdown__toggle-text").simulate("click");

    wrapper
      .find("#refresh-toggle")
      .at(0)
      .simulate("click");

    wrapper
      .find("#refresh-disable")
      .at(0)
      .simulate("click");

    expect(toJson(wrapper.render())).toMatchSnapshot();
  });
});
