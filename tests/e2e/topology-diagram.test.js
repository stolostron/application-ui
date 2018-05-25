/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

const config = require('../../config')
const ROUTE ='/topology'

module.exports = {
  //'@disabled': true,

  before: function (browser) {
    let loginPage = browser.page.LoginPage()
    loginPage.navigate()
    loginPage.authenticate()
  },

  'verify-topology-diagram-contents': (browser) => {
    const url = `${browser.launch_url}${config.get('contextPath')}${ROUTE}`
    let topologyDiagramPage = browser.page.TopologyDiagramPage()
    topologyDiagramPage.navigate(url)
    topologyDiagramPage.verifyPageContent()
  },

  after: function (browser, done) {
    setTimeout(() => {
      browser.end()
      done()
    })
  }
}
