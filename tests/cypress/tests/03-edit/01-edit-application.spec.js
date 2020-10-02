/*******************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import { editApplication } from "../../views/application";

describe("Edit application", () => {
  for (const type in config) {
    const data = config[type].data;
    if (data.enable) {
      it(`${data.name} should be editable`, () => {
        editApplication(data.name);
      });
    } else {
      it(`disable modification on resource ${type}`, () => {
        cy.log(`skipping ${type} - ${data.name}`);
      });
    }
  }
});