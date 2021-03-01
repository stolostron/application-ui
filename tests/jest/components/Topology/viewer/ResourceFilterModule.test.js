// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
"use strict";

import {
  ResourceFilterView,
  ResourceFilterModule
} from "../../../../../src-web/components/Topology/viewer/ResourceFilterModule";
import renderer from "react-test-renderer";
import React from "react";

const mockViewData = {
  activeFilters: {
    resourceStatuses: new Set(["red", "orange", "yellow"]),
    type: [
      "application",
      "cluster",
      "placements",
      "service",
      "statefulset",
      "storageclass",
      "subscription"
    ]
  },
  availableFilters: {
    namespaces: {
      name: "Namespaces",
      availableSet: new Set(["cassandra-ns", "cluster-scoped"])
    },
    resourceStatuses: {
      name: "Resource status",
      availableSet: new Map([
        ["green", "Success"],
        ["orange", "Pending"],
        ["yellow", "Warning"],
        ["red", "Error"]
      ])
    },
    resourceTypes: {
      name: "Types",
      availableSet: new Set(["statefulset", "service", "storageclass"])
    },
    type: [
      "application",
      "cluster",
      "placements",
      "service",
      "statefulset",
      "storageclass",
      "subscription"
    ]
  },
  locale: "en-US",
  onClose: jest.fn(),
  updateFilters: jest.fn()
};

const mockModuleData = {
  activeFilters: {
    resourceStatuses: new Set(["red", "orange", "yellow"]),
    type: [
      "application",
      "cluster",
      "placements",
      "service",
      "statefulset",
      "storageclass",
      "subscription"
    ]
  },
  availableFilters: {
    namespaces: {
      name: "Namespaces",
      availableSet: new Set(["cassandra-ns", "cluster-scoped"])
    },
    resourceStatuses: {
      name: "Resource status",
      availableSet: new Map([
        ["green", "Success"],
        ["orange", "Pending"],
        ["yellow", "Warning"],
        ["red", "Error"]
      ])
    },
    resourceTypes: {
      name: "Types",
      availableSet: new Set(["statefulset", "service", "storageclass"])
    },
    type: [
      "application",
      "cluster",
      "placements",
      "service",
      "statefulset",
      "storageclass",
      "subscription"
    ]
  },
  locale: "en-US",
  portals: {
    assortedFilterOpenBtn: "assorted-filter-open-portal-id",
    assortedFilterCloseBtns: "assorted-filter-close-portal-id",
    typeFilterBar: "type-filter-bar-portal-id",
    searchTextbox: "search-textbox-portal-id"
  },
  updateActiveFilters: jest.fn()
};

describe("Test ResourceFilterView renderView", () => {
  it("should render the html", () => {
    const rfv = new ResourceFilterView();

    rfv.renderView({ style: {}, props: {} });
  });
});

describe("ResourceFilterView", () => {
  it("renders as expected", () => {
    const component = renderer.create(
      <ResourceFilterView
        activeFilters={mockViewData.activeFilters}
        availableFilters={mockViewData.availableFilters}
        locale={mockViewData.locale}
        onClose={mockViewData.onClose}
        updateFilters={mockViewData.updateFilters}
      />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});

describe("ResourceFilterModule", () => {
  it("renders as expected", () => {
    const component = renderer.create(
      <ResourceFilterModule
        activeFilters={mockModuleData.activeFilters}
        availableFilters={mockModuleData.availableFilters}
        locale={mockModuleData.locale}
        portals={mockModuleData.portals}
        updateActiveFilters={mockModuleData.updateActiveFilters}
      />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
