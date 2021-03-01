/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright Contributors to the Open Cluster Management project
"use strict";
import { callOnEnter } from "../../../../src-web/shared/utils/event";

describe("event callOnEnter", () => {
  const fn = jest.fn();

  it("should throw an error", () => {
    expect(() => callOnEnter(undefined)).toThrow();
  });

  it("call back should not be executed", () => {
    callOnEnter(fn)({ key: "Click" });
    expect(fn).not.toHaveBeenCalled();
  });

  it("call back should be executed", () => {
    callOnEnter(fn)({ key: "Enter" });
    expect(fn).toHaveBeenCalled();
  });
});
