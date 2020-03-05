/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

const React = require("../../../node_modules/react");

import ApplicationsTab from "../../../src-web/containers/ApplicationsTab";

import renderer from "react-test-renderer";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import configureMockStore from "redux-mock-store";

import {
  reduxStoreAppPipeline,
  reduxStoreAllAppsPipeline,
  serverProps
} from "../components/TestingData";

const mockStore = configureMockStore();
const storeApp = mockStore(reduxStoreAppPipeline);
const storeAllApps = mockStore(reduxStoreAllAppsPipeline);

const secondaryHeaderProps = {
  title: "routes.applications",
  tabs: [],
  resourceFilters: []
};

const resourceType = {
  name: "QueryApplications",
  list: "QueryApplicationList"
};

describe("ApplicationsTab", () => {
  it("ApplicationsTab renders correctly with data on single app.", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <Provider store={storeApp}>
            <ApplicationsTab
              serverProps={serverProps}
              secondaryHeaderProps={secondaryHeaderProps}
              resourceType={resourceType}
              status="DONE"
            />
          </Provider>
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("ApplicationsTab renders correctly with data on all app.", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <Provider store={storeAllApps}>
            <ApplicationsTab
              serverProps={serverProps}
              secondaryHeaderProps={secondaryHeaderProps}
              resourceType={resourceType}
              status="DONE"
            />
          </Provider>
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
