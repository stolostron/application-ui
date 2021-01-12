/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const config = JSON.parse(Cypress.env("TEST_CONFIG"));

describe("Application UI: [P1][Sev1][app-lifecycle-ui] Application Test Requirement", () => {
  it(`intall Ansible Operator`, () => {
    cy.installAnsibleOperator();
  });
});
