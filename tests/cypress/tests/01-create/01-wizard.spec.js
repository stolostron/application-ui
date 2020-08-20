/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const { wizards } = JSON.parse(Cypress.env("TEST_CONFIG"));
import { createApplication } from "../../views/application";

describe("Application", () => {
  for (const type in wizards) {
    it(`can be created on resource ${type} from the wizard`, () => {
      const application = wizards[type];
      const { name, url } = application;
      cy.visit("/multicloud/applications");
      createApplication(type, application, name, url);
    });
  }
});
