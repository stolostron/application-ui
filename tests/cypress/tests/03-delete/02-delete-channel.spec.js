/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const { wizards } = JSON.parse(Cypress.env("TEST_CONFIG"));
import { apiResources } from "../../views/application";

describe("Cleanup resouces", () => {
  for (const type in wizards) {
    const { name } = wizards[type];
    const application = wizards[type];
    it(`delete application ${name}'s channel, subscription and placementrule`, () => {
      apiResources.action(name, "delete", application);
    });
  }
});
