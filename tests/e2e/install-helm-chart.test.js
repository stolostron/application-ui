/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

const config = require('../../config')
const ROUTE = {
  'add-helm-repo': '/repositories',
  'install-helm-release': '/charts',
  'delete-helm-release': '/releases'
}

const getReleaseName = chartName => `selenium-${chartName}-${Date.now()}`
let releaseName

module.exports = {
  '@disabled': true,
  before: function (browser) {
    const loginPage = browser.page.LoginPage()
    loginPage.navigate()
    loginPage.authenticate()
    releaseName = getReleaseName('acs')
  },

  'add-helm-repo': (browser) => {
    const url = `${browser.launch_url}${config.get('contextPath')}${ROUTE[browser.currentTest.name]}`
    const repoPage = browser.page.HelmRepoPage()
    repoPage.navigate(url)
    repoPage.verifyPageContent()
    repoPage.addHelmRepository('test', 'https://kubernetes-charts.storage.googleapis.com/')
    repoPage.verifyRepoAdd('test')
  },

  'install-helm-release': (browser) => {
    const url = `${browser.launch_url}${config.get('contextPath')}${ROUTE[browser.currentTest.name]}`
    const chartPage = browser.page.HelmChartsPage()
    chartPage.navigate(url)
    chartPage.verifyPageContent()
    chartPage.installHelmRelease(browser, 'acs', releaseName, 'default')
    chartPage.verifyHelmReleaseInstall(browser, releaseName)
  },

  'delete-helm-release': (browser) => {
    const url = `${browser.launch_url}${config.get('contextPath')}${ROUTE[browser.currentTest.name]}`
    const chartPage = browser.page.HelmChartsPage()
    chartPage.navigate(url)
    chartPage.verifyPageContent()
    chartPage.deleteHelmRelease(browser, releaseName)
    chartPage.verifyHelmReleaseDelete(releaseName)
  },

  after: function (browser, done) {
    setTimeout(() => {
      browser.end()
      done()
    })
  }
}
