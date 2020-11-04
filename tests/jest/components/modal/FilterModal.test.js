/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
"use strict";

import React from "react";
import { shallow } from "enzyme";
import FilterModal from "../../../../src-web/components/modals/FilterModal";
import { availableFilters } from "./ModalsTestingData";

describe("FilterModal modal", () => {
  const handleModalClose = jest.fn();
  const handleModalSubmit = jest.fn();
  it("renders as expected", () => {
    const component = shallow(
      <FilterModal handleModalClose={handleModalClose} />
    );
    expect(component).toMatchSnapshot();
  });
  it("componentWillReceiveProps as expected", () => {
    const component = shallow(
      <FilterModal
        availableFilters={availableFilters}
        handleModalClose={handleModalClose}
      />
    );
    component.instance().UNSAFE_componentWillReceiveProps();
    expect(component.state().tags).toEqual([]);
    component
      .instance()
      .UNSAFE_componentWillReceiveProps({ selected: ["test"] });
    expect(component.state().tags).toEqual(["test"]);
  });
  it("convertFilterArray as expected", () => {
    const component = shallow(
      <FilterModal
        availableFilters={availableFilters}
        handleModalClose={handleModalClose}
      />
    );
    expect(
      component.instance().convertFilterArray(availableFilters)
    ).toMatchSnapshot();
  });
  it("convertFilterArray as expected", () => {
    const component = shallow(
      <FilterModal
        availableFilters={availableFilters}
        handleModalClose={handleModalClose}
      />
    );
    expect(
      component
        .instance()
        .createFilterTable(
          availableFilters,
          ["testConvertFilterArray"],
          jest.fn()
        )
    ).toMatchSnapshot();
  });
  it("selectionChanged as expected", () => {
    const component = shallow(
      <FilterModal
        availableFilters={availableFilters}
        handleModalClose={handleModalClose}
      />
    );
    component
      .instance()
      .selectionChanged(["testSelectionChanged1", "testSelectionChanged2"]);
    expect(component.state()).toMatchSnapshot();
  });
  it("handleSubmitClick as expected", () => {
    const component = shallow(
      <FilterModal
        availableFilters={availableFilters}
        handleModalClose={handleModalClose}
        handleModalSubmit={handleModalSubmit}
      />
    );
    component.instance().handleSubmitClick();
    expect(component.state()).toMatchSnapshot();
  });
});
