/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const { wizards } = JSON.parse(Cypress.env("TEST_CONFIG"));
import { resourceTable, modal } from "../../views/common";

describe("delete application", () => {
  for (const resource in wizards) {
    const { url, name } = wizards[resource];
    it(`can be created on resource ${resource}`, () => {
      cy.visit("/multicloud/applications");
      cy
        .get("#undefined-search")
        .click()
        .type(name);
      resourceTable.rowShouldExist(name);
      resourceTable.openRowMenu(name);
      resourceTable.menuClickDelete();
      modal.shouldBeOpen();
      // delete confirmation
      modal.clickDanger();
      modal.shouldNotBeVisible();

      // should not equal 200 as it should not exist
      //cy.getAppResourceAPI(Cypress.env("token"), "application", appNamespace, appName);

      // after deleting the app, it should not exist in the app table
      resourceTable.rowShouldNotExist(name);
    });
  }
});
