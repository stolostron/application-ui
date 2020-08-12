/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

import { pageLoader, resourceTable } from "../../views/common";

const { wizards } = JSON.parse(Cypress.env("TEST_CONFIG"));

describe("validate wizard", () => {
  for (const resource in wizards) {
    const { name } = wizards[resource];
    it(`can be validated`, () => {
      cy.visit(`/multicloud/applications`);
      pageLoader.shouldNotExist();
      cy.reload();
      resourceTable.rowShouldExist(name, 60 * 1000, () => {
        cy.reload();
      });
      resourceTable.rowNameClick(name);
      cy.reload(); // status isn't updating after unknown failure
      cy.get(".bx--detail-page-header-title");
    });
  }
});
