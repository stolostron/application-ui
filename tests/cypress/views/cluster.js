/** *****************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 ****************************************************************************** */

/// <reference types="cypress" />

import { resourceTable, modal, notification } from "./common";

export const createCluster = config => {
  const { name, releaseImage, providerConnection, baseDnsDomain } = config;

  cy.get("#name").type(name);
  cy.get("#amazon-web-services").click();

  cy.get('input[placeholder="Select or enter a release image"]').click();
  !releaseImage
    ? cy.get(".bx--list-box__menu-item:first-of-type").click()
    : cy.contains(releaseImage).click();

  cy.get("#connection .bx--list-box__field").click();
  cy
    .get("#connection")
    .contains(providerConnection)
    .click();
  cy.get("#baseDomain").type(baseDnsDomain);

  cy.get(".secondary-header-links .bx--btn--primary").click();
  notification.shouldExist("info");
  notification.shouldExist("success");
  resourceTable.shouldExist();
  resourceTable.rowShouldExist(name);
  if (Cypress.env("TEST_MODE") === "e2e") {
    cy
      .get(`tr[data-row-name="${name}"]`)
      .contains("Creating", { timeout: 60000 })
      .should("exist");
    // TODO handle case for waiting for cluster to come to Ready
  }
};

export const destroyCluster = name => {
  resourceTable.openRowMenu(name);
  resourceTable.menuClickDestroy();
  modal.shouldBeOpen();
  modal.confirmAction(name);
  modal.clickDanger();
  resourceTable.rowShouldNotExist(name);
  // TODO handle case for deleting cluster at Ready
};
