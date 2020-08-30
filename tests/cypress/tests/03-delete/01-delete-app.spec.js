/*******************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import { deleteApplicationUI } from "../../views/application";

describe("Delete application", () => {
  for (const type in config) {
    const data = config[type].data;
    if (data.enable) {
      it(`${data.name} should be deleted from UI`, () => {
        deleteApplicationUI(data.name);
      });
    } else {
      it(`disable deletion on resource ${type}`, () => {
        cy.log(`skipping ${type} - ${data.name}`);
      });
    }
  }
});
