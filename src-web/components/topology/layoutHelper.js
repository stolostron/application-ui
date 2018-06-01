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
import lodash from 'lodash'
import { CLUSTER_MARGIN, CLUSTER_MARGIN_TOP, NODE_RADIUS } from './constants.js'


export default class LayoutHelper {
  /**
   * Helper class to be used by TopologyDiagram.
   *
   * Contains functions to compute the position of nodes in the diagram.
   */
  constructor(height, width, clusters){
    this.clusters = clusters
    this.height = height
    this.width = width
    this.svg = d3.select('svg.topologyDiagram')
  }

  /**
   * Adjust the position of the node so that it stays within the cluster boundaries.
   */
  adjustNodePosition = (node) => {
    // TODO: Jorge: Save cluster boundaries in state instead of calculating each time here.
    const index = lodash.findIndex(this.clusters, (c) => (c.id == node.cluster))
    const clusterWidth = this.width / this.clusters.length

    const boundaries = {
      minX: clusterWidth * index + NODE_RADIUS + CLUSTER_MARGIN,
      maxX: clusterWidth * (index + 1) - NODE_RADIUS - CLUSTER_MARGIN,
      minY: CLUSTER_MARGIN_TOP + NODE_RADIUS,
      maxY: this.height -CLUSTER_MARGIN_TOP - NODE_RADIUS,
    }

    return {
      x: Math.max(boundaries.minX, Math.min(boundaries.maxX, node.x)),
      y: Math.max(boundaries.minY, Math.min(boundaries.maxY, node.y)),
    }
  }

  /**
   * Computes the new position of links after a simulation tick.
   */
  moveLinks = () => {
    const links = this.svg.select('g.links').selectAll('g.link')
    links.selectAll('line')
      .attr('x1', (d) => { return this.adjustNodePosition(d.source).x })
      .attr('y1', (d) => { return this.adjustNodePosition(d.source).y })
      .attr('x2', (d) => { return this.adjustNodePosition(d.target).x })
      .attr('y2', (d) => { return this.adjustNodePosition(d.target).y })

    // Compute position of link text
    links.selectAll('text')
      .attr('transform', (d) => {
        const x = (this.adjustNodePosition(d.source).x + this.adjustNodePosition(d.target).x)/2
        const y = (this.adjustNodePosition(d.source).y + this.adjustNodePosition(d.target).y)/2
        const angle = Math.atan2(
          this.adjustNodePosition(d.target).y - this.adjustNodePosition(d.source).y,
          this.adjustNodePosition(d.target).x - this.adjustNodePosition(d.source).x)
          * 180 / Math.PI
        return `translate(${x}, ${y}) rotate(${x > this.adjustNodePosition(d.target).x ? angle + 180 : angle})`
      })

    // Compute position of direction indicator
    links.selectAll('polygon')
      .attr('transform', (d) => {
        const x = this.adjustNodePosition(d.target).x
        const y = this.adjustNodePosition(d.target).y
        const angle = Math.atan2(d.target.y - d.source.y, d.target.x - d.source.x) * 180 / Math.PI
        return `translate(${x}, ${y}) rotate(${angle + 90})`
      })
  }


  /**
   * Computes the new position of nodes after a simulation tick.
   */
  moveNodes = () => {
    const nodes = this.svg.select('g.nodes').selectAll('g.node')
    nodes.selectAll('polygon')
      .attr('transform', (n) => {
        const x = this.adjustNodePosition(n).x
        const y = this.adjustNodePosition(n).y
        return `translate(${x - 21.650625}, ${y - 25.65625})`
      })
    nodes.selectAll('circle')
      .attr('cx', (n) => { return this.adjustNodePosition(n).x })
      .attr('cy', (n) => { return this.adjustNodePosition(n).y })

    //Compute position of node's text
    nodes.selectAll('text')
      .attr('x', (n) => { return this.adjustNodePosition(n).x })
      .attr('y', (n) => { return this.adjustNodePosition(n).y + 35 })
  }

}
