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
    installBtn: '.bx--btn--primary',
    modal: '.bx--modal',
    releaseClusterInput: '#downshift-0-item-0',
    releaseNameInput: '.bx--text-input',
    resourceSearch: '.bx--search-input',
    spinner: '.content-spinner',
  },
  commands: [{
    installHelmRelease,
    verifyHelmReleaseInstall,
    verifyPageContent
  }]
}

function verifyPageContent() {
  this.waitForElementNotPresent('@spinner', 60000)
}

function installHelmRelease(browser) {
  this.click('@releaseNameInput')
  this.waitForElementVisible('@releaseClusterInput', 60000)
  browser.pause(1000)
  this.click('@releaseClusterInput')
  this.click('@installBtn')
  browser.pause(1000)
  this.waitForElementNotPresent('@spinner', 60000)
}

// TODO: Zack L - Should come back to this once we are using dynamic mock data
function verifyHelmReleaseInstall(browser) {
  this.waitForElementNotPresent('@spinner')
  browser.pause(3000)
  this.waitForElementVisible('@resourceSearch')
}
