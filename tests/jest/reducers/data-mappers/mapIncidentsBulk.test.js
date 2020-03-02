/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import { mapIncidents } from "../../../../src-web/reducers/data-mappers/mapIncidents";

describe("data-mappers testing for mapIncidents", () => {
  it("should mold the data properly", () => {
    const incidents = [
      {
        createdTime: "a",
        description: "b",
        escalated: "",
        id: "",
        lastChanged: "",
        owner: "",
        priority: "",
        state: "",
        summary: "",
        team: ""
      }
    ];

    const result = [
      {
        createdTime: "a",
        description: "b",
        escalated: "",
        id: "",
        lastChanged: "",
        owner: "",
        priority: "",
        state: "",
        summary: "",
        team: ""
      }
    ];

    expect(mapIncidents(incidents)).toEqual(result);
  });

  it("should not break on empty response", () => {
    const apiResponse = [];

    expect(mapIncidents(apiResponse)).toEqual([]);
  });

  it("should not break on undefined response", () => {
    expect(mapIncidents(undefined)).toEqual([]);
  });
});
