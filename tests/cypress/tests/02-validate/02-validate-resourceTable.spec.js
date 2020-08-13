/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

import { pageLoader, resourceTable } from "../../views/common";

const { wizards } = JSON.parse(Cypress.env("TEST_CONFIG"));

describe("Created application", () => {
  for (const resource in wizards) {
    const { name } = wizards[resource];
    it(`should be validated from the resource table`, () => {
      cy.visit(`/multicloud/applications`);
      cy.get(".search-query-card-loading").should("not.exist");
      pageLoader.shouldNotExist();
      cy
        .get("#bx-pagination-select-resource-table-pagination", {
          timeout: 60 * 1000
        })
        .should("exist");
      resourceTable.rowShouldExist(name, 60 * 1000);
      resourceTable.rowNameClick(name);
      cy.reload(); // status isn't updating after unknown failure
      cy.get(".bx--detail-page-header-title");
    });
  }
});
