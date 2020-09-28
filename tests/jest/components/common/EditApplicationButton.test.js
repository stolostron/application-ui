// Copyright (c) 2020 Red Hat, Inc.
"use strict";

import React from "react";
import renderer from "react-test-renderer";
import { BrowserRouter } from "react-router-dom";
import EditApplicationButton from "../../../../src-web/components/common/EditApplicationButton";

describe("EditApplicationButton", () => {
  it("renders correctly", () => {
    const component = renderer.create(
      <BrowserRouter>
        <EditApplicationButton path="/example/foo" />
      </BrowserRouter>
    );
    expect(component.root.findByType("a").props.href).toEqual("/example/foo");
    expect(component.root.findByType("button")).toBeTruthy();
  });
});
