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
  })
}));

("use strict");
import React from "react";
import AutoRefreshSelect from "../../../../src-web/components/common/AutoRefreshSelect";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { mount } from "enzyme";
import toJson from "enzyme-to-json";

import thunkMiddleware from "redux-thunk";
import configureMockStore from "redux-mock-store";

import { reduxStoreAllAppsPipeline } from "../TestingData";

const middleware = [thunkMiddleware];
const mockStore = configureMockStore(middleware);
const storeAllApps = mockStore(reduxStoreAllAppsPipeline);

const locationAllApps = {
  pathname: "/multicloud/applications/"
};

const locationAllChannels = {
  pathname: "/multicloud/applications/advanced?resource=channels"
};

const dateNowStub = jest.fn(() => 1530518207007);
global.Date.now = dateNowStub;

describe("AutoRefreshSelect on all apps", () => {
  it("renders correctly when visible", () => {
    const wrapper = mount(
      <BrowserRouter>
        <Provider store={storeAllApps}>
          <AutoRefreshSelect route={locationAllApps} />
        </Provider>
      </BrowserRouter>
    );
    wrapper
      .find("#refresh-toggle")
      .at(0)
      .simulate("click");
    wrapper.find(".pf-c-dropdown__toggle-text").simulate("click");

    expect(toJson(wrapper.render())).toMatchSnapshot();
  });
});

describe("AutoRefreshSelect on all subscriptions", () => {
  it("renders correctly when visible", () => {
    const wrapper = mount(
      <BrowserRouter>
        <Provider store={storeAllApps}>
          <AutoRefreshSelect route={locationAllChannels} />
        </Provider>
      </BrowserRouter>
    );
    wrapper
      .find("#refresh-toggle")
      .at(0)
      .simulate("click");
    wrapper.find(".pf-c-dropdown__toggle-text").simulate("click");

    expect(toJson(wrapper.render())).toMatchSnapshot();
  });
});
