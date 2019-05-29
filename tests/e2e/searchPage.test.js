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

  'SearchPage: Load page': () => {
    searchPage.verifyPageContent()
  },

  'SearchPage: Info modal is visible': () => {
    searchPage.openInfoModal()
    searchPage.verifyInfoModalOpen()
  },

  'SearchPage: Create and delete tab': () => {
    searchPage.createNewTab()
    searchPage.deleteNewTab()
  },

  'SearchPage: Save query': (browser) => {
    searchPage.focusInput()
    searchPage.enterTextInSearchbar(browser, 'kind', '', 'pod')
    searchPage.checkTagArray('kind:pod')
    searchPage.saveQuery()
    // Need to redirect to main search page to see created query
    searchPage.navigate(`${browser.launch_url}${config.get('contextPath')}/search`)
    searchPage.verifySavedQuery()
  },

  'SearchPage: Share modal': (browser) => {
    searchPage.focusCardInput(browser)
    searchPage.shareSavedQuery()
  },

  // **Unable to properly test this until issue #24409 is closed (editing creates new card)
  // 'SearchPage: Edit modal': (browser) => {
  //   searchPage.focusCardInput(browser)
  //   searchPage.editSavedQuery(browser)
  //   searchPage.verifyQueryUpdate()
  // },

  'SearchPage: Delete query': (browser) => {
    searchPage.focusCardInput(browser)
    searchPage.deleteSavedQuery(browser)
    searchPage.verifyDeleteQuery()
  },

  // For release 2
  // 'SearchPage: Related resource testing': (browser) => {
  //   TODO
  // }

  after: function (browser, done) {
    setTimeout(() => {
      browser.end()
      done()
    })
  }
}
