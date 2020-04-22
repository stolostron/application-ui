/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

import {
  getStandaloneSubscriptions,
  getDataByKind,
  determineStatus
} from "../../../../../../src-web/components/ApplicationDeploymentPipeline/components/PipelineGrid/utils";

import {
  resultSubscriptionsWithChannel,
  resultNoApps
} from "../../../../components/ReducersTestingData";

describe("getDataByKind", () => {
  // basic test cases

  it("subscriptions empty", () => {
    expect(getDataByKind(undefined, "")).toEqual({});
  });
});

describe("determineStatus", () => {
  it("subscriptions empty", () => {
    expect(determineStatus([0, 0, 0, 0, 0], "some other value")).toEqual([
      0,
      0,
      0,
      0,
      1
    ]);
  });
});

// filter out subscriptions that have an app
describe("getStandaloneSubscriptions", () => {
  // subscriptions empty
  const subEmpty = [];
  // subscriptions with related empty
  const subRelatedEmpty = [
    { name: "n1", related: [] },
    { name: "n2", related: [] }
  ];
  // subscriptions with related with app
  const subRelatedWithApp = [
    { related: [{ kind: "application", name: "app1" }] }
  ];
  // // subscriptions with related with no app
  const subRelatedWithNoApp = [
    { related: [{ kind: "channel", name: "channel1" }] }
  ];

  const subRelatedMixed = [
    { related: [{ kind: "channel", name: "channel1" }] },
    { related: [{ kind: "blah" }] },
    { related: [{ kind: "application", name: "app1" }] },
    { related: [{ kind: "application", name: "app2" }] },
    { related: [] }
  ];

  const subRelatedMixedResult = [
    { related: [{ kind: "channel", name: "channel1" }] },
    { related: [{ kind: "blah" }] },
    { related: [] }
  ];

  // basic test cases
  it("subscriptions empty", () => {
    expect(getStandaloneSubscriptions(subEmpty)).toEqual([]);
  });

  it("subscriptions with related empty", () => {
    expect(getStandaloneSubscriptions(subRelatedEmpty)).toEqual(
      subRelatedEmpty
    );
  });
  it("subscriptions with related with app", () => {
    expect(getStandaloneSubscriptions(subRelatedWithApp)).toEqual([]);
  });
  it("subscriptions with related with no app", () => {
    expect(getStandaloneSubscriptions(subRelatedWithNoApp)).toEqual(
      subRelatedWithNoApp
    );
  });
  it("subscriptions with mixed elements, two app", () => {
    expect(getStandaloneSubscriptions(subRelatedMixed)).toEqual(
      subRelatedMixedResult
    );
  });

  // test cases with sample data
  it("subscription sample data with channel", () => {
    expect(getStandaloneSubscriptions(resultSubscriptionsWithChannel)).toEqual(
      resultSubscriptionsWithChannel
    );
  });

  it("subscription sample data with no apps", () => {
    expect(getStandaloneSubscriptions(resultNoApps)).toEqual(resultNoApps);
  });
});
