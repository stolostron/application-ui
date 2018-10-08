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
    barChart: '.dashboard-bar-chart',
    cardClusters: '#card-clusters',
    cardCpu: '#card-cpu',
    cardHelmReleases: '#card-helm-releases',
    cardPods: '#card-pods',
    cardPvs: '#card-pvs',
    cardMemory: '#card-memory',
    cardStorage: '#card-storage',
    dashboardCard: '.bx--module.bx--module--single.dashboard-card',
    headerTitle: '.bx--detail-page-header-title',
    pieChart: '.dashboard-pie-chart',
    spinner: '.content-spinner',
  },
  commands: [{
    verifyPageLoaded,
    verifyResourceOverviewSection,
  }]
}



/**
 * Verifications
 */

function verifyPageLoaded() {
  this.expect.element('@headerTitle').to.be.present
  this.expect.element('@spinner').to.be.present
  this.waitForElementNotPresent('@spinner')
}

function verifyResourceOverviewSection() {
  this.expect.element('@cardClusters').to.be.present
  this.expect.element('@cardCpu').to.be.present
  this.expect.element('@cardHelmReleases').to.be.present
  this.expect.element('@cardMemory').to.be.present
  this.expect.element('@cardPods').to.be.present
  this.expect.element('@cardPvs').to.be.present
  this.expect.element('@cardStorage').to.be.present
  this.expect.element('@dashboardCard').to.be.present
}

