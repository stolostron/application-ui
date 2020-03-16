/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

module.exports = {
  elements: {
    headerTitle: ".bx--detail-page-header-title",
    spinner: ".content-spinner"
  },
  commands: [
    {
      verifyPageLoaded
    }
  ]
};

/**
 * Verifications
 */

function verifyPageLoaded() {
  this.waitForElementNotPresent("@spinner");
  this.expect.element("@headerTitle").to.be.present;
}
