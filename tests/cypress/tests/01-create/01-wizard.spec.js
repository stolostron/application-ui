/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

import { modal } from "../../views/common";

const { wizards } = JSON.parse(Cypress.env("TEST_CONFIG"));

describe("Application", () => {
  for (const resource in wizards) {
    const { name, url, username, token, branch, path } = wizards[resource];
    it(`can be created on resource ${resource} from the wizard`, () => {
      cy.visit("/multicloud/applications");
      modal.clickSecondary();
      cy.get(".bx--detail-page-header-title-container").should("exist");
      cy.get("#name").type(name);
      cy.get(`#${resource}`).click();
      cy.get("#githubURL", { timeout: 20 * 1000 }).type(url);
      if (username && token) {
        cy.get("#githubUser").type(username);
        cy.get("#githubAccessID").type(token);
      }

      cy.get("#githubBranch").type(branch);
      cy.get("#githubPath").type(path);
      // Disable deploy for now when we figure out how to validate the through api
      // cy.get("#online-cluster-only-checkbox").click({ force: true });
      cy.get("#create-button-portal-id").click();
      cy
        .location("pathname", { timeout: 60 * 1000 })
        .should("include", `${name}-ns/${name}`);
      // cy.visit(`/multicloud/applications/`);
    });
  }
});
