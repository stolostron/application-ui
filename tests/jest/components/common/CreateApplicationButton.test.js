// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
"use strict";

let mockUserAccessAnyNamespaces = true;

jest.mock("../../../../lib/client/apollo-client", () => ({
  getUserAccessAllNamespaces: jest.fn(variables => {
    return Promise.resolve({
      data: {
        userAccessAnyNamespaces: mockUserAccessAnyNamespaces
      },
      loading: false,
      networkStatus: 7,
      stale: false
    });
  })
}));

import React from "react";
import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import { BrowserRouter } from "react-router-dom";
import CreateApplicationButton from "../../../../src-web/components/common/CreateApplicationButton";

describe("CreateApplicationButton", () => {
  mockUserAccessAnyNamespaces = true;
  const wrapper = mount(
    <BrowserRouter>
      <CreateApplicationButton />
    </BrowserRouter>
  );

  it("renders correctly when enabled", () => {
    wrapper.update();
    expect(toJson(wrapper.render())).toMatchSnapshot();
  });

  mockUserAccessAnyNamespaces = false;
  const wrapperDisabled = mount(
    <BrowserRouter>
      <CreateApplicationButton />
    </BrowserRouter>
  );

  it("renders correctly when disabled", () => {
    wrapperDisabled.update();
    expect(toJson(wrapperDisabled.render())).toMatchSnapshot();
  });
});
