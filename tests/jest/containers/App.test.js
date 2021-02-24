/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
const React = require("../../../node_modules/react");

import App from "../../../src-web/containers/App";

import renderer from "react-test-renderer";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import configureMockStore from "redux-mock-store";

import { reduxStoreAppPipeline, serverProps } from "../components/TestingData";

const mockStore = configureMockStore();
const storeApp = mockStore(reduxStoreAppPipeline);

const secondaryHeaderProps = {
  title: "routes.applications",
  tabs: [],
  resourceFilters: []
};

const resourceType = {
  name: "QueryApplications",
  list: "QueryApplicationList"
};

const props = {
  className: "hcmapplication",
  content: "test",
  serverProps: serverProps
};

describe("App", () => {
  it("App renders correctly with data on single app.", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <Provider store={storeApp}>
            <App {...props} />
          </Provider>
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
