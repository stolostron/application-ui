/** *****************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 ****************************************************************************** */

/// <reference types="cypress" />

export const pageLoader = {
  shouldExist: () =>
    cy.get(".content-spinner", { timeout: 20000 }).should("exist"),
  shouldNotExist: () =>
    cy.get(".content-spinner", { timeout: 20000 }).should("not.exist")
};

export const resourceTable = {
  shouldExist: () =>
    cy.get(".resource-table", { timeout: 20000 }).should("exist"),
  shouldNotExist: () =>
    cy.get(".resource-table", { timeout: 20000 }).should("not.exist"),
  rowCount: () =>
    cy.get(".resource-table", { timeout: 500 * 1000 }).then($table => {
      return $table.find("tbody").find("tr").length;
    }),
  rowShouldExist: function(name, timeout) {
    this.searchTable(name);
    cy
      .get(`tr[data-row-name="${name}"]`, {
        timeout: timeout || 30 * 1000
      })
      .should("exist");
  },
  rowShouldNotExist: function(name, timeout, disableSearch) {
    !disableSearch && this.searchTable(name);
    cy
      .get(`tr[data-row-name="${name}"]`, {
        timeout: timeout || 30 * 1000
      })
      .should("not.exist");
  },
  rowNameClick: name =>
    cy.get(`a[href*="multicloud/applications/${name}-ns/${name}"]`).click(),
  searchTable: function(name) {
    cy.get("#page").then(page => {
      if (page.find("#resource-search-bar", { timeout: 15000 }).length > 0) {
        this.clearSearch();
        cy.get("#resource-search-bar").paste(name);
      }
    });
  },
  openRowMenu: name =>
    cy
      .get(`tr[data-row-name="${name}"] .bx--overflow-menu`, {
        timeout: 20 * 10000
      })
      .click(),
  menuClickView: () =>
    cy
      .get('button[data-table-action="table.actions.applications.view"]', {
        timeout: 20 * 1000
      })
      .click({ force: true }),
  menuClickEdit: () =>
    cy
      .get('button[data-table-action="table.actions.applications.edit"]', {
        timeout: 20 * 1000
      })
      .click({ force: true }),
  menuClickDelete: type =>
    cy
      .get(`button[data-table-action="table.actions.${type}.remove"]`, {
        timeout: 20 * 1000
      })
      .click(),
  menuClickDeleteConfirm: () =>
    cy
      .get("button")
      .contains("Delete application", { timeout: 20 * 1000 })
      .click()
};

export const secondaryHeader = {
  clickPrimary: () => cy.get(".secondary-header-actions-primary").click(),
  clickSecondary: () => cy.get(".secondary-header-actions-secondary").click()
};

export const noResource = {
  shouldExist: () =>
    cy.get(".no-resource", { timeout: 20000 }).should("be.visible"),
  shouldNotExist: timeout =>
    cy
      .get(".no-resource", { timeout: timeout ? timeout : 20 * 1000 })
      .should("not.be.visible")
};

export const modal = {
  shouldBeOpen: () => cy.get(".bx--modal", { timeout: 20000 }).should("exist"),
  shouldBeClosed: () =>
    cy.get(".bx--modal", { timeout: 20000 }).should("not.exist"),
  shouldBeVisible: () =>
    cy.get("#create-button-portal-id", { timeout: 20000 }).should("be.visible"),
  shouldNotBeVisible: () =>
    cy
      .get("#create-button-portal-id", { timeout: 20000 })
      .should("not.be.visible"),
  shouldNotBeDisabled: () =>
    cy
      .get(".bx--btn.bx--btn--primary", { timeout: 20000 })
      .should("not.be.disabled"),
  shouldBeDisabled: () =>
    cy
      .get(".bx--btn.bx--btn--primary", { timeout: 20000 })
      .should("be.disabled"),
  clickSubmit: () =>
    cy.get(".bx--btn.bx--btn--primary", { timeout: 20000 }).click(),
  clickResources: () =>
    cy.get("#remove-app-resources", { timeout: 20000 }).click({ force: true }),
  clickDanger: () =>
    cy.get(".bx--modal .bx--btn--danger--primary", { timeout: 20000 }).click(),
  clickPrimary: () =>
    cy
      .get(".bx--btn.bx--btn--sm.bx--btn--primary, .pf-c-button.pf-m-primary", {
        timeout: 20 * 1000
      })
      .then($el => {
        Cypress.dom.isDetached($el); // false
      })
      .click({ force: true }),
  clickSecondary: () =>
    cy
      .get(".bx--btn.bx--btn--sm.bx--btn--secondary", { timeout: 20000 })
      .click(),
  confirmAction: text => cy.get("#confirm-action").type(text)
};

export const notification = {
  shouldExist: type =>
    cy
      .get(`.bx--inline-notification[kind="${type}"]`, { timeout: 200 * 1000 })
      .should("exist")
};

export const resourcePage = {
  shouldLoad: () => {
    cy.get("#page").then(page => {
      if (page.find(".resource-table").length) {
        resourceTable.shouldExist();
      } else {
        noResource.shouldExist();
      }
    });
  }
};

/*
Validate advanced configuration tables content
*/
export const validateSubscriptionTable = (
  name,
  tableType,
  data,
  numberOfRemoteClusters
) => {
  let clustersColumnIndex = -1;
  let timeWindowColumnIndex = -1;
  let repositoryColumnIndex = -1; //for channel table only

  switch (tableType) {
    case "subscriptions":
      clustersColumnIndex = 4;
      timeWindowColumnIndex = 5;
      break;
    case "placementrules":
      clustersColumnIndex = 2;
      break;
    case "channels":
      // will not check channel table since we can't get the aggregated number
      clustersColumnIndex = -1;
      repositoryColumnIndex = 2;
      break;
    default:
      clustersColumnIndex = -1;
  }
  cy.log(
    `validateSubscriptionTable tableType=${tableType}, clustersColumnIndex=${clustersColumnIndex}`
  );
  cy
    .get(".resource-table")
    .get(`tr[data-row-name="${name}"]`)
    .get("td")
    .eq(0)
    .invoke("text")
    .should("eq", name);

  let hasWindow = "";
  if (timeWindowColumnIndex > 0) {
    //validate time window for subscriptions
    cy.log("Validate Window column");

    if (data.timeWindow && data.timeWindow.type) {
      if (data.timeWindow.type == "activeinterval") {
        hasWindow = "Active";
      } else if (data.timeWindow.type == "blockinterval") {
        hasWindow = "Blocked";
      }
    }
    cy
      .get(".resource-table")
      .get(`tr[data-row-name="${name}"]`)
      .get("td")
      .eq(timeWindowColumnIndex)
      .invoke("text")
      .should("eq", hasWindow);
  }

  if (clustersColumnIndex > 0 && hasWindow.length == 0) {
    //don't validate cluster count if time window is set since it might be blocked
    //validate remote cluster value
    cy.log("Validate remote cluster values");

    const { local, online, matchingLabel, existing } = data.deployment;
    const onlineDeploy = online ? true : false;
    const remoteDeploy = matchingLabel || existing ? true : false;
    const localDeploy = local ? true : false;

    let clusterText = "None";
    if (onlineDeploy) {
      clusterText = `${numberOfRemoteClusters} Remote, 1 Local`;
    } else if (remoteDeploy && localDeploy) {
      clusterText = "1 Remote, 1 Local";
    } else if (localDeploy) {
      clusterText = "Local";
    } else if (remoteDeploy) {
      clusterText = "1 Remote";
    }
    cy
      .get(".resource-table", { timeout: 100 * 1000 })
      .get(`tr[data-row-name="${name}"]`)
      .get("td")
      .eq(clustersColumnIndex)
      .invoke("text")
      .should("eq", clusterText);
  }

  if (repositoryColumnIndex > 0) {
    cy.log("Validate Repository popup");
    cy
      .get(".resource-table")
      .get(`tr[data-row-name="${name}"]`)
      .get("td")
      .eq(repositoryColumnIndex)
      .click();

    cy
      .get(".pf-l-split__item")
      .invoke("text")
      .should("include", data.url);
  }

  if (data.type == "git") {
    cy.log(`Validate Menu actions for ${tableType} with name ${name}`);
    resourceTable.openRowMenu(name);

    cy.get(`button[data-table-action="table.actions.${tableType}.search"]`, {
      timeout: 20 * 1000
    });
    cy.get(`button[data-table-action="table.actions.${tableType}.edit"]`, {
      timeout: 20 * 1000
    });

    cy.get(`button[data-table-action="table.actions.${tableType}.remove"]`, {
      timeout: 20 * 1000
    });
  }
};

/*
Return remote clusters info and time wndow for a single app as it shows in single app table
*/
export const getSingleAppClusterTimeDetails = (
  data,
  numberOfRemoteClusters,
  opType
) => {
  let onlineDeploy = false; //deploy to all online clusters including local
  let localDeploy = false;
  let remoteDeploy = false;
  let hasWindow = "";
  let index = 0;
  data.config.forEach(item => {
    if (opType == "add" && index == 0) {
      // if this is called after add subscription stop, use the new configuration
      //the first initial item was removed on delete subs step
      item = data.new[0];
    } else if (opType == "delete" && index == 0) {
      //ignore first subscription since it was deleted
    } else {
      if (item.timeWindow) {
        hasWindow = "Yes"; // at list one window set
      }
      const { local, online, matchingLabel, existing } = item.deployment;
      onlineDeploy = onlineDeploy || online ? true : false; // if any subscription was set to online option, use that over anything else
      remoteDeploy = matchingLabel || existing ? true : remoteDeploy;
      localDeploy = local ? true : localDeploy;
    }
    index = index + 1;
  });

  let clusterText = "None";
  if (onlineDeploy) {
    //clusterText = `${numberOfRemoteClusters} Remote, 1 Local`;
    //TODO:enable cluster number check
    clusterText = "Remote, 1 Local"; //when multiple clusters deployment is not always completed on all so for now disabling number check
  } else if (remoteDeploy && localDeploy) {
    clusterText = "1 Remote, 1 Local";
  } else if (localDeploy) {
    clusterText = "Local";
  } else if (remoteDeploy) {
    clusterText = "1 Remote";
  }

  return {
    clusterData: clusterText,
    timeWindowData: hasWindow
  };
};

export const verifyApplicationData = (name, data, opType) => {
  cy.log(`Verify application settings for ${name}`);
  cy.get(".creation-view-controls-section").within($section => {
    for (const [key, itemConfig] of Object.entries(data.config)) {
      let item = itemConfig;
      if (opType == "add") {
        item = key == 0 ? data.config[1] : data.new[0]; // here we assume first subscription was removed by the delete test and then added a new one
      }
      cy
        .get(".creation-view-group-container")
        .eq(key)
        .within($div => {
          let channelSectionId =
            key == 0
              ? "#channel-repository-types"
              : `#channelgrp${key}-repository-types`;
          cy.get(channelSectionId).click();
          if (data.type == "git") {
            cy.log(`Verify Git reconcile option for ${name}`);
            const reconcileKey =
              key == 0 ? "#gitReconcileOption" : `#gitReconcileOptiongrp${key}`;
            item.gitReconcileOption &&
              cy.get(reconcileKey, { timeout: 20 * 1000 }).should("be.checked");

            !item.gitReconcileOption &&
              cy
                .get(reconcileKey, { timeout: 20 * 1000 })
                .and("not.be.checked");
          }

          const { deployment } = item;

          cy.log(`Verify Placement option for ${name}`);
          let prSectionId =
            key == 0
              ? "#clustersection-select-clusters-to-deploy-to"
              : `#clustersectiongrp${key}-select-clusters-to-deploy-to`;
          cy.get(prSectionId).click();

          cy.log(`Verify existing placement rule option should not be checked`);
          const existingRuleId =
            key == 0
              ? "#existingrule-checkbox"
              : `#existingrule-checkboxgrp${key}`;
          cy
            .get(existingRuleId, { timeout: 20 * 1000 })
            .should("not.be.checked");

          cy.log(
            `Verify deploy to clusters by label checkbox deployment.matchingLabel=${
              deployment.matchingLabel
            }`
          );
          const matchingLabelId =
            key == 0
              ? "#clusterSelector-checkbox-clusterSelector"
              : `#clusterSelector-checkbox-clusterSelectorgrp${key}`;
          (deployment.matchingLabel || deployment.existing) &&
            cy
              .get(matchingLabelId, { timeout: 20 * 1000 })
              .should("be.checked");
          !deployment.matchingLabel &&
            !deployment.existing &&
            cy
              .get(matchingLabelId, { timeout: 20 * 1000 })
              .should("not.be.checked");

          cy.log(
            `Verify deploy to all online clusters checkbox deployment.online=${
              deployment.online
            }`
          );
          const onlineId =
            key == 0
              ? "#online-cluster-only-checkbox"
              : `#online-cluster-only-checkboxgrp${key}`;
          deployment.online &&
            cy.get(onlineId, { timeout: 20 * 1000 }).should("be.checked");
          !deployment.online &&
            cy.get(onlineId, { timeout: 20 * 1000 }).should("not.be.checked");

          cy.log(`Verify deploy to local cluster checkbox`);
          const localClusterId =
            key == 0
              ? "#local-cluster-checkbox"
              : `#local-cluster-checkboxgrp${key}`;
          deployment.local &&
            cy.get(localClusterId, { timeout: 20 * 1000 }).should("be.checked");
          !deployment.local &&
            cy
              .get(localClusterId, { timeout: 20 * 1000 })
              .should("not.be.checked");
        });
    }
  });
};

const convertTimeFormat = time => {
  if (time !== "") {
    const hour24 = time.substring(0, 2);
    let hour12 = hour24 % 12 || 12;
    const period = hour24 < 12 ? "am" : "pm";
    return hour12 + time.substring(2) + period;
  } else {
    return "";
  }
};

export const validateSubscriptionDetails = (name, data, type, opType) => {
  if (opType == "delete") {
    //ignore this
    return;
  }
  // as soon as details button is enabled we can proceed
  cy
    .get("[data-test-subscription-details=true]", { timeout: 50 * 1000 })
    .scrollIntoView()
    .click();
  for (const [key, itemConfig] of Object.entries(data.config)) {
    let value = itemConfig;
    if (opType == "add") {
      value = key == 0 ? data.config[1] : data.new[0]; // here we assume first subscription was removed by the delete test and then added a new one
    }

    // some subscriptions might not have time window
    const type = value.timeWindow ? value.timeWindow.type : "active"; //if not defined is always active
    cy.log(`Validate subscriptions cards for ${name} key=${key}`);

    // Get "Repository resource" info
    let repoInfo = value.url;
    if (value.branch && value.branch.length > 0) {
      repoInfo = `${repoInfo}Branch:${value.branch}`;
    }
    if (value.path && value.path.length > 0) {
      repoInfo = `${repoInfo}Path:${value.path}`;
    }

    // Get "Time window" info
    let timeWindowInfo = {};
    if (value.timeWindow) {
      timeWindowInfo["date"] = `Days of the week${value.timeWindow.date.join(
        ", "
      )}`;

      if (value.timeWindow.hours) {
        let timeRangeString = "";
        value.timeWindow.hours.forEach((range, i) => {
          timeRangeString =
            `${timeRangeString}${convertTimeFormat(
              range.start
            )} - ${convertTimeFormat(range.end)}` +
            `${i < value.timeWindow.hours.length - 1 ? ", " : ""}`;
        });
        timeWindowInfo["hours"] = `Time range${timeRangeString}`;
      }
    }
    const keywords = {
      blockinterval: "Blocked",
      activeinterval: "Active",
      active: "Set time window"
    };

    // 1. Check "Repository resource" button and popover
    cy
      .get(".overview-cards-subs-section", { timeout: 20 * 1000 })
      .children()
      .eq(key)
      .within($subcards => {
        cy.log("Validate subscription repository info");
        let repositoryText =
          data.type === "objectstore"
            ? "Object storage"
            : data.type === "helm" ? "Helm" : "Git";
        cy
          .get(".pf-c-label__content")
          .first()
          .invoke("text")
          .should("include", repositoryText);

        cy.log("Validate Repository popup");
        let repoInfo = value.url;
        if (value.branch && value.branch.length > 0) {
          repoInfo = `${repoInfo}Branch:${value.branch}`;
        }
        if (value.path && value.path.length > 0) {
          repoInfo = `${repoInfo}Path:${value.path}`;
        }
        cy
          .get(".pf-c-label")
          .first()
          .click({ force: true });
      });
    // Validate info in popover
    cy
      .get(".channel-labels.channel-labels-popover-content", {
        timeout: 20 * 1000
      })
      .invoke("text")
      .should("include", repoInfo);
    cy
      .get(".subs-icon")
      .first()
      .click(); // Close any popovers

    // 2. Check "Time window" button and popover
    cy
      .get(".overview-cards-subs-section", { timeout: 20 * 1000 })
      .children()
      .eq(key)
      .within($subcards => {
        cy.log(`Validate time window for subscription is ${keywords[type]}`);
        type == "active"
          ? cy
              .get(".set-time-window-link", { timeout: 20 * 1000 })
              .contains(keywords[type])
          : cy
              .get(".timeWindow-status-icon", { timeout: 20 * 1000 })
              .contains(keywords[type].toLowerCase());

        if (type !== "active") {
          cy.log("Validate time window popup");
          cy
            .get(".timeWindow-status-icon", { timeout: 20 * 1000 })
            .click({ force: true });
        }
      });
    // Validate info in popover
    if (type !== "active") {
      cy
        .get(".timeWindow-labels-popover-content", { timeout: 20 * 1000 })
        .invoke("text")
        .should("include", timeWindowInfo.date)
        .and("include", timeWindowInfo.hours);
      cy
        .get(".subs-icon")
        .first()
        .click(); // Close any popovers
    }
  }
};

export const testInvalidApplicationInput = () => {
  const validURL = "http://a.com";
  const invalidValue = "INVALID VALUE";
  const validValue = "default";

  cy.visit("/multicloud/applications");
  // wait for create button to be enabled
  cy.get("[data-test-create-application=true]", { timeout: 50 * 1000 }).click();
  cy.get(".bx--detail-page-header-title-container").should("exist");

  cy.log("Test invalid name");
  cy.get("#name", { timeout: 50 * 1000 }).type(invalidValue);
  cy.get("#name-error-msg").should("exist");
  cy.get("#name", { timeout: 50 * 1000 }).clear();
  cy.get("#name-error-msg").should("not.exist");

  cy.log("Test invalid namespace");
  cy
    .get("#namespace", { timeout: 50 * 1000 })
    .type(invalidValue)
    .blur();
  cy.get("[data-invalid=true]", { timeout: 2 * 1000 }).should("exist");
  cy
    .get("#namespace", { timeout: 50 * 1000 })
    .click()
    .clear()
    .type("default")
    .blur();
  cy.get("[data-invalid=true]").should("not.exist");

  cy.log("Test invalid git url");
  cy
    .get("#github")
    .click()
    .trigger("mouseover");

  cy.get("#labelName-0-clusterSelector").type("label");
  cy.get("#labelValue-0-clusterSelector").type("value");

  cy
    .get("#githubURL", { timeout: 20 * 1000 })
    .type(invalidValue)
    .blur();
  cy.get("[data-invalid=true]").should("exist");
  cy.wait(1000);
  cy
    .get("#githubURL", { timeout: 20 * 1000 })
    .click()
    .clear()
    .type(validURL)
    .blur();
  cy.get("[data-invalid=true]").should("not.exist");

  cy
    .get("#githubBranch", { timeout: 20 * 1000 })
    .type(invalidValue)
    .blur();
  cy.get("[data-invalid=true]").should("exist");
  cy.wait(2000);
  cy
    .get("#githubBranch", { timeout: 20 * 1000 })
    .click()
    .clear()
    .type(validValue)
    .blur();
  cy.get("[data-invalid=true]").should("not.exist");

  cy.log("Test invalid HELM url");
  cy
    .get("#github")
    .click()
    .trigger("mouseover");

  cy
    .get("#helmrepo")
    .click()
    .trigger("mouseover");

  cy.get("#labelName-0-clusterSelector").type("label");
  cy.get("#labelValue-0-clusterSelector").type("value");

  cy
    .get("#helmURL", { timeout: 20 * 1000 })
    .type(invalidValue)
    .blur();
  cy.get("[data-invalid=true]").should("exist");
  cy.wait(1000);
  cy
    .get("#helmURL", { timeout: 20 * 1000 })
    .click()
    .clear()
    .type(validURL)
    .blur();
  cy.get("[data-invalid=true]").should("not.exist");

  cy.log("Test invalid object store url");
  cy
    .get("#helmrepo")
    .click()
    .trigger("mouseover");
  cy
    .get("#objectstore")
    .click()
    .trigger("mouseover");

  cy.get("#labelName-0-clusterSelector").type("label");
  cy.get("#labelValue-0-clusterSelector").type("value");

  cy
    .get("#objectstoreURL", { timeout: 20 * 1000 })
    .type(invalidValue)
    .blur();
  cy.get("[data-invalid=true]").should("exist");
  cy.wait(1000);
  cy
    .get("#objectstoreURL", { timeout: 20 * 1000 })
    .click()
    .clear()
    .type(validURL)
    .blur();
  cy.get("[data-invalid=true]").should("not.exist");
};
