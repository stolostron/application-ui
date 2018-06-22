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
  'add-helm-repo': '/clusters/repositories',
  'install-helm-release': '/clusters/charts',
  'delete-helm-release': '/clusters/releases'
}

module.exports = {
  before: function (browser) {
    let loginPage = browser.page.LoginPage()
    loginPage.navigate()
    loginPage.authenticate()
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
    chartPage.installHelmRelease(browser, 'acs', 'toronto', 'default')
    chartPage.verifyHelmReleaseInstall('acs')
  },

  'delete-helm-release': (browser) => {
    const url = `${browser.launch_url}${config.get('contextPath')}${ROUTE[browser.currentTest.name]}`
    const chartPage = browser.page.HelmChartsPage()
    chartPage.navigate(url)
    chartPage.verifyPageContent()
    chartPage.deleteHelmRelease('acs')
    chartPage.verifyHelmReleaseDelete('acs')
  },

  after: function (browser, done) {
    setTimeout(() => {
      browser.end()
      done()
    })
  }
}
