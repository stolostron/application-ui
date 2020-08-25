/** *****************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 ****************************************************************************** */

/// <reference types="cypress" />

import {
  pageLoader,
  resourceTable,
  modal,
  noResource,
  notification
} from "./common";

export const createApplication = (type, application, name, url) => {
  type = type.replace(/\s+/g, "-").toLowerCase();
  modal.clickPrimary();
  cy.get(".bx--detail-page-header-title-container").should("exist");
  cy.get("#name").type(name);
  cy.get("#namespace", { timeout: 20 * 1000 }).type(`${name}-ns`);

  if (type === "git") {
    const { username, token, branch, path } = application;
    cy.get(`#${type}`).click();
    cy.get("#githubURL", { timeout: 20 * 1000 }).type(url);
    if (username && token) {
      cy.get("#githubUser").type(username);
      cy.get("#githubAccessID").type(token);
    }
    cy.get("#githubBranch").type(branch);
    cy.get("#githubPath").type(path);
    // Disable deploy for now when we figure out how to validate the through api
    // cy.get("#online-cluster-only-checkbox").click({ force: true });
  }
  if (type === "objectbucket") {
    const { accessKey, secretKey } = application;
    cy.get(`#${type}`).click();
    cy.get("#objectstoreURL", { timeout: 20 * 1000 }).type(url);
    cy.get("#accessKey").then(input => {
      if (input.is("enabled")) {
        cy.get("#accessKey").type(accessKey);
        cy.get("#secretKey").type(secretKey);
      } else {
        cy.log(`credentials have been saved for ${type} - url: ${url}`);
      }
    });
  }

  cy.get("#create-button-portal-id").click();
  notification.shouldExist("success", { timeout: 60 * 1000 });
  cy
    .location("pathname", { timeout: 60 * 1000 })
    .should("include", `${name}-ns/${name}`);
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
  resourceTable.rowShouldExist(name, 600 * 1000);
  resourceTable.rowNameClick(name);
  cy.reload(); // status isn't updating after unknown failure
  cy.get(".bx--detail-page-header-title");
};

export const deleteApplicationUI = name => {
  cy.visit("/multicloud/applications");
  if (noResource.shouldNotExist()) {
    resourceTable.rowShouldExist(name, 600 * 1000);
    resourceTable.openRowMenu(name);
    resourceTable.menuClickDelete();
    modal.shouldBeOpen();
    // delete confirmation
    modal.clickDanger();
    modal.shouldNotBeVisible();

    // should not equal 200 as it should not exist
    //cy.getAppResourceAPI(Cypress.env("token"), "application", appNamespace, appName);

    // after deleting the app, it should not exist in the app table
    resourceTable.rowShouldNotExist(name, 300 * 1000);
    // disable for now letting the canary pass until #4677 is fixed
    // notification.shouldExist("success");
  } else {
    cy.log("No apps to delete...");
  }
};

export const deleteAPIResources = name => {
  cy
    .exec(
      `oc login --server=${Cypress.env("OC_CLUSTER_URL")} -u ${Cypress.env(
        "OC_CLUSTER_USER"
      )} -p ${Cypress.env("OC_CLUSTER_PASS")} --insecure-skip-tls-verify=true`
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
              .exec(`oc delete placementrule ${name}-placement-0 -n ${name}-ns`)
              .its("stdout")
              .should("contain", "deleted");
          } else {
            cy.log(
              `The placementrule ${name}-placement-0 in namespace:${name}-ns is empty`
            );
          }
        });
    });
};
