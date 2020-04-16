/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import { getStatusPercentages } from "../../../../../../src-web/components/ApplicationDeploymentPipeline/components/ProgressBar/utils";

describe("getStatusPercentages", () => {
  it("an object with invalid values", () => {
    const result = { pass: 0, completed: 0, inprogress: 0, fail: 0, total: 0 };

    expect(getStatusPercentages(undefined)).toEqual(undefined);
  });

  const input = [0, 0, 0, 0, 0];

  it("an object with 0 values", () => {
    const result = { pass: 0, completed: 0, inprogress: 0, fail: 0, total: 0 };

    expect(getStatusPercentages(input)).toEqual(result);
  });

  // 1 pass, 2 fail, 3 inprogress, 3 pending, 1 unidentifed
  const input2 = [1, 2, 3, 3, 1];
  // total is sum of deployments = 10
  it("an object with variety of inputs [1, 2, 3, 3, 1]", () => {
    const result = {
      pass: 10,
      completed: 20,
      inprogress: 60,
      fail: 20,
      total: 10
    };

    expect(getStatusPercentages(input2)).toEqual(result);
  });
});
