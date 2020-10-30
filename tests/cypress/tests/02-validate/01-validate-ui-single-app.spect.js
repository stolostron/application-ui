/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import { validateTopology } from "../../views/application";

describe("Application Validation Test for single application page, topology ", () => {
  for (const type in config) {
    const data = config[type].data;

    if (data.enable) {
      it(`Verify application content from the single application topology - ${type}: ${
        data.name
      }`, () => {
        validateTopology(data.name, data, type);
      });
    } else {
      it(`disable validation on resource ${type}`, () => {
        cy.log(`skipping ${type} - ${data.name}`);
      });
    }
  }
});
