/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import { testInvalidApplicationInput } from "../../views/common";

describe("Application UI: Always fail for debugging", () => {
  it(`fails`, () => {
    cy.visit("/multicloud/applications");
    cy.contains("NOT ON THE PAGE");
  });
});
