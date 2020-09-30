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

import { channelsInformation } from "./resources.js";

export const createApplication = (clusterName, data, type) => {
  cy.visit("/multicloud/applications");
  const { name, config } = data;
  modal.clickPrimary();
  cy.get(".bx--detail-page-header-title-container").should("exist");
  cy.get("#name").type(name);
  cy.get("#namespace", { timeout: 50 * 1000 }).type(`${name}-ns`);
  if (type === "git") {
    createGit(clusterName, config);
  } else if (type === "objectstore") {
    createObj(clusterName, config);
  } else if (type === "helm") {
    createHelm(clusterName, config);
  }
  submitSave();
};

export const gitTasks = (clusterName, value, gitCss, key = 0) => {
  const { url, username, token, branch, path, timeWindow, deployment } = value;
  const { gitUrl, gitUser, gitKey, gitBranch, gitPath } = gitCss;
  cy
    .get(`#github`)
    .click()
    .trigger("mouseover");
  cy
    .get(gitUrl, { timeout: 20 * 1000 })
    .type(url, { timeout: 30 * 1000 })
    .blur();
  if (username && token) {
    cy.get(gitUser).type(username);
    cy.get(gitKey).type(token);
  }

  // wait for form to remove the users
  cy.wait(1000);
  // type in branch and path
  cy
    .get(gitBranch, { timeout: 20 * 1000 })
    .type(branch, { timeout: 30 * 1000 })
    .blur();
  cy.wait(1000);
  cy
    .get(gitPath, { timeout: 20 * 1000 })
    .type(path, { timeout: 30 * 1000 })
    .blur();
  selectClusterDeployment(deployment, clusterName, key);
  selectTimeWindow(timeWindow, key);
};

export const createHelm = (clusterName, configs) => {
  let helmCss = {
    helmURL: "#helmURL",
    helmChartName: "#helmChartName"
  };
  for (const [key, value] of Object.entries(configs)) {
    key == 0
      ? helmTasks(clusterName, value, helmCss)
      : multipleTemplate(clusterName, value, helmCss, key, helmTasks);
  }
};

export const helmTasks = (clusterName, value, css, key = 0) => {
  const { url, chartName, timeWindow, deployment } = value;
  const { helmURL, helmChartName } = css;
  cy
    .get("#helmrepo")
    .click()
    .trigger("mouseover");
  cy
    .get(helmURL, { timeout: 20 * 1000 })
    .type(url, { timeout: 30 * 1000 })
    .blur();
  cy
    .get(helmChartName, { timeout: 20 * 1000 })
    .type(chartName)
    .blur();
  selectClusterDeployment(deployment, clusterName, key);
  selectTimeWindow(timeWindow, key);
};

export const createGit = (clusterName, configs) => {
  let gitCss = {
    gitUrl: "#githubURL",
    gitUser: "#githubUser",
    gitKey: "#githubAccessID",
    gitBranch: "#githubBranch",
    gitPath: "#githubPath"
  };
  for (const [key, value] of Object.entries(configs)) {
    key == 0
      ? gitTasks(clusterName, value, gitCss)
      : multipleTemplate(clusterName, value, gitCss, key, gitTasks);
  }
};

export const createObj = (clusterName, configs) => {
  let objCss = {
    objUrl: "#objectstoreURL",
    objAccess: "#accessKey",
    objSecret: "#secretKey"
  };
  for (const [key, value] of Object.entries(configs)) {
    key == 0
      ? objTasks(clusterName, value, objCss)
      : multipleTemplate(clusterName, value, objCss, key, objTasks);
  }
};

export const objTasks = (clusterName, value, css, key = 0) => {
  const { url, accessKey, secretKey, timeWindow, deployment } = value;
  const { objUrl, objAccess, objSecret } = css;
  cy
    .get("#objectstore")
    .click()
    .trigger("mouseover");
  cy.get(objUrl, { timeout: 20 * 1000 }).type(url, { timeout: 30 * 1000 });
  cy.get(objAccess).then(input => {
    if (input.is("enabled")) {
      cy.get(objAccess).type(accessKey);
      cy.get(objSecret).type(secretKey);
    } else {
      cy.log(`credentials have not been saved...`);
    }
  });
  selectClusterDeployment(deployment, clusterName, key);
  selectTimeWindow(timeWindow, key);
};

export const multipleTemplate = (clusterName, value, css, key, func) => {
  Object.keys(css).forEach(k => (css[k] = css[k] + `grp${key}`));
  cy.get("#add-channels").click();
  cy
    .get(".creation-view-group-container")
    .eq(key)
    .within($content => {
      func(clusterName, value, css, key);
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

export const validateSubscriptionDetails = (name, data, type) => {
  cy
    .get(".toggle-subs-btn.bx--btn.bx--btn--primary", { timeout: 20 * 1000 })
    .scrollIntoView()
    .click({ timeout: 100 * 1000 });
  for (const [key, value] of Object.entries(data.config)) {
    const { setting, type } = value.timeWindow;
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
                .get(".timeWindow-status-icon")
                .contains(keywords[type].toLowerCase());
        });
    }
  }
};

export const validateAdvancedTables = async (name, data, type) => {
  for (const [key, value] of Object.entries(data.config)) {
    const { local } = value.deployment;
    const { channelName } = await channelsInformation(name, key);
    let resourceTypes = {
      subscriptions: `${name}-subscription-${key}`,
      placementrules: `${name}-placement-${key}`,
      channels: channelName
    };
    cy.log(`instance-${key}`);
    Object.keys(resourceTypes).map(function(key) {
      if (local && key == "placementrules") {
        cy.log(
          `no placementrules for app - ${name} because it has been deployed locally`
        );
      } else {
        cy.log(`validating ${key} on Advanced Tables`);
        cy.visit(`/multicloud/applications/advanced?resource=${key}`);
        cy.get("#undefined-search").type(resourceTypes[key]);
        resourceTable.rowShouldExist(resourceTypes[key], 600 * 1000);
      }
    });
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
  for (const [key, value] of Object.entries(data.config)) {
    const { local } = value.deployment;
    !local
      ? (cy.log("validate the placementrule..."),
        cy
          .get(`g[type="${name}-placement-0"]`, { timeout: 25 * 1000 })
          .should("be.visible"))
      : cy.log(
          "placement will not be created as the application is deployed locally"
        );
  }

  data.config.forEach(data => {
    const { path } = type == "git" ? data : data;
    path == "helloworld" ? validateHelloWorld() : null;
  });
};

export const validateHelloWorld = () => {
  // validate route
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
  cy.get("#undefined-search").type(name);
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
    modal.clickResources();
    modal.clickDanger();
    modal.shouldNotBeVisible();

    // after deleting the app, it should not exist in the app table
    resourceTable.rowShouldNotExist(name, 300 * 1000);
  } else {
    cy.log("No apps to delete...");
  }
};

export const selectClusterDeployment = (deployment, clusterName, key) => {
  if (deployment) {
    const { local, online, matchingLabel } = deployment;
    const cluster = clusterName.split("/")[1];
    let clusterDeploymentCss = {
      localClusterID: "#local-cluster-checkbox",
      onlineClusterID: "#online-cluster-only-checkbox",
      uniqueClusterID: "#clusterSelector-checkbox-clusterSelector"
    };
    key == 0
      ? clusterDeploymentCss
      : Object.keys(clusterDeploymentCss).forEach(
          k => (clusterDeploymentCss[k] = clusterDeploymentCss[k] + `grp${key}`)
        );

    const {
      localClusterID,
      onlineClusterID,
      uniqueClusterID
    } = clusterDeploymentCss;

    !local
      ? cy.log("do not select `Deploy on local cluster`")
      : cy
          .get(localClusterID)
          .click({ force: true })
          .trigger("mouseover", { force: true });
    !online
      ? local
        ? cy.log("local deployment has been set")
        : cy
            .get(onlineClusterID, { timeout: 50 * 1000 })
            .click({ force: true })
            .trigger("mouseover", { force: true })
      : cy.log("select `Deploy to all online clusters` by default");

    !matchingLabel
      ? cy.log(
          "do not select `Deploy application resources only on clusters matching specified labels`"
        )
      : (cy.get(uniqueClusterID).click({ force: true }),
        cy.log(`deploying app to cluster-${cluster}`),
        cy.get("#labelName-0").type("name"),
        cy.get("#labelValue-0").type(cluster));
  } else {
    throw new Error(
      "no available imported OCP clusters to deploy applications"
    );
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

export const editApplication = name => {
  cy.visit("/multicloud/applications");
  resourceTable.rowShouldExist(name, 600 * 1000);
  resourceTable.openRowMenu(name);
  resourceTable.menuClickEdit();
  cy.url().should("include", `/${name}`);
};
