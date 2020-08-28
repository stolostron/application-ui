/** *****************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 ****************************************************************************** */

/// <reference types="cypress" />
const { wizards, timeWindows } = JSON.parse(Cypress.env("TEST_CONFIG"));

import {
  pageLoader,
  resourceTable,
  modal,
  noResource,
  notification
} from "./common";

export const createApplication = (
  type,
  application,
  name,
  url,
  timeWindowData,
  timewindowType
) => {
  type = type.replace(/\s+/g, "-").toLowerCase();
  modal.clickPrimary();
  cy.get(".bx--detail-page-header-title-container").should("exist");
  cy.get("#name").type(name);
  cy.get("#namespace", { timeout: 50 * 1000 }).type(`${name}-ns`, {
    timeout: 50 * 1000
  });
  cy.get(`#${type}`).click();
  if (type === "git") {
    const { username, token, branch, path } = application;
    cy.get("#githubURL", { timeout: 20 * 1000 }).type(url);
    if (username && token) {
      cy.get("#githubUser").type(username);
      cy.get("#githubAccessID").type(token);
    }
    cy.get("#githubBranch").type(branch);
    cy.get("#githubPath").type(path);
    // Disable deploy for now when we figure out how to validate the through api
    // cy.get("#online-cluster-only-checkbox").click({ force: true });
  } else if (type === "objectbucket") {
    const { accessKey, secretKey } = application;
    cy.get("#objectstoreURL", { timeout: 20 * 1000 }).type(url);
    cy.get("#accessKey").then(input => {
      if (input.is("enabled")) {
        cy.get("#accessKey").type(accessKey);
        cy.get("#secretKey").type(secretKey);
      } else {
        cy.log(`credentials have been saved for ${type} - url: ${url}`);
      }
    });
  } else if (type === "local-cluster") {
    const { repository } = application;
    repository
      ? cy.get("#namespaceChannelName", { timeout: 20 * 1000 }).type(repository)
      : cy.log("skip repository name as it is not provided");
  }

  if (timeWindowData) {
    selectTimeWindow(timeWindowData, timewindowType);
  }
  cy.get("#create-button-portal-id").click();
  notification.shouldExist("success", { timeout: 60 * 1000 });
  cy
    .location("pathname", { timeout: 60 * 1000 })
    .should("include", `${name}-ns/${name}`);
  return name;
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

export const validateTimewindow = (name, timeWindowType) => {
  const windowType = { activeinterval: "active", blockinterval: "blocked" };
  cy
    .exec(
      `oc login --server=${Cypress.env("OC_CLUSTER_URL")} -u ${Cypress.env(
        "OC_CLUSTER_USER"
      )} -p ${Cypress.env("OC_CLUSTER_PASS")} --insecure-skip-tls-verify=true`
    )
    .its("stdout")
    .should("contain", "Login successful.")
    .then(() => {
      // get the subscription
      cy.log(
        "the subscription should contain the correct timewindow information"
      );
      cy
        .exec(`oc get subscription -n ${name}-ns`)
        .then(({ stdout, stderr }) => {
          cy.log(stdout || stderr);
          if ((stdout || stderr).includes("No resource") === false) {
            cy.log("the subscription is not empty");
            console.log(timeWindowType);
            if (
              timeWindowType === "activeinterval" ||
              timeWindowType === "blockinterval"
            ) {
              const searchText = windowType[timeWindowType];
              cy
                .exec(
                  `oc get subscription ${name}-subscription-0 -n ${name}-ns -o yaml`
                )
                .its("stdout")
                .should("contain", "timewindow")
                .should("contain", searchText);
            } else if (timeWindowType === "active") {
              cy
                .exec(
                  `oc get subscription ${name}-subscription-0 -n ${name}-ns -o yaml`
                )
                .its("stdout")
                .should("not.contain", "timewindow");
            } else {
              cy.log(
                "there is no timewindow selected... checking the default type"
              );
              cy
                .exec(
                  `oc get subscription ${name}-subscription-0 -n ${name}-ns -o yaml`
                )
                .its("stdout")
                .should("not.contain", "timewindow");
            }
          } else {
            cy.log(
              `The subscription ${name}-subscription-0 in namespace:${name}-ns is empty`
            );
          }
        });
    });
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

export const apiResources = {
  action: (name, action, application) => {
    cy
      .exec(
        `oc login --server=${Cypress.env("OC_CLUSTER_URL")} -u ${Cypress.env(
          "OC_CLUSTER_USER"
        )} -p ${Cypress.env("OC_CLUSTER_PASS")} --insecure-skip-tls-verify=true`
      )
      .its("stdout")
      .should("contain", "Login successful.")
      .then(() => {
        // app channel
        cy.log(`${action} the channel if it exists`);
        cy
          .exec(`oc get channels -n ${name}-app-samples-chn-ns`)
          .then(({ stdout, stderr }) => {
            cy.log(stdout || stderr);
            if ((stdout || stderr).includes("No resource") === false) {
              cy.log("There exist channel");
              cy
                .exec(
                  `oc ${action} channel ${name}-app-samples-chn -n ${name}-app-samples-chn-ns`
                )
                .its("stdout")
                .should("contain", `${action}`)
                .should("contain", name);
            } else {
              cy.log(
                `The channel ${name}--app-samples-chn-ns in namespace:${name}-app-samples-chn-ns is empty`
              );
            }
          });
        // channel
        cy.log(`${action} the channel if it exists`);

        cy
          .exec(`oc get channels -n ${name}-resource-ns-0`)
          .then(({ stdout, stderr }) => {
            cy.log(stdout || stderr);
            if ((stdout || stderr).includes("No resource") === false) {
              cy.log("There exist channel");
              cy
                .exec(
                  `oc ${action} channel ${name}-resource-0 -n ${name}-resource-ns-0`
                )
                .its("stdout")
                .should("contain", `${action}`)
                .should("contain", name);
            } else {
              cy.log(
                `The channel ${name}-resource-0 in namespace:${name}-resource-ns-0 is empty`
              );
            }
          });
        const { repository } = application;
        if (repository) {
          cy
            .exec(`oc get channels -n ${name}-${repository}-chn-ns-0`)
            .then(({ stdout, stderr }) => {
              cy.log(stdout || stderr);
              if ((stdout || stderr).includes("No resource") === false) {
                cy.log("There exist leftover channel");
                cy
                  .exec(
                    `oc ${action} channel ${name}-${repository}-chn-0 -n ${name}-${repository}-chn-ns-0`
                  )
                  .its("stdout")
                  .should("contain", `${action}`)
                  .should("contain", name);
              } else {
                cy.log(
                  `The channel ${name}-${repository}-chn-0 in namespace:${name}-${repository}-chn-ns-0 is empty`
                );
              }
            });
        }

        // subscription
        cy.log(`${action} the subscription if it exists`);
        cy
          .exec(`oc get subscription -n ${name}-ns`)
          .then(({ stdout, stderr }) => {
            cy.log(stdout || stderr);
            if ((stdout || stderr).includes("No resource") === false) {
              cy.log("There exist leftover subscription");
              cy
                .exec(
                  `oc ${action} subscription ${name}-subscription-0 -n ${name}-ns`
                )
                .its("stdout")
                .should("contain", `${action}`);
            } else {
              cy.log(
                `The subscription ${name}-subscription-0 in namespace:${name}-ns is empty`
              );
            }
          });
        // placementrule
        cy.log(`${action} the placementrule if it exists`);
        cy
          .exec(`oc get placementrule -n ${name}-ns`)
          .then(({ stdout, stderr }) => {
            cy.log(stdout || stderr);
            if ((stdout || stderr).includes("No resource") === false) {
              cy.log("There exist subscription");
              cy
                .exec(
                  `oc ${action} placementrule ${name}-placement-0 -n ${name}-ns`
                )
                .its("stdout")
                .should("contain", `${action}`);
            } else {
              cy.log(
                `The placementrule ${name}-placement-0 in namespace:${name}-ns is empty`
              );
            }
          });
      });
  }
};

export const passTimeWindowType = timeWindowType => {
  let timeWindowData;
  if (timeWindows[timeWindowType].setting) {
    timeWindowData = timeWindows[timeWindowType];
  }
  return { timeWindowData: timeWindowData };
};

export const selectTimeWindow = (timeWindowData, timeWindowType) => {
  const { setting, date } = timeWindowData;
  if (setting && date) {
    cy.log("Select TimeWindow...");
    cy.log(timeWindowType);
    const dateId = date.toLowerCase().substring(0, 3) + "-timeWindow";
    let typeID =
      timeWindowType === "blockinterval"
        ? "#blocked-mode-timeWindow"
        : "#active-mode-timeWindow";
    cy
      .get(typeID)
      .scrollIntoView()
      .click({ force: true });
    cy.get(`#${dateId}`, { timeout: 20 * 1000 }).click({ force: true });
    cy
      .get(".bx--dropdown.config-timezone-dropdown.bx--list-box")
      .within($timezone => {
        cy.get("[type='button']").click();
        cy
          .get(".bx--list-box__menu-item:first-of-type", {
            timeout: 30 * 1000
          })
          .click();
      });
  }
};

export const getTimeWindowType = name => {
  let nameList = name.split("-");
  let timeWindowType;
  "active activeinterval blockinterval".indexOf(
    nameList[nameList.length - 1]
  ) !== -1
    ? (timeWindowType = nameList[nameList.length - 1])
    : (timeWindowType = undefined);
  return timeWindowType;
};
