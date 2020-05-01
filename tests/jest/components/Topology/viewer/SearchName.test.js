/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/
"use strict";

import React from "react";
import Search from "../../../../../src-web/components/Topology/viewer/SearchName";
import renderer from "react-test-renderer";

const emptySearchName = "";
const locale = "en-US";

describe("SearchName empty search", () => {
  let btn = document.createElement("a");
  btn.setAttribute("className", "bx--search-close");
  const props = {
    searchName: emptySearchName,
    onNameSearch: jest.fn(),
    locale: locale
  };
  const searchInst = new Search(props);
  searchInst.setNameSearchRef(btn);
  it("render as expected", () => {
    const component = renderer.create(searchInst.render());
    expect(component.toJSON()).toMatchSnapshot();
  });
});
