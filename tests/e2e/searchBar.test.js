/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

const config = require('../../config')

let searchPage

module.exports = {
  '@disabled': false,
  before: function (browser) {
    const loginPage = browser.page.LoginPage()
    loginPage.navigate()
    loginPage.authenticate()

    const url = `${browser.launch_url}${config.get('contextPath')}/search`
    searchPage = browser.page.SearchPage()
    searchPage.navigate(url)
  },

  'SearchBar: Load page': () => {
    searchPage.verifyPageContent()
  },

  'SearchBar: Search for pods': (browser) => {
    searchPage.focusInput()
    searchPage.enterTextInSearchbar(browser, 'kind', '', 'pod')
    searchPage.checkTagArray('kind:pod')
    searchPage.checkUrlUpdated(browser, 'kind', 'pod')
    searchPage.resetInput()
  },

  'SearchBar: Search for cpu < 16': (browser) => {
    searchPage.focusInput()
    searchPage.enterTextInSearchbar(browser, 'cpu', '<', '16')
    searchPage.checkTagArray('cpu:<16')
    searchPage.checkUrlUpdated(browser, 'cpu', '%3C16') // %3C = < after encoding
    searchPage.resetInput()
  },

  'SearchBar: Search for created within last day': (browser) => {
    searchPage.focusInput()
    searchPage.enterTextInSearchbar(browser, 'created', '', 'day')
    searchPage.checkTagArray('created:day')
    searchPage.checkUrlUpdated(browser, 'created', 'day')
    searchPage.resetInput()
  },

  'SearchBar: Search for kind:pod,application': (browser) => {
    searchPage.focusInput()
    searchPage.enterTextInSearchbar(browser, 'kind', '', 'pod')
    browser.pause(1000)
    searchPage.enterTextInSearchbar(browser, 'kind', '', 'application')
    searchPage.checkTagArray('kind:pod,application')
    searchPage.checkUrlUpdated(browser, 'kind', ['pod', 'application'])
    searchPage.resetInput()
  },

  'SearchBar: Search for keyword': (browser) => {
    searchPage.focusInput()
    searchPage.enterTextInSearchbar(browser, 'keyword', null, null)
    searchPage.checkTagArray('keyword')
    searchPage.checkUrlUpdated(browser, 'keyword')
    searchPage.resetInput()
  },

  'SearchBar: Search for namespace:!=default': (browser) => {
    searchPage.focusInput()
    searchPage.enterTextInSearchbar(browser, 'namespace', '!=', 'default')
    searchPage.checkTagArray('namespace:!=default')
    searchPage.checkUrlUpdated(browser, 'namespace', '!%3Ddefault') // after encoding
    searchPage.resetInput()
  },

  'SearchBar: Check redirecting to searchpage with query in URL': (browser) => {
    searchPage.navigate(`${browser.launch_url}${config.get('contextPath')}/search?filters={"textsearch":"kind%3Apod"}`)
    searchPage.checkTagArray('kind:pod')
  },

  after: function (browser, done) {
    setTimeout(() => {
      browser.end()
      done()
    })
  }
}
