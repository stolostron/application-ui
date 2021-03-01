/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

/*
For a given input, a selector should always produce the same output.
 */
import {
  combineFilters,
  receiveFiltersSuccess,
  updateResourceFilters
} from "../../../src-web/actions/filters";

describe("combineFilters ", () => {
  it("should return a empty filters", () => {
    const input = [];
    const expectedValue = { filter: { resourceFilter: [] } };
    expect(combineFilters(input)).toEqual(expectedValue);
  });

  it("should return filters succcess", () => {
    const resourceType = {
      name: "QueryApplications",
      list: "QueryApplicationList"
    };
    const input = ["test"];
    const expectedValue = {
      filters: { clusterSelector: [], clusterNames: [] },
      resourceType: ["test"],
      status: "DONE",
      type: "RESOURCE_FILTERS_RECEIVE_SUCCESS"
    };
    expect(receiveFiltersSuccess(resourceType, input)).toEqual(expectedValue);
  });

  it("should return updated filters", () => {
    const resourceType = {
      name: "QueryApplications",
      list: "QueryApplicationList"
    };
    const input = ["test"];
    const expectedValue = {
      resourceName: "QueryApplications",
      selectedFilters: ["test"],
      type: "RESOURCE_FILTERS_UPDATE"
    };
    expect(updateResourceFilters(resourceType, input)).toEqual(expectedValue);
  });
});
