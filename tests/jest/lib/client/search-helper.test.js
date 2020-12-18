/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

import {
  convertStringToQuery,
  formatNumber
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
