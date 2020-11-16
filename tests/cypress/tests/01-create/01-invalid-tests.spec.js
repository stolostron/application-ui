/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import { testInvalidApplicationInput } from "../../views/common";

describe("Application Creation Validate invalid input Test", () => {
  it(`[P2/Sev2/application-lifecycle-ui] Verify invalid input is rejected`, () => {
    testInvalidApplicationInput();
  });
});
