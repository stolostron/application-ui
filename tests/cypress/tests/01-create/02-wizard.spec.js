/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

import { modal } from "../../views/common";

const { wizards } = JSON.parse(Cypress.env("TEST_CONFIG"));

describe("create wizard", () => {
  for (const resource in wizards) {
    const { name, url, branch, path } = wizards[resource];
    it(`can be created on resource ${resource}`, () => {
      cy.visit("/multicloud/applications");
      modal.clickSecondary();
      cy.get(".bx--detail-page-header-title-container").should("exist");
      cy.get("#name").type(name);
      cy.get(`#${resource}`).click();
      cy.get("#githubURL").type(url);
      cy.get("#githubBranch").type(branch);
      cy.get("#githubPath").type(path);

      cy.get("#online-cluster-only-checkbox").click({ force: true });
      cy.get("#create-button-portal-id").click();
    });
  }
});
