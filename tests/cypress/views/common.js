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

export const selectDate = (date, key) => {
  date.forEach(d => {
    const { dateId } = indexedCSS(
      { dateId: d.toLowerCase().substring(0, 3) + "-timeWindow" },
      key
    );
    cy.get(`#${dateId}`, { timeout: 20 * 1000 }).click({ force: true });
  });
};

export const selectTimeWindow = (timeWindow, key = 0) => {
  if (!timeWindow) {
    cy.log("timeWindow info not available, ignore this section");
    return;
  }
  const { setting, type, date, hours } = timeWindow;
  if (setting && date) {
    cy.log(`Select TimeWindow - ${type}...`);
    const { active, blocked } = indexedCSS(
      {
        active: "#active-mode-timeWindow",
        blocked: "#blocked-mode-timeWindow"
      },
      key
    );
    const typeID = type === "blockinterval" ? blocked : active;
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

    // Check that time window mode is still selected after toggling YAML editor
    if (key == 0) {
      cy.get("#edit-yaml", { timeout: 10 * 1000 }).click({ force: true });
      cy.get("#edit-yaml", { timeout: 10 * 1000 }).click({ force: true });
      cy.get(typeID).should("be.checked");
    }
  } else {
    cy.log("leave default `active`");
  }
};

export const submitSave = successState => {
  modal.shouldNotBeDisabled();
  modal.clickSubmit();
  cy
    .get("#notifications", { timeout: 5 * 1000 })
    .scrollIntoView({ offset: { top: -500, left: 0 } });

  if (successState) {
    notification.shouldExist("success");
    cy
      .location("pathname", { timeout: 10 * 1000 })
      .should("include", `${name}`);
  } else {
    notification.shouldExist("error");
    cy.log("Verify Save button is disabled");
    modal.shouldBeDisabled();
  }
};

const getPFTableRowSelector = key =>
  `[data-ouia-component-type="PF4/TableRow"][data-ouia-component-id="${key}"]`;

export const resourceTable = {
  getRow: function(name, key, timeout) {
    return cy.get(getPFTableRowSelector(key), {
      timeout: timeout || 30 * 1000
    });
  },
  getCell: function(name) {
    return cy.get(`td[data-label="${name}"]`);
  },
  rowShouldExist: function(name, key, timeout) {
    this.searchTable(name);
    this.getRow(name, key, timeout).should("exist");
  },
  rowShouldNotExist: function(name, key, timeout, disableSearch) {
    !disableSearch && this.searchTable(name);
    this.getRow(name, key, timeout).should("not.exist");
  },
  searchTable: function(name) {
    cy.get(".pf-c-search-input__text-input").type(name);
  },
  openRowMenu: function(name, key) {
    cy
      .get(`${getPFTableRowSelector(key)} .pf-c-dropdown__toggle`, {
        timeout: 20 * 10000
      })
      .click();
  },
  getMenuButton: function(action) {
    return cy.contains("button", action, {
      matchCase: false,
      timeout: 20 * 1000
    });
  },
  menuClick: function(action) {
    return this.getMenuButton(action).click({ force: true });
  }
};

export const secondaryHeader = {
  clickPrimary: () => cy.get(".secondary-header-actions-primary").click(),
  clickSecondary: () => cy.get(".secondary-header-actions-secondary").click()
};

export const noResource = {
  shouldExist: () =>
    cy
      .get(".pf-c-empty-state__content", { timeout: 20000 })
      .should("be.visible"),
  shouldNotExist: timeout =>
    cy
      .get(".pf-c-empty-state__content", {
        timeout: timeout ? timeout : 20 * 1000
      })
      .should("not.exist")
};

export const modal = {
  shouldBeOpen: () =>
    cy.get("#remove-resource-modal", { timeout: 20000 }).should("exist"),
  shouldBeClosed: () =>
    cy.get("#remove-resource-modal", { timeout: 20000 }).should("not.exist"),
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
    cy
      .get(".bx--btn.bx--btn--primary", { timeout: 20000 })
      .click({ force: true }),
  clickResources: () =>
    cy.get("#remove-app-resources", { timeout: 20000 }).click({ force: true }),
  clickDanger: () =>
    cy.get(".pf-m-danger", { timeout: 20000 }).click({ force: true }),
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
      .get(`.bx--inline-notification[kind="${type}"]`, { timeout: 10 * 1000 })
      .should("exist"),
  shouldNotExist: type =>
    cy
      .get(`.bx--inline-notification[kind="${type}"]`, { timeout: 5 * 1000 })
      .should("not.exist")
};

/*
Validate advanced configuration tables content
*/
export const validateSubscriptionTable = (
  name,
  tableType,
  sub,
  numberOfRemoteClusters,
  data
) => {
  let checkClusterColumn = true;
  let checkTimeWindowColumn = false;
  let checkResourceColumn = false;
  let singularDisplayName;

  switch (tableType) {
    case "subscriptions":
      singularDisplayName = "subscription";
      checkTimeWindowColumn = true;
      break;
    case "placementrules":
      singularDisplayName = "placement rule";
      break;
    case "channels":
      singularDisplayName = "channel";
      // will not check channel table since we can't get the aggregated number
      checkClusterColumn = false;
      checkResourceColumn = true;
      break;
  }
  cy.log(`validateSubscriptionTable tableType=${tableType}`);
  const resourceKey = getResourceKey(
    name,
    getNamespace(tableType === "channels" ? name : data.name)
  );
  resourceTable.getRow(name, resourceKey).within(() =>
    resourceTable
      .getCell("Name")
      .invoke("text")
      .should("eq", name)
  );

  let hasWindow = "";
  if (checkTimeWindowColumn > 0) {
    //validate time window for subscriptions
    cy.log("Validate Window column");

    if (sub.timeWindow && sub.timeWindow.type) {
      if (sub.timeWindow.type == "activeinterval") {
        hasWindow = "Active";
      } else if (sub.timeWindow.type == "blockinterval") {
        hasWindow = "Blocked";
      }
    }
    resourceTable.getRow(name, resourceKey).within(() =>
      resourceTable
        .getCell("Time window")
        .invoke("text")
        .should("eq", hasWindow)
    );
  }

  if (checkClusterColumn && hasWindow.length == 0) {
    //don't validate cluster count if time window is set since it might be blocked
    //validate remote cluster value
    cy.log("Validate remote cluster values");

    const { local, online, matchingLabel, existing } = sub.deployment;
    const onlineDeploy = online ? true : false;
    const remoteDeploy = matchingLabel || existing ? true : false;
    const localDeploy = local ? true : false;

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
    resourceTable.getRow(name, resourceKey).within(() =>
      resourceTable
        .getCell("Clusters")
        .invoke("text")
        .should("contain", clusterText)
    );
  }

  if (checkResourceColumn) {
    cy.log("Validate Repository popup");
    resourceTable.getRow(name, resourceKey).within(() =>
      resourceTable
        .getCell("Type")
        .find(".pf-c-label")
        .click()
    );
    cy
      .get(".channel-labels-popover-content .channel-entry")
      .invoke("text")
      .should("include", sub.url);
  }

  if (data.type == "git") {
    cy.log(`Validate Menu actions for ${tableType} with name ${name}`);
    resourceTable.openRowMenu(name, resourceKey);

    resourceTable.getMenuButton(`search ${singularDisplayName}`);
    resourceTable.getMenuButton(`edit ${singularDisplayName}`);
    resourceTable.getMenuButton(`delete ${singularDisplayName}`);
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
          const {
            channelSectionId,
            prSectionId,
            existingRuleId,
            reconcileKey,
            matchingLabelId,
            onlineId,
            localClusterId
          } = indexedCSS(
            {
              channelSectionId: "#channel-repository-types",
              prSectionId: "#clustersection-select-clusters-to-deploy-to",
              existingRuleId: "#existingrule-checkbox",
              reconcileKey: "#gitReconcileOption",
              matchingLabelId: "#clusterSelector-checkbox-clusterSelector",
              onlineId: "#online-cluster-only-checkbox",
              localClusterId: "#local-cluster-checkbox"
            },
            key
          );

          cy.get(channelSectionId).click();
          if (data.type == "git") {
            cy.log(`Verify Git reconcile option for ${name}`);
            item.gitReconcileOption &&
              cy.get(reconcileKey, { timeout: 20 * 1000 }).should("be.checked");

            !item.gitReconcileOption &&
              cy
                .get(reconcileKey, { timeout: 20 * 1000 })
                .and("not.be.checked");
          }

          const { deployment } = item;

          cy.log(`Verify Placement option for ${name}`);
          cy.get(prSectionId).click();

          cy.log(`Verify existing placement rule option should not be checked`);
          cy
            .get(existingRuleId, { timeout: 20 * 1000 })
            .should("not.be.checked");

          cy.log(
            `Verify deploy to clusters by label checkbox deployment.matchingLabel=${
              deployment.matchingLabel
            }`
          );
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
          deployment.online &&
            cy.get(onlineId, { timeout: 20 * 1000 }).should("be.checked");
          !deployment.online &&
            cy.get(onlineId, { timeout: 20 * 1000 }).should("not.be.checked");

          cy.log(`Verify deploy to local cluster checkbox`);
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
      .get(".overview-cards-subs-section", { timeout: 120 * 1000 })
      .children()
      .eq(key)
      .within($subcards => {
        cy.log("Validate subscription repository info");
        let repositoryText =
          data.type === "objectstore"
            ? "Object storage"
            : data.type === "helm" ? "Helm" : "Git";

        //get repository popup info
        cy
          .get(".add-right-border", { timeout: 20 * 1000 })
          .eq(1)
          .within($repo => {
            cy
              .get(".pf-c-label__content", { timeout: 120 * 1000 })
              .invoke("text")
              .should("include", repositoryText);
          });

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
      .get(".channel-labels-popover-content .channel-entry", {
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
        .should("include", "Edit time window");
      cy
        .get(".subs-icon")
        .first()
        .click(); // Close any popovers
    }
  }
};

const saveErrorShouldNotExist = () => {
  cy.log("Verify Save errors are gone");
  cy
    .get("#notifications", { timeout: 50 * 1000 })
    .scrollIntoView({ offset: { top: -500, left: 0 } });
  notification.shouldNotExist("error", { timeout: 2 * 1000 }); //save error goes away
};

export const testInvalidApplicationInput = () => {
  const validURL = "http://a.com";
  const invalidValue = "INVALID VALUE";
  const validValue = "default";

  cy.visit("/multicloud/applications");
  // wait for create button to be enabled
  cy.get("[data-test-create-application=true]", { timeout: 50 * 1000 }).click();
  cy.get(".bx--detail-page-header-title-container").should("exist");

  //enter a valid ns
  cy
    .get("#namespace", { timeout: 50 * 1000 })
    .click()
    .clear()
    .type("default")
    .blur();

  cy.log("Test invalid name");
  cy.get("#name", { timeout: 50 * 1000 }).type(invalidValue);
  cy.get("#name-error-msg").should("exist");

  submitSave(false); //test save error

  cy
    .get("#name", { timeout: 50 * 1000 })
    .clear()
    .type(validValue);
  cy.get("#name-error-msg").should("not.exist");
  saveErrorShouldNotExist(); //save error goes away

  cy.log("Test invalid namespace");
  cy
    .get("#namespace", { timeout: 50 * 1000 })
    .type(invalidValue)
    .blur();
  cy.get("[data-invalid=true]", { timeout: 2 * 1000 }).should("exist");
  submitSave(false); //test save error

  cy
    .get("#namespace", { timeout: 50 * 1000 })
    .click()
    .clear()
    .type("default")
    .blur();
  cy.get("[data-invalid=true]").should("not.exist");
  saveErrorShouldNotExist(); //save error goes away

  cy.log("Test invalid git url");
  cy
    .get("#git", { timeout: 20 * 1000 })
    .click({ force: true })
    .trigger("mouseover");

  cy
    .get("#githubURL", { timeout: 20 * 1000 })
    .type(invalidValue)
    .blur();
  //enter a valid deployment value
  cy.get("#labelName-0-clusterSelector").type("label");
  cy.get("#labelValue-0-clusterSelector").type("value");

  cy.get("[data-invalid=true]").should("exist");
  cy.wait(1000);
  submitSave(false); //test save error

  cy
    .get("#githubURL", { timeout: 20 * 1000 })
    .click()
    .clear()
    .type(validURL)
    .blur();
  cy.get("[data-invalid=true]").should("not.exist");
  saveErrorShouldNotExist(); //save error goes away

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
  saveErrorShouldNotExist(); //save error goes away

  cy.log("Test invalid HELM url");
  cy
    .get("#git")
    .click()
    .trigger("mouseover");

  cy
    .get("#helm")
    .click()
    .trigger("mouseover");

  cy
    .get("#helmURL", { timeout: 20 * 1000 })
    .type(invalidValue)
    .blur();
  //enter a valid deployment value and a chart name
  cy.get("#labelName-0-clusterSelector").type("label");
  cy.get("#labelValue-0-clusterSelector").type("value");
  cy.get("#helmChartName").type("chartName");

  cy.get("[data-invalid=true]").should("exist");
  cy.wait(1000);
  submitSave(false); //test save error

  cy
    .get("#helmURL", { timeout: 20 * 1000 })
    .click()
    .clear()
    .type(validURL)
    .blur();
  cy.get("[data-invalid=true]").should("not.exist");
  saveErrorShouldNotExist(); //save error goes away

  cy.log("Test invalid object store url");
  cy
    .get("#helm")
    .click()
    .trigger("mouseover");
  cy
    .get("#object-storage")
    .click()
    .trigger("mouseover");

  cy
    .get("#objectstoreURL", { timeout: 20 * 1000 })
    .type(invalidValue)
    .blur();
  //enter a valid deployment value
  cy.get("#labelName-0-clusterSelector").type("label");
  cy.get("#labelValue-0-clusterSelector").type("value");

  cy.get("[data-invalid=true]").should("exist");
  cy.wait(1000);
  submitSave(false); //test save error

  cy
    .get("#objectstoreURL", { timeout: 20 * 1000 })
    .click()
    .clear()
    .type(validURL)
    .blur();
  cy.get("[data-invalid=true]").should("not.exist");
  saveErrorShouldNotExist(); //save error goes away

  cy.log("Test invalid time window");
  const timeWindow = {
    type: "activeinterval",
    setting: true,
    date: []
  };
  selectTimeWindow(timeWindow, 0);
  submitSave(false); //test error
};

// Calculates unique CSS selectors based on index
// Always returns a new object to avoid side-effects
export const indexedCSS = (cssMap, index) =>
  index != 0
    ? Object.keys(cssMap).reduce((result, key) => {
        let selector;
        switch (cssMap[key]) {
          case "#clustersection-select-clusters-to-deploy-to":
            selector = `#clustersectiongrp${index}-select-clusters-to-deploy-to`;
            break;
          case "#channel-repository-types":
            selector = `#channelgrp${index}-repository-types`;
            break;
          default:
            selector = `${cssMap[key]}grp${index}`;
            break;
        }
        result[key] = selector;
        return result;
      }, {})
    : cssMap;

export const getNamespace = name => {
  return `${name}-ns`;
};

export const getResourceKey = (name, namespace) => `${namespace}/${name}`;

//validate all deployed nodes show up in the app topo
export const validateDeployables = data => {
  if (data.resources) {
    cy.log(`validate deployables list ${data.resources}...`),
      data.resources.forEach(resourceType => {
        cy.log(
          `validate deployable with type ${resourceType} exists in app topology`
        ),
          cy.get(`#diagramShapes_${resourceType}`).should("exist");
      });
  }
};
