// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

let mockUserAccessAnyNamespaces = true;
let mockmanagedCluster = true;

jest.mock("../../../../lib/client/apollo-client", () => ({
  getUserAccessAllNamespaces: jest.fn(variables => {
    return Promise.resolve({
      data: {
        userAccessAnyNamespaces: mockUserAccessAnyNamespaces
      },
      loading: false,
      networkStatus: 7,
      stale: false
    });
  }),
  getManagedClusterStatus: jest.fn(variables => {
    return Promise.resolve({
      data: {
        isManagedClusterConditionAvailable: mockmanagedCluster
      },
      loading: false,
      networkStatus: 7,
      stale: false
    });
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
  })
}));

const React = require("../../../../node_modules/react");

import ApplicationCreationPage from "../../../../src-web/components/ApplicationCreationPage/ApplicationCreationPage.js";

import renderer from "react-test-renderer";
import * as reducers from "../../../../src-web/reducers";
import { mount, shallow } from "enzyme";

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

//// need to mock a div w/i a div to be parent of monaco editor
//function createNodeMock() {
//  var iDiv = document.createElement("div");
//  var innerDiv = document.createElement("div");
//  iDiv.appendChild(innerDiv);
//  return innerDiv;
//}

const locale = "en-US";
describe("ApplicationCreationPage creating application", () => {
  it("ApplicationCreationPage renders correctly when creating application", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <Provider store={store}>
            <ApplicationCreationPage
              params={params}
              serverProps={{
                title: "Red Hat Advanced Cluster Management for Kubernetes",
                context: { locale: "en-US" }
              }}
              secondaryHeaderProps={{ title: "application.create.title" }}
            />
          </Provider>
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

const params = {
  name: "app1",
  namespace: "default"
};
