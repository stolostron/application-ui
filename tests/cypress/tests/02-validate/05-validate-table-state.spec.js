// Copyright (c) 2020 Red Hat, Inc.

const config = JSON.parse(Cypress.env("TEST_CONFIG"));

// Only affects this spec file
// See https://docs.cypress.io/api/cypress-api/config.html#Syntax
Cypress.config({
  defaultCommandTimeout: 30000 // Wait up to 30s for table loads
});

describe("Application UI: [P2][Sev2][app-lifecycle-ui] Application UI Tables", () => {
  it(`maintain their state across SPA navigation`, () => {
    // Open Applications table
    cy.visit("/multicloud/applications");

    // Sort by Created column
    cy.get('[data-label="Created"] > .pf-c-table__button').click();

    // Switch to advanced tables
    cy.get("#advanced").click();

    // Go to 2nd page of Subscriptions
    cy
      .get('button[aria-label="Go to next page"]')
      .scrollIntoView()
      .click();

    // Switch to Channels
    cy
      .get("#channels")
      .scrollIntoView()
      .click();

    // Filter Channels table
    cy.get(".pf-c-search-input__text-input").type("charts-v1");

    // Go to app creation, then cancel
    cy.get("button[data-test-create-application]").click();
    cy.get("button#cancel-button-portal-id").click();

    // Verify still on Channels table
    cy.get("#channels.pf-m-selected");

    // Verify still filtered by "charts-v1"
    cy.get(".pf-c-search-input__text-input").should("have.value", "charts-v1");

    // Switch to Subscriptions
    cy.get("#subscriptions").click();

    // Verify still on page 2
    cy.get('input[aria-label="Current page"]').should("have.value", "2");

    // Change page size
    cy
      .get('button[aria-label="Items per page"]')
      .scrollIntoView()
      .click();
    cy
      .get('button[data-action="per-page-20"]')
      .scrollIntoView()
      .click();

    // Switch to Placement Rules
    cy
      .get("#placementrules")
      .scrollIntoView()
      .click();

    // Verify page size change applied to Placement Rules
    cy
      .get('button[aria-label="Items per page"]')
      .scrollIntoView()
      .click();
    cy.get('button[data-action="per-page-20"].pf-m-selected');

    // Switch back to Applications tables
    cy
      .get("#overview")
      .scrollIntoView()
      .click();

    // Verify Applications table is still sorted by Created column
    cy.get('[data-label="Created"][aria-sort="ascending"]');
  });
});
