/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

const config = require("../../config");

let appsPage;

module.exports = {
  "@disabled": false,

  before(browser) {
    const loginPage = browser.page.LoginPage();
    loginPage.navigate();
    loginPage.authenticate();

    const url = `${browser.launch_url}${config.get("contextPath")}`;
    appsPage = browser.page.ApplicationsPage();
    appsPage.navigate(url);
  },

  "Applications: Load page": () => {
    appsPage.verifyPageContent();
  },

  "Applications: Register new application - yaml validation": browser => {
    appsPage.openAppRegistrationModal();
    appsPage.verifyModalOpened();
    appsPage.enterTextInYamlEditor(browser, "BadYaml:\nThis is bad Yaml");
    appsPage.submitRegisterAppModal();
    appsPage.verifyYamlValidationError(browser);
    appsPage.closeAppRegistrationModal();
  },

  "Applications: Resources tab": () => {
    appsPage.verifyResourcesTab();
    appsPage.verifyTerminology();
    appsPage.verifySearch();
    appsPage.verifyResourceCards();
  },

  "Applications: New Subscription - yaml validation": browser => {
    appsPage.openNewSubModal();
    appsPage.verifyModalOpened();
    appsPage.enterTextInYamlEditor(browser, "BadYaml:\nThis is bad Yaml");
    appsPage.submitNewResourceModal();
    appsPage.verifyYamlValidationError(browser);
    appsPage.closeNewResourceModal();
  },

  "Applications: New PlacementRule - yaml validation": browser => {
    appsPage.openNewPlacementRuleModal();
    appsPage.verifyModalOpened();
    appsPage.enterTextInYamlEditor(browser, "BadYaml:\nThis is bad Yaml");
    appsPage.submitNewResourceModal();
    appsPage.verifyYamlValidationError(browser);
    appsPage.closeNewResourceModal();
  },

  "Applications: New Channel - yaml validation": browser => {
    appsPage.openNewChannelModal();
    appsPage.verifyModalOpened();
    appsPage.enterTextInYamlEditor(browser, "BadYaml:\nThis is bad Yaml");
    appsPage.submitNewResourceModal();
    appsPage.verifyYamlValidationError(browser);
    appsPage.closeNewResourceModal();
  },

  after(browser, done) {
    setTimeout(() => {
      browser.end();
      done();
    });
  }
};
