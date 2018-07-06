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
  before: function (browser) {
    let loginPage = browser.page.LoginPage()
    loginPage.navigate()
    loginPage.authenticate()

    const url = `${browser.launch_url}${config.get('contextPath')}/overview/application`
    page = browser.page.DashboardPage()
    page.navigate(url)
  },

  'Dashboard: Load page': () => {
    page.verifyPageLoaded()
  },

  'Dashboard: Health Overview': () => {
    page.verifyHealthOverviewSection()
  },

  'Dashboard: Resource Overview': () => {
    page.verifyResourceOverviewSection()
  },


  after: function (browser, done) {
    setTimeout(() => {
      browser.end()
      done()
    })
  }
}
