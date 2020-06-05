/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/
"use strict";

import { FilterButton } from "../../../../../src-web/components/Topology/viewer/TypeFilterBar";
import renderer from "react-test-renderer";
import React from "react";

describe("FilterButton basic render", () => {
  const mockData = {
    type: "application",
    displayName: "application",
    selected: false,
    toolip: "application",
    typeToShapeMap: {
      application: {
        shape: "application",
        className: "design",
        nodeRadius: 30
      },
      deployable: { shape: "deployable", className: "design" },
      subscription: { shape: "subscription", className: "design" },
      rules: { shape: "rules", className: "design" },
      clusters: { shape: "cluster", className: "container" },
      helmrelease: { shape: "chart", className: "container" },
      package: { shape: "chart", className: "container" },
      internet: { shape: "cloud", className: "internet" },
      host: { shape: "host", className: "host" },
      policy: { shape: "roundedSq", className: "design", nodeRadius: 30 },
      placement: { shape: "placement", className: "design" },
      cluster: { shape: "cluster", className: "container" },
      service: { shape: "service", className: "service" },
      deployment: { shape: "deployment", className: "deployment" },
      daemonset: { shape: "star4", className: "daemonset" },
      statefulset: { shape: "cylinder", className: "statefulset" },
      pod: { shape: "pod", className: "pod" },
      container: { shape: "irregularHexagon", className: "container" },
      cronjob: { shape: "clock", className: "default" },
      spare1: { shape: "star4", className: "daemonset" },
      spare2: { shape: "roundedSq", className: "daemonset" },
      spare3: { shape: "hexagon", className: "daemonset" },
      spare4: { shape: "irregularHexagon", className: "daemonset" },
      spare5: { shape: "roundedRect", className: "daemonset" }
    },
    handleClickFunc: jest.fn()
  };
  it("renders as expected", () => {
    const component = renderer.create(
      <FilterButton
        key={mockData.type}
        label={mockData.displayName}
        selected={mockData.selected}
        typeToShapeMap={mockData.typeToShapeMap}
        tooltip={mockData.tooltip}
        handleClick={mockData.handleClickFunc}
      />
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
