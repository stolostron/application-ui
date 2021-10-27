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
  createFilter,
  searchObjArr,
  multiFilter,
  mapAndMultiFilterResoucesSelector
} from "../../../src-web/shared/filters";

describe("createFilter", () => {
  const items = [{ key: "k1" }, { key: "k2" }, { key: "k3" }, { key: "k4" }];
  const matchValues = ["k1"];

  it("should return the item has k1 as the key", () => {
    expect(createFilter("key", matchValues)(items)).toEqual([{ key: "k1" }]);
    expect(createFilter("key", matchValues)(items)).toHaveLength(1);
  });

  it("should return the original item list", () => {
    expect(createFilter("key", null)(items)).toBe(items);
  });

  it("should return the original item list", () => {
    expect(createFilter("key", [])(items)).toBe(items);
  });

  it("should return an empty list", () => {
    expect(createFilter("key", ["k5"])(items)).toEqual([]);
  });
});

describe("searchObjArr", () => {
  it("should return single element", () => {
    expect(searchObjArr("hello", ["hello", "world"])).toEqual(["hello"]);
  });

  it("should return the original item list", () => {
    expect(searchObjArr("", ["hello", "world"])).toEqual(["hello", "world"]);
  });
});

describe("multiFilter", () => {
  it("should return an empty list", () => {
    expect(multiFilter()).toEqual([]);
  });
});

describe("mapAndMultiFilterResoucesSelector", () => {
  const item = {
    filters: {
      selectedRepos: "repo",
      searchText: "search"
    },
    items: [
      {
        name: "name",
        repoName: "repo",
        url: "url"
      }
    ]
  };
  it("should return an empty list", () => {
    expect(mapAndMultiFilterResoucesSelector(item)).toEqual([]);
  });
});
