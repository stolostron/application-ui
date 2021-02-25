/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
"use strict";

/*
For a given input, a selector should always produce the same output.
 */

import { resourceFilters } from "../../../src-web/reducers/filter";
import * as Actions from "../../../src-web/actions";

describe("filter reducer", () => {
  it("should return a state with RESOURCE_FILTERS_RECEIVE_SUCCESS status", () => {
    const state = {
      test: "test"
    };
    const action = {
      type: Actions.RESOURCE_FILTERS_RECEIVE_SUCCESS,
      filters: {
        clusterName: "test",
        clusterSelector: "test"
      }
    };
    const expectedValue = {
      filters: { clusterSelector: "test", clusterNames: undefined },
      status: "DONE",
      test: "test"
    };
    expect(resourceFilters(state, action)).toEqual(expectedValue);
  });

  it("should return a state with RESOURCE_FILTERS_UPDATE status", () => {
    const state = {
      test: "test",
      selectedFilters: {}
    };
    const action = {
      type: Actions.RESOURCE_FILTERS_UPDATE,
      resourceName: "test",
      selectedFilters: {}
    };
    const expectedValue = { selectedFilters: { test: {} }, test: "test" };
    expect(resourceFilters(state, action)).toEqual(expectedValue);
  });
});
