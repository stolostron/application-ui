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
  getResource: jest.fn(resourceType => {
    const error = {
      resourceType: resourceType,
      errors: ["some multi error"]
    };

    return Promise.resolve(error);
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

const React = require("../../../../../node_modules/react");

import ResourceDetails from "../../../../../src-web/components/common/ResourceDetails";

import renderer from "react-test-renderer";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { BrowserRouter } from "react-router-dom";
import thunkMiddleware from "redux-thunk";

import {
  reduxStoreAppPipelineWithCEM,
  resourceType,
  staticResourceDataApp,
  HCMApplication
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

const matchData = {
  isExact: true,
  path: "/multicloud/applications/:namespace/:name?",
  url: "/multicloud/applications/sample/samplebook-gbapp",
  params: {
    name: "samplebook-gbapp",
    namespace: "sample"
  }
};

const matchData2 = {
  isExact: false,

  params: {
    path: "/multicloud/applications",
    url: "/multicloud/applications"
  }
};

describe("ResourceDetails", () => {
  it("ResourceDetails renders correctly with data on single app.", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <Provider store={storeApp}>
            <ResourceDetails
              item={HCMApplication}
              match={matchData2}
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
