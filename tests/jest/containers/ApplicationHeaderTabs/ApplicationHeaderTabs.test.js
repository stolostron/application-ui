/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

const React = require("../../../../node_modules/react");

import ApplicationHeaderTabs from "../../../../src-web/containers/ApplicationHeaderTabs";

import { mount } from "enzyme";
import renderer from "react-test-renderer";
import { Provider } from "react-redux";

import configureMockStore from "redux-mock-store";

import {
  reduxStoreAppPipelineWithCEM,
  serverProps
} from "../../components/TestingData";

const mockStore = configureMockStore();

describe("ApplicationHeaderTabs", () => {
  it("has functioning onclick, one app", () => {
    const storeApp = mockStore(reduxStoreAppPipelineWithCEM);

    const component = mount(
      <Provider store={storeApp}>
        <ApplicationHeaderTabs
          showSingleApp={false}
          serverProps={serverProps}
        />
      </Provider>
    );
  });

  it("ApplicationHeaderTabs renders correctly.", () => {
    reduxStoreAppPipelineWithCEM.AppOverview.selectedAppTab = 2;
    const storeApp = mockStore(reduxStoreAppPipelineWithCEM);

    const tree = renderer
      .create(
        <Provider store={storeApp}>
          <ApplicationHeaderTabs
            showSingleApp={false}
            serverProps={serverProps}
          />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("ApplicationHeaderTabs renders correctly.", () => {
    reduxStoreAppPipelineWithCEM.AppOverview.selectedAppTab = 1;
    const storeApp = mockStore(reduxStoreAppPipelineWithCEM);

    const tree = renderer
      .create(
        <Provider store={storeApp}>
          <ApplicationHeaderTabs
            showSingleApp={true}
            serverProps={serverProps}
          />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("ApplicationHeaderTabs renders correctly.", () => {
    reduxStoreAppPipelineWithCEM.AppOverview.selectedAppTab = 2;
    const storeApp = mockStore(reduxStoreAppPipelineWithCEM);

    const tree = renderer
      .create(
        <Provider store={storeApp}>
          <ApplicationHeaderTabs
            showSingleApp={true}
            serverProps={serverProps}
          />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
