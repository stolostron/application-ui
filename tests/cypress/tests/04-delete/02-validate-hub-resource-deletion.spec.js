// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import { apiResources } from "../../views/resources";

describe("Application UI: [P1][Sev1][app-lifecycle-ui] Application backend validation that app hub resources have been removed", () => {
  if (Cypress.config().baseUrl.includes("localhost")) {
    for (const type in config) {
      const apps = config[type].data;
      apps.forEach(data => {
        if (data.enable) {
          it(`Verify that the apps ${
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
  } else {
    it("Skipping validate delete test if not running on localhost", () => {});
  }
});
