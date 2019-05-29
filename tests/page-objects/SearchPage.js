/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/


module.exports = {
  // NOTE: .class, #id
  elements: {
    primaryButton: '.bx--btn--primary',
    headerTitle: '.bx--detail-page-header-title',
    searchbar: '.react-tags',
    searchbarInput: '.react-tags__search-input',
    input: '.react-tags__search-input input',
    tableHeader: '.search--resource-table-header-button',
    tableHeaderLast: '.search--resource-table-header-button:last-child',
    clearAllButton: '.tagInput-cleanButton',
    dateTableCell: 'td:last-child',
    querySpan: '.react-tags__selected-tag-name',
    suggestions: '.react-tags__suggestions',
    searchSuggestionCards: '.saved-search-query-header',
    infoModal: '.search-guide-modal',
    infoModalButton: '.tagInput-infoButton',
    infoModalCloseButton: '.bx--modal-close',
    searchSaveButton: '.search-input-save-button',
    savedQuerySectionHeader: '.saved-search-query-header',
    saveEditModal: '.save-and-edit-query-modal',
    saveQueryName: '#add-query-name',
    saveQueryDesc: '#add-query-desc',
    savedQueryCardName: '.search-query-name',
    searchTabs: '.bx--tabs__nav',
    newTabButton: '#add-new-query',
    newTabID: '.bx--tabs__nav-item--selected',
    closeTabButton: '.header-icon--close',
    overflowMenu: '.query-menu-button',
    overflowMenuShare: '[data-table-action="modal.actions.share"]',
    overflowMenuEdit: '[data-table-action="modal.actions.edit"]',
    overflowMenuRemove: '[data-table-action="modal.actions.remove"]',
    deleteQueryButton: '.bx--btn.bx--btn--danger--primary',
    shareText: '.bx--snippet-container',
  },
  commands: [{
    focusInput,
    enterTextInSearchbar,
    resetInput,
    openInfoModal,
    createNewTab,
    deleteNewTab,
    saveQuery,
    focusCardInput,
    shareSavedQuery,
    // editSavedQuery,
    deleteSavedQuery,
    verifyPageContent,
    checkTagArray,
    checkUrlUpdated,
    verifyInfoModalOpen,
    verifySavedQuery,
    // verifyQueryUpdate,
    verifyDeleteQuery
  }]
}

/**
 * Actions
 */

function focusInput() {
  this.waitForElementPresent('@searchbar')
  this.waitForElementPresent('@searchSuggestionCards')
  this.waitForElementPresent('@input')
  this.click('@input')
  this.waitForElementPresent('@suggestions')
}

function enterTextInSearchbar(browser, property, op, value) {
  this.setValue('@input', property)
  this.setValue('@input', ' ')
  this.waitForElementPresent('@suggestions')
  if (op !== null && value !== null) {
    const valueText = op + value
    this.setValue('@input', valueText)
    this.setValue('@input', ' ')
  }
}

function resetInput() {
  this.click('@clearAllButton')
}

function openInfoModal() {
  this.waitForElementPresent('@searchbar')
  this.waitForElementPresent('@searchSuggestionCards')
  this.waitForElementPresent('@infoModalButton').click('@infoModalButton')
}

function createNewTab() {
  this.waitForElementPresent('@searchTabs')
  this.click('@newTabButton')
}

function deleteNewTab() {
  this.api.useXpath()
  this.waitForElementPresent('//*[@id="Search - 2 (Unsaved)"]')
  this.click('@closeTabButton')
  this.waitForElementNotPresent('//*[@id="Search - 2 (Unsaved)"]')
  this.api.useCss()
}

function saveQuery() {
  this.waitForElementPresent('@searchSaveButton')
    .click('@searchSaveButton')
  this.waitForElementPresent('@saveEditModal')
  this.setValue('@saveQueryName', 'SeleniumTesting')
  this.setValue('@saveQueryDesc', 'Testing the search UI using selenium/nightwatch')
  this.click('@primaryButton')
}

function focusCardInput(browser) {
  this.expect.element('@savedQueryCardName').text.to.contain('SeleniumTesting')
  browser.moveToElement('.bx--module.bx--module--single.bx--tile.search-query-card', 1, 1) // overflow menu only appears with focus
  this.waitForElementPresent('@overflowMenu')
  this.click('@overflowMenu')
}

function shareSavedQuery() {
  this.waitForElementPresent('@overflowMenuShare')
  this.click('@overflowMenuShare')
  this.waitForElementPresent('@saveEditModal')
  this.expect.element('@shareText').text.to.contain('?filters={"textsearch":"kind%3Apod"}')
  this.click('@infoModalCloseButton')
}

// function editSavedQuery(browser) {
//   this.waitForElementPresent('@overflowMenuEdit')
//   this.click('@overflowMenuEdit')
//   this.waitForElementPresent('@saveEditModal')
//   // edit existing query info text
//   this.setValue('@saveQueryName', ' - Edited')
//   this.setValue('@saveQueryDesc', ' - Edited')
//   this.click('@primaryButton')
//   browser.pause(1000) // buffer for card to appear on screen
// }

function deleteSavedQuery(browser) {
  this.waitForElementPresent('@overflowMenuRemove')
  this.click('@overflowMenuRemove')
  this.waitForElementPresent('@saveEditModal')
  this.click('@deleteQueryButton')
  browser.pause(1000)
}

/**
 * Verifications
 */

function verifyPageContent() {
  this.expect.element('@headerTitle').to.be.present
  this.expect.element('@searchbar').to.be.present
}

function checkTagArray(query) {
  // this only checks the first tag - need to update function to check multiple
  this.expect.element('@querySpan').text.to.contain(query)
}

function checkUrlUpdated(browser, property, value) {
  if (value === undefined) {
    browser.assert.urlContains(`?filters={%22textsearch%22:%22${property}%22}`)
  } else {
    if (Array.isArray(value)) value = value.join('%2C')
    browser.assert.urlContains(`?filters={%22textsearch%22:%22${property}%3A${value}%22}`)
  }
}

function verifyInfoModalOpen() {
  this.expect.element('@infoModal').to.be.present
  this.click('@infoModalCloseButton')
}

function verifySavedQuery() {
  this.waitForElementPresent('@savedQuerySectionHeader')
  this.expect.element('@savedQuerySectionHeader').text.to.contain('Saved')
  this.waitForElementPresent('@savedQueryCardName')
  this.expect.element('@savedQueryCardName').text.to.contain('SeleniumTesting')
}

// function verifyQueryUpdate() {
//   this.waitForElementPresent('@savedQuerySectionHeader')
//   this.expect.element('@savedQuerySectionHeader').text.to.contain('Saved')
//   this.waitForElementPresent('@savedQueryCardName')
//   this.expect.element('@savedQueryCardName').text.to.contain('SeleniumTesting - Edited')
// }

function verifyDeleteQuery() {
  this.waitForElementPresent('@savedQuerySectionHeader')
  this.waitForElementPresent('@savedQueryCardName')
  this.expect.element('@savedQueryCardName').text.to.not.contain('SeleniumTesting')
}
