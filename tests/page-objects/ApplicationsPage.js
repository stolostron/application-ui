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
    aceEditor: '.ace_layer.ace_text-layer',
    deleteBtn: '.bx--btn--danger--primary',
    headerTitle: '.bx--detail-page-header-title',
    inlineNotificationError: '.bx--inline-notification.bx--inline-notification--error',
    modal: '.bx--modal',
    modalContent: '.bx--modal-content',
    modalRegisterApp: '.bx--modal.bx--modal-tall.is-visible.modal-with-editor',
    modalRemoveResource: '#remove-resource-modal',
    modalRemoveDeployment: '#undeploy-application-modal',
    modalCancelBtn: '.bx--btn.bx--btn--secondary',
    modalSubmitBtn: '.bx--modal__buttons-container .bx--btn.bx--btn--primary',
    overflowMenu: '.bx--overflow-menu',
    overflowMenuDashboard: '[data-table-action="table.actions.applications.dashboard"]',
    overflowMenuDeploy: '[data-table-action="table.actions.applications.deploy"]',
    overflowMenuRemove: '[data-table-action="table.actions.applications.remove"]',
    overflowMenuUndeploy: '[data-table-action="table.actions.applications.undeploy"]',
    registerAppBtn: '#register-application',
    registerAppModal: '.bx--modal',
    resourceSearch: '#resource-search',
    spinner: '.content-spinner',
    aceEditorTextInput: '#brace-editor',
  },
  commands: [{
    closeAppRegistrationModal,
    deleteApplication,
    deployApplication,
    enterTextInYamlEditor,
    findResource,
    generateDashboardLink,
    openAppRegistrationModal,
    removeDeployment,
    submitRegisterAppModal,
    verifyAppDeployed,
    verifyDashboardLink,
    verifyDeploymentRemoved,
    verifyModalOpened,
    verifyModalSubmitted,
    verifyPageContent,
    verifyResourceNotPresent,
    verifyResourceIsPresent,
    verifyResourceIsRefreshing,
    verifyYamlValidationError,
  }]
}

function openAppRegistrationModal(){
  this.waitForElementVisible('@registerAppBtn')
  this.click('@registerAppBtn')
  this.waitForElementVisible('@registerAppModal')
  this.waitForElementVisible('@aceEditor')
}

function submitRegisterAppModal(){
  this.click('@modalSubmitBtn')
}

function closeAppRegistrationModal(){
  this.click('@modalCancelBtn')
  this.waitForElementNotVisible('@aceEditor')
}


function enterTextInYamlEditor(browser, yaml){
  this.waitForElementPresent('@registerAppModal')
  this.click('@aceEditorTextInput')

  const keystrokes = []
  yaml.split(/\r?\n/).forEach(line => {
    const indentation = line.search(/\S|$/)
    keystrokes.push(line)
    keystrokes.push(browser.Keys.RETURN)

    for (let i = 0; i < indentation / 2; i++ )
      keystrokes.push(browser.Keys.BACK_SPACE)
  })

  this.api.keys(keystrokes)
}


function findResource(resourceName){
  this.waitForElementNotPresent('@spinner')
  this.waitForElementVisible('@resourceSearch')
  this.clearValue('@resourceSearch')
  this.setValue('@resourceSearch', resourceName)
}

function generateDashboardLink(){
  this.click('@overflowMenu')
  this.waitForElementVisible('@overflowMenuDashboard')
  this.click('@overflowMenuDashboard')
}

function deployApplication(){
  this.click('@overflowMenu')
  this.waitForElementVisible('@overflowMenuDeploy')
  this.click('@overflowMenuDeploy')
}

function removeDeployment(){
  this.click('@overflowMenu')
  this.waitForElementVisible('@overflowMenuUndeploy')
  this.click('@overflowMenuUndeploy')
  this.waitForElementPresent('@modalRemoveDeployment')
  this.click('@deleteBtn')
  this.waitForElementNotPresent('@spinner')
}

function deleteApplication(){
  this.click('@overflowMenu')
  this.waitForElementVisible('@overflowMenuRemove')
  this.click('@overflowMenuRemove')
  this.waitForElementVisible('@modalRemoveResource')
  this.click('@deleteBtn')
  this.waitForElementNotPresent('@spinner')
}


/**
 * Verifications
 */

function verifyAppDeployed(name){
  this.verifyResourceIsRefreshing(name)
  this.expect.element('@inlineNotificationError').to.be.not.present
  this.assert.containsText(`[data-row-name="${name}"`, 'Deployed')
}

function verifyDashboardLink(name){
  this.verifyResourceIsRefreshing(name)
  this.expect.element('a').to.be.present
}

function verifyDeploymentRemoved(name){
  this.verifyResourceIsRefreshing(name)
  this.expect.element('@inlineNotificationError').to.be.not.present
  this.assert.containsText(`[data-row-name="${name}"`, 'Registered')
}

function verifyModalSubmitted(){
  this.waitForElementNotPresent('@modalRegisterApp')
  this.expect.element('@modalRegisterApp').to.be.not.present
  this.expect.element('@inlineNotificationError').to.be.not.present
}

function verifyModalOpened(){
  this.waitForElementPresent('@modalRegisterApp')
  this.expect.element('@modalRegisterApp').to.be.present
  this.expect.element('@inlineNotificationError').to.be.not.present
}

function verifyPageContent() {
  this.expect.element('@headerTitle').to.be.present
  this.expect.element('@registerAppBtn').to.be.present
}

function verifyResourceIsPresent(name){
  this.expect.element(`[data-row-name="${name}"`).to.be.present
}

function verifyResourceNotPresent(name){
  this.expect.element(`[data-row-name="${name}"`).to.be.not.present
}

function verifyResourceIsRefreshing(name){
  this.expect.element(`#loading-${name}`).to.be.present
  this.waitForElementNotPresent(`#loading-${name}`, 20000)
}

function verifyYamlValidationError(){
  this.assert.containsText('.bx--inline-notification__subtitle', 'can not read a block mapping entry; a multiline key may not be an implicit key')
  this.expect.element('@inlineNotificationError').to.be.present
}
