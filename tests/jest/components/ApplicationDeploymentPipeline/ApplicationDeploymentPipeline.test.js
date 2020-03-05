/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

const React = require("../../../../node_modules/react");

import ApplicationDeploymentPipeline from "../../../../src-web/components/ApplicationDeploymentPipeline";

import renderer from "react-test-renderer";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";

import {
  reduxStoreAppPipeline,
  reduxStoreAllAppsPipeline,
  serverProps,
  reduxStoreAllAppsPipelineNoChannels,
  reduxStoreAppPipelineNoChannels
} from "../TestingData";

const mockStore = configureMockStore();
const storeApp = mockStore(reduxStoreAppPipeline);
const storeAllApps = mockStore(reduxStoreAllAppsPipeline);
const storeAllAppsNoChannels = mockStore(reduxStoreAllAppsPipelineNoChannels);
const storeAppNoChannels = mockStore(reduxStoreAppPipelineNoChannels);

describe("ApplicationDeploymentPipeline", () => {
  it("ApplicationDeploymentPipeline renders correctly with data on single app.", () => {
    const tree = renderer
      .create(
        <Provider store={storeApp}>
          <ApplicationDeploymentPipeline serverProps={serverProps} />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("ApplicationDeploymentPipeline renders correctly with data on all apps.", () => {
    const tree = renderer
      .create(
        <Provider store={storeAllApps}>
          <ApplicationDeploymentPipeline serverProps={serverProps} />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("ApplicationDeploymentPipeline renders correctly with data on all apps no channels.", () => {
    const tree = renderer
      .create(
        <Provider store={storeAllAppsNoChannels}>
          <ApplicationDeploymentPipeline serverProps={serverProps} />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("ApplicationDeploymentPipeline renders correctly with data on one app no channels.", () => {
    const tree = renderer
      .create(
        <Provider store={storeAppNoChannels}>
          <ApplicationDeploymentPipeline serverProps={serverProps} />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
