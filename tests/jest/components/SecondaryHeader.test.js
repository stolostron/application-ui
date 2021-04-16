/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
"use strict";

import React from "react";
import renderer from "react-test-renderer";
import { BrowserRouter } from "react-router-dom";

import { SecondaryHeader } from "../../../src-web/components/SecondaryHeader";

describe("SecondaryHeader component 1", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it("renders as expected with window size < 1200", () => {
    window.innerWidth = 1000;
    const navToggle = {
      addEventListener: jest.fn
    };
    const navBar = {
      className: "pf-m-expanded"
    };
    const secHeader = {
      style: {
        width: 1200
      }
    };

    jest.spyOn(document, "querySelector").mockImplementation(selector => {
      switch (selector) {
        case "#nav-toggle":
          return navToggle;
        case ".pf-c-page__sidebar":
          return navBar;
        case ".secondary-header":
          return secHeader;
      }
    });
    const component = renderer.create(
      <BrowserRouter>
        <SecondaryHeader title="hello world" />
      </BrowserRouter>
    );
    expect(component.toJSON()).toMatchSnapshot();
    expect(document.querySelector).toBeCalledTimes(3);
  });

  it("renders as expected with window size > 1200", () => {
    window.innerWidth = 1300;
    const navToggle = {
      addEventListener: jest.fn
    };
    const navBar = {
      className: "pf-m-expanded"
    };
    const secHeader = {
      style: {
        width: 1200
      }
    };

    jest.spyOn(document, "querySelector").mockImplementation(selector => {
      switch (selector) {
        case "#nav-toggle":
          return navToggle;
        case ".pf-c-page__sidebar":
          return navBar;
        case ".secondary-header":
          return secHeader;
      }
    });
    const component = renderer.create(
      <BrowserRouter>
        <SecondaryHeader title="hello world" />
      </BrowserRouter>
    );
    expect(component.toJSON()).toMatchSnapshot();
    expect(document.querySelector).toBeCalledTimes(3);
  });

  it("renders as expected with window size > 1200, navBar is not expanded", () => {
    window.innerWidth = 1300;
    const navToggle = {
      addEventListener: jest.fn
    };
    const navBarNotExpanded = {
      className: "pf-m-not-expanded"
    };
    const secHeader = {
      style: {
        width: 1200
      }
    };

    jest.spyOn(document, "querySelector").mockImplementation(selector => {
      switch (selector) {
        case "#nav-toggle":
          return navToggle;
        case ".pf-c-page__sidebar":
          return navBarNotExpanded;
        case ".secondary-header":
          return secHeader;
      }
    });
    const component = renderer.create(
      <BrowserRouter>
        <SecondaryHeader title="hello world" />
      </BrowserRouter>
    );
    expect(component.toJSON()).toMatchSnapshot();
    expect(document.querySelector).toBeCalledTimes(3);
  });
});

describe("SecondaryHeader component 2", () => {
  const tabs = [
    {
      id: "dashboard-application",
      label: "tabs.dashboard.application",
      url: "/multicloud/dashboard"
    }
  ];
  it("renders as expected", () => {
    const component = renderer.create(
      <BrowserRouter>
        <SecondaryHeader title="hello world" tabs={tabs} />
      </BrowserRouter>
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});

describe("SecondaryHeader component 3", () => {
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
  it("renders as expected", () => {
    const component = renderer.create(
      //eslint-disable-next-line
      <BrowserRouter>
        <SecondaryHeader title="hello world" tabs={tabs} location={location} />
      </BrowserRouter>
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
