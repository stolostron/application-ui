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


export default class NodeHelper {
  /**
   * Helper class to be used by TopologyDiagram.
   *
   * Contains functions to draw and manage nodes in the diagram.
   */
  constructor(nodes, simulation) {
    this.nodes = nodes
    this.simulation = simulation
    this.svg = d3.select('svg.topologyDiagram')
  }


  /**
   * Remove nodes that aren't in the current nodeData array.
   */
  removeOldNodesFromDiagram = () => {
    this.svg.select('g.nodes')
      .selectAll('g.node')
      .data(this.nodes, (n) => n.uid)
      .exit().remove()
  }


  addNodesToDiagram = (currentZoom, nodeClickHandler) => {
    const polygonTypes = ['cluster', 'service']
    const circleArray = this.nodes.filter(node => polygonTypes.indexOf(node.type) === -1)
    const polygonArray = this.nodes.filter(node => polygonTypes.indexOf(node.type) !== -1)

    const circleNode = this.svg.select('g.nodes')
      .selectAll('g.node')
      .data(circleArray, (n) => n.uid)
      .enter().append('g')
      .attr('class','node')
      .attr('transform', currentZoom)
      .attr('type', (d) => { return d.name })
      .on('click', nodeClickHandler)

    // circle shadow
    this.createCircleSVG(circleNode, 'shadow', '19.6078431')
    // main circle
    this.createCircleSVG(circleNode, 'main', '19.6078431', '1')
    // central circle
    this.createCircleSVG(circleNode, 'centralCircle', '4', '', '21.650625', '25.65625')
    circleNode.append('title')
      .text((d) => { return d.name })
    circleNode.append('text')
      .text((d) => { return d.name })
      .attr('tabindex', '-1')


    // Add nodes to the diagram
    const polygonNode = this.svg.select('g.nodes')
      .selectAll('g.node')
      .data(polygonArray, (n) => n.uid)
      .enter().append('g')
      .attr('class','node')
      .attr('transform', currentZoom)
      .attr('type', (d) => { return d.name })
      .on('click', nodeClickHandler)

    // polygon shallow
    this.createPolygonSVG(polygonNode, 'shadow')
    // main polygon
    this.createPolygonSVG(polygonNode, 'main', '1')
    // central circle
    this.createCircleSVG(polygonNode, 'centralCircle', '4', '', '21.650625', '25.65625')
    polygonNode.append('title')
      .text((d) => { return d.name })
    polygonNode.append('text')
      .text((d) => { return d.name })
      .attr('tabindex', '-1')
  }


  createPolygonSVG = (node, className, tabindex) => {
    node.append('polygon')
      .attr('tabindex', tabindex)
      .attr('class', (d) => {
        return `${d.type} ${className}`
      })
      .attr('tabindex', tabindex)
      .attr('points', '21.65075 0.65625 0 13.15625 0 38.15625 21.65075 50.65625 43.30125 38.15625 43.30125 13.15625')
      .call(d3.drag()
        .on('start', this.dragstarted)
        .on('drag', this.dragged)
        .on('end', this.dragended))
  }

  createCircleSVG = (node, className, rad, tabindex, cx, cy) => {
    node.append('circle')
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('r', rad)
      .attr('class', (d) => {
        return `${d.type} ${className}`
      })
      .attr('tabindex', tabindex)
      .call(d3.drag()
        .on('start', this.dragstarted)
        .on('drag', this.dragged)
        .on('end', this.dragended))
  }


  dragstarted =(d) => {
    if (!d3.event.active) this.simulation.alphaTarget(0.2).restart()
    d.fx = d.x
    d.fy = d.y
  }

  dragged = (d) => {
    d.fx = d3.event.x
    d.fy = d3.event.y
  }

  dragended = (d) => {
    if (!d3.event.active) this.simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
  }
}

