/** *****************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 ****************************************************************************** */
const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import { apiResources } from "../../views/resources";

describe("Application backend validation that app hub resources have been removed", () => {
  for (const type in config) {
    const apps = config[type].data;
    apps.forEach(data => {
      if (data.enable) {
        it(`[P1][Sev1][app-lifecycle-ui] Verify that the apps ${
          data.name
        } subscription and placementrule no longer exist - ${type}: ${
          data.name
        }`, () => {
          apiResources(type, data, "not.contain");
        });
      } else {
        it(`disable validation on resource ${type}`, () => {
          cy.log(`skipping ${type} - ${data.name}`);
        });
      }
    });
  }
});
