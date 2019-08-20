/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

module.exports = {
  elements: {
    headerTitle: '.bx--detail-page-header-title',
    spinner: '.content-spinner'
  },
  commands: [
    {
      verifyPageLoaded
    }
  ]
}

/**
 * Verifications
 */

function verifyPageLoaded() {
  this.expect.element('@headerTitle').to.be.present
  this.expect.element('@spinner').to.be.present
  this.waitForElementNotPresent('@spinner')
}
