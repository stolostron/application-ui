/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

module.exports = {
  elements: {
    searchInputBox: 'input#undefined-search',
    spinner: '.content-spinner'
  },
  commands: [{
    verifySearchInput,
    verifySearchResult,
  }]
}

function verifySearchInput(browser, inputText){
  this.waitForElementNotPresent('@spinner', 60000)
  this.waitForElementVisible('@searchInputBox')
    .setValue('@searchInputBox',inputText)
    .assert.value('@searchInputBox',inputText)
}

function verifySearchResult(browser,inputText){
  browser.expect.element('tbody tr').to.have.attribute('data-row-name').equals(inputText)
}
