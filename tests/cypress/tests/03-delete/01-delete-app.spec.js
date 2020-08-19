/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const { wizards } = JSON.parse(Cypress.env("TEST_CONFIG"));
import { noResource, resourceTable, modal } from "../../views/common";

describe("Delete application", () => {
  for (const resource in wizards) {
    const { name } = wizards[resource];
    it(`${name} should be successful from UI`, () => {
      cy.visit("/multicloud/applications");
      if (noResource.shouldNotExist()) {
        cy
          .get("#undefined-search", { timeout: 20 * 1000 })
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
        resourceTable.rowShouldNotExist(name, 90 * 1000);
      } else {
        cy.log("No apps to delete...");
      }
    });
  }
});
