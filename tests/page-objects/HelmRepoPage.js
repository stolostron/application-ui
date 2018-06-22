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
    addRepoBtn: '#add-repo',
    addRepoModal: '.bx--modal',
    noResource: '.no-resource',
    repoNameInput: '#helm-repo-name',
    repoSubmit: '.bx--modal-footer .bx--btn--primary',
    repoTable: '.resource-table-container',
    repoTableRow: '[data-row-name="test"]',
    repoUrlInput: '#helm-repo-url',
  },
  commands: [{
    addHelmRepository,
    verifyPageContent,
    verifyRepoAdd,
  }]
}

function verifyPageContent() {
  this.waitForElementVisible('@addRepoBtn')
}

function addHelmRepository(name, url) {
  this.click('@addRepoBtn')
  this.waitForElementVisible('@addRepoModal')
  this.setValue('@repoNameInput', name)
  this.setValue('@repoUrlInput', url)
  this.click('@repoSubmit')
  this.waitForElementVisible('@repoTable')
}

function verifyRepoAdd(name) {
  this.waitForElementVisible(`[data-row-name=${name}]`)
}
