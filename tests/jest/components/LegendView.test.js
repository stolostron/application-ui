// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
"use strict";

import React from "react";
import renderer from "react-test-renderer";

import LegendView from "../../../src-web/components/Topology/viewer/LegendView";

class MockViewContainer {
  getBoundingClientRect() {
    return new Map();
  }
}

describe("LegendView no nodes", () => {
  const returnEmptyArr = jest.fn();
  returnEmptyArr.mockReturnValue([]);
  const viewContainer = jest.fn();
  viewContainer.mockReturnValue(new MockViewContainer());
  const mockData = {
    locale: "en-US",
    handleClose: jest.fn(),
    getLayoutNodes: returnEmptyArr,
    getViewContainer: viewContainer
  };
  it("renders as expected", () => {
    const component = renderer.create(
      <LegendView
        locale={mockData.locale}
        onClose={mockData.handleClose}
        getLayoutNodes={mockData.getLayoutNodes}
        getViewContainer={mockData.getViewContainer}
      />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});

const mockLaidoutNodes = {
  laidoutNodes: [
    {
      id: "application--mortgage-app",
      uid: "application--mortgage-app",
      name: "mortgage-app",
      type: "application",
      namespace: "default"
    },
    {
      id: "member--subscription--default--mortgage-app-subscription",
      uid: "member--subscription--default--mortgage-app-subscription",
      name: "mortgage-app-subscription",
      type: "subscription",
      namespace: "default"
    },
    {
      id: "member--rules--default--mortgage-app-placement--0",
      uid: "member--rules--default--mortgage-app-placement--0",
      name: "mortgage-app-placement",
      type: "placements",
      namespace: "default"
    },
    {
      id: "member--clusters--localcluster",
      uid: "member--clusters--localcluster",
      name: "localcluster",
      type: "cluster",
      namespace: ""
    },
    {
      id:
        "member--deployable--member--clusters--localcluster--default--mortgage-app-deployable",
      uid:
        "member--deployable--member--clusters--localcluster--default--mortgage-app-deployable",
      name: "mortgage-app-deployable",
      type: "deployable",
      namespace: "default"
    },
    {
      id:
        "member--member--deployable--member--clusters--localcluster--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
      uid:
        "member--member--deployable--member--clusters--localcluster--default--mortgage-app-deployable--deployment--mortgage-app-deploy",
      name: "mortgage-app-deploy",
      type: "deployment",
      namespace: ""
    },
    {
      id:
        "member--pod--member--deployable--member--clusters--localcluster--default--mortgage-app-deployable--mortgage-app-deploy",
      uid:
        "member--pod--member--deployable--member--clusters--localcluster--default--mortgage-app-deployable--mortgage-app-deploy",
      name: "mortgage-app-deploy",
      type: "deployment",
      namespace: ""
    },
    {
      id:
        "member--deployable--member--clusters--localcluster--default--mortgage-app-svc",
      uid:
        "member--deployable--member--clusters--localcluster--default--mortgage-app-svc",
      name: "mortgage-app-svc",
      type: "deployable",
      namespace: "default"
    },
    {
      id:
        "member--member--deployable--member--clusters--localcluster--default--mortgage-app-svc--service--mortgage-app-svc",
      uid:
        "member--member--deployable--member--clusters--localcluster--default--mortgage-app-svc--service--mortgage-app-svc",
      name: "mortgage-app-svc",
      type: "service",
      namespace: ""
    },
    {
      id: "deploymentconfig",
      uid: "deploymentconfig",
      name: "deploymentconfig",
      type: "deploymentconfig",
      namespace: ""
    },
    {
      id: "replicationcontroller",
      uid: "replicationcontroller",
      name: "replicationcontroller",
      type: "replicationcontroller",
      namespace: ""
    },
    {
      id: "securitycontextconstraints",
      uid: "securitycontextconstraints",
      name: "securitycontextconstraints",
      type: "securitycontextconstraints",
      namespace: ""
    },
    {
      id: "persistentvolumeclaim",
      uid: "persistentvolumeclaim",
      name: "persistentvolumeclaim",
      type: "persistentvolumeclaim",
      namespace: ""
    }
  ]
};

const mockLayoutNodes = jest.fn();
mockLayoutNodes.mockReturnValue(mockLaidoutNodes.laidoutNodes);
const mockData = {
  locale: "en-US",
  handleClose: jest.fn()
};

class MockViewContainer2 {
  getBoundingClientRect() {
    return { height: 667 };
  }
}

const viewContainer2 = jest.fn();
viewContainer2.mockReturnValue(new MockViewContainer2());

describe("LegendView with nodes", () => {
  it("render as expected", () => {
    const component = renderer.create(
      <LegendView
        locale={mockData.locale}
        onClose={mockData.handleClose}
        getLayoutNodes={mockLayoutNodes}
        getViewContainer={viewContainer2}
      />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
