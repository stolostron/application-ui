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
  'verify-clusters-list-content': '/clusters/clusters',
  'verify-clusters-pods-list-content': '/clusters/pods',
  'verify-clusters-charts-list-content': '/clusters/charts',
  'verify-clusters-releases-list-content': '/clusters/releases',
  'verify-clusters-repositories-list-content': '/clusters/repositories'
}

module.exports = {
  //'@disabled': true,

  before: function (browser) {
    let loginPage = browser.page.LoginPage()
    loginPage.navigate()
    loginPage.authenticate()
  },

  'verify-clusters-list-content': (browser) => {
    verifyResourcePage(browser)
  },

  'verify-clusters-pods-list-content': (browser) => {
    verifyResourcePage(browser)
  },

  // 'verify-clusters-charts-list-content': (browser) => {
  //   verifyResourcePage(browser)
  // },

  'verify-clusters-releases-list-content': (browser) => {
    verifyResourcePage(browser)
  },

  'verify-clusters-repositories-list-content': (browser) => {
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
  let resourceTablePage = browser.page.ResourceTablePage()
  resourceTablePage.navigate(url)
  resourceTablePage.verifyPageContent()
  resourceTablePage.verifySecondaryHeader(hasTabs)
}
