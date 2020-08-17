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

import { updateNSControls } from "../../../../../src-web/components/ApplicationCreationPage/controlData/ControlData";

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
