/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
"use strict";

import React from "react";
import renderer from "react-test-renderer";
import { BrowserRouter } from "react-router-dom";

import SecondaryHeader from "../../../src-web/components/SecondaryHeader";

const tabs = [
  {
    id: "logs-tab1",
    label: "tabs.dashboard.application",
    url: "/multicloud/dashboard"
  },
  {
    id: "logs-tab2",
    label: "tabs.dashboard",
    url: "/hello"
  }
];
const location = {
  pathname: "/hello"
};
const history = {
  location: {
    pathname: "/hello/oldPath"
  },
  state: {
    tabChange: true
  },
  action: "REPLACE"
};

const tooltip = {
  text: "text",
  link: "link",
  id: "fixID"
};

// mock the Math.random() value
const mockMath = Object.create(global.Math);
mockMath.random = () => 0.5;
global.Math = mockMath;

const breadcrumbItems = [
  {
    id: "logs-b1",
    label: "breadcrumb1",
    url: "breadcrumb1-url1"
  },
  {
    id: "logs-b2",
    label: "breadcrumb2",
    url: "breadcrumb2-url2"
  }
];

const actions = {
  primary: {
    action: "action1"
  },
  secondary: {
    action: "action2"
  }
};

describe("SecondaryHeader component 1", () => {
  it("renders as expected", () => {
    const component = renderer.create(
      <SecondaryHeader title="hello world" titleId="applications" />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});

describe("SecondaryHeader component 2", () => {
  const oneTab = [
    {
      id: "dashboard-application",
      label: "tabs.dashboard.application",
      url: "/multicloud/dashboard"
    }
  ];
  it("renders as expected", () => {
    const component = renderer.create(
      <SecondaryHeader title="hello world" tabs={oneTab} />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});

describe("SecondaryHeader component 3", () => {
  it("renders as expected", () => {
    const component = renderer.create(
      //eslint-disable-next-line
      <SecondaryHeader title="hello world" tabs={tabs} location={location} />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});

describe("SecondaryHeader component 4", () => {
  it("renders as expected", () => {
    const component = renderer.create(
      //eslint-disable-next-line
      <BrowserRouter>
        <SecondaryHeader
          title="hello world"
          tabs={tabs}
          location={location}
          history={history}
          tooltip={tooltip}
          breadcrumbItems={breadcrumbItems}
          actions={actions}
        />
      </BrowserRouter>
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
