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
  roleReceiveSuccess,
  roleReceiveFailure
} from "../../../src-web/actions/role";

import * as Actions from "../../../src-web/actions/index";

describe("roleReceiveSuccess ", () => {
  it("should return a success state", () => {
    const input = {
      type: Actions.ROLE_RECEIVE_SUCCESS,
      role: "Admin"
    };
    const expectedValue = {
      role: {
        role: "Admin",
        type: "ROLE_RECEIVE_SUCCESS"
      },
      type: "ROLE_RECEIVE_SUCCESS"
    };
    expect(roleReceiveSuccess(input)).toEqual(expectedValue);
  });

  it("should return a failure state", () => {
    const input = {
      type: Actions.ROLE_RECEIVE_FAILURE,
      role: "Admin"
    };
    const expectedValue = {
      err: {
        role: "Admin",
        type: "ROLE_RECEIVE_FAILURE"
      },
      type: "ROLE_RECEIVE_FAILURE"
    };
    expect(roleReceiveFailure(input)).toEqual(expectedValue);
  });
});
