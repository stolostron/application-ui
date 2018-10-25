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
    podsChart: '.bx--data-table-v2',
    nextPageButton: '.bx--pagination__button--forward',
    prevPageButton: '.bx--pagination__button--backward',
    spinner: '.content-spinner',
  },
  commands: [{
    verifyPageLoaded,
    switchPages,
  }]
}

function verifyPageLoaded() {
  this.waitForElementVisible('@podsChart',60000)
}

function switchPages() {
  this.waitForElementVisible('@nextPageButton',60000)
  this.click('@nextPageButton')
  this.waitForElementVisible('@prevPageButton',60000)
  this.click('@prevPageButton')
}
