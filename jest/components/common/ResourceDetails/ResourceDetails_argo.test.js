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
                  apiVersion: "argoproj.io/v1alpha1",
                  kind: "Application",
                  metadata: {
                    name: "helloworld-local",
                    namespace: "argocd"
                  },
                  spec: {
                    destination: {
                      namespace: "argo-helloworld",
                      server: "https://kubernetes.default.svc"
                    },
                    source: {
                      path: "helloworld",
                      repoURL: "https://github.com/test/app-samples",
                      targetRevision: "HEAD"
                    }
                  }
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
        searchResult: [
          {
            items: [
              {
                apigroup: "argoproj.io",
                apiversion: "v1alpha1",
                cluster: "local-cluster",
                destinationNamespace: "argo-helloworld",
                destinationServer: "https://api.app-aaa.com:6443",
                kind: "application",
                name: "helloworld-remote",
                namespace: "argocd",
                path: "helloworld",
                targetRevision: "HEAD",
                repoURL: "https://github.com/test/app-samples"
              },
              {
                apigroup: "argoproj.io",
                apiversion: "v1alpha1",
                cluster: "remote-cluster1",
                destinationNamespace: "argo-helloworld2",
                destinationName: "ui-dev-remote",
                kind: "application",
                name: "helloworld-remote2",
                namespace: "argocd",
                path: "helloworld",
                targetRevision: "HEAD",
                repoURL: "https://github.com/test/app-samples"
              },
              {
                apigroup: "argoproj.io",
                apiversion: "v1alpha1",
                cluster: "ui-dev-remote",
                destinationNamespace: "argo-helloworld2",
                destinationServer: "https://kubernetes.default.svc",
                kind: "application",
                name: "helloworld-remote3",
                namespace: "argocd",
                path: "helloworld",
                targetRevision: "HEAD",
                repoURL: "https://github.com/test/app-samples"
              }
            ]
          }
        ]
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
