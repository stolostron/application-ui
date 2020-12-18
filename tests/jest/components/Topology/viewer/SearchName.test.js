/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/
"use strict";

import Search from "../../../../../src-web/components/Topology/viewer/SearchName";
import renderer from "react-test-renderer";

const testSearchName = "test";
const locale = "en-US";

describe("SearchName search", () => {
  let btn = document.createElement("a");
  btn.innerHTML = "<button className='bx--search-close' />";
  btn.className = "bx--search-close";
  document.body.appendChild(btn);
  const props = {
    searchName: testSearchName,
    onNameSearch: jest.fn(),
    locale: locale
  };

  const searchInst = new Search(props);
  searchInst.setNameSearchRef(document);
  searchInst.handleSearch({ target: { value: "test" } });
  it("render as expected", () => {
    const component = renderer.create(searchInst.render());
    expect(component.toJSON()).toMatchSnapshot();
  });
});
