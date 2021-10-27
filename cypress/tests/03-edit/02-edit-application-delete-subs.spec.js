// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

const config = Cypress.env("TEST_CONFIG_EXCLUDE_ARGO");
import {
  verifyEditAfterDeleteSubscription,
  deleteFirstSubscription
} from "../../views/application";

describe("Application UI: [P1][Sev1][app-lifecycle-ui] Edit application delete subscription Test", () => {
  for (const type in config) {
    const apps = config[type].data;
    apps.forEach(data => {
      if (data.enable) {
        it(`Verify first subscription can be deleted for app ${
          data.name
        }`, () => {
          deleteFirstSubscription(data.name, data);
        });
        if (data.config.length > 1) {
          it(`Verify ${
            data.name
          } is valid after first subscription is deleted and selecting new placement rule, defect #7359`, () => {
            verifyEditAfterDeleteSubscription(data.name, data);
          });
        }
      } else {
        it(`disable modification on resource ${type}`, () => {
          cy.log(`skipping ${type} - ${data.name}`);
        });
      }
    });
  }
});
