/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 ****************************************************************************** */
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
/*
 jest.mock("../../../../lib/client/apollo-client", () => ({
  getSearchClient: jest.fn(() => {
    return null;
  }),
  changeTablePage: jest.fn( resourceType => {
    const data = {
      type: "TABLE_PAGE_CHANGE",
      page: "1",
      pageSize: "20",
      resourceType : {
        list: "QueryApplicationList",
        name: "QueryApplications"
      }
    } 

    return data
  }),
  get: jest.fn(resourceType => {
      const data = {
        data: {
          applications: [
            {
              items: [
                {
                  kind: "application",
                  name: "samplebook-gbapp",
                  namespace: "sample",
                  dashboard:
                    "localhost/grafana/dashboard/db/samplebook-gbapp-dashboard-via-federated-prometheus?namespace=sample",
                  selfLink:
                    "/apis/app.k8s.io/v1beta1/namespaces/sample/applications/samplebook-gbapp",
                  _uid: "local-cluster/96218695-3798-4dac-b3d3-179fb86b6715",
                  created: "2020-02-19T01:43:43Z",
                  apigroup: "app.k8s.io",
                  cluster: "local-cluster",
                  kind: "application",
                  label:
                    "app=gbapp; chart=gbapp-0.1.0; heritage=Tiller; release=samplebook",
                  _hubClusterResource: "true",
                  _rbac: "sample_app.k8s.io_applications"
                }
              ]
            }
          ]
        }
      };

      return Promise.resolve(data);
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
*/
const React = require("../../../../node_modules/react");

import ResourceList from "../../../../src-web/components/common/ResourceList";

import renderer from "react-test-renderer";
import * as reducers from "../../../../src-web/reducers";

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

describe("ResourceList", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <Provider store={store}>
            <ResourceList {...props} />
          </Provider>
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

const props = {
  secondaryHeaderProps: { title: "routes.applications" },
  match: {
    path: "/multicloud/applications",
    url: "/multicloud/applications",
    isExact: true,
    params: {}
  },
  location: {
    pathname: "/multicloud/applications",
    search: "",
    hash: "",
    state: undefined,
    key: "4wnt09"
  },
  history: { length: 16, action: "PUSH", location: {} },
  staticContext: undefined,
  routes: [],
  resourceType: { name: "QueryApplications", list: "QueryApplicationList" },
  staticResourceData: {
    defaultSortField: "name",
    uriKey: "name",
    primaryKey: "name",
    secondaryKey: "namespace",
    tableKeys: [
      {
        msgKey: "table.header.name",
        resourceKey: "name",
        transformFunction: item => item.name
      }
    ],
    tableActions: [],
    emptyTitle: () => "No items",
    emptyMessage: () => "There are no items"
  },
  getVisibleResources: function getVisibleResources(state, obj) {
    return { normalizedItems: ["item1", "item2"] };
  },
  buttons: [{}],
  modules: [{}],
  tabs: undefined,
  title: "routes.applications",
  children: []
};
