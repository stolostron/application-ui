/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const { wizards } = JSON.parse(Cypress.env("TEST_CONFIG"));

describe("Application", () => {
  for (const resource in wizards) {
    const { name } = wizards[resource];
    it(`should be validated from the topology`, () => {
      cy.visit(`/multicloud/applications/${name}-ns/${name}`);
      cy.reload();
      cy
        .get(".search-query-card-loading", { timeout: 20 * 1000 })
        .should("not.exist");
      cy.get(".overview-cards-container");
      cy.get("#topologySvgId", { timeout: 50 * 1000 });
    });
  }
});
