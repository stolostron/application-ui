// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

import {
  reduxStoreAllAppsPipeline,
  serverProps,
  QuerySubscriptionList,
  QueryPlacementRuleList,
  QueryChannelList
} from "../TestingData";

const mockSubscriptions = QuerySubscriptionList.items;
const mockPlacementRules = QueryPlacementRuleList.items;
const mockChannels = QueryChannelList.items;

jest.mock("../../../../lib/client/apollo-client", () => ({
  get: jest.fn(resourceType => {
    switch (resourceType.list) {
      case "QuerySubscriptionList":
        return Promise.resolve({
          data: {
            subscriptions: mockSubscriptions
          }
        });
      case "QueryPlacementRuleList":
        return Promise.resolve({
          data: {
            placementRules: mockPlacementRules
          }
        });
      case "QueryChannelList":
        return Promise.resolve({
          data: {
            channels: mockChannels
          }
        });
      default:
        return null;
    }
  })
}));

const React = require("react");
import thunkMiddleware from "redux-thunk";

import AdvancedConfigurationPage from "../../../../src-web/components/AdvancedConfigurationPage";

import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import configureMockStore from "redux-mock-store";

const middleware = [thunkMiddleware];
const mockStore = configureMockStore(middleware);
const storeAllApps = mockStore(reduxStoreAllAppsPipeline);

const secondaryHeaderProps = {
  title: "routes.applications",
  tabs: [],
  resourceFilters: []
};

// mock the Math.random() value
const mockMath = Object.create(global.Math);
mockMath.random = () => 0.5;
global.Math = mockMath;

describe("AdvancedConfigurationPage", () => {
  it("renders the Subscriptions table correctly", () => {
    const wrapper = mount(
      <BrowserRouter>
        <Provider store={storeAllApps}>
          <AdvancedConfigurationPage
            serverProps={serverProps}
            secondaryHeaderProps={secondaryHeaderProps}
          />
        </Provider>
      </BrowserRouter>
    );
    expect(toJson(wrapper.render())).toMatchSnapshot();
  });

  it("renders the Placement rules table correctly", () => {
    const wrapper = mount(
      <BrowserRouter>
        <Provider store={storeAllApps}>
          <AdvancedConfigurationPage
            serverProps={serverProps}
            secondaryHeaderProps={secondaryHeaderProps}
          />
        </Provider>
      </BrowserRouter>
    );
    wrapper
      .find("#placementrules")
      .at(0)
      .simulate("click");
    expect(toJson(wrapper.render())).toMatchSnapshot();
  });

  it("renders the Channels table correctly", () => {
    const wrapper = mount(
      <BrowserRouter>
        <Provider store={storeAllApps}>
          <AdvancedConfigurationPage
            serverProps={serverProps}
            secondaryHeaderProps={secondaryHeaderProps}
          />
        </Provider>
      </BrowserRouter>
    );
    wrapper
      .find("#channels")
      .at(0)
      .simulate("click");
    expect(toJson(wrapper.render())).toMatchSnapshot();
  });
});
