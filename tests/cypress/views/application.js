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
  cy.get("#namespace", { timeout: 50 * 1000 }).type(`${name}-ns`);
  if (type === "git") {
    createGit(config);
  } else if (type === "objectstore") {
    createObj(config);
  } else if (type === "local-cluster") {
    createLocal(config);
  }
  // comment until the validation is done
  // cy.get("#online-cluster-only-checkbox").click({ force: true });
  submitSave();
};

export const gitTasks = (value, gitCss, key = 0) => {
  const { url, username, token, branch, path, timeWindow } = value;
  const { gitUrl, gitUser, gitKey, gitBranch, gitPath } = gitCss;
  cy
    .get(`#git`)
    .click()
    .trigger("mouseover");
  cy.get(gitUrl, { timeout: 20 * 1000 }).type(url).blur();
  if (username && token) {
    cy.get(gitUser).type(username);
    cy.get(gitKey).type(token);
  }
  cy.wait(500).then(()=>{
    cy.get(gitBranch).then(input => {
      if (input.is("enabled")) {
        cy.get(gitBranch).type(branch);
        cy.get(gitPath).type(path);
      } else {
        cy.log(`typing in branch name too soon...`);
      }
    });
  });
  
  selectTimeWindow(timeWindow, key);
};

export const createGit = configs => {
  let gitCss = {
    gitUrl: "#githubURL",
    gitUser: "#githubUser",
    gitKey: "#githubAccessID",
    gitBranch: "#githubBranch",
    gitPath: "#githubPath"
  };
  for (const [key, value] of Object.entries(configs)) {
    key == 0
      ? gitTasks(value, gitCss)
      : multipleTemplate(value, gitCss, key, gitTasks);
  }
};

export const createObj = configs => {
  let objCss = {
    objUrl: "#objectstoreURL",
    objAccess: "#accessKey",
    objSecret: "#secretKey"
  };
  for (const [key, value] of Object.entries(configs)) {
    key == 0
      ? objTasks(value, objCss)
      : multipleTemplate(value, objCss, key, objTasks);
  }
};

export const objTasks = (value, css, key = 0) => {
  const { url, accessKey, secretKey, timeWindow } = value;
  const { objUrl, objAccess, objSecret } = css;
  cy
    .get(`#objectstore`)
    .click()
    .trigger("mouseover");
  cy.get(objUrl, { timeout: 20 * 1000 }).type(url);
  cy.get(objAccess).then(input => {
    if (input.is("enabled")) {
      cy.get(objAccess).type(accessKey);
      cy.get(objSecret).type(secretKey);
    } else {
      cy.log(`credentials have not been saved...`);
    }
  });
  selectTimeWindow(timeWindow, key);
};

export const multipleTemplate = (value, css, key, func) => {
  Object.keys(css).forEach(k => (css[k] = css[k] + `grp${key}`));
  console.log(css);
  cy.get("#add-channels").click();
  cy
    .get(".creation-view-group-container")
    .eq(key)
    .within($content => {
      func(value, css, key);
    });
};

export const createLocal = configs => {
  let localCss = {
    channelName: "#namespaceChannelName"
  };
  for (const [key, value] of Object.entries(configs)) {
    key == 0
      ? localTasks(value, localCss)
      : multipleTemplate(value, localCss, key, localTasks);
  }
};

export const localTasks = (value, css, key = 0) => {
  const { repository, timeWindow } = value;
  const { channelName } = css;
  cy
    .get(`#local-cluster`)
    .click()
    .trigger("mouseover");
  repository
    ? cy.get(channelName, { timeout: 20 * 1000 }).type(repository)
    : cy.log("skip repository name as it is not provided");
  selectTimeWindow(timeWindow, key);
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
    selectDate(date, key);

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

export const selectDate = (date, key) => {
  date.forEach(d => {
    const dateId = d.toLowerCase().substring(0, 3) + "-timeWindow";
    key == 0
      ? cy.get(`#${dateId}`, { timeout: 20 * 1000 }).click({ force: true })
      : cy
          .get(`#${dateId}grp${key}`, { timeout: 20 * 1000 })
          .click({ force: true });
  });
};
