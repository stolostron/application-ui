/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

const config = require('../../config');
const fs = require('fs');
const path = require('path');

const date = new Date();
const day = date
  .getDate()
  .toString()
  .padStart(2, 0);
const hours = date
  .getHours()
  .toString()
  .padStart(2, 0);
const minutes = date
  .getMinutes()
  .toString()
  .padStart(2, 0);
const seconds = date
  .getSeconds()
  .toString()
  .padStart(2, 0);
const appName = `selenium-players_${day}_${hours}_${minutes}_${seconds}`;
let appsPage;

module.exports = {
  '@disabled': true,

  before(browser) {
    const loginPage = browser.page.LoginPage();
    loginPage.navigate();
    loginPage.authenticate();

    const url = `${browser.launch_url}${config.get('contextPath')}/mcmapplications`;
    appsPage = browser.page.ApplicationsPage();
    appsPage.navigate(url);
  },

  'Applications: Load page': () => {
    appsPage.verifyPageContent();
  },

  'Applications: Register new application - yaml validation': (browser) => {
    appsPage.openAppRegistrationModal();
    appsPage.verifyModalOpened();
    appsPage.enterTextInYamlEditor(browser, 'BadYaml:\nThis is bad Yaml');
    appsPage.submitRegisterAppModal();
    appsPage.verifyYamlValidationError(browser);
    appsPage.closeAppRegistrationModal();
  },

  'Applications: Register new application template': (browser) => {
    let templateYaml = fs.readFileSync(
      path.join(__dirname, '..', 'resources', 'players_case1_template.yaml'),
      'utf8',
    );
    templateYaml = templateYaml.replace('{{application-name}}', appName);

    appsPage.openAppRegistrationModal();
    appsPage.verifyModalOpened();
    appsPage.enterTextInYamlEditor(browser, templateYaml);
    appsPage.submitRegisterAppModal();
    appsPage.verifyModalSubmitted();
  },

  'Applications: Register new application instance': (browser) => {
    let instanceYaml = fs.readFileSync(
      path.join(__dirname, '..', 'resources', 'players_instance.yaml'),
      'utf8',
    );
    instanceYaml = instanceYaml.replace('{{application-name}}', appName);

    appsPage.openAppRegistrationModal();
    appsPage.enterTextInYamlEditor(browser, instanceYaml);
    appsPage.submitRegisterAppModal();
    appsPage.verifyModalSubmitted();
    appsPage.verifyResourceIsPresent(appName);
  },

  'Applications: Deploy an application': () => {
    appsPage.findResource(appName);
    appsPage.deployApplication(appName);
    appsPage.verifyAppDeployed(appName);
  },

  'Applications: Generate dashboard': () => {
    appsPage.generateDashboardLink(appName);
    appsPage.verifyDashboardLink(appName);
  },

  'Applications: Remove the deployment': () => {
    appsPage.removeDeployment(appName);
    appsPage.verifyDeploymentRemoved(appName);
  },

  'Applications: Delete the application': () => {
    appsPage.deleteApplication(appName);
    appsPage.verifyResourceNotPresent(appName);
  },

  after(browser, done) {
    setTimeout(() => {
      browser.end();
      done();
    });
  },
};
