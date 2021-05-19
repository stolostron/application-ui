/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
jest.mock("../../../../../lib/client/apollo-client.js", () => ({
  getClient: jest.fn(() => {
    return null;
  }),
  getResource: jest.fn(resourceType => {
    const data = {
      data: {
        items: []
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
  search: jest.fn(resourceType => Promise.resolve({ response: resourceType }))
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

import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { BrowserRouter } from "react-router-dom";
import thunkMiddleware from "redux-thunk";

import {
  reduxStoreAppPipelineWithCEM,
  resourceType,
  staticResourceDataApp,
  HCMApplication,
  topology
} from "../../../components/TestingData";

const middleware = [thunkMiddleware];
const mockStore = configureMockStore(middleware);
const storeApp = mockStore(reduxStoreAppPipelineWithCEM);

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
    const tree = mount(
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
    ).render();
    expect(toJson(tree)).toMatchSnapshot();
  });
});
