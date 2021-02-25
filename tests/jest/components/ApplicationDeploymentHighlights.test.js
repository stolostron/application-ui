/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

const React = require("react");
const renderer = require("react-test-renderer");
const ApplicationDeploymentHighlights = require("../../../src-web/components/ApplicationDeploymentHighlights")
  .default;

const applications = {
  items: [
    {
      _uid: "local-cluster/5cd1d4c7-52aa-11ea-bf05-00000a102d26",
      name: "mortgage-app",
      namespace: "default",
      dashboard:
        "https://localhost:443/grafana/dashboard/db/mortgage-app-dashboard-via-federated-prometheus?namespace=default",
      clusterCount: 1,
      hubSubscriptions: [
        {
          _uid: "local-cluster/5cdc0d8d-52aa-11ea-bf05-00000a102d26",
          status: "Propagated",
          channel: "default/mortgage-channel",
          __typename: "Subscription"
        }
      ],
      created: "2020-02-18T23:57:04Z",
      __typename: "Application"
    },
    {
      _uid: "local-cluster/42d4c013-52b9-11ea-bf05-00000a102d26",
      name: "samplebook-gbapp",
      namespace: "sample",
      dashboard:
        "https://localhost:443/grafana/dashboard/db/samplebook-gbapp-dashboard-via-federated-prometheus?namespace=sample",
      clusterCount: 1,
      hubSubscriptions: [
        {
          _uid: "local-cluster/42d9ec27-52b9-11ea-bf05-00000a102d26",
          status: "Propagated",
          channel: "gbook-ch/guestbook",
          __typename: "Subscription"
        }
      ],
      created: "2020-02-19T01:43:43Z",
      __typename: "Application"
    },
    {
      _uid: "local-cluster/8f4799db-4cf4-11ea-a229-00000a102d26",
      name: "stocktrader-app",
      namespace: "stock-trader",
      dashboard: null,
      clusterCount: 0,
      hubSubscriptions: [],
      created: "2020-02-11T17:33:04Z",
      __typename: "Application"
    },
    {
      _uid: "local-cluster/e77e69a7-4d25-11ea-a229-00000a102d26",
      name: "subscribed-guestbook-application",
      namespace: "kube-system",
      dashboard: null,
      clusterCount: 2,
      hubSubscriptions: [
        {
          _uid: "local-cluster/98dce449-52b8-11ea-bf05-00000a102d26",
          status: "Propagated",
          channel: "default/hub-local-helm-repo",
          __typename: "Subscription"
        }
      ],
      created: "2020-02-11T23:26:18Z",
      __typename: "Application"
    }
  ]
};

const header = {
  breadcrumbItems: [
    { url: "/multicloud/applications" },
    { url: "/multicloud/applications/default/mortgage-app" }
  ]
};

describe("ApplicationDeploymentHighlights with an app selected", () => {
  const mockStore = configureStore([]);
  let store;
  // values from the mocked store
  beforeEach(() => {
    store = mockStore({
      QueryApplicationList: applications,
      secondaryHeader: header
    });
  });

  it("ApplicationDeploymentHighlights renders correctly with an app selected.", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <ApplicationDeploymentHighlights />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("ApplicationDeploymentHighlights with no app", () => {
  const mockStore = configureStore([]);
  let store;
  // values from the mocked store
  beforeEach(() => {
    store = mockStore({});
  });

  it("ApplicationDeploymentHighlights with no app renders correctly.", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <ApplicationDeploymentHighlights />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("ApplicationDeploymentHighlights with no app selection", () => {
  const mockStore = configureStore([]);
  let store;
  // values from the mocked store
  beforeEach(() => {
    store = mockStore({
      QueryApplicationList: applications,
      secondaryHeader: { breadcrumbItems: undefined }
    });
  });
  it("ApplicationDeploymentHighlights renders correctly when no app is selected.", () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <ApplicationDeploymentHighlights />
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
