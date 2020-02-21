/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

module.exports = {
  elements: {
    aceEditor: ".ace_layer.ace_text-layer",
    deleteBtn: ".bx--btn--danger--primary",
    headerTitle: ".bx--detail-page-header-title",
    inlineNotificationError:
      ".bx--inline-notification.bx--inline-notification--error",
    modal: ".bx--modal",
    modalContent: ".bx--modal-content",
    modalRegisterApp: ".bx--modal.bx--modal-tall.is-visible.modal-with-editor",
    modalRemoveResource: "#remove-resource-modal",
    modalRemoveDeployment: "#undeploy-application-modal",
    modalCancelBtn: ".bx--btn.bx--btn--secondary",
    modalSubmitBtn: ".bx--modal__buttons-container .bx--btn.bx--btn--primary",
    overflowMenu: ".bx--overflow-menu",
    overflowMenuDashboard:
      '[data-table-action="table.actions.applications.dashboard"]',
    overflowMenuDeploy:
      '[data-table-action="table.actions.applications.deploy"]',
    overflowMenuRemove:
      '[data-table-action="table.actions.applications.remove"]',
    overflowMenuUndeploy:
      '[data-table-action="table.actions.applications.undeploy"]',
    registerAppBtn: 'button[id="New application"]',
    registerAppModal: ".bx--modal",
    resourceSearch: "#resource-search",
    spinner: ".content-spinner",
    aceEditorTextInput: "#brace-editor",
    pagination: ".bx--pagination",
    yamlInstructions: ".yaml-instructions",
    docLink: ".help-link",
    overviewTab: "#applicationheadertabs li:nth-child(2)",
    terminologyBtn: "button[class=bx--accordion__heading]",
    terminologyContent: ".bx--accordion__content",
    documentationText: ".deployment-highlights-terminology-docs-text",
    documentationIcon: ".deployment-highlights-terminology-docs-icon",
    searchInput: ".bx--search-input",
    searchIcon: ".bx--search-magnifier",
    resourceCards: ".resource-cards-container",
    resourceInfo: ".resource-cards-info-container",
    resourceCreate: ".resource-cards-create-container",
    newSubBtn: 'button[id="Subscription"]',
    newPlacementRuleBtn: 'button[id="Placement Rule"]',
    newChannelBtn: 'button[id="Channel"]',
    newResourceModal: ".bx--modal.bx--modal-tall.is-visible.modal-with-editor"
  },
  commands: [
    {
      closeAppRegistrationModal,
      deleteApplication,
      deployApplication,
      enterTextInYamlEditor,
      findResource,
      generateDashboardLink,
      openAppRegistrationModal,
      removeDeployment,
      submitRegisterAppModal,
      verifyAppDeployed,
      verifyDashboardLink,
      verifyDeploymentRemoved,
      verifyModalOpened,
      verifyModalSubmitted,
      verifyPageContent,
      verifyResourceNotPresent,
      verifyResourceIsPresent,
      verifyResourceIsRefreshing,
      verifyYamlValidationError,
      verifyResourcesTab,
      verifyTerminology,
      verifySearch,
      verifyResourceCards,
      openNewSubModal,
      submitNewResourceModal,
      closeNewResourceModal,
      openNewPlacementRuleModal,
      openNewChannelModal
    }
  ]
};

function openAppRegistrationModal() {
  this.waitForElementVisible("@registerAppBtn");
  this.click("@registerAppBtn");
  this.waitForElementVisible("@registerAppModal");
  this.waitForElementVisible("@aceEditor");
}

function submitRegisterAppModal() {
  this.click("@modalSubmitBtn");
}

function closeAppRegistrationModal() {
  this.click("@modalCancelBtn");
  this.waitForElementNotPresent("@aceEditor");
}

function enterTextInYamlEditor(browser, yaml) {
  this.waitForElementPresent("@newResourceModal");
  this.click("@aceEditorTextInput");

  browser.clearValue("div[class=ace_content");

  const keystrokes = [];
  yaml.split(/\r?\n/).forEach(line => {
    const indentation = line.search(/\S|$/);
    keystrokes.push(line);
    keystrokes.push(browser.Keys.RETURN);

    for (let i = 0; i < indentation / 2; i++)
      keystrokes.push(browser.Keys.BACK_SPACE);
  });

  this.api.keys(keystrokes);
}

function findResource(resourceName) {
  this.waitForElementNotPresent("@spinner");
  this.waitForElementVisible("@resourceSearch");
  this.clearValue("@resourceSearch");
  this.setValue("@resourceSearch", resourceName);
}

function generateDashboardLink() {
  this.click("@overflowMenu");
  this.waitForElementVisible("@overflowMenuDashboard");
  this.click("@overflowMenuDashboard");
}

function deployApplication() {
  this.click("@overflowMenu");
  this.waitForElementVisible("@overflowMenuDeploy");
  this.click("@overflowMenuDeploy");
}

function removeDeployment() {
  this.click("@overflowMenu");
  this.waitForElementVisible("@overflowMenuUndeploy");
  this.click("@overflowMenuUndeploy");
  this.waitForElementPresent("@modalRemoveDeployment");
  this.click("@deleteBtn");
  this.waitForElementNotPresent("@spinner");
}

function deleteApplication() {
  this.click("@overflowMenu");
  this.waitForElementVisible("@overflowMenuRemove");
  this.click("@overflowMenuRemove");
  this.waitForElementVisible("@modalRemoveResource");
  this.click("@deleteBtn");
  this.waitForElementNotPresent("@spinner");
}

/**
 * Verifications
 */

function verifyAppDeployed(name) {
  this.verifyResourceIsRefreshing(name);
  this.expect.element("@inlineNotificationError").to.be.not.present;
  this.assert.containsText(`[data-row-name="${name}"`, "Deployed");
}

function verifyDashboardLink(name) {
  this.verifyResourceIsRefreshing(name);
  this.expect.element("a").to.be.present;
}

function verifyDeploymentRemoved(name) {
  this.verifyResourceIsRefreshing(name);
  this.expect.element("@inlineNotificationError").to.be.not.present;
  this.assert.containsText(`[data-row-name="${name}"`, "Registered");
}

function verifyModalSubmitted() {
  this.waitForElementNotPresent("@modalRegisterApp");
  this.expect.element("@modalRegisterApp").to.be.not.present;
  this.expect.element("@inlineNotificationError").to.be.not.present;
}

function verifyModalOpened() {
  this.waitForElementPresent("@modalRegisterApp");
  this.expect.element("@modalRegisterApp").to.be.present;
  this.expect.element("@inlineNotificationError").to.be.not.present;
  this.expect.element("@yamlInstructions").to.be.present;
  this.expect.element("@docLink").to.be.present;
}

function verifyPageContent() {
  this.expect.element("@headerTitle").to.be.present;
  this.expect.element("@registerAppBtn").to.be.present;
  this.expect.element("@searchInput").to.be.present;
  this.expect.element("@searchIcon").to.be.present;
  this.expect.element("@pagination").to.be.present;
}

function verifyResourcesTab() {
  this.expect.element("@overviewTab").to.be.present;
  this.click("@overviewTab");
  this.waitForElementNotPresent("@spinner");
}

function verifyTerminology() {
  this.expect.element("@terminologyBtn").to.be.present;
  this.click("@terminologyBtn");
  this.expect.element("@terminologyContent").to.be.present;
  this.expect.element("@documentationText").to.be.present;
  this.expect.element("@documentationIcon").to.be.present;
}

function verifySearch() {
  this.expect.element("@searchIcon").to.be.present;
  this.expect.element("@searchInput").to.be.present;
}

function verifyResourceCards() {
  this.expect.element("@resourceCards").to.be.present;
  this.expect.element("@resourceInfo").to.be.present;
  this.expect.element("@resourceCreate").to.be.present;
  this.expect.element("@newSubBtn").to.be.present;
  this.expect.element("@newPlacementRuleBtn").to.be.present;
  this.expect.element("@newChannelBtn").to.be.present;
}

function openNewSubModal() {
  this.waitForElementVisible("@newSubBtn");
  this.click("@newSubBtn");
  this.waitForElementVisible("@newResourceModal");
  this.waitForElementVisible("@aceEditor");
}

function openNewPlacementRuleModal() {
  this.waitForElementVisible("@newPlacementRuleBtn");
  this.click("@newPlacementRuleBtn");
  this.waitForElementVisible("@newResourceModal");
  this.waitForElementVisible("@aceEditor");
}

function openNewChannelModal() {
  this.waitForElementVisible("@newChannelBtn");
  this.click("@newChannelBtn");
  this.waitForElementVisible("@newResourceModal");
  this.waitForElementVisible("@aceEditor");
}

function submitNewResourceModal() {
  this.click("@modalSubmitBtn");
}

function closeNewResourceModal() {
  this.click("@modalCancelBtn");
  this.waitForElementNotPresent("@aceEditor");
}

function verifyResourceIsPresent(name) {
  this.expect.element(`[data-row-name="${name}"`).to.be.present;
}

function verifyResourceNotPresent(name) {
  this.expect.element(`[data-row-name="${name}"`).to.be.not.present;
}

function verifyResourceIsRefreshing(name) {
  this.expect.element(`#loading-${name}`).to.be.present;
  this.waitForElementNotPresent(`#loading-${name}`, 20000);
}

function verifyYamlValidationError() {
  this.assert.containsText(
    ".bx--inline-notification__subtitle",
    "Cannot parse the YAML content. Review and update the YAML content to complete any required fields or correct any errors."
  );
  this.expect.element("@inlineNotificationError").to.be.present;
}
