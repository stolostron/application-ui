// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

import {
  convertStringToQuery,
  formatNumber,
  isSearchAvailable,
  isYAMLEditAvailable,
  searchError,
  searchFailure,
  searchSuccess,
  shouldTrySearch
} from "../../../../lib/client/search-helper";

describe("convertStringToQuery", () => {
  it("empty string - application", () => {
    const input = "kind:application";
    const expectedOutput = {
      filters: [{ property: "kind", values: ["application"] }],
      keywords: [],
      relatedKinds: []
    };
    const output = convertStringToQuery(input);
    expect(output).toEqual(expectedOutput);
  });

  it("empty string - channel", () => {
    const input = "kind:channel";
    const expectedOutput = {
      keywords: [],
      filters: [{ property: "kind", values: ["channel"] }],
      relatedKinds: ["subscription"]
    };
    const output = convertStringToQuery(input);
    expect(output).toEqual(expectedOutput);
  });

  it("empty string - subscription", () => {
    const input = "kind:subscription";
    const expectedOutput = {
      keywords: [],
      filters: [{ property: "kind", values: ["subscription"] }],
      relatedKinds: [
        "placementrule",
        "deployable",
        "application",
        "subscription",
        "channel"
      ]
    };
    const output = convertStringToQuery(input);
    expect(output).toEqual(expectedOutput);
  });
});

describe("formatNumber", () => {
  it("0", () => {
    expect(formatNumber(0)).toEqual(0);
  });
  it("9999", () => {
    expect(formatNumber(9999)).toEqual("9.9k");
  });
  it("123", () => {
    expect(formatNumber(123)).toEqual(123);
  });
});

describe("search-helper function", () => {
  it("shouldTrySearch is intially true", () => {
    expect(shouldTrySearch()).toBe(true);
  });
  it("isSearchAvailable is intially true", () => {
    expect(isSearchAvailable()).toBe(true);
  });
  it("isYAMLEditAvailable is intially true", () => {
    expect(isYAMLEditAvailable()).toBe(true);
  });
  it("isSearchAvailable is false after failure", () => {
    searchFailure();
    expect(isSearchAvailable()).toBe(false);
  });
  it("isYAMLEditAvailable is true after failure", () => {
    expect(isYAMLEditAvailable()).toBe(true);
  });
  it("isSearchAvailable is false after error", () => {
    searchError();
    expect(isSearchAvailable()).toBe(false);
  });
  it("isYAMLEditAvailable is false after error", () => {
    expect(isYAMLEditAvailable()).toBe(false);
  });
  it("isSearchAvailable resets after success", () => {
    searchSuccess();
    expect(isSearchAvailable()).toBe(true);
  });
  it("isYAMLEditAvailable resets after success", () => {
    expect(isYAMLEditAvailable()).toBe(true);
  });
  it("shouldTrySearch is false after many failures/errors", () => {
    searchFailure();
    searchFailure();
    searchError();
    searchError();
    expect(shouldTrySearch()).toBe(false);
  });
});
