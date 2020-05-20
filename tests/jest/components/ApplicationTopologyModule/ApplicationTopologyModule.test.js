/*******************************************************************************
 * Licensed Materials - Property of Red Hat
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/
jest.mock("../../../../lib/client/apollo-client", () => ({
  getSearchClient: jest.fn(() => {
    return null;
  }),
  search: jest.fn((resourceType, namespace, name) => {
    if (resourceType.name && resourceType.name === "HCMApplicationList") {
      const appData = {
        items: [
          {
            kind: "application",
            name: "mortgage-channel",
            namespace: "mortgage-ch",
            _hubClusterResource: "true"
          }
        ]
      };

      return Promise.resolve(appData);
    }

    return Promise.resolve({ response: "invalid resonse" });
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
  })
}));

const React = require("../../../../node_modules/react");

import ApplicationTopologyModule from "../../../../src-web/components/ApplicationTopologyModule/ApplicationTopologyModule.js";

import renderer from "react-test-renderer";
import * as reducers from "../../../../src-web/reducers";
import { mount } from "enzyme";

import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

const preloadedState = window.__PRELOADED_STATE__;
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = [thunkMiddleware];

const store = createStore(
  combineReducers(reducers),
  preloadedState,
  composeEnhancers(applyMiddleware(...middleware))
);

// need to mock a div w/i a div to be parent of monaco editor
function createNodeMock() {
  var iDiv = document.createElement("div");
  var innerDiv = document.createElement("div");
  iDiv.appendChild(innerDiv);
  return innerDiv;
}

const locale = "en-US";
describe("ApplicationTopologyModule with selected node ID", () => {
  it("ApplicationTopologyModule renders correctly when topology is not expanded---aaa", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <Provider store={store}>
            <ApplicationTopologyModule
              selectedNodeId={nodeID}
              showExpandedTopology={false}
              params={params}
              locale={locale}
            />
          </Provider>
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("ApplicationTopologyModule renders correctly when topology is expanded---bbb", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <Provider store={store}>
            <ApplicationTopologyModule
              selectedNodeId={nodeID}
              showExpandedTopology={true}
              params={params}
              locale={locale}
            />
          </Provider>
        </BrowserRouter>,
        { createNodeMock }
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  const actions = {
    setShowExpandedTopology: jest.fn()
  };
  it("ApplicationTopologyModule renders correctly when topology is expanded click---ccc", () => {
    const wrapper = mount(
      <BrowserRouter>
        <Provider store={store}>
          <ApplicationTopologyModule
            selectedNodeId={nodeID}
            showExpandedTopology={true}
            params={params}
            locale={locale}
            actions={actions}
          />
        </Provider>
      </BrowserRouter>
    );

    wrapper
      .find(".bx--search-input")
      .at(0)
      .simulate("change");
    wrapper
      .find(".bx--search-close")
      .at(0)
      .simulate("click");

    wrapper
      .find(".diagram-close-button")
      .at(0)
      .simulate("click");

    wrapper
      .find(".diagram-close-button")
      .at(0)
      .simulate("keypress");
  });
});

const nodeID = "acb123";

const params = {
  name: "app1",
  namespace: "default"
};
