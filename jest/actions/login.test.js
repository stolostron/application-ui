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
  receiveLoginSuccess,
  receiveLogoutSuccess,
  receiveLogoutError,
  logoutStart
} from "../../../src-web/actions/login";

import * as Actions from "../../../src-web/actions/index";

describe("login ", () => {
  it("should return a receiveLoginSuccess state", () => {
    const input = {
      type: Actions.ROLE_RECEIVE_SUCCESS,
      role: "Admin"
    };
    const expectedValue = {
      loggedIn: "LOGGED_IN",
      type: "USER_LOGIN_RECEIVE_SUCCESS",
      user: {
        role: "Admin",
        type: "ROLE_RECEIVE_SUCCESS"
      }
    };

    expect(receiveLoginSuccess(input)).toEqual(expectedValue);
  });

  it("should return a receiveLogoutSuccess state", () => {
    const expectedValue = {
      loggedIn: "LOGGED_OUT",
      type: "USER_LOGOUT_RECEIVE_SUCCESS"
    };

    expect(receiveLogoutSuccess()).toEqual(expectedValue);
  });

  it("should return a receiveLogoutError state", () => {
    const expectedValue = {
      loggedIn: "LOGGED_IN",
      type: "USER_LOGOUT_RECEIVE_FAILURE"
    };

    expect(receiveLogoutError()).toEqual(expectedValue);
  });

  it("should return a logoutStart state", () => {
    const expectedValue = {
      loggedIn: "IN_PROGRESS",
      type: "USER_LOGOUT_REQUEST"
    };

    expect(logoutStart()).toEqual(expectedValue);
  });
});
