// Copyright (c) 2020 Red Hat, Inc.
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
import renderer from "react-test-renderer";
import { BrowserRouter } from "react-router-dom";
import CreateApplicationButton from "../../../../src-web/components/common/CreateApplicationButton";

describe("CreateApplicationButton", () => {
  mockUserAccessAnyNamespaces = true;
  const componentEnabled = renderer.create(
    <BrowserRouter>
      <CreateApplicationButton />
    </BrowserRouter>
  );

  it("renders correctly when enabled", () => {
    const buttonClasses = componentEnabled.root.findByType("button").props
      .className;
    expect(buttonClasses).not.toContain("pf-m-disabled");
    expect(buttonClasses).not.toContain("pf-m-aria-disabled");
  });

  mockUserAccessAnyNamespaces = false;
  const componentDisabled = renderer.create(
    <BrowserRouter>
      <CreateApplicationButton />
    </BrowserRouter>
  );

  it("renders correctly when disabled", () => {
    const buttonClasses = componentDisabled.root.findByType("button").props
      .className;
    expect(buttonClasses).toContain("pf-m-aria-disabled");
  });
});
