/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
jest.mock("../../../../lib/client/apollo-client", () => ({
  getSearchClient: jest.fn(() => {
    return null;
  }),
  get: jest.fn(resourceType => {
    const error = {
      resourceType: resourceType,
      errors: ["some multi error"]
    };

    return Promise.resolve(error);
  }),
  search: jest.fn((searchQuery, searchInput) => {
    const error = {
      errors: ["some multi error"]
    };
    return Promise.resolve(error);
  }),
  getResource: jest.fn((resourceType, { namespace }) => {
    const error = {
      resourceType: resourceType,
      errors: ["some multi error"]
    };
    return Promise.resolve(error);
  })
}));

const React = require("../../../../node_modules/react");

import ApplicationDeploymentPipeline from "../../../../src-web/components/ApplicationDeploymentPipeline";

import thunkMiddleware from "redux-thunk";

import renderer from "react-test-renderer";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";

import { reduxStoreAllAppsPipeline, serverProps } from "../TestingData";

const middleware = [thunkMiddleware];
const mockStore = configureMockStore(middleware);
const storeAllApps = mockStore(reduxStoreAllAppsPipeline);

it("ApplicationDeploymentPipeline renders correctly with data on all apps; call this again to allow more coverage on fecth calls.", () => {
  const tree = renderer
    .create(
      <Provider store={storeAllApps}>
        <ApplicationDeploymentPipeline serverProps={serverProps} />
      </Provider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
