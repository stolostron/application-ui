/*******************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import {
  deleteApplicationUI,
  deleteChannelInsecureSkip
} from "../../views/application";

describe("Application UI: [P1][Sev1][app-lifecycle-ui] Delete application Test", () => {
  for (const type in config) {
    const apps = config[type].data;
    apps.forEach(data => {
      if (data.enable) {
        if (data.new && (type === "git" || type === "helm")) {
          it(`[P1][Sev1][app-lifecycle-ui] Verify channel with insecureSkipVerify option is deleted for application ${
            data.name
          }`, () => {
            deleteChannelInsecureSkip(data.name);
          });
        }
        it(`[P1][Sev1][app-lifecycle-ui] Verify application ${
          data.name
        } is deleted from UI`, () => {
          deleteApplicationUI(data.name);
        });
      } else {
        it(`Verify disable deletion on resource ${data.name} ${type}`, () => {
          cy.log(`skipping ${type} - ${data.name}`);
        });
      }
    });
  }
});
