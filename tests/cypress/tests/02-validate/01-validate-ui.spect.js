/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import {
  validateTopology,
  validateResourceTable
} from "../../views/application";

describe("Application", () => {
  for (const type in config) {
    const data = config[type].data;

    if (data.enable) {
      it(`should be validated from the topology - ${type}: ${
        data.name
      }`, () => {
        validateTopology(data.name);
      });
      it(`should be validated from the resource table - ${type}: ${
        data.name
      }`, () => {
        validateResourceTable(data.name);
      });
    } else {
      it(`disable validation on resource ${type}`, () => {
        cy.log(`skipping ${type} - ${data.name}`);
      });
    }
  }
});
