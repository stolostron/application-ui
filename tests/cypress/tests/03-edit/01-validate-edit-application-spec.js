// Copyright (c) 2020 Red Hat, Inc.

const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import { editApplication } from "../../views/application";

describe("Application UI: [P1][Sev1][app-lifecycle-ui] Verify application settings on Editor", () => {
  for (const type in config) {
    const apps = config[type].data;
    apps.forEach(data => {
      if (data.enable) {
        it(`Verify that settings for application ${
          data.name
        } are properly shown in the app Editor`, () => {
          editApplication(data.name, data);
        });
      } else {
        it(`disable modification on resource ${type}`, () => {
          cy.log(`skipping ${type} - ${data.name}`);
        });
      }
    });
  }
});
