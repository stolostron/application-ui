/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import moment from "moment";
import "moment/min/locales";

import {
  mapCell,
  getAge
} from "../../../../src-web/containers/IncidentsTab/utils";

const incident1 = {
  createdTime: "2020-02-18T23:56:15Z",
  description: "b",
  escalated: "",
  id: "aa:lastChanged",
  lastChanged: "2020-02-19",
  owner: "",
  priority: "",
  state: "",
  summary: "",
  team: ""
};

const incident2 = {
  createdTime: "2020-02-18T23:56:15Z",
  description: "b",
  escalated: "",
  id: "aa:createdTime",
  lastChanged: "2020-02-19",
  owner: "",
  priority: "",
  state: "",
  summary: "",
  team: ""
};

const testAge = (value, locale) => {
  if (value) {
    if (value.includes("T")) {
      const momentObj = moment(value, "YYYY-MM-DDTHH:mm:ssZ");
      momentObj && momentObj.locale(locale && locale.toLowerCase());
      return momentObj && momentObj.fromNow();
    } else {
      const momentObj = moment(value, "YYYY-MM-DD HH:mm:ss");
      momentObj && momentObj.locale(locale && locale.toLowerCase());
      return momentObj && momentObj.fromNow();
    }
  }
  return "-";
};

describe("getAge", () => {
  it("should return incident getAge", () => {
    const time = "2020-02-18T23:56:15Z";
    const locale = "en-us";

    expect(getAge(time, locale)).toEqual(testAge(time, locale));
  });

  it("should return incident getAge", () => {
    const result = "-";
    expect(getAge(undefined, "en-us")).toEqual(result);
  });
});

describe("mapCell", () => {
  it("should return incident cell1", () => {
    const result = "-";
    expect(mapCell(incident1, "en-us")).toEqual(result);
  });

  it("should return incident cell2", () => {
    const result = "-";
    expect(mapCell(incident2, "en-us")).toEqual(result);
  });
});
