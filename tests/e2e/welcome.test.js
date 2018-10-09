/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

const config = require('../../config')
const a11yScan = require('../utils/accessibilityScan')
let page

module.exports = {
  '@disabled': false,

  before: function (browser) {
    const loginPage = browser.page.LoginPage()
    loginPage.navigate()
    loginPage.authenticate()

    const url = `${browser.launch_url}${config.get('contextPath')}/`
    page = browser.page.WelcomePage()
    page.navigate(url)
  },

  'Welcome: Load page': () => {
    page.verifyPageLoaded()
  },

  'Welcome: Run Accessibility Scan': (browser) => {
    a11yScan.runAccessibilityScan(browser, 'welcome')
  },

  'Welcome: Redirect unknown paths to welcome page': (browser) => {
    const urlWithNonExistentPath = `${browser.launch_url}${config.get('contextPath')}/some-non-existent-path`
    page.navigate(urlWithNonExistentPath)
    browser.assert.urlEquals(`${browser.launch_url}${config.get('contextPath')}/welcome`)
    page.verifyPageLoaded()
  },

  after: function (browser, done) {
    setTimeout(() => {
      browser.end()
      done()
    })
  }
}
