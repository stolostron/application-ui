/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const { wizards } = JSON.parse(Cypress.env("TEST_CONFIG"));
import { deleteAPIResources } from "../../views/application";

describe("Cleanup resouces", () => {
  for (const resource in wizards) {
    const { name } = wizards[resource];
    it(`delete application ${name}'s channel, subscription and placementrule`, () => {
      deleteAPIResources(name);
    });
  }
});
