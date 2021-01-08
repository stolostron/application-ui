/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import { testInvalidApplicationInput } from "../../views/common";

describe("Application UI: [P1][Sev1][app-lifecycle-ui] Application Creation Validate invalid input Test", () => {
  it(`Verify invalid input is rejected`, () => {
    testInvalidApplicationInput();
  });
});
