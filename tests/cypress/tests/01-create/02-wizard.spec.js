/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

import { modal } from "../../views/common";

const { wizards } = JSON.parse(Cypress.env("TEST_CONFIG"));

describe("create wizard", () => {
  for (const resource in wizards) {
    const { url, name } = wizards[resource];
    it(`can be created on resource ${resource}`, () => {
      cy.visit("/multicloud/applications");
      modal.clickSecondary();
      cy.get(".bx--detail-page-header-title-container").should("exist");
      cy.get("#name").type(name);
      cy.get(`#${resource}`).click();
      cy.get(".creation-view-group-container").within(() => {
        cy
          .get("input", { timeout: 20000 })
          .should("have.attr", "placeholder", "Enter or select Git URL");
      });
      //   cy.get("#githubUser", { timeout: 20000 }).type(username);
      //   cy.get("#githubAccessId", { timeout: 20000 }).type(accessToken);
    });
  }
});
