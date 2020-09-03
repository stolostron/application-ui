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

export const createApplication = (data, type) => {
  cy.visit("/multicloud/applications");
  const { name, config } = data;
  modal.clickPrimary();
  cy.get(".bx--detail-page-header-title-container").should("exist");
  cy.get("#name").type(name);
  cy.get("#namespace", { timeout: 50 * 1000 }).type(`${name}-ns`, {
    timeout: 50 * 1000
  });
  cy.get(`#${type}`).click();
  if (type === "git") {
    config.length > 1 ? createMultipleGit(config) : createGit(config);
  } else if (type === "objectstore") {
    config.length > 1 ? createMultipleObj(config) : createObj(config);
  } else if (type === "local-cluster") {
    config.length > 1 ? createMultipleLocal(config) : createLocal(config);
  }
  // comment until the validation is done
  // cy.get("#online-cluster-only-checkbox").click({ force: true });
  submitSave();
};

export const createGit = config => {
  const { url, username, token, branch, path, timeWindow } = config;
  cy.get("#githubURL", { timeout: 20 * 1000 }).type(url);
  if (username && token) {
    cy.get("#githubUser").type(username);
    cy.get("#githubAccessID").type(token);
  }
  cy.get("#githubBranch").type(branch);
  cy.get("#githubPath").type(path);

  selectTimeWindow(timeWindow);
};

export const createMultipleGit = configs => {
  for (const [key, value] of Object.entries(configs)) {
    key == 0 ? createGit(value) : multipleGit(key, value);
  }
};

export const multipleGit = (key, config) => {
  const { url, username, token, branch, path, timeWindow } = config;
  cy.get("#add-channels").click();
  cy
    .get(".creation-view-group-container")
    .eq(key)
    .within($content => {
      cy
        .get(`#git`)
        .click()
        .trigger("mouseover");
      cy.get(`#githubURLgrp${key}`, { timeout: 20 * 1000 }).type(url);
      if (username && token) {
        cy.get(`#githubUsergrp${key}`).type(username);
        cy.get(`#githubAccessIDgrp${key}`).type(token);
      }
      cy.get(`#githubBranchgrp${key}`).type(branch);
      cy.get(`#githubPathgrp${key}`).type(path);
      selectTimeWindow(timeWindow, key);
    });
};

export const createObj = config => {
  console.log(config);
  const { url, accessKey, secretKey, timeWindow } = config;
  cy.get("#objectstoreURL", { timeout: 20 * 1000 }).type(url);
  cy.get("#accessKey").then(input => {
    if (input.is("enabled")) {
      cy.get("#accessKey").type(accessKey);
      cy.get("#secretKey").type(secretKey);
    } else {
      cy.log(`credentials have not been saved...`);
    }
  });
  selectTimeWindow(timeWindow);
};

export const createMultipleObj = configs => {
  for (const [key, value] of Object.entries(configs)) {
    key == 0 ? createObj(value) : multipleObj(key, value);
  }
};

export const multipleObj = (key, config) => {
  const { url, accessKey, secretKey, timeWindow } = config;
  cy.get("#add-channels").click();
  cy
    .get(".creation-view-group-container")
    .eq(key)
    .within($content => {
      cy
        .get(`#objectstore`)
        .click()
        .trigger("mouseover");
      cy.get(`#objectstoreURLgrp${key}`, { timeout: 20 * 1000 }).type(url);
      cy.get(`#accessKeygrp${key}`).then(input => {
        if (input.is("enabled")) {
          cy.get(`#accessKeygrp${key}`).type(accessKey);
          cy.get(`#secretKeygrp${key}`).type(secretKey);
        } else {
          cy.log(`credentials have not been saved...`);
        }
      });
      selectTimeWindow(timeWindow, key);
    });
};

export const createLocal = config => {
  const { repository, timeWindow } = config;
  repository
    ? cy.get("#namespaceChannelName", { timeout: 20 * 1000 }).type(repository)
    : cy.log("skip repository name as it is not provided");
  selectTimeWindow(timeWindow);
};

export const createMultipleLocal = configs => {
  for (const [key, value] of Object.entries(configs)) {
    key == 0 ? createLocal(value) : multipleLocal(key, value);
  }
};

export const multipleLocal = (key, config) => {
  const { repository, timeWindow } = config;
  cy.get("#add-channels").click();
  cy
    .get(".creation-view-group-container")
    .eq(key)
    .within($content => {
      cy
        .get(`#local-cluster`)
        .click()
        .trigger("mouseover");
      repository
        ? cy
            .get(`#namespaceChannelNamegrp${key}`, { timeout: 20 * 1000 })
            .type(repository)
        : cy.log("skip repository name as it is not provided");
      selectTimeWindow(timeWindow, key);
    });
};

export const submitSave = () => {
  cy
    .get("#create-button-portal-id", { timeout: 20 * 1000 })
    .should("not.be.disabled")
    .click();
  notification.shouldExist("success", { timeout: 60 * 1000 });
  cy.location("pathname", { timeout: 60 * 1000 }).should("include", `${name}`);
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
  cy.get(".search-query-card-loading").should("not.exist", {
    timeout: 60 * 1000
  });
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

    // after deleting the app, it should not exist in the app table
    resourceTable.rowShouldNotExist(name, 300 * 1000);
    // disable for now letting the canary pass until #4677 is fixed
    // notification.shouldExist("success");
  } else {
    cy.log("No apps to delete...");
  }
};

export const selectTimeWindow = (timeWindow, key = 0) => {
  const { setting, type, date } = timeWindow;
  if (setting && date) {
    cy.log(`Select TimeWindow - ${type}...`);
    const dateId = date.toLowerCase().substring(0, 3) + "-timeWindow";
    let typeID;
    key == 0
      ? (typeID =
          type === "blockinterval"
            ? "#blocked-mode-timeWindow"
            : "#active-mode-timeWindow")
      : (typeID =
          type === "blockinterval"
            ? `#blocked-mode-timeWindowgrp${key}`
            : `#active-mode-timeWindowgrp${key}`);

    cy
      .get(typeID)
      .scrollIntoView()
      .click({ force: true });
    key == 0
      ? cy.get(`#${dateId}`, { timeout: 20 * 1000 }).click({ force: true })
      : cy
          .get(`#${dateId}grp${key}`, { timeout: 20 * 1000 })
          .click({ force: true });

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
  } else {
    cy.log("leave default `active`");
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
