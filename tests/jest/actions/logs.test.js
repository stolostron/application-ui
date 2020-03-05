/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc
 * Copyright (c) 2020 Red Hat, Inc
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

/*
For a given input, a selector should always produce the same output.
 */
import {
  resetLogs,
  searchLogs,
  receiveLogsSuccess,
  receiveLogsFailure,
  receiveLogsInProgress
} from "../../../src-web/actions/logs";

describe("logs ", () => {
  it("should return a resetLogs state", () => {
    const expectedValue = { type: "LOGS_RESET" };

    expect(resetLogs()).toEqual(expectedValue);
  });

  it("should return a receiveLogsInProgress state", () => {
    const expectedValue = {
      status: "IN_PROGRESS",
      type: "LOGS_RECEIVE_IN_PROGRESS"
    };

    expect(receiveLogsInProgress()).toEqual(expectedValue);
  });

  it("should return a receiveLogsSuccess state", () => {
    const response = {};
    const expectedValue = {
      data: {},
      status: "DONE",
      type: "LOGS_RECEIVE_SUCCESS"
    };

    expect(receiveLogsSuccess(response)).toEqual(expectedValue);
  });

  it("should return a receiveLogsFailure state", () => {
    const response = {};
    const expectedValue = {
      data: {},
      status: "DONE",
      type: "LOGS_RECEIVE_FAILURE"
    };

    expect(receiveLogsFailure(response)).toEqual(expectedValue);
  });

  it("should return a searchLogs state", () => {
    const resourceType = {
      name: "QueryApplications",
      list: "QueryApplicationList"
    };
    const search = {};
    const expectedValue = {
      resourceType: { list: "QueryApplicationList", name: "QueryApplications" },
      search: {},
      type: "LOGS_SEARCH"
    };

    expect(searchLogs(search, resourceType)).toEqual(expectedValue);
  });
});
