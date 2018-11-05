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
    topologyDiagram : '.topologyDiagram',
    notification: '.bx--inline-notification',
    notificationText: '.bx--inline-notification__subtitle'
  },
  commands: [{
    verifyTopologyLoads,
    waitUntilFiltersLoaded,
    filterTopology,
    openDetailsView,
    closeDetailsView
  }]
}

function verifyTopologyLoads() {
  this.waitForElementVisible('@topologyDiagram')
  this.waitForElementNotPresent('@spinner')
}

function waitUntilFiltersLoaded(cb) {
  this.api.useXpath()
  this.waitForElementNotPresent('//input[@placeholder=\'Loading...\']', 20000, ()=>{
    this.api.useCss()
    this.api.elements('css selector', '.multi-select-filter', res => cb(res))
  })
}

function filterTopology(filter, checkBox, cb) {
  this.click(`.topologyFilters #${filter} .bx--list-box__field .bx--list-box__menu-icon`)
  this.waitForElementPresent('.bx--list-box__menu', 3000, ()=>{
    this.api.useXpath()
    this.click(checkBox?`//input[@name='${checkBox}']/..`:
      '//div[@class=\'bx--list-box__menu\']//input[@type=\'checkbox\']/..') // checkbox is readonly, so click parent
    this.api.useCss()
    this.waitForElementNotPresent('.bx--list-box__menu', 3000, ()=>{
      this.waitForElementNotPresent('@spinner', ()=>{
        this.api.elements('css selector', '.topologyDiagramContainer > .diagramViewerDiagram', res => cb(res))
      })
    })
  })
}

function openDetailsView(cb) {
  // for now just click on the first node in the diagram
  this.click('.topologyDiagramContainer> .diagramViewerDiagram > .diagramViewerContainer > svg > g.nodes > g.node')
  this.waitForElementPresent('.topologyDetails', 3000, ()=>{
    this.api.elements('css selector', 'section.topologyDetails', res => cb(res))
  })
}

function closeDetailsView(cb) {
  this.click('section.topologyDetails svg.closeIcon')
  this.waitForElementNotPresent('.topologyDetails', 3000, ()=>{
    this.api.elements('css selector', 'section.topologyDetails', res => cb(res))
  })
}
