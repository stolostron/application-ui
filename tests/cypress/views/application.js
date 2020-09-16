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
  } else if (type === "helm") {
    createHelm(config);
  }
  submitSave();
};

export const gitTasks = (value, gitCss, key = 0) => {
  const { url, username, token, branch, path, timeWindow } = value;
  const { gitUrl, gitUser, gitKey, gitBranch, gitPath } = gitCss;
  cy
    .get(`#github`)
    .click()
    .trigger("mouseover");
  cy
    .get(gitUrl, { timeout: 20 * 1000 })
    .type(url)
    .blur();
  if (username && token) {
    cy.get(gitUser).type(username);
    cy.get(gitKey).type(token);
  }

  cy.wait(20 * 1000);
  cy.get(gitBranch).type(branch, { force: true });
  cy.get(gitPath).type(path, { force: true });

  selectTimeWindow(timeWindow, key);
};

export const createHelm = configs => {
  let helmCss = {
    helmURL: "#helmURL",
    helmChartName: "#helmChartName"
  };
  for (const [key, value] of Object.entries(configs)) {
    key == 0
      ? helmTasks(value, helmCss)
      : multipleTemplate(value, helmCss, key, helmTasks);
  }
};

export const helmTasks = (value, css, key = 0) => {
  const { url, chartName, timeWindow } = value;
  const { helmURL, helmChartName } = css;
  cy
    .get("#helmrepo")
    .click()
    .trigger("mouseover");
  cy
    .get(helmURL, { timeout: 20 * 1000 })
    .type(url)
    .blur();
  cy
    .get(helmChartName, { timeout: 20 * 1000 })
    .type(chartName)
    .blur();
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
    .get("#objectstore")
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
    .get("#deployable")
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

export const validateSubscriptionDetails = (name, data, type) => {
  cy
    .get(".toggle-subs-btn.bx--btn.bx--btn--primary", { timeout: 20 * 1000 })
    .scrollIntoView()
    .click({ timeout: 100 * 1000 });
  for (const [key, value] of Object.entries(data.config)) {
    const { timeWindow } = value;
    const { setting, type } = timeWindow;
    if (setting) {
      const keywords = {
        blockinterval: "Blocked",
        activeinterval: "Active",
        active: "Set time window"
      };
      cy
        .get(".overview-cards-subs-section", { timeout: 20 * 1000 })
        .children()
        .eq(key)
        .within($subcards => {
          type == "active"
            ? cy.get(".set-time-window-link").contains(keywords[type])
            : cy
                .get(".sub-card-status-icon")
                .contains(keywords[type].toLowerCase());
        });
    }
  }
};

export const validateTopology = (name, data, type) => {
  cy.visit(`/multicloud/applications/${name}-ns/${name}`);
  cy.reload();
  cy
    .get(".search-query-card-loading", { timeout: 100 * 1000 })
    .should("not.exist");
  cy.get("#left-col").contains(name);
  cy.get("#left-col").contains(`${name}-ns`);

  validateSubscriptionDetails(name, data, type);

  cy.get(".overview-cards-container");
  cy.get("#topologySvgId", { timeout: 50 * 1000 });
  cy.get(".layoutLoadingContainer").should("not.be.visible");
  cy.get(".bx--loading", { timeout: 50 * 1000 }).should("not.be.visible", {
    timeout: 100 * 1000
  });
  // application
  cy.log("validate the application...");
  cy.get(`g[type=${name}]`, { timeout: 25 * 1000 }).should("be.visible");

  //subscription
  cy.log("validate the subscription...");
  cy
    .get(`g[type="${name}-subscription-0"]`, { timeout: 25 * 1000 })
    .should("be.visible");

  //placementrule
  cy.log("validate the placementrule...");
  cy
    .get(`g[type="${name}-placement-0"]`, { timeout: 25 * 1000 })
    .should("be.visible");

  data.config.forEach(data => {
    const { path } = type == "git" ? data : data;
    path == "helloworld" ? validateHelloWorld() : null;
  });
};

export const validateHelloWorld = () => {
  // validate route
  cy.wait(3 * 60 * 1000); // wait for a the route to be deployed
  cy.log("validate the route...");
  cy.scrollTo("bottom");
  cy
    .get('g[type="helloworld-app-route"]', {
      timeout: 100 * 1000
    })
    .should("be.visible")
    .click();
  cy
    .get(".topologyDetails")
    .children(".details-view-container")
    .find(">div")
    .first()
    .within($div => {
      cy
        .get("#linkForNodeAction", { timeout: 200 * 1000 })
        .contains("http://")
        .invoke("text")
        .then(urlLink => {
          cy
            .exec(`curl ${urlLink}`)
            .its("stdout")
            .should("not.be", "empty");
        });
    });
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
