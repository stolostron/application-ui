/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright Contributors to the Open Cluster Management project
import mapAllDeployments from "../../../../src-web/reducers/data-mappers/mapAllDeployments";

describe("data-mappers testing for mapAllDeployments", () => {
  it("should mold the data properly", () => {
    const apiResponse = {
      deployment: "sampleDeploymentName",
      shouldIgnore: "ignore"
    };
    const result = {
      deploymentName: "sampleDeploymentName"
    };
    expect(mapAllDeployments(apiResponse)).toEqual(result);
  });

  it("should not break on empty response", () => {
    const apiResponse = {};
    const result = {
      deploymentName: ""
    };
    expect(mapAllDeployments(apiResponse)).toEqual(result);
  });
});
