/** *****************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 ****************************************************************************** */
const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import {
  apiResources,
  targetResource,
  validateTimewindow
} from "../../views/resources";

describe("Application application backend resources exist", () => {
  for (const type in config) {
    const apps = config[type].data;
    apps.forEach(data => {
      if (data.enable) {
        it(`[P1,Sev1,app-lifecycle-ui] Verify that the apps ${
          data.name
        } channels, subscription and placementrule are valid - ${type}: ${
          data.name
        }`, () => {
          apiResources(type, data, "contain");
        });
        it(`[P1,Sev1,app-lifecycle-ui] Validate apps ${
          data.name
        } timewindow - ${type}: ${data.name}`, () => {
          validateTimewindow(data.name, data.config);
        });
        it(`[P1,Sev1,app-lifecycle-ui] Validate apps ${
          data.name
        } resources created on the target cluster`, () => {
          targetResource(data);
        });
      } else {
        it(`disable validation on resource ${type}`, () => {
          cy.log(`skipping ${type} - ${data.name}`);
        });
      }
    });
  }
});
