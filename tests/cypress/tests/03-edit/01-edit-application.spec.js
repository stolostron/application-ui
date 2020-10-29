/*******************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import { editApplication, verifyEdit } from "../../views/application";

describe("Edit application Test", () => {
  for (const type in config) {
    const data = config[type].data;
    if (data.enable) {
      it(`Verify that ${data.name} is editable`, () => {
        editApplication(data.name, data);
      });
      it(`Verify that ${data.name} is valid after edit`, () => {
        verifyEdit(data.name, data);
      });
    } else {
      it(`disable modification on resource ${type}`, () => {
        cy.log(`skipping ${type} - ${data.name}`);
      });
    }
  }
});
