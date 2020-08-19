/** *****************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 ****************************************************************************** */

/// <reference types="cypress" />

import { pageLoader, resourceTable } from "./common";

export const deleteAPIResources = name => {
  cy
    .exec(
      `oc login --server=${Cypress.env("OC_CLUSTER_URL")} -u ${Cypress.env(
        "OC_CLUSTER_USER"
      )} -p ${Cypress.env("OC_CLUSTER_PASS")}`
    )
    .its("stdout")
    .should("contain", "Login successful.")
    .then(() => {
      // delete the channel
      cy.log("delete the channel if it exists");
      cy
        .exec(`oc get channels -n ${name}-app-samples-chn-ns`)
        .then(({ stdout, stderr }) => {
          cy.log(stdout || stderr);
          if ((stdout || stderr).includes("No resource") === false) {
            cy.log("There exist leftover channel");
            cy
              .exec(
                `oc delete channel ${name}-app-samples-chn -n ${name}-app-samples-chn-ns`
              )
              .its("stdout")
              .should("contain", "deleted");
          } else {
            cy.log(
              `The channel ${name}--app-samples-chn-ns in namespace:${name}-app-samples-chn-ns is empty`
            );
          }
        });

      // delete the subscription
      cy.log("delete the subscription if it exists");
      cy
        .exec(`oc get subscription -n ${name}-ns`)
        .then(({ stdout, stderr }) => {
          cy.log(stdout || stderr);
          if ((stdout || stderr).includes("No resource") === false) {
            cy.log("There exist leftover subscription");
            cy
              .exec(
                `oc delete subscription ${name}-subscription-0 -n ${name}-ns`
              )
              .its("stdout")
              .should("contain", "deleted");
          } else {
            cy.log(
              `The subscription ${name}-subscription-0 in namespace:${name}-ns is empty`
            );
          }
        });
      // delete the placementrule
      cy.log("delete the placementrule if it exists");
      cy
        .exec(`oc get placementrule -n ${name}-ns`)
        .then(({ stdout, stderr }) => {
          cy.log(stdout || stderr);
          if ((stdout || stderr).includes("No resource") === false) {
            cy.log("There exist leftover subscription");
            cy
              .exec(`oc delete placementrule ${name}-placement -n ${name}-ns`)
              .its("stdout")
              .should("contain", "deleted");
          } else {
            cy.log(
              `The placementrule ${name}-placement in namespace:${name}-ns is empty`
            );
          }
        });
    });
};

export const validateTopology = name => {
  cy.visit(`/multicloud/applications/${name}-ns/${name}`);
  cy.reload();
  cy
    .get(".search-query-card-loading", { timeout: 20 * 1000 })
    .should("not.exist");
  cy.get(".overview-cards-container");
  cy.get("#topologySvgId", { timeout: 50 * 1000 });
};

export const validateResourceTable = name => {
  cy.visit(`/multicloud/applications`);
  cy.get(".search-query-card-loading").should("not.exist");
  pageLoader.shouldNotExist();
  cy
    .get("#bx-pagination-select-resource-table-pagination", {
      timeout: 60 * 1000
    })
    .should("exist");
  resourceTable.rowShouldExist(name, 100 * 1000);
  resourceTable.rowNameClick(name);
  cy.reload(); // status isn't updating after unknown failure
  cy.get(".bx--detail-page-header-title");
};
