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
  notification,
  validateSubscriptionTable,
  getSingleAppClusterTimeDetails,
  verifyApplicationData,
  validateSubscriptionDetails
} from "./common";

import { channelsInformation } from "./resources.js";

const gitCssValues = {
  gitUrl: "#githubURL",
  gitUser: "#githubUser",
  gitKey: "#githubAccessId",
  gitBranch: "#githubBranch",
  gitPath: "#githubPath",
  merge: "#gitReconcileOption"
};

export const createApplication = (clusterName, data, type) => {
  cy.visit("/multicloud/applications");
  // wait for create button to be enabled
  cy.get("[data-test-create-application=true]", { timeout: 50 * 1000 }).click();
  cy.log(`Test create application ${name}`);
  const { name, config } = data;
  cy.get(".bx--detail-page-header-title-container").should("exist");
  cy.get("#name", { timeout: 50 * 1000 }).type(name);
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
  const {
    url,
    username,
    token,
    branch,
    path,
    timeWindow,
    deployment,
    gitReconcileOption
  } = value;
  cy.log(`gitTasks key=${key}, url=${url}, path=${path}`);
  const { gitUrl, gitUser, gitKey, gitBranch, gitPath, merge } = gitCss;

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
  if (gitReconcileOption) {
    cy.get(merge).click({ force: true });
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

export const createHelm = (clusterName, configs, addOperation) => {
  let helmCss = {
    helmURL: "#helmURL",
    helmChartName: "#helmChartName",
    helmPackageVersion: "#helmPackageVersion"
  };
  if (addOperation) {
    //add new subscription to existing app
    for (const [key, value] of Object.entries(configs.new)) {
      multipleTemplate(
        clusterName,
        value,
        helmCss,
        parseInt(key) + Object.entries(configs.config).length - 1,
        helmTasks
      );
    }
  } else {
    //create application
    for (const [key, value] of Object.entries(configs)) {
      key == 0
        ? helmTasks(clusterName, value, helmCss)
        : multipleTemplate(clusterName, value, helmCss, key, helmTasks);
    }
  }
};

export const helmTasks = (clusterName, value, css, key = 0) => {
  const { url, chartName, packageVersion, timeWindow, deployment } = value;
  const { helmURL, helmChartName, helmPackageVersion } = css;
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
  packageVersion &&
    cy
      .get(helmPackageVersion, { timeout: 20 * 1000 })
      .type(packageVersion)
      .blur();
  selectClusterDeployment(deployment, clusterName, key);
  selectTimeWindow(timeWindow, key);
};

export const createGit = (clusterName, configs, addOperation) => {
  let gitCss = gitCssValues;
  if (addOperation) {
    //add new subscription to existing app
    for (const [key, value] of Object.entries(configs.new)) {
      multipleTemplate(
        clusterName,
        value,
        gitCss,
        parseInt(key) + Object.entries(configs.config).length - 1,
        gitTasks
      );
    }
  } else {
    //create application
    for (const [key, value] of Object.entries(configs)) {
      key == 0
        ? gitTasks(clusterName, value, gitCss)
        : multipleTemplate(clusterName, value, gitCss, key, gitTasks);
    }
  }
};

export const createObj = (clusterName, configs, addOperation) => {
  let objCss = {
    objUrl: "#objectstoreURL",
    objAccess: "#accessKey",
    objSecret: "#secretKey"
  };
  if (addOperation) {
    //add new subscription to existing app
    for (const [key, value] of Object.entries(configs.new)) {
      multipleTemplate(
        clusterName,
        value,
        objCss,
        parseInt(key) + Object.entries(configs.config).length - 1,
        objTasks
      );
    }
  } else {
    //create application
    for (const [key, value] of Object.entries(configs)) {
      key == 0
        ? objTasks(clusterName, value, objCss)
        : multipleTemplate(clusterName, value, objCss, key, objTasks);
    }
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
  cy.get("#add-channels").click({ force: true });
  cy
    .get(".creation-view-group-container")
    .eq(key)
    .within($content => {
      func(clusterName, value, css, key);
    });
};

export const submitSave = () => {
  modal.shouldNotBeDisabled();
  modal.clickSubmit();
  cy
    .get("#notifications", { timeout: 50 * 1000 })
    .scrollIntoView({ offset: { top: -500, left: 0 } });
  notification.shouldExist("success", { timeout: 60 * 1000 });
  cy.location("pathname", { timeout: 60 * 1000 }).should("include", `${name}`);
};

export const validateAdvancedTables = (
  name,
  data,
  type,
  numberOfRemoteClusters
) => {
  cy.log(
    `Execute validateAdvancedTables for name=${name}, data.config=${
      data.config
    }`
  );
  for (const [key, subscriptionItem] of Object.entries(data.config)) {
    const { local } = subscriptionItem.deployment;
    channelsInformation(name, key).then(({ channelName }) => {
      let resourceTypes = {
        subscriptions: `${name}-subscription-${parseInt(key) + 1}`,
        placementrules: `${name}-placement-${parseInt(key) + 1}`,
        channels: channelName
      };
      cy.log(`Validate instance-${key} with channel name ${channelName}`);
      Object.keys(resourceTypes).map(function(tableType) {
        cy.log(`Validating now the ${tableType} table for app ${name}`);
        if (local && tableType == "placementrules") {
          cy.log(
            `no placementrules for app - ${name} because it has been deployed locally`
          );
        } else {
          cy.log(`Validating ${tableType} on Advanced Tables`);
          cy.visit(`/multicloud/applications/advanced?resource=${tableType}`);
          cy
            .get("#undefined-search", { timeout: 500 * 1000 })
            .type(resourceTypes[tableType]);
          resourceTable.rowShouldExist(resourceTypes[tableType], 600 * 1000);
          validateSubscriptionTable(
            resourceTypes[tableType],
            tableType,
            subscriptionItem,
            numberOfRemoteClusters
          );
        }
      });
    });
  }
};

/*
opType = 'create' if run afer app creation step
opType = 'delete' if run afer delete subs step
opType = 'add' if run afer add subs step
*/
export const validateTopology = (
  name,
  data,
  type,
  numberOfRemoteClusters,
  opType
) => {
  cy.visit(`/multicloud/applications/${name}-ns/${name}`);
  cy.reload();
  cy
    .get(".search-query-card-loading", { timeout: 50 * 1000 })
    .should("not.exist");
  cy.get("#left-col").contains(name);
  cy.get("#left-col").contains(`${name}-ns`);

  const appDetails = getSingleAppClusterTimeDetails(
    data,
    numberOfRemoteClusters,
    opType
  );
  cy.log(
    `Verify cluster deploy status on app card is ${appDetails.clusterData}`
  );

  //for now check on create app only
  cy
    .get(".overview-cards-details-section", { timeout: 50 * 1000 })
    .contains(appDetails.clusterData);

  const successNumber = data.successNumber; // this needs to be set in the yaml as the number of resources that should show success for this app
  cy.log(
    `Verify that the deployed resources number with status success is at least ${successNumber}`
  );
  cy
    .get("#green-resources", { timeout: 50 * 1000 })
    .children(".status-count")
    .invoke("text")
    .then(parseInt)
    .should("be.gte", successNumber);

  validateSubscriptionDetails(name, data, type, opType);

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
  const subsIndex = opType == "create" ? 1 : 2; //add new subs or delete subs
  cy
    .get(`g[type="${name}-subscription-${subsIndex}"]`, { timeout: 25 * 1000 })
    .should("be.visible");

  // cluster and placement
  for (const [key, value] of Object.entries(data.config)) {
    if (opType == "delete" && key == 0) {
      //ignore first subscription on delete
    } else {
      //if opType is create, the first subscription was removed by the delete subs test, use the new config option
      const { local, online } =
        key == 0 && opType == "add" ? data.new[0].deployment : value.deployment;
      cy.log(` key=${key}, type=${opType}`);
      !local
        ? (validatePlacementNode(name, key),
          !online && validateClusterNode(Cypress.env("managedCluster"))) //ignore online placements since the app is deployed on all online clusters here and we don't know for sure how many remote clusters the hub has
        : cy.log(
            "cluster and placement nodes will not be created as the application is deployed locally"
          );
    }
  }
};

export const validateClusterNode = clusterName => {
  cy.log("validating the cluster...");
  cy
    .get(`g[type="${clusterName}"]`, { timeout: 25 * 1000 })
    .should("be.visible");
};

export const validatePlacementNode = (name, key) => {
  cy.log("validate the placementrule..."),
    cy
      .get(`g[type="${name}-placement-${parseInt(key) + 1}"]`, {
        timeout: 25 * 1000
      })
      .should("be.visible");
};

export const validateAppTableMenu = (name, resourceTable) => {
  //validate SEARCH menu

  if (name != "ui-git") {
    // check popup actions on one app only, that's sufficient
    return;
  }
  resourceTable.openRowMenu(name);
  cy
    .get('button[data-table-action="table.actions.applications.search"]', {
      timeout: 20 * 1000
    })
    .click({ force: true });
  cy
    .url()
    .should(
      "include",
      `multicloud/search?filters={%22textsearch%22:%22name%3A${name}%20namespace%3A${name}-ns%20kind%3Aapplication%20apigroup%3Aapp.k8s.io%22}`
    );

  //get back to app page
  cy.visit(`/multicloud/applications`);
  cy.get(".search-query-card-loading").should("not.exist", {
    timeout: 60 * 1000
  });
  pageLoader.shouldNotExist();
  cy.get("#undefined-search", { timeout: 500 * 1000 }).type(name);
  resourceTable.rowShouldExist(name, 600 * 1000);
  //END SEARCH menu validation

  //validate Edit menu
  resourceTable.openRowMenu(name);
  resourceTable.menuClickEdit();
  cy.get(".bx--detail-page-header-title").should("exist", {
    timeout: 60 * 1000
  });
  //get back to app page
  cy.visit(`/multicloud/applications`);
  cy.get(".search-query-card-loading").should("not.exist", {
    timeout: 60 * 1000
  });
  pageLoader.shouldNotExist();
  cy.get("#undefined-search", { timeout: 500 * 1000 }).type(name);
  resourceTable.rowShouldExist(name, 600 * 1000);
  //END Edit menu validation

  //validate View menu
  resourceTable.openRowMenu(name);
  resourceTable.menuClickView();
  cy.get(".resourceDiagramSourceContainer").should("exist", {
    timeout: 60 * 1000
  });
};

export const validateResourceTable = (name, data, numberOfRemoteClusters) => {
  cy.visit(`/multicloud/applications`);
  cy.get(".search-query-card-loading").should("not.exist", {
    timeout: 60 * 1000
  });
  pageLoader.shouldNotExist();
  cy.get("#undefined-search", { timeout: 500 * 1000 }).type(name);
  resourceTable.rowShouldExist(name, 600 * 1000);

  //validate content
  cy
    .get(".resource-table")
    .get(`tr[data-row-name="${name}"]`)
    .get("td")
    .eq(0)
    .invoke("text")
    .should("eq", name);
  cy
    .get(".resource-table")
    .get(`tr[data-row-name="${name}"]`)
    .get("td")
    .eq(1)
    .invoke("text")
    .should("eq", `${name}-ns`);

  const appDetails = getSingleAppClusterTimeDetails(
    data,
    numberOfRemoteClusters,
    "create"
  );
  cy.log("Validate Cluster column");
  cy
    .get(".resource-table")
    .get(`tr[data-row-name="${name}"]`)
    .get("td")
    .eq(2)
    .invoke("text")
    .should("contains", appDetails.clusterData);

  const popupDefaultText =
    "Provide a description that will be used as the title";
  const subscriptionLength = data.config.length;
  let repositoryText =
    data.type === "objectstore"
      ? "Object storage"
      : data.type === "helm" ? "Helm" : "Git";
  repositoryText =
    subscriptionLength > 1
      ? `${repositoryText} (${subscriptionLength})`
      : repositoryText;
  repositoryText = `${repositoryText}${popupDefaultText}`;
  cy.log("Validate Repository column");
  cy
    .get(".resource-table")
    .get(`tr[data-row-name="${name}"]`)
    .get("td")
    .eq(3)
    .invoke("text")
    .should("eq", repositoryText);

  cy.log("Validate Repository popup");
  cy
    .get(".resource-table")
    .get(`tr[data-row-name="${name}"]`)
    .get("td")
    .eq(3)
    .click();

  data.config.forEach(item => {
    let repoInfo = `${popupDefaultText}${item.url}`;
    if (item.branch && item.branch.length > 0) {
      repoInfo = `${repoInfo}Branch:${item.branch}`;
    }
    if (item.path && item.path.length > 0) {
      repoInfo = `${repoInfo}Path:${item.path}`;
    }

    cy
      .get(".pf-l-split__item")
      .invoke("text")
      .should("include", repoInfo);
  });

  cy.log("Validate Window column");
  cy
    .get(".resource-table")
    .get(`tr[data-row-name="${name}"]`)
    .get("td")
    .eq(4)
    .invoke("text")
    .should("eq", appDetails.timeWindowData);

  if (data.type == "git") {
    cy.log("Validate popup actions");
    //validate menu for one app only, no need to check all
    validateAppTableMenu(name, resourceTable, numberOfRemoteClusters);
  }
};

//delete application resources from advanced tables
export const deleteResourceUI = (name, type) => {
  cy.visit(`/multicloud/applications/advanced?resource=${type}`);

  let resourceTypes = {
    subscriptions: `${name}-subscription-1`,
    placementrules: `${name}-placement-1`,
    channels: "hkubernetes-chartsstoragegoogleapiscom"
  };
  cy.log(
    `Verify that resource ${resourceTypes[type]} can be deleted for app ${name}`
  );

  cy
    .get("#undefined-search", { timeout: 500 * 1000 })
    .type(resourceTypes[type]);
  resourceTable.rowShouldExist(resourceTypes[type], 600 * 1000);

  resourceTable.openRowMenu(resourceTypes[type]);
  resourceTable.menuClickDelete(type);
  modal.shouldBeOpen();

  modal.clickDanger();
  modal.shouldBeClosed();

  // after deleting the app, it should not exist in the app table
  resourceTable.rowShouldNotExist(resourceTypes[type], 300 * 1000);
};

export const deleteApplicationUI = name => {
  cy.visit("/multicloud/applications");
  if (noResource.shouldNotExist()) {
    resourceTable.rowShouldExist(name, 600 * 1000);

    resourceTable.openRowMenu(name);
    resourceTable.menuClickDelete("applications");
    modal.shouldBeOpen();

    cy
      .get(".bx--loading-overlay", { timeout: 50 * 1000 })
      .should("not.be.visible", {
        timeout: 100 * 1000
      });

    if (!name.includes("ui-helm2")) {
      //delete all resources
      cy.log(`Verify that the app and all resources are deleted for ${name}`);
      modal.clickResources();
    }
    modal.clickDanger();
    // after deleting the app, it should not exist in the app table
    modal.shouldBeClosed();
    resourceTable.rowShouldNotExist(name, 300 * 1000);
  } else {
    cy.log("No apps to delete...");
  }

  if (name.includes("ui-helm2")) {
    //delete all resources from advanced table
    deleteResourceUI(name, "subscriptions");
    deleteResourceUI(name, "placementrules");
    deleteResourceUI(name, "channels");
  }
};

export const selectClusterDeployment = (deployment, clusterName, key) => {
  cy.log(
    `Execute selectClusterDeployment with options clusterName=${clusterName} deployment=${deployment} and key=${key}`
  );
  if (deployment) {
    const { local, online, matchingLabel, existing } = deployment;
    cy.log(
      `cluster options are  local=${local} online=${online} matchingLabel=${matchingLabel} existing=${existing}`
    );
    let clusterDeploymentCss = {
      localClusterID: "#local-cluster-checkbox",
      onlineClusterID: "#online-cluster-only-checkbox",
      uniqueClusterID: "#clusterSelector-checkbox-clusterSelector",
      existingClusterID: "#existingrule-checkbox",
      existingRuleComboID: "#placementrulecombo"
    };
    key == 0
      ? clusterDeploymentCss
      : Object.keys(clusterDeploymentCss).forEach(
          k => (clusterDeploymentCss[k] = clusterDeploymentCss[k] + `grp${key}`)
        );

    const {
      localClusterID,
      onlineClusterID,
      uniqueClusterID,
      existingClusterID,
      existingRuleComboID
    } = clusterDeploymentCss;
    cy.log(
      `existingClusterID=${existingClusterID} existingRuleCombo=${existingRuleComboID} existing=${existing}`
    );
    if (existing) {
      cy.log(`Select to deploy using existing placement ${existing}`);
      cy
        .get(existingClusterID, { timeout: 50 * 1000 })
        .click({ force: true })
        .trigger("mouseover", { force: true });

      cy.get(existingRuleComboID).within($rules => {
        cy.get("[type='button']").click();
        cy
          .get(".bx--list-box__menu-item:first-of-type", {
            timeout: 30 * 1000
          })
          .click();
      });
    } else if (online) {
      cy.log("Select to deploy to all online clusters including local cluster");
      cy
        .get(onlineClusterID, { timeout: 50 * 1000 })
        .click({ force: true })
        .trigger("mouseover", { force: true });
    } else if (local) {
      cy.log("Select to deploy to local cluster only");
      cy
        .get(localClusterID, { timeout: 50 * 1000 })
        .click({ force: true })
        .trigger("mouseover", { force: true });
    } else {
      cy.log(
        "Select Deploy application resources only on clusters matching specified labels, which is the default"
      );
      cy.log(`deploying app to cluster-${clusterName}`),
        selectMatchingLabel(clusterName, key);
    }
  } else {
    throw new Error(
      "no available imported OCP clusters to deploy applications"
    );
  }
};

export const selectMatchingLabel = (cluster, key) => {
  let matchingLabelCSS = {
    labelName: "#labelName-0-clusterSelector",
    labelValue: "#labelValue-0-clusterSelector"
  };

  key == 0
    ? matchingLabelCSS
    : Object.keys(matchingLabelCSS).forEach(
        k => (matchingLabelCSS[k] = matchingLabelCSS[k] + `grp${key}`)
      );
  const { labelName, labelValue } = matchingLabelCSS;
  cy.get(labelName).type("name"), cy.get(labelValue).type(cluster);
};

export const selectTimeWindow = (timeWindow, key = 0) => {
  if (!timeWindow) {
    cy.log("timeWindow info not available, ignore this section");
    return;
  }
  const { setting, type, date, hours } = timeWindow;
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
      .get(".bx--combo-box.config-timezone-combo-box.bx--list-box")
      .within($timezone => {
        cy.get("[type='button']").click();
        cy
          .get(".bx--list-box__menu-item:first-of-type", {
            timeout: 30 * 1000
          })
          .click();
      });

    if (hours) {
      hours.forEach((interval, idx) => {
        cy.get(`#start-time-${idx}`).type(interval.start);
        cy.get(`#end-time-${idx}`).type(interval.end);

        if (idx < hours.length - 1) {
          cy.get(".add-time-btn", { timeout: 10 * 1000 }).click();
        }
      });
    }
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

export const edit = name => {
  cy
    .server()
    .route({
      method: "POST", // Route all POST requests
      url: `/multicloud/applications/graphql`
    })
    .as("graphql");
  cy.visit("/multicloud/applications");
  resourceTable.rowShouldExist(name, 600 * 1000);
  resourceTable.openRowMenu(name);
  resourceTable.menuClickEdit();
  cy.url().should("include", `/${name}`);
  // as soon as edit button is shown we can proceed
  cy.get("#edit-yaml", { timeout: 100 * 1000 });
  cy.wait(["@graphql", "@graphql"], {
    timeout: 50 * 1000
  });
};

export const editApplication = (name, data) => {
  edit(name);
  cy.log("Verify name and namespace fields are disabled");
  cy.get(".bx--detail-page-header-title-container", { timeout: 100 * 1000 });
  cy.get("#edit-yaml", { timeout: 100 * 1000 }).click({ force: true });
  cy.get(".creation-view-yaml", { timeout: 20 * 1000 });
  cy
    .get(".bx--text-input.bx--text__input", { timeout: 20 * 1000 })
    .should("be.disabled");
  cy
    .get(".bx--text-input.bx--text__input", { timeout: 20 * 1000 })
    .invoke("val")
    .should("eq", name);
  cy.get("#namespace", { timeout: 20 * 1000 }).should("be.disabled");
  cy
    .get("#namespace", { timeout: 20 * 1000 })
    .invoke("val")
    .should("eq", `${name}-ns`);
  cy.log("Verify Update button is disabled");

  modal.shouldBeDisabled();

  verifyApplicationData(name, data, "create");
};

export const deleteFirstSubscription = (name, data) => {
  edit(name);
  if (data.config.length > 1) {
    cy.log(`Verified that ${name} has ${data.config.length} subscriptions`);
    cy.log(
      `Verify that the first subscription can be deleted for ${name} application`
    );

    cy.get(".creation-view-controls-section").within($section => {
      cy
        .get(".creation-view-group-container")
        .first()
        .within($div => {
          cy.get(".creation-view-controls-delete-button").click();
        });
    });
    modal.shouldNotBeDisabled();
    modal.clickSubmit();
    notification.shouldExist("success", { timeout: 60 * 1000 });
  } else {
    cy.log(`skipping ${name} since it's a single application...`);
  }
};

export const addNewSubscription = (name, data, clusterName) => {
  cy.log(`Verify that a new subscription can be added to ${name} application`);
  edit(name);

  if (data.type === "git") {
    createGit(clusterName, data, true);
  } else if (data.type === "objectstore") {
    createObj(clusterName, data, true);
  } else if (data.type === "helm") {
    createHelm(clusterName, data, true);
  }

  modal.shouldNotBeDisabled();
  modal.clickSubmit();
  notification.shouldExist("success", { timeout: 60 * 1000 });
};

export const verifyEditAfterDeleteSubscription = (name, data) => {
  if (data.config.length > 1) {
    edit(name);
    cy.log(
      `Verify that after edit, ${name} application has one less subscription`
    );
    cy.get(".creation-view-controls-section").within($section => {
      cy
        .get(".creation-view-group-container")
        .should("have.length", data.config.length - 1);
    });
  }
};

export const verifyEditAfterNewSubscription = (name, data) => {
  edit(name);
  cy.log(
    `Verify that after edit, ${name} application has one more subscription`
  );
  let nbOfSubscriptionsNow =
    data.config.length == 1 ? 1 : data.config.length - 1; //count for the subscription deleted by the delete subs test
  cy.get(".creation-view-controls-section").within($section => {
    cy
      .get(".creation-view-group-container")
      .should("have.length", nbOfSubscriptionsNow + 1);
  });

  verifyApplicationData(name, data, "add");
};
