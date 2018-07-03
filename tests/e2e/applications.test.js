/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

const config = require('../../config')
const fs = require('fs')
const path = require('path')

const appName = `selenium-players_${Date.now()}`
let appsPage

module.exports = {
  before: function (browser) {
    let loginPage = browser.page.LoginPage()
    loginPage.navigate()
    loginPage.authenticate()

    const url = `${browser.launch_url}${config.get('contextPath')}/clusters/applications`
    appsPage = browser.page.ApplicationsPage()
    appsPage.navigate(url)
  },

  'Applications: Load page': () => {
    appsPage.verifyPageContent()
  },

  'Applications: Register new application': (browser) => {
    appsPage.openAppRegistrationModal()
    appsPage.verifyModalOpened()
    appsPage.enterTextInYamlEditor(browser, 'BadYaml:\nThis is bad Yaml')
    appsPage.submitRegisterAppModal()
    appsPage.verifyYamlValidationError(browser)
    appsPage.closeAppRegistrationModal()

    let templateYaml = fs.readFileSync(path.join(__dirname, '..', 'resources', 'players_case1_template.yaml'), 'utf8')
    templateYaml = templateYaml.replace('{{application-name}}', appName)

    appsPage.openAppRegistrationModal()
    appsPage.verifyModalOpened()
    appsPage.enterTextInYamlEditor(browser, templateYaml)
    appsPage.submitRegisterAppModal()
    appsPage.verifyModalSubmitted()


    let instanceYaml = fs.readFileSync(path.join(__dirname, '..', 'resources', 'players_instance.yaml'), 'utf8')
    instanceYaml = instanceYaml.replace('{{application-name}}', appName)

    appsPage.openAppRegistrationModal()
    appsPage.enterTextInYamlEditor(browser, instanceYaml)
    appsPage.submitRegisterAppModal()
    appsPage.verifyModalSubmitted()
    appsPage.verifyResourceIsPresent(appName)
  },

  'Applications: Deploy an application': () => {
    appsPage.findResource(appName)
    appsPage.deployApplication(appName)
    appsPage.verifyAppDeployed(appName)
  },

  'Applications: Generate dashboard': () => {
    appsPage.findResource(appName)
    appsPage.generateDashboardLink(appName)
    appsPage.verifyDashboardLink(appName)
  },

  'Applications: Remove the deployment': () => {
    appsPage.findResource(appName)
    appsPage.removeDeployment(appName)
    appsPage.verifyDeploymentRemoved(appName)
  },

  'Applications: Delete the application': () => {
    appsPage.findResource(appName)
    appsPage.deleteApplication(appName)
    appsPage.verifyResourceNotPresent(appName)
  },

  after: function (browser, done) {
    setTimeout(() => {
      browser.end()
      done()
    })
  }
}
