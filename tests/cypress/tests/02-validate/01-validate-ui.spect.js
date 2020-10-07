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

describe("Application", () => {
  it(`get the name of the managed OCP cluster`, () => {
    getManagedClusterName();
  });
  for (const type in config) {
    const data = config[type].data;

    if (data.enable) {
      it(`should be validated from the resource table - ${type}: ${
        data.name
      }`, () => {
        validateResourceTable(data.name);
      });
      it(`should be validated from the topology - ${type}: ${
        data.name
      }`, () => {
        validateTopology(data.name, data, type);
      });
      it(`should be validated from the advanced configuration tables - ${type}: ${
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
