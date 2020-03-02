/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
"use strict";
var fs = require("fs");

import {
  getChannelSampleByType,
  channelNamespaceSample,
  channelHelmRepoSample,
  getChannelSample,
  getApplicationSample,
  getPlacementRuleSample,
  getSubscriptionSample
} from "../../../../src-web/shared/yamlSamples";

describe("getChannelSampleByType", () => {
  it("should return channel Namespace", () => {
    expect(getChannelSampleByType("Namespace")).toEqual(channelNamespaceSample);
  });
  it("should return channel HelmRepo", () => {
    expect(getChannelSampleByType("HelmRepo")).toEqual(channelHelmRepoSample);
  });
});

describe("getChannelSample", () => {
  it("should return channel Namespace sample ", () => {
    expect(getChannelSample("Namespace", "en-un")).toEqual(
      fs.readFileSync(__dirname + "/files/ns.yaml", "utf8")
    );
  });

  it("should return channel GitRepo sample ", () => {
    expect(getChannelSample("GitRepo", "en-un")).toEqual(
      fs.readFileSync(__dirname + "/files/git.yaml", "utf8")
    );
  });

  it("should return channel ObjectBucket sample ", () => {
    expect(getChannelSample("ObjectBucket", "en-un")).toEqual(
      fs.readFileSync(__dirname + "/files/ob.yaml", "utf8")
    );
  });

  it("should return channel HelmRepo sample ", () => {
    expect(getChannelSample("HelmRepo", "en-un")).toEqual(
      fs.readFileSync(__dirname + "/files/hr.yaml", "utf8")
    );
  });
});

describe("getApplicationSample", () => {
  const result = fs.readFileSync(__dirname + "/files/app.yaml", "utf8");

  it("should return app sample ", () => {
    expect(getApplicationSample("en-un")).toEqual(result);
  });
});

describe("getPlacementRuleSample", () => {
  const result = fs.readFileSync(__dirname + "/files/pr.yaml", "utf8");

  it("should return placement rule sample ", () => {
    expect(getPlacementRuleSample("en-un")).toEqual(result);
  });
});

describe("getSubscriptionSample", () => {
  const result = fs.readFileSync(__dirname + "/files/sub.yaml", "utf8");

  it("should return subscription sample ", () => {
    expect(getSubscriptionSample("en-un")).toEqual(result);
  });
});
