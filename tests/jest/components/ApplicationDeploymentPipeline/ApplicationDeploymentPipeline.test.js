/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
jest.mock("../../../../lib/client/apollo-client", () => ({
  getSearchClient: jest.fn(() => {
    return null;
  }),
  get: jest.fn(resourceType => {
    const testData = {
      data: {
        globalAppData: {
          clusterCount: 1
        }
      }
    };
    const errorEVENData = {
      resourceType: resourceType,
      error: "some EVEN error"
    };
    const errorsODDData = {
      resourceType: resourceType,
      errors: ["some ODD error"]
    };
    if (resourceType.list === "GlobalApplicationsData") {
      return Promise.resolve(testData);
    }

    //random odd or even nb to allow covering different paths of the code
    const val = Date.now();
    if (val % 2 == 0) {
      return Promise.resolve(errorEVENData);
    } else {
      return Promise.resolve(errorsODDData);
    }
  }),
  search: jest.fn((searchQuery, searchInput) => {
    const searchType = searchInput.input[0].filters[0].values[0];
    //random odd or even nb to allow covering different paths of the code
    const val = Date.now();
    const errorsODDData = {
      errors: ["some ODD error"]
    };
    const errorEVENData = {
      error: "some EVEN error"
    };

    if (searchType === "channel") {
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
      if (val % 2 == 0) {
        return Promise.resolve(channelData);
      } else {
        return Promise.resolve(errorsODDData);
      }
    }

    if (searchType === "subscription") {
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
      if (val % 2 == 0) {
        return Promise.resolve(errorEVENData);
      } else {
        return Promise.resolve(subscriptionData);
      }
    }

    return Promise.resolve({ response: "invalid resonse" });
  }),
  getResource: jest.fn((resourceType, { namespace }) => {
    //random odd or even nb to allow covering different paths of the code
    const val = Date.now();
    const errorsODDData = {
      errors: ["some ODD error"]
    };
    const errorEVENData = {
      error: "some EVEN error"
    };

    if (resourceType === "channel") {
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
      if (val % 2 == 0) {
        return Promise.resolve(channelData);
      } else {
        return Promise.resolve(errorsODDData);
      }
    }

    return Promise.resolve({ response: "invalid resonse" });
  })
}));
const React = require("../../../../node_modules/react");
import { MockedProvider } from "react-apollo/test-utils";

import ApplicationDeploymentPipeline from "../../../../src-web/components/ApplicationDeploymentPipeline";

import { mount } from "enzyme";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import * as reducers from "../../../../src-web/reducers";

import renderer from "react-test-renderer";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";

import {
  reduxStoreAppPipeline,
  reduxStoreAllAppsPipeline,
  serverProps,
  reduxStoreAllAppsPipelineNoChannels,
  reduxStoreAppPipelineNoChannels,
  channelObjectForEdit,
  subscriptionObjectForEdit,
  appObjectForEdit,
  prObjectForEdit
} from "../TestingData";

const middleware = [thunkMiddleware];
const mockStore = configureMockStore(middleware);
const storeApp = mockStore(reduxStoreAppPipeline);
const storeAllApps = mockStore(reduxStoreAllAppsPipeline);
const storeAllAppsNoChannels = mockStore(reduxStoreAllAppsPipelineNoChannels);
const storeAppNoChannels = mockStore(reduxStoreAppPipelineNoChannels);

// mock the Math.random() value
const mockMath = Object.create(global.Math);
mockMath.random = () => 0.5;
global.Math = mockMath;

describe("ApplicationDeploymentPipeline", () => {
  it("ApplicationsTab renders correctly with data on single app, create channel error", () => {
    const wrapper = mount(
      <Provider store={storeAllApps}>
        <ApplicationDeploymentPipeline serverProps={serverProps} />
      </Provider>
    );
    wrapper
      .find(".bx--btn--primary")
      .find({ id: "Channel" })
      .simulate("click");

    wrapper
      .find(".bx--btn--primary")
      .find({ id: "Subscription" })
      .simulate("click");

    wrapper
      .find(".bx--btn--primary")
      .find({ id: "Placement Rule" })
      .simulate("click");

    wrapper.find(".bx--search-input").simulate("change");

    wrapper.find(".bx--search-close").simulate("change");
  });
  it("ApplicationDeploymentPipeline renders spinner.", () => {
    const preloadedState = window.__PRELOADED_STATE__;
    const composeEnhancers =
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const middleware = [thunkMiddleware];

    const store = createStore(
      combineReducers(reducers),
      preloadedState,
      composeEnhancers(applyMiddleware(...middleware))
    );

    const tree = renderer
      .create(
        <Provider store={store}>
          <ApplicationDeploymentPipeline serverProps={serverProps} />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("ApplicationDeploymentPipeline renders error.", () => {
    reduxStoreAllAppsPipeline.QueryApplicationList.status = "ERROR";
    const store = mockStore(reduxStoreAllAppsPipeline);

    const tree = renderer
      .create(
        <MockedProvider mocks={[]} addTypename={false}>
          <Provider store={store}>
            <ApplicationDeploymentPipeline serverProps={serverProps} />
          </Provider>
        </MockedProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("ApplicationDeploymentPipeline renders correctly with data on single app and open channel.", () => {
    const channelEditStore = reduxStoreAllAppsPipeline;
    channelEditStore.QueryApplicationList.status = "DONE";
    channelEditStore.AppDeployments.openEditChannelModal = true;
    channelEditStore.AppDeployments.currentChannelInfo = channelObjectForEdit;
    const editChannel = mockStore(channelEditStore);

    const tree = renderer
      .create(
        <Provider store={editChannel}>
          <ApplicationDeploymentPipeline serverProps={serverProps} />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("ApplicationDeploymentPipeline renders correctly with data on single app and open subscription.", () => {
    const subsEditStore = reduxStoreAllAppsPipeline;
    subsEditStore.AppDeployments.openEditChannelModal = false;
    subsEditStore.AppDeployments.openEditSubscriptionModal = true;
    subsEditStore.AppDeployments.currentSubscriptionInfo = subscriptionObjectForEdit;
    const editSubscription = mockStore(subsEditStore);

    const tree = renderer
      .create(
        <Provider store={editSubscription}>
          <ApplicationDeploymentPipeline serverProps={serverProps} />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("ApplicationDeploymentPipeline renders correctly with data on single app and open app.", () => {
    const subsEditStore = reduxStoreAllAppsPipeline;
    subsEditStore.AppDeployments.openEditChannelModal = false;
    subsEditStore.AppDeployments.openEditSubscriptionModal = false;
    subsEditStore.AppDeployments.openEditApplicationModal = true;
    subsEditStore.AppDeployments.currentApplicationInfo = appObjectForEdit;
    const editApp = mockStore(subsEditStore);

    const tree = renderer
      .create(
        <Provider store={editApp}>
          <ApplicationDeploymentPipeline serverProps={serverProps} />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("ApplicationDeploymentPipeline renders correctly with data on single app and open PR.", () => {
    const subsEditStore = reduxStoreAllAppsPipeline;
    subsEditStore.AppDeployments.openEditChannelModal = false;
    subsEditStore.AppDeployments.openEditSubscriptionModal = false;
    subsEditStore.AppDeployments.openEditApplicationModal = false;
    subsEditStore.AppDeployments.openEditPlacementRuleModal = true;
    subsEditStore.AppDeployments.currentPlacementRuleInfo = prObjectForEdit;
    const editApp = mockStore(subsEditStore);

    const tree = renderer
      .create(
        <Provider store={editApp}>
          <ApplicationDeploymentPipeline serverProps={serverProps} />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("ApplicationDeploymentPipeline renders correctly with data on single app.", () => {
    const tree = renderer
      .create(
        <MockedProvider mocks={[]} addTypename={false}>
          <Provider store={storeApp}>
            <ApplicationDeploymentPipeline serverProps={serverProps} />
          </Provider>
        </MockedProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("ApplicationDeploymentPipeline renders correctly with data on all apps.", () => {
    const tree = renderer
      .create(
        <MockedProvider mocks={[]} addTypename={false}>
          <Provider store={storeAllApps}>
            <ApplicationDeploymentPipeline serverProps={serverProps} />
          </Provider>
        </MockedProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("ApplicationDeploymentPipeline renders correctly with data on all apps no channels.", () => {
    const tree = renderer
      .create(
        <Provider store={storeAllAppsNoChannels}>
          <ApplicationDeploymentPipeline serverProps={serverProps} />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("ApplicationDeploymentPipeline renders correctly with data on one app no channels.", () => {
    const tree = renderer
      .create(
        <Provider store={storeAppNoChannels}>
          <ApplicationDeploymentPipeline serverProps={serverProps} />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
