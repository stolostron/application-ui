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
  truncateByWordLength,
  LC,
  getTranslation
} from "../../../../src-web/shared/utils/text";

describe("text truncateByWordLength", () => {
  it("should return text as expected", () => {
    expect(truncateByWordLength("hello world", 1)).toBe("hello...");
  });

  it("should return text as expected", () => {
    expect(truncateByWordLength("hello world", 20)).toBe("hello world.");
  });
});

describe("text LC", () => {
  it("should return text as expected", () => {
    expect(LC("Hello World")).toBe("hello world");
  });

  it("should return text as expected", () => {
    expect(LC(["Hello World"])).toEqual(["hello world"]);
  });

  it("should return text as expected", () => {
    expect(LC(undefined)).toBe(undefined);
  });
});

describe("text getTranslation", () => {
  it("should return text as expected", () => {
    expect(getTranslation("action", "US-en")).toBe("Action");
  });
});
