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

    const { local, online, matchingLabel } = data.deployment;
    const onlineDeploy = online ? true : false;
    const remoteDeploy = matchingLabel ? true : false;
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
      .get(".resource-table")
      .get(`tr[data-row-name="${name}"]`)
      .get("td", { timeout: 5 * 10000 })
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
  numberOfRemoteClusters
) => {
  let onlineDeploy = false; //deploy to all online clusters including local
  let localDeploy = false;
  let remoteDeploy = false;
  let hasWindow = "";
  data.config.forEach(item => {
    if (item.timeWindow) {
      hasWindow = "Yes"; // at list one window set
    }
    const { local, online, matchingLabel } = item.deployment;
    onlineDeploy = onlineDeploy || online ? true : false; // if any subscription was set to online option, use that over anything else
    remoteDeploy = matchingLabel ? true : remoteDeploy;
    localDeploy = local ? true : localDeploy;
  });

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

  return {
    clusterData: clusterText,
    timeWindowData: hasWindow
  };
};
