/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
jest.mock("../../../../../lib/client/apollo-client", () => ({
  getClient: jest.fn(() => {
    return null;
  }),
  getResource: jest.fn(resourceType => {
    const data = {
      data: {
        topology: {
          resources: [
            {
              id: "application--helloworld-local",
              type: "application",
              specs: {
                raw: {
                  apiVersion: "app.k8s.io/v1beta1",
                  kind: "Application",
                  metadata: {
                    name: "helloworld-local",
                    namespace: "acm"
                  },
                  spec: {}
                }
              }
            },
            {
              id: "application--helloworld-local",
              type: "service",
              specs: {
                raw: {
                  apiVersion: "v1",
                  kind: "Service",
                  metadata: {
                    name: "helloworld-app-svc",
                    namespace: "argo-helloworld"
                  }
                }
              }
            }
          ]
        }
      }
    };
    return Promise.resolve(data);
  }),
  get: jest.fn(resourceType => {
    const data = {
      data: {
        items: []
      }
    };
    return Promise.resolve(data);
  }),
  search: jest.fn(resourceType => {
    const data = {
      data: {
        searchResult: []
      }
    };
    return Promise.resolve(data);
  })
}));

jest.mock("../../../../../lib/client/access-helper.js", () => ({
  canCallAction: jest.fn(() => {
    const data = {
      data: {
        userAccess: {
          allowed: true
        }
      }
    };
    return Promise.resolve(data);
  }),
  canCreateActionAllNamespaces: jest.fn(() => {
    const data = {
      data: {
        userAccessAnyNamespaces: true
      }
    };
    return Promise.resolve(data);
  })
}));

const React = require("../../../../../node_modules/react");

import ResourceDetails from "../../../../../src-web/components/common/ResourceDetails";

import renderer from "react-test-renderer";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { BrowserRouter } from "react-router-dom";
import thunkMiddleware from "redux-thunk";

import {
  reduxStoreAppPipelineWithCEM_Inception,
  resourceType,
  staticResourceDataApp,
  HCMApplication,
  topology
} from "../../../components/TestingData";

const middleware = [thunkMiddleware];
const mockStore = configureMockStore(middleware);
const storeApp = mockStore(reduxStoreAppPipelineWithCEM_Inception);

const getVisibleResourcesFn = (state, store) => {
  const items = {
    normalizedItems: {
      "samplebook-gbapp-sample": HCMApplication
    }
  };
  return items;
};

const mockData = {
  getVisibleResources: getVisibleResourcesFn,
  location: {
    pathname: "/multicloud/applications/sample/samplebook-gbapp"
  },
  match: {
    isExact: true,
    path: "/multicloud/applications/:namespace/:name?",
    url: "/multicloud/applications/sample/samplebook-gbapp",
    params: {
      name: "samplebook-gbapp",
      namespace: "sample"
    }
  }
};

describe("ResourceDetails", () => {
  it("ResourceDetails renders correctly with data on single app with fectch resource on reload.", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <Provider store={storeApp}>
            <ResourceDetails
              topology={topology}
              item={HCMApplication}
              match={mockData.match}
              loading={false}
              location={mockData.location}
              tabs={[]}
              routes={[]}
              params={mockData.match.params}
              getVisibleResources={mockData.getVisibleResources}
              resourceType={resourceType}
              staticResourceData={staticResourceDataApp}
            />
          </Provider>
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
