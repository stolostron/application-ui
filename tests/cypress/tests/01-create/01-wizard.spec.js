/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

import { noResource, modal, resourceTable } from "../../views/common";

const { wizards } = JSON.parse(Cypress.env("TEST_CONFIG"));

describe("create wizard", () => {
  for (const resource in wizards) {
    const { name, url, username, token, branch, path } = wizards[resource];
    it(`can be created on resource ${resource}`, () => {
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
    });

    it(`can be validated`, () => {
      cy.visit(`/multicloud/applications`);
      noResource.shouldNotExist(90 * 1000);
      cy
        .get("#undefined-search")
        .type(name)
        .type("{enter}");
      resourceTable.rowShouldExist(name);
      resourceTable.rowNameClick(name);
      cy.wait(10 * 1000); // wait for the application to deploy
      cy.reload(); // status isn't updating after unknown failure
      cy.get(".bx--detail-page-header-title");
    });
  }
});
