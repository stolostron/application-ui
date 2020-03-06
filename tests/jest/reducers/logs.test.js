/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
"use strict";

import { logs } from "../../../src-web/reducers/logs";
import * as Actions from "../../../src-web/actions";

describe("logs reducer", () => {
  it("should return logs reset status", () => {
    const state = {
      test: "test"
    };
    const action = {
      type: Actions.LOGS_RESET
    };
    const expectedValue = { logs: null, status: "DONE" };
    expect(logs(state, action)).toEqual(expectedValue);
  });

  it("should return logs LOGS_RECEIVE_IN_PROGRESS status", () => {
    const state = {
      test: "test"
    };
    const action = {
      type: Actions.LOGS_RECEIVE_IN_PROGRESS
    };
    const expectedValue = { status: "LOGS_RECEIVE_IN_PROGRESS", test: "test" };
    expect(logs(state, action)).toEqual(expectedValue);
  });

  it("should return logs LOGS_RECEIVE_SUCCESS status", () => {
    const state = {
      test: "test"
    };
    const action = {
      type: Actions.LOGS_RECEIVE_SUCCESS
    };
    const expectedValue = { status: "DONE", type: "LOGS_RECEIVE_SUCCESS" };
    expect(logs(state, action)).toEqual(expectedValue);
  });

  it("should return logs LOGS_RECEIVE_FAILURE status", () => {
    const state = {
      test: "test"
    };
    const action = {
      type: Actions.LOGS_RECEIVE_FAILURE,
      err: {
        details: "some error"
      }
    };
    const expectedValue = {
      errorMessage: "some error",
      status: "ERROR",
      statusCode: undefined,
      test: "test"
    };
    expect(logs(state, action)).toEqual(expectedValue);
  });

  it("should return logs invalid status", () => {
    const state = {
      test: "test"
    };
    const action = {
      type: "unknown"
    };
    const expectedValue = { test: "test" };
    expect(logs(state, action)).toEqual(expectedValue);
  });
});
