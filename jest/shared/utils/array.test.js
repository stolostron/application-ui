/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright Contributors to the Open Cluster Management project
"use strict";
import {
  addOrRemove,
  findCommonElements
} from "../../../../src-web/shared/utils/array";

describe("array addOrRemove", () => {
  it("should return array as expected", () => {
    expect(addOrRemove(undefined, "name")).toEqual(["name"]);
  });

  it("should return array as expected", () => {
    expect(addOrRemove(["hello", "world"], "hello")).toEqual(["world"]);
  });

  it("should return array as expected", () => {
    expect(addOrRemove(["hello"], "hello")).toEqual([]);
  });

  it("should return array as expected", () => {
    expect(addOrRemove(["hello"], "world")).toEqual(["hello", "world"]);
  });
});

describe("array findCommonElements", () => {
  it("should return array as expected", () => {
    expect(typeof findCommonElements([{ value: "v1" }], null)).toBe("function");
  });

  it("should return array as expected", () => {
    expect(findCommonElements([{ value: "v1" }], ["v1"])).toEqual([]);
  });
});
