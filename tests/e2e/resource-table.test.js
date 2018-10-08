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
  'verify-clusters-list-content': '/clusters',
  'verify-clusters-pods-list-content': '/pods',
  'verify-clusters-applications-list-content': '/applications',
  'verify-clusters-releases-list-content': '/releases',
  'verify-clusters-compliances-list-content': '/policies',
  'verify-clusters-local-policies-list-content': '/policies/local',
}

module.exports = {
  '@disabled': true,

  before: function (browser) {
    const loginPage = browser.page.LoginPage()
    loginPage.navigate()
    loginPage.authenticate()
  },

  'verify-clusters-list-content': (browser) => {
    verifyResourcePage(browser)
  },

  'verify-clusters-pods-list-content': (browser) => {
    verifyResourcePage(browser)
  },

  'verify-clusters-applications-list-content': (browser) => {
    verifyResourcePage(browser)
  },

  'verify-clusters-releases-list-content': (browser) => {
    verifyResourcePage(browser)
  },

  'verify-clusters-compliances-list-content': (browser) => {
    verifyResourcePage(browser)
  },

  'verify-clusters-local-policies-list-content': (browser) => {
    verifyResourcePage(browser)
  },

  after: function (browser, done) {
    setTimeout(() => {
      browser.end()
      done()
    })
  }
}

function verifyResourcePage(browser, hasTabs) {
  const url = `${browser.launch_url}${config.get('contextPath')}${ROUTE[browser.currentTest.name]}`
  const resourceTablePage = browser.page.ResourceTablePage()
  resourceTablePage.navigate(url)
  resourceTablePage.verifyPageContent()
  resourceTablePage.verifySecondaryHeader(hasTabs)
}
