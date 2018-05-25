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
    noResource: '.no-resource',
    pageContainer: '.page-content-container',
    topologyDiagram : '.topologyDiagram',
    removeModal: '#remove-resource-modal',
    removeModalBtn: '#remove-resource-modal .bx--btn--danger--primary',
    resourceModal: '#resource-modal',
    resourceModalBtn: '#resource-modal .bx--btn--primary',
    notification: '.bx--inline-notification',
    notificationText: '.bx--inline-notification__subtitle'
  },
  commands: [{
    verifyPageContent
  }]
}

function verifyPageContent() {
  const self = this
  self.waitForElementVisible('@topologyDiagram')
}
