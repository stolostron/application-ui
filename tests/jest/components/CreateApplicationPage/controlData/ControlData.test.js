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

import {
  updateNSControls,
  updatePlacementControls
} from "../../../../../src-web/components/ApplicationCreationPage/controlData/ControlData";

describe("updateNSControls with existing NS", () => {
  const urlControl = {
    id: "namespace",
    active: "acmtest-helmrepo-ns-sub",
    availableData: { "acmtest-helmrepo-ns-sub": {} }
  };
  const controlData = [{ id: "userDefinedNamespace" }];
  const result = { active: "", id: "userDefinedNamespace" };
  it("should return empty user data", () => {
    expect(updateNSControls(urlControl, controlData)).toEqual(result);
  });
});

describe("updateNSControls with new NS", () => {
  const urlControl = {
    active: "newNS",
    availableData: { "acmtest-helmrepo-ns-sub": {} }
  };
  const controlData = [{ id: "userDefinedNamespace" }];
  const result = { active: "newNS", id: "userDefinedNamespace" };
  it("should return new user data", () => {
    expect(updateNSControls(urlControl, controlData)).toEqual(result);
  });
});

describe("updatePlacementControls without controls", () => {
  const placementControl = {
    id: "local-cluster-checkbox",
    type: "checkbox",
    groupControlData: [{ id: "local-cluster-checkbox" }]
  };
  const result = [{ id: "local-cluster-checkbox" }];
  it("should return same data", () => {
    expect(updatePlacementControls(placementControl)).toEqual(result);
  });
});

describe("updatePlacementControls with controls", () => {
  const placementControl = {
    id: "local-cluster-checkbox",
    type: "checkbox",
    groupControlData: [
      {
        id: "local-cluster-checkbox",
        type: "checkbox"
      },
      {
        id: "online-cluster-only-checkbox",
        type: "checkbox"
      },
      {
        id: "clusterSelector",
        type: "custom"
      },
      {
        id: "clusterReplicas",
        type: "text"
      }
    ]
  };
  const result = [
    { id: "local-cluster-checkbox", type: "checkbox" },
    { id: "online-cluster-only-checkbox", type: "checkbox" },
    { id: "clusterSelector", type: "custom" },
    { id: "clusterReplicas", type: "text" }
  ];
  it("should return all data", () => {
    expect(updatePlacementControls(placementControl)).toEqual(result);
  });
});

describe("updatePlacementControls with controls", () => {
  const placementControl = {
    id: "local-cluster-checkbox",
    type: "checkbox",
    active: true,
    groupControlData: [
      {
        id: "local-cluster-checkbox",
        type: "checkbox"
      },
      {
        id: "online-cluster-only-checkbox",
        type: "checkbox"
      },
      {
        id: "clusterSelector",
        type: "custom"
      },
      {
        id: "clusterReplicas",
        type: "text"
      }
    ]
  };
  const result = [
    { id: "local-cluster-checkbox", type: "checkbox" },
    { id: "online-cluster-only-checkbox", type: "hidden" },
    { id: "clusterSelector", type: "hidden" },
    { id: "clusterReplicas", type: "hidden" }
  ];
  it("should return local only", () => {
    expect(updatePlacementControls(placementControl)).toEqual(result);
  });
});
