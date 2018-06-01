/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import * as d3 from 'd3'
import { NODE_RADIUS } from './constants.js'


export default class LinkHelper {
  /**
   * Helper class to be used by TopologyDiagram.
   *
   * Contains functions to draw and manage links between nodes in the diagram.
   */
  constructor(links) {
    this.links = links
    this.svg = d3.select('svg.topologyDiagram')
  }

  /**
   * Removes links from the diagram.
   *
   * TODO: Currently it removes all the links, but we should only remove stale
   * old links. We can do that adding a uid to every link. For a sample
   * implementation see removeOldNodesFromDiagram().
   *
   */
  removeOldLinksFromDiagram = () => {
    this.svg.select('g.links')
      .selectAll('g.link').remove()
  }

  /**
   * Adds new links to the SVG diagram.
   *
   * @param {*} currentZoom
   */
  addLinksToDiagram = (currentZoom) => {
    const links = this.svg.select('g.links')
      .selectAll('g.link')
      .data(this.links)
      .enter().append('g')
      .attr('class', 'link')
      .attr('transform', currentZoom)

    links.append('line')

    links.append('text')
      .attr('class', 'linkText')
      .text((d) => { return d.label })

    links.append('polygon')
      .attr('class', 'directionDecorator')
      .attr('points', `0,${NODE_RADIUS}, -2,${NODE_RADIUS + 5}, 2,${NODE_RADIUS + 5}`)
  }

}
