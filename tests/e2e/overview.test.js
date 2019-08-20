/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

const config = require('../../config')
const a11yScan = require('../utils/accessibilityScan')
let page

module.exports = {
  '@disabled': true,

  before: function(browser) {
    const loginPage = browser.page.LoginPage()
    loginPage.navigate()
    loginPage.authenticate()

    const url = `${browser.launch_url}${config.get('contextPath')}/overview`
    page = browser.page.OverviewPage()
    page.navigate(url)
  },

  'Overview: Load page': () => {
    page.verifyPageLoaded()
  },

  'Overview: Run Accessibility Scan': browser => {
    a11yScan.runAccessibilityScan(browser, 'overview')
  },

  after: function(browser, done) {
    setTimeout(() => {
      browser.end()
      done()
    })
  }
}
