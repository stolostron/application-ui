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
    spinner: '.content-spinner',
    secondaryHeader: '.secondary-header',
    tabs: '.bx--tabs',
    table: '.resource-table-container__table',
    noResource: '.no-resource',
    pageContainer: '.page-content-container',
    createResource: '.resource-table-container__actions button',
    createResourceBtn: '#nav-modal .bx--btn--primary',
    eventsTab: '#events-tab a',
    logsTab: '#logs-tab a',
    logsContent: '.logs-container__content',
    removeModal: '#remove-resource-modal',
    removeModalBtn: '#remove-resource-modal .bx--btn--danger--primary',
    scaleModal: '#scale-resource-modal',
    scaleModalBtn: '#scale-resource-modal .bx--btn--primary',
    scaleNumInput: '#scale-number',
    podsTable: '#pods-module .resource-table-container__table',
    resourceModal: '#resource-modal',
    resourceModalBtn: '#resource-modal .bx--btn--primary',
    notification: '.bx--inline-notification',
    notificationText: '.bx--inline-notification__subtitle'
  },
  commands: [{
    verifySecondaryHeader,
    verifyPageContent,
    createResource,
    deleteResource,
    handleTableAction,
    editResource,
    verifyEvents,
    verifyLogs,
    verifyFieldValidation
  }]
}

function verifySecondaryHeader(hasTabs) {
  this.waitForElementVisible('@secondaryHeader')
  if (hasTabs)
    this.waitForElementVisible('@tabs')
}

function verifyPageContent() {
  const self = this
  self.waitForElementPresent('@pageContainer')
  self.waitForElementNotPresent('@spinner')
  self.api.pause(10000)
  self.client.api.element('css selector', '.resource-table-container__table', res => {
    res.status === 0 ? self.waitForElementVisible('@table') : self.waitForElementVisible('@notification')
  })
}

function createResource(formData, resourceName) {
  this.waitForElementVisible('@createResource').click('@createResource')
  formData.forEach(item => {
    this.click(item.tabSelector)
    item.fields.forEach(field => this.setValue(field.selector, field.value), this)
  }, this)
  this.click('@createResourceBtn')
  this.waitForElementNotPresent('@spinner')
  this.waitForElementVisible(`[data-row-name="${resourceName}"]`)
  this.api.useXpath()
  this.waitForElementPresent('//tr[1]/td[5][text()="1"]', 25000) // Wait for pod to start running
  this.api.useCss()
}

function deleteResource(resourceName) {
  this.handleTableAction(resourceName, 'table.actions.applications.remove')
  this.waitForElementVisible('@removeModal')
  this.click('@removeModalBtn')
  this.waitForElementNotPresent('@removeModal')
  this.waitForElementNotPresent(`[data-row-name="${resourceName}"]`, 25000) // Wait for pod to terminate
}

// For now, only perfoming save action without any new changes since issues editing Ace editor with selenium
function editResource(resourceName) {
  this.handleTableAction(resourceName, 'table.actions.edit')
  this.waitForElementVisible('@resourceModal')
  this.click('@resourceModalBtn')
}

function verifyEvents() {
  this.waitForElementPresent('@pageContainer')
  this.waitForElementNotPresent('@spinner')
  this.api.element('css selector', '.resource-table-container__table', res => {
    res.status === 0 ? this.waitForElementVisible('@table') : this.waitForElementVisible('@noResource')
  }, this)
}

function verifyLogs() {
  this.waitForElementPresent('@pageContainer')
  this.waitForElementNotPresent('@spinner', 20000)
  this.api.element('css selector', '.logs-container__content', res => {
    res.status === 0 ? this.waitForElementVisible('@logsContent') : this.waitForElementVisible('@noResource')
  }, this)
}

function handleTableAction(resourceName, actionName) {
  this.waitForElementPresent('@pageContainer')
  this.waitForElementNotPresent('@spinner')
  this.waitForElementPresent(`[data-row-name="${resourceName}"] .bx--overflow-menu`)
  this.click(`[data-row-name="${resourceName}"] .bx--overflow-menu`)
  this.waitForElementPresent(`[data-row-name="${resourceName}"] .bx--overflow-menu [data-table-action="${actionName}"]`)
  this.click(`[data-row-name="${resourceName}"] .bx--overflow-menu [data-table-action="${actionName}"]`)
}

function verifyFieldValidation(formData) {
  this.waitForElementVisible('@createResource').click('@createResource')
  formData.forEach(item => {
    this.click(item.tabSelector)
    item.fields.forEach(field => this.setValue(field.selector, field.value), this)
  }, this)
  this.click('@createResourceBtn')
  this.waitForElementVisible('@notification') // Confirm error notification displays
  formData.forEach(item => {
    this.click(item.tabSelector)
    item.fields.forEach(field => this.waitForElementVisible(`${field.selector}[data-invalid="true"]`)) // Confirm field error displays
  })
}
