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
  'cluster': ['/clusters','hub-cluster'],
  'compliance': ['/policies','compliance-xz'],
  'local_policies': ['/policies/local','policy-xz-2'],
  'applications': ['/applications','gbapp-gbapp'],
  'helm_releases': ['/releases','audit-logging'],
  'pods': ['/pods','audit-logging-fluentd-ds-lgjpj'],
  'nodes': ['/nodes','9.37.137.174'],
  'persistent_volume': ['/storage','helm-repo-pv'],
  'persistent_volume_claim': ['/storage/claims','helm-repo-pvc']
}

module.exports = {
  '@disabled': false,

  before: function (browser) {
    const loginPage = browser.page.LoginPage()
    loginPage.navigate()
    loginPage.authenticate()
  },

  'Cluster Page: table and search': (browser) => {
    verifyResourcePage(browser, ROUTE['cluster'][0],false)
    verifyTableSearch(browser, ROUTE['cluster'][0], ROUTE['cluster'][1])
  },

  'Compliance Page: table and search': (browser) => {
    verifyResourcePage(browser, ROUTE['compliance'][0],true)
    verifyTableSearch(browser, ROUTE['compliance'][0], ROUTE['compliance'][1])
  },

  'Local Policy Page: table and search': (browser) => {
    verifyResourcePage(browser, ROUTE['local_policies'][0],true)
    verifyTableSearch(browser, ROUTE['local_policies'][0], ROUTE['local_policies'][1])
  },

  'Application Page: table and search': (browser) => {
    verifyResourcePage(browser, ROUTE['applications'][0],false)
    verifyTableSearch(browser, ROUTE['applications'][0], ROUTE['applications'][1])
  },

  'Helm Release Page: table and search': (browser) => {
    verifyResourcePage(browser, ROUTE['helm_releases'][0],false)
    verifyTableSearch(browser, ROUTE['helm_releases'][0], ROUTE['helm_releases'][1])
  },

  'Pod Page: table and search': (browser) => {
    verifyResourcePage(browser, ROUTE['pods'][0],false)
    verifyTableSearch(browser, ROUTE['pods'][0], ROUTE['pods'][1])
  },

  'Node Page: table and search': (browser) => {
    verifyResourcePage(browser, ROUTE['nodes'][0],false)
    verifyTableSearch(browser, ROUTE['nodes'][0], ROUTE['nodes'][1])
  },

  'Storage Page: table and search': (browser) => {
    verifyResourcePage(browser, ROUTE['persistent_volume'][0],true)
    verifyTableSearch(browser, ROUTE['persistent_volume'][0], ROUTE['persistent_volume'][1])
  },

  'Storage Claim Page: table and search': (browser) => {
    verifyResourcePage(browser, ROUTE['persistent_volume_claim'][0],true)
    verifyTableSearch(browser, ROUTE['persistent_volume_claim'][0], ROUTE['persistent_volume_claim'][1])
  },

  after: function (browser, done) {
    setTimeout(() => {
      browser.end()
      done()
    })
  }
}

function verifyTableSearch(browser, subUrl, searchInput) {
  const url = `${browser.launch_url}${config.get('contextPath')}${subUrl}`
  const page = browser.page.TableSearchTest()
  page.navigate(url)
  page.verifySearchInput(browser,searchInput)
  page.verifySearchResult(browser,searchInput)
}

function verifyResourcePage(browser, subUrl,hasTabs) {
  const url = `${browser.launch_url}${config.get('contextPath')}${subUrl}`
  const resourceTablePage = browser.page.ResourceTablePage()
  resourceTablePage.navigate(url)
  resourceTablePage.verifyPageContent()
  resourceTablePage.verifySecondaryHeader(hasTabs)
}
