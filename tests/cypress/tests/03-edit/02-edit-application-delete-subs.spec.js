/*******************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import {
  verifyEditAfterDeleteSubscription,
  deleteFirstSubscription
} from "../../views/application";

describe("Edit application delete subscription Test", () => {
  for (const type in config) {
    const apps = config[type].data;
    apps.forEach(data => {
      if (data.enable) {
        if (data.config.length > 1) {
          it(`Verify first subscription can be deleted`, () => {
            deleteFirstSubscription(data.name, data);
          });
          it(`Verify ${
            data.name
          } is valid after first subscription is deleted`, () => {
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
