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
  this.waitForElementNotPresent('@spinner')
}

function installHelmRelease(browser, name, cluster, namespace) {
  this.waitForElementVisible('@chartSearch')
  this.setValue('@chartSearch', name)
  this.click('@chart')
  this.waitForElementVisible('@modal')
  this.setValue('@releaseNameInput', `selenium-${name}`)
  this.click('@releaseClusterInput')
  this.setValue('@releaseClusterInput', cluster)
  this.sendKeys('@releaseClusterInput', browser.Keys.DOWN_ARROW)

  this.click('@selectedCluster')

  this.waitForElementNotPresent('@clusterDropdown')
  this.click('@releaseNamespaceDropdown')

  this.waitForElementVisible(`[value="${namespace}"]`)
  this.click(`[value="${namespace}"]`)

  this.click('@installBtn')
  this.waitForElementVisible('@spinner')
  this.waitForElementNotPresent('@spinner')
}

function deleteHelmRelease(name) {
  this.waitForElementNotPresent('@spinner')
  this.waitForElementVisible('@resourceSearch')
  this.setValue('@resourceSearch', `selenium-${name}`)
  this.click('@overflowMenu')
  this.waitForElementVisible('@overflowMenuRemove')
  this.click('@overflowMenuRemove')
  this.waitForElementVisible('@modal')
  this.click('@deleteBtn')
  this.waitForElementNotPresent('@spinner')
}

function verifyHelmReleaseInstall(name) {
  this.waitForElementNotPresent('@spinner')
  this.waitForElementVisible('@resourceSearch')
  this.setValue('@resourceSearch', `selenium-${name}`)
  this.expect.element(`[data-row-name=selenium-${name}]`).to.be.present
}

function verifyHelmReleaseDelete(name) {
  this.waitForElementVisible('@resourceSearch')
  this.setValue('@resourceSearch', `selenium-${name}`)
  this.expect.element('@searchNoResults').to.be.present
}
