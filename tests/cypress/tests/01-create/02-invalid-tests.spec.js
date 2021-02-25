// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

import { testInvalidApplicationInput } from "../../views/common";

describe("Application UI: [P2][Sev2][app-lifecycle-ui] Application Creation Validate invalid input Test", () => {
  it(`Verify invalid input is rejected`, () => {
    testInvalidApplicationInput();
  });
});
