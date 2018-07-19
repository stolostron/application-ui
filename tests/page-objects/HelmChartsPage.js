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
    chart: '.resource-tile__wrapper',
    chartSearch: '#search-1',
    clusterDropdown: '.bx--list-box__menu',
    defaultNamespace: '[value="default"]',
    deleteBtn: '.bx--btn--danger--primary',
    installBtn: '.bx--modal-footer .bx--btn--primary',
    modal: '.bx--modal',
    removeResourceModal: '#remove-resource-modal',
    notificationText: '.bx--inline-notification__subtitle',
    overflowMenu: '.bx--overflow-menu',
    overflowMenuRemove: '.bx--overflow-menu-options__btn',
    releaseClusterInput: '#downshift-1-input',
    releaseNameInput: '#helm-release-name',
    releaseNamespaceDropdown: '.bx--dropdown',
    resourceSearch: '#resource-search',
    selectedCluster: '.bx--list-box__menu-item--highlighted',
    searchNoResults: '.search-no-results',
    spinner: '.content-spinner',
  },
  commands: [{
    deleteHelmRelease,
    installHelmRelease,
    verifyHelmReleaseDelete,
    verifyHelmReleaseInstall,
    verifyPageContent
  }]
}

function verifyPageContent() {
  this.waitForElementNotPresent('@spinner', 60000)
}

function installHelmRelease(browser, chartName, relName, namespace) {
  this.waitForElementVisible('@chartSearch', 60000)
  this.setValue('@chartSearch', chartName)
  browser.pause(1000)
  this.click('@chart')
  this.waitForElementVisible('@modal', 60000)
  this.setValue('@releaseNameInput', relName)
  this.click('@releaseClusterInput')
  this.sendKeys('@releaseClusterInput', browser.Keys.DOWN_ARROW)

  // Wait for clusters list to populate
  browser.pause(5000)
  this.click('@selectedCluster')

  this.waitForElementNotPresent('@clusterDropdown', 60000)
  this.click('@releaseNamespaceDropdown')

  this.waitForElementVisible(`[value="${namespace}"]`, 60000)
  browser.pause(1000)
  this.click(`[value="${namespace}"]`)
  browser.pause(1000)

  this.click('@installBtn')
  this.waitForElementVisible('@spinner', 60000)
  this.waitForElementNotPresent('@spinner', 60000)
}

function deleteHelmRelease(browser, relName) {
  this.waitForElementNotPresent('@spinner')
  browser.pause(5000)
  this.waitForElementVisible('@resourceSearch')
  this.setValue('@resourceSearch', relName)
  this.click('@overflowMenu')
  this.waitForElementVisible('@overflowMenuRemove')
  this.click('@overflowMenuRemove')
  this.waitForElementVisible('@removeResourceModal')
  this.click('@deleteBtn')
  this.waitForElementNotPresent('@spinner')
}

function verifyHelmReleaseInstall(browser, relName) {
  this.waitForElementNotPresent('@spinner')
  browser.pause(3000)
  this.waitForElementVisible('@resourceSearch')
  this.setValue('@resourceSearch', relName)
  this.expect.element(`[data-row-name=${relName}]`).to.be.present
}

function verifyHelmReleaseDelete(relName) {
  this.waitForElementVisible('@resourceSearch')
  this.setValue('@resourceSearch', relName)
  this.expect.element('@searchNoResults').to.be.present
}
