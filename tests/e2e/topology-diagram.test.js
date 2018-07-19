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

const NUMBER_OF_FILTERS = 4
const FILTER_NAME = 'Clusters'

module.exports = {
  //'@disabled': true,

  before: function (browser) {
    const loginPage = browser.page.LoginPage()
    loginPage.navigate()
    loginPage.authenticate()
  },

  'verify-topology-diagram-loads': (browser) => {
    const url = `${browser.launch_url}${config.get('contextPath')}${ROUTE}`
    const page = browser.page.TopologyDiagramPage()
    page.navigate(url)
    page.verifyTopologyLoads()
  },

  'verify-topology-diagram-filtering': (browser) => {
    const page = browser.page.TopologyDiagramPage()
    page.waitUntilFiltersLoaded((res)=>{
      // make sure there are NUMBER_OF_FILTERS
      browser.assert.equal(res.value.length, NUMBER_OF_FILTERS)

      // filter topology
      page.filterTopology(FILTER_NAME, null, (res)=>{

        // make sure there are any clusters
        browser.assert.ok(res.value.length > 0)
      })
    })
  },

  // 'verify-topology-details-view': (browser) => {
  //   let page = browser.page.TopologyDiagramPage()
  //   page.openDetailsView(res=>{
  //     // view opened
  //     browser.assert.equal(res.value.length, 1)
  //     page.closeDetailsView(res=>{
  //       // view closed
  //       browser.assert.equal(res.value.length, 0)
  //     })
  //   })
  // },

  after: function (browser, done) {
    setTimeout(() => {
      browser.end()
      done()
    })
  }
}
