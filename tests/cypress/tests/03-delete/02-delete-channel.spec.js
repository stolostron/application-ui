/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const { wizards } = JSON.parse(Cypress.env("TEST_CONFIG"));
import { apiResources } from "../../views/application";

describe("Cleanup resouces", () => {
  for (const type in wizards) {
    const { name, enable } = wizards[type];
    const application = wizards[type];
    if (enable) {
      it(`delete application ${name}'s channel, subscription and placementrule`, () => {
        apiResources.action(name, "delete", application);
      });
    } else {
      it(`disable deletion on resource ${type}`, () => {
        cy.log(`skipping ${type} - ${name}`);
      });
    }
  }
});
