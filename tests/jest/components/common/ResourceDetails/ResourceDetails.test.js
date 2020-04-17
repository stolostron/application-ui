/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
jest.mock("../../../../../lib/client/apollo-client", () => ({
  getClient: jest.fn(() => {
    return null;
  }),
  fetchResource: jest.fn((resourceType, namespace, name) => {
    const data = {
      data: {
        items: [
          {
            metadata: {
              creationTimestamp: "2020-04-06T22:27:05Z",
              generation: 2,
              name: "guestbook-app",
              namespace: "default",
              resourceVersion: "840144",
              selfLink:
                "/apis/app.k8s.io/v1beta1/namespaces/default/applications/guestbook-app",
              uid: "0221dae9-b6b9-40cb-8cba-473011a750e0"
            },
            raw: {
              apiVersion: "app.k8s.io/v1beta1",
              kind: "Application",
              metadata: {
                creationTimestamp: "2020-04-06T22:27:05Z",
                generation: 2,
                name: "guestbook-app",
                namespace: "default",
                resourceVersion: "840144",
                selfLink:
                  "/apis/app.k8s.io/v1beta1/namespaces/default/applications/guestbook-app",
                uid: "0221dae9-b6b9-40cb-8cba-473011a750e0"
              }
            }
          }
        ]
      }
    };

    return Promise.resolve(data);
  }),
  getResource: jest.fn((resourceType, variables) => {
    const data = {
      data: {
        items: [
          {
            metadata: {
              creationTimestamp: "2020-04-06T22:27:05Z",
              generation: 2,
              name: "guestbook-app",
              namespace: "default",
              resourceVersion: "840144",
              selfLink:
                "/apis/app.k8s.io/v1beta1/namespaces/default/applications/guestbook-app",
              uid: "0221dae9-b6b9-40cb-8cba-473011a750e0"
            },
            raw: {
              apiVersion: "app.k8s.io/v1beta1",
              kind: "Application",
              metadata: {
                creationTimestamp: "2020-04-06T22:27:05Z",
                generation: 2,
                name: "guestbook-app",
                namespace: "default",
                resourceVersion: "840144",
                selfLink:
                  "/apis/app.k8s.io/v1beta1/namespaces/default/applications/guestbook-app",
                uid: "0221dae9-b6b9-40cb-8cba-473011a750e0"
              }
            }
          }
        ]
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

import {
  reduxStoreAppPipeline,
  resourceType,
  staticResourceDataApp,
  HCMApplication
} from "../../../components/TestingData";

const mockStore = configureMockStore();
const storeApp = mockStore(reduxStoreAppPipeline);

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
  it("ResourceDetails renders correctly with data on single app.", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <Provider store={storeApp}>
            <ResourceDetails
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
