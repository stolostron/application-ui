/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import { validateAdvancedTables } from "../../views/application";

describe("Application Validation Test for advanced configuration tables", () => {
  for (const type in config) {
    const apps = config[type].data;
    apps.forEach(data => {
      if (data.enable) {
        it(`Verify application ${
          data.name
        } channel, subscription, placement rule info from the advanced configuration tables - ${type}: ${
          data.name
        }`, () => {
          validateAdvancedTables(data.name, data, type);
        });
      } else {
        it(`disable validation on resource ${type}`, () => {
          cy.log(`skipping ${type} - ${data.name}`);
        });
      }
    });
  }
});
