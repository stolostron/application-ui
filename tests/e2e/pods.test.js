/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

const config = require('../../config')
let page

module.exports = {
  '@disabled': false,

  before: function (browser) {
    const loginPage = browser.page.LoginPage()
    loginPage.navigate()
    loginPage.authenticate()

    const url = `${browser.launch_url}${config.get('contextPath')}/pods`
    page = browser.page.PodsPage()
    page.navigate(url)
  },

  'Pods: Load page': () => {
    page.verifyPageLoaded()
  },

  'Pods: Switch pages': (browser) => {
    page.switchPages(browser)
  },

  after: function (browser, done) {
    setTimeout(() => {
      browser.end()
      done()
    })
  }
}
