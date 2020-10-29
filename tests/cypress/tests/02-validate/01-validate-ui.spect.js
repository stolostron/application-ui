/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import {
  validateTopology,
  validateResourceTable,
  validateAdvancedTables
} from "../../views/application";

import { getManagedClusterName } from "../../views/resources";

describe("Application Validation Test for tables, topology and advanced configuration tables", () => {
  it(`get the name of the managed OCP cluster`, () => {
    getManagedClusterName();
  });
  for (const type in config) {
    const data = config[type].data;

    if (data.enable) {
      it(`Verify application info from applications table - ${type}: ${
        data.name
      }`, () => {
        validateResourceTable(data.name, data);
      });
      it(`Verify application content from the single application topology - ${type}: ${
        data.name
      }`, () => {
        validateTopology(data.name, data, type);
      });
      it(`Verify application channel, subscription, placement rule info from the advanced configuration tables - ${type}: ${
        data.name
      }`, () => {
        validateAdvancedTables(data.name, data, type);
      });
    } else {
      it(`disable validation on resource ${type}`, () => {
        cy.log(`skipping ${type} - ${data.name}`);
      });
    }
  }
});
