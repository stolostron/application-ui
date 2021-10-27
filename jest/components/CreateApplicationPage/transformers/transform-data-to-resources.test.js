/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 ****************************************************************************** */
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

"use strict";

import { isFiltered } from "../../../../../src-web/components/ApplicationCreationPage/transformers/transform-data-to-resources";

describe("isFiltered", () => {
  const key = "status";
  const parentKey = 0;
  const parentObj1 = {
    status: "True",
    type: "ManagedClusterConditionAvailable"
  };
  const parentObj2 = { status: "True", type: "someOtherStatus" };

  it("isFiltered should return not filtered", () => {
    expect(isFiltered("True", key, parentKey, parentObj1)).toEqual(false);
  });

  it("isFiltered should return not filtered", () => {
    expect(isFiltered("True", key, parentKey, parentObj2)).toEqual(true);
  });

  it("isFiltered should return not filtered", () => {
    expect(isFiltered("True", key, parentKey, undefined)).toEqual(true);
  });

  it("isFiltered should return filtered", () => {
    expect(
      isFiltered(
        "True",
        "apps.open-cluster-management.io/git-path",
        "annotations",
        undefined
      )
    ).toEqual(false);
  });

  it("isFiltered should return not filtered", () => {
    expect(isFiltered("True", "someKey", "annotations", undefined)).toEqual(
      true
    );
  });
});
