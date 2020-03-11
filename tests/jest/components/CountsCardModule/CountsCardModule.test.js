/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

const React = require("react");
const renderer = require("react-test-renderer");
const CountsCardModule = require("../../../../src-web/components/CountsCardModule")
  .default;
const mockStore = configureStore([]);

describe("CountsCardModule", () => {
  let store;

  // values from the mocked store
  beforeEach(() => {
    store = mockStore({
      actions: null
    });
  });

  it("CountsCardModule renders correctly.", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <CountsCardModule
            data={countsCardData}
            title="Test Counts Card"
            link="https://www.ibm.com"
          />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("CountsCardModule renders correctly. (no title, no link)", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <CountsCardModule data={countsCardData} />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("CountsCardModule renders correctly. (empty params)", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <CountsCardModule />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

const countsCardData = [
  {
    msgKey: "dashboard.card.deployables",
    textKey: "dashboard.card.perInstance",
    count: 6,
    border: "right",
    targetLink: "abc"
  },
  {
    msgKey: "dashboard.card.deployments",
    textKey: "dashboard.card.total",
    count: 38,
    targetTab: 1
  },
  {
    msgKey: "dashboard.card.deployment.completed",
    textKey: "dashboard.card.deployments",
    count: 24,
    targetTab: 1
  },
  {
    msgKey: "dashboard.card.deployment.inProgress",
    textKey: "dashboard.card.deployments",
    count: 10,
    targetTab: 1
  },
  {
    msgKey: "dashboard.card.deployment.failed",
    textKey: "dashboard.card.deployments",
    count: 4,
    alert: true,
    targetTab: 1,
    targetLink: "def"
  },
  {
    msgKey: "dashboard.card.incidents",
    textKey: "dashboard.card.total",
    count: 2,
    alert: true,
    targetTab: 2,
    border: "left"
  }
];
