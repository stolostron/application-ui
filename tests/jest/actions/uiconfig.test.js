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
import { uiConfigReceiveSucess } from "../../../src-web/actions/uiconfig";

describe("uiConfigReceiveSucess ", () => {
  it("should returns uiConfigReceiveSucess", () => {
    const uiConfig = {};

    const expectedValue = { data: {}, type: "UICONFIG_RECEIVE_SUCCESS" };
    expect(uiConfigReceiveSucess(uiConfig)).toEqual(expectedValue);
  });
});
