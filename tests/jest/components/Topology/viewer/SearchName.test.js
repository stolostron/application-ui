// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
"use strict";

import Search from "../../../../../src-web/components/Topology/viewer/SearchName";
import renderer from "react-test-renderer";

const testSearchName = "test";
const locale = "en-US";

describe("SearchName search", () => {
  const props = {
    searchName: testSearchName,
    onNameSearch: jest.fn(),
    locale: locale
  };

  const searchInst = new Search(props);
  searchInst.setNameSearchRef(document);
  searchInst.handleSearch({ value: "test" });
  searchInst.handleClear();
  it("render as expected", () => {
    const component = renderer.create(searchInst.render());
    expect(component.toJSON()).toMatchSnapshot();
  });
});
