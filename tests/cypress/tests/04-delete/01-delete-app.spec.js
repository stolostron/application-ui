/*******************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import { deleteApplicationUI } from "../../views/application";

describe("Delete application Test", () => {
  for (const type in config) {
    const data = config[type].data;
    if (data.enable) {
      it(`Verify application ${data.name} is deleted from UI`, () => {
        deleteApplicationUI(data.name);
      });
    } else {
      it(`Verify disable deletion on resource ${type}`, () => {
        cy.log(`skipping ${type} - ${data.name}`);
      });
    }
  }
});
