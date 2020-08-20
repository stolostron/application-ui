/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const { wizards } = JSON.parse(Cypress.env("TEST_CONFIG"));
import { validateTopology } from "../../views/application";

describe("Application", () => {
  for (const type in wizards) {
    const { name } = wizards[type];
    it(`should be validated from the topology`, () => {
      validateTopology(name);
    });
  }
});
