/*******************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import { deleteApplicationUI } from "../../views/application";

describe("Delete application Test", () => {
  for (const type in config) {
    const apps = config[type].data;
    apps.forEach(data => {
      if (data.enable) {
        it(`[P1/Sev1/application-lifecycle-ui] Verify application ${
          data.name
        } is deleted from UI`, () => {
          deleteApplicationUI(data.name);
        });
      } else {
        it(`[P1/Sev1/application-lifecycle-ui] Verify disable deletion on resource ${
          data.name
        } ${type}`, () => {
          cy.log(`skipping ${type} - ${data.name}`);
        });
      }
    });
  }
});
