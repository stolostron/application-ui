/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const { wizards } = JSON.parse(Cypress.env("TEST_CONFIG"));
import {
  validateTopology,
  validateResourceTable
} from "../../views/application";

describe("Application", () => {
  for (const type in wizards) {
    const { name, enable } = wizards[type];
    if (enable) {
      it(`should be validated from the topology - ${type}: ${name}`, () => {
        validateTopology(name);
      });
      it(`should be validated from the resource table - ${type}: ${name}`, () => {
        validateResourceTable(name);
      });
    } else {
      it(`disable validation on resource ${type}`, () => {
        cy.log(`skipping ${type} - ${name}`);
      });
    }
  }
});
