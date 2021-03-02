// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
"use strict";

import React from "react";
import { mount } from "enzyme";
import { BrowserRouter, Router } from "react-router-dom";
import queryString from "query-string";
import QuerySwitcher, {
  getSelectedId
} from "../../../../src-web/components/common/QuerySwitcher";

const findById = (mountedComponent, id) =>
  mountedComponent.find(`#${id}`).at(0);

const click = (mountedComponent, id) =>
  findById(mountedComponent, id).simulate("click");

const isSelected = (mountedComponent, id) =>
  findById(mountedComponent, id).hasClass("pf-m-selected");

const options = [
  {
    id: "one",
    contents: "Items"
  },
  {
    id: "two",
    contents: "Things"
  },
  {
    id: "three",
    contents: "Stuff"
  }
];

const defaultOption = "two";

const queryParam = "foo";

const switcher = mount(
  <BrowserRouter>
    <QuerySwitcher options={options} />
  </BrowserRouter>
);

const switcherWithDefault = mount(
  <BrowserRouter>
    <QuerySwitcher options={options} defaultOption={defaultOption} />
  </BrowserRouter>
);

const switcherWithCustomQueryParm = mount(
  <BrowserRouter>
    <QuerySwitcher options={options} queryParam={queryParam} />
  </BrowserRouter>
);

describe("QuerySwitcher", () => {
  it("with no default has no intial selection", () => {
    options.forEach(option => {
      expect(isSelected(switcher, option.id)).toEqual(false);
    });
  });

  it("selects only 1 option", () => {
    options.forEach(selectedOption => {
      click(switcher, selectedOption.id);
      options.forEach(otherOption => {
        expect(isSelected(switcher, otherOption.id)).toEqual(
          otherOption.id === selectedOption.id
        );
      });
    });
  });

  it("has the default initially selected", () => {
    expect(isSelected(switcherWithDefault, defaultOption)).toEqual(true);
  });

  it("renders correctly with non-default query param", () => {
    click(switcherWithCustomQueryParm, "two");
    expect(
      switcherWithCustomQueryParm
        .find(Router)
        .at(0)
        .instance().props.history.location.search
    ).toEqual("?foo=two");
  });

  it("preserves other data in the query string", () => {
    const history = switcherWithDefault
      .find(Router)
      .at(0)
      .instance().props.history;
    history.push("/?other=data");
    click(switcherWithDefault, "three");
    expect(history.location.search).toContain("other=data");
    expect(history.location.search).toContain("resource=three");
  });
});

describe("getSelectedId", () => {
  it("works without a pre-parsed query string", () => {
    const location = switcherWithDefault
      .find(Router)
      .at(0)
      .instance().props.history.location;

    expect(getSelectedId({ location, options, defaultOption })).toEqual(
      "three"
    );
  });

  it("works with a pre-parsed query string", () => {
    const location = switcherWithDefault
      .find(Router)
      .at(0)
      .instance().props.history.location;
    const query = queryString.parse(location.search);

    expect(getSelectedId({ location, options, defaultOption, query })).toEqual(
      "three"
    );
  });
});
