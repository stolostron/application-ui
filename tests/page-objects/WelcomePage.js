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
    welcomeImage: '.welcome--image',
    welcomeText: '.welcome--text',
  },
  commands: [{
    verifyPageLoaded,
  }]
}


/**
 * Verifications
 */

function verifyPageLoaded() {
  this.expect.element('@welcomeImage').to.be.present
  this.expect.element('@welcomeText').to.be.present
}
