/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

import {
  convertStringToQuery,
  formatNumber
} from "../../../../lib/client/search-helper";

describe("convertStringToQuery", () => {
  it("empty string", () => {
    console.log(convertStringToQuery(""));
  });
});

describe("formatNumber", () => {
  it("0", () => {
    expect(formatNumber(123)).toEqual("0");
  });
  it("9999", () => {
    expect(formatNumber(9999)).toEqual("9k");
  });
  it("123", () => {
    expect(formatNumber(123)).toEqual("123");
  });
  it("9999", () => {
    expect(formatNumber(9999)).toEqual("9k");
  });
});
