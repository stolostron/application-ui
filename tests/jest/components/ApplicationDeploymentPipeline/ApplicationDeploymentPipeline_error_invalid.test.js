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
    return Promise.resolve({
      response: {
        other_value: { test: "invalid resonse" }
      }
    });
  }),
  search: jest.fn((searchQuery, searchInput) => {
    return Promise.resolve(undefined);
  }),
  getResource: jest.fn((resourceType, { namespace }) => {
    return Promise.resolve({
      response: {
        other_value: { test: "invalid resonse" }
      }
    });
  })
}));
import ApplicationDeploymentPipeline from "../../../../src-web/components/ApplicationDeploymentPipeline";

const React = require("../../../../node_modules/react");

import thunkMiddleware from "redux-thunk";

import renderer from "react-test-renderer";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";

import {
  reduxStoreAllAppsPipeline,
  serverProps,
  selectedApp
} from "../TestingData";

const middleware = [thunkMiddleware];
const mockStore = configureMockStore(middleware);
const storeAllApps = mockStore(reduxStoreAllAppsPipeline);

// mock the Math.random() value
const mockMath = Object.create(global.Math);
mockMath.random = () => 0.5;
global.Math = mockMath;

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
