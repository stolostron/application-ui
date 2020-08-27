/*******************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const { wizards } = JSON.parse(Cypress.env("TEST_CONFIG"));
import { deleteApplicationUI } from "../../views/application";

describe("Delete application", () => {
  for (const type in wizards) {
    const { name, enable } = wizards[type];
    if (enable) {
      it(`${name} should be successful from UI`, () => {
        deleteApplicationUI(name);
      });
    } else {
      it(`disable deletion on resource ${type}`, () => {
        cy.log(`skipping ${type} - ${name}`);
      });
    }
  }
});
