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
import SVG from 'svg.js'

const polygonTypes = ['cluster', 'service']


export default class NodeHelper {
  /**
   * Helper class to be used by TopologyDiagram.
   *
   * Contains functions to draw and manage nodes in the diagram.
   */
  constructor(svg, nodes, linkHelper) {
    this.svg = svg
    this.nodes = nodes
    this.linkHelper = linkHelper
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
    const circleArray = this.nodes.filter(node => node.layout && !polygonTypes.includes(node.layout.type))
    const polygonArray = this.nodes.filter(node => node.layout && polygonTypes.includes(node.layout.type))
    const draw = SVG(document.createElementNS('http://www.w3.org/2000/svg', 'svg'))

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
    this.createCircleSVG(circleNode, 'centralCircle', '4')
    // add label
    this.createLabel(draw, circleNode)

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
    // add label
    this.createLabel(draw, polygonNode)
  }


  createPolygonSVG = (node, className, tabindex=-1) => {
    node.append('polygon')
      .attr('points', '21.65075 0.65625 0 13.15625 0 38.15625 21.65075 50.65625 43.30125 38.15625 43.30125 13.15625')
      .attr('tabindex', tabindex)
      .attr('class', ({layout}) => {
        return `${layout.type} ${className}`
      })
      .call(d3.drag()
        .on('drag', this.dragNode))
  }

  createCircleSVG = (node, className, rad, tabindex=-1) => {
    node.append('circle')
      .attr('r', rad)
      .attr('class', ({layout}) => {
        return `${layout.type} ${className}`
      })
      .attr('tabindex', tabindex)
      .call(d3.drag()
        .on('drag', this.dragNode))
  }

  createLabel = (draw, node) => {
    node.append('title')
      .text((d) => { return d.name })
    node.append('g')
      .attr('class','nodeLabel')
      .html(({layout})=>{
        var text = draw.text((add) => {
          layout.label.split('\n').forEach(line=>{
            if (line) {
              add.tspan(line).newLine()
            }
          })
          if (layout.info) {
            add.tspan(layout.info).fill('gray').font({size: 9}).newLine()
          }
        })
        text
          .leading(0.8)
        return text.svg()
      })
      .attr('tabindex', '-1')
  }

  moveNodes = (transition) => {
    // center nodes that have no position yet
    this.centerNodes()

    // position nodes and labels
    const nodes = this.svg.select('g.nodes').selectAll('g.node')
    nodes.selectAll('polygon')
      .transition(transition)
      .attr('transform', ({layout}) => {
        const {x, y} = layout
        return `translate(${x - 21.650625}, ${y - 25.65625})`
      })
    nodes.selectAll('circle')
      .transition(transition)
      .attr('cx', ({layout}) => { return layout.x })
      .attr('cy', ({layout}) => { return layout.y })

    this.svg.select('g.nodes').selectAll('g.nodeLabel')
      .each(({layout},i,ns)=>{
        d3.select(ns[i]).selectAll('text')
          .transition(transition)
          .attr('x', () => {return layout.x})
          .attr('y', () => {return layout.y+(polygonTypes.includes(layout.type)?24:20)})
        d3.select(ns[i]).selectAll('tspan')
          .transition(transition)
          .attr('x', () => {return layout.x})
      })
  }

  // center everything so transition zooms out from center
  centerNodes = () => {
    const nodes = this.svg.select('g.nodes').selectAll('g.node')
      .filter(({layout})=>{return !layout.positioned})
    nodes.selectAll('polygon')
      .attr('transform', ({layout}) => {
        const {x, y} = layout.center
        return `translate(${x - 21.650625}, ${y - 25.65625})`
      })
    nodes.selectAll('circle')
      .attr('cx', ({layout}) => { return layout.center.x })
      .attr('cy', ({layout}) => { return layout.center.y })

    this.svg.select('g.nodes').selectAll('g.nodeLabel')
      .filter(({layout})=>{return !layout.positioned})
      .each(({layout},i,ns)=>{
        d3.select(ns[i]).selectAll('text')
          .attr('x', () => {return layout.center.x})
          .attr('y', () => {return layout.center.y})
        d3.select(ns[i]).selectAll('tspan')
          .attr('x', () => {return layout.center.x})
      })
    nodes.each(({layout})=>{
      layout.positioned = true
    })
  }

  dragNode = (d, i, ns) => {
    let {layout} = d
    let node = d3.select(ns[i].parentNode)
    layout.x += d3.event.dx
    layout.y += d3.event.dy
    layout.dragged = {x:layout.x, y:layout.y}

    // drag circle
    node.selectAll('circle')
      .attr('cx', layout.x)
      .attr('cy', layout.y)

    // drag polygons
    node.selectAll('polygon')
      .attr('transform', () => {
        let x = layout.x
        let y = layout.y
        return `translate(${x - 21.650625}, ${y - 25.65625})`
      })

    // drag label
    const nodeLabels = node.selectAll('g.nodeLabel')
    nodeLabels.each((d,i,ns)=>{
      d3.select(ns[i]).selectAll('text')
        .attr('x', () => {return layout.x})
        .attr('y', () => {return layout.y+(polygonTypes.includes(layout.type)?24:20)})
      d3.select(ns[i]).selectAll('tspan')
        .attr('x', () => {return layout.x})
    })

    // drag any connecting link
    this.linkHelper.dragLinks(d)
  }
}

