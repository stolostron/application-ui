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
import config from '../../../lib/shared/config'

import { NODE_RADIUS, NODE_SIZE } from './constants.js'

export default class NodeHelper {
  /**
   * Helper class to be used by TopologyDiagram.
   *
   * Contains functions to draw and manage nodes in the diagram.
   */
  constructor(svg, nodes, topologyShapes, linkHelper, cyMap, hiliteSelectMap, resetHighlightMode) {
    this.svg = svg
    this.cyMap = cyMap
    this.hiliteSelectMap = hiliteSelectMap
    this.nodes = nodes
    this.topologyShapes = topologyShapes
    this.linkHelper = linkHelper
    this.resetHighlightMode = resetHighlightMode
  }


  /**
   * Remove nodes that aren't in the current nodeData array.
   */
  removeOldNodesFromDiagram = () => {
    this.svg.select('g.nodes')
      .selectAll('g.node')
      .data(this.nodes.filter(d=>{return !!d.layout}), n => {
        return n.layout ? n.layout.uid : ''
      })
      .exit().remove()
  }

  addNodesToDiagram = (currentZoom, nodeClickHandler) => {
    const draw = SVG(document.createElementNS('http://www.w3.org/2000/svg', 'svg'))
    const filteredNodes = this.nodes.filter(node => !!node.layout)

    // Add node groups to diagram
    const nodes = this.svg.select('g.nodes')
      .selectAll('g.node')
      .data(filteredNodes, n => {
        return n.layout.uid
      })
      .enter().append('g')
      .attr('class','node')
      .attr('transform', currentZoom)
      .attr('type', (d) => { return d.name })
      .on('click', (d)=>{
        this.highlightNodes(d)
        nodeClickHandler(d)
      })

    // node hover
    this.createNodeShapes(nodes, 'shadow')
    // node shape
    this.createNodeShapes(nodes, 'main', '1')
    // central circle
    this.createCircle(nodes)

    // Add node labels to diagram
    this.createLabels(draw, nodes)

    // unhighlite shapes
    this.svg
      .on('click', ()=>{
        this.highlightNodes()
      })
  }

  createNodeShapes = (nodes, className, tabindex=-1) => {
    nodes.append('use')
      .attr('xlink:href', ({layout: {type}})=>{
        const shape = this.topologyShapes[type] ? this.topologyShapes[type].shape : 'circle'
        return `${config.contextPath}/graphics/topologySprite.svg#${shape}`
      })
      .attr('width', NODE_SIZE)
      .attr('height', NODE_SIZE)
      .attr('tabindex', tabindex)
      .attr('class', ({layout: {type}}) => {
        type = this.topologyShapes[type] ? this.topologyShapes[type].className : 'default'
        return `${type} ${className}`
      })
      .attr('transform', ({layout}) => {
        if (layout.center) {
          const {x, y} = layout.center
          return `translate(${x - NODE_SIZE/2}, ${y - NODE_SIZE/2})`
        }
      })
      .call(d3.drag()
        .on('drag', this.dragNode))
  }

  // add circles to nodes that represent mmore then one k8 object
  createCircle = (nodes) => {
    nodes
      .filter(({layout: {hasContent}}) => {
        return hasContent
      })
      .append('circle')
      .attr('r', 4)
      .attr('class', ({layout}) => {
        return `${layout.type} centralCircle`
      })
      .attr('tabindex', -1)
      .attr('cx', ({layout}) => { return layout.center.x })
      .attr('cy', ({layout}) => { return layout.center.y })
      .call(d3.drag()
        .on('drag', this.dragNode))
  }

  createLabels = (draw, nodes) => {
    nodes.append('title')
      .text((d) => { return d.name })

    // create label
    nodes.append('g')
      .attr('class','nodeLabel')
      .html(({layout})=>{
        const {center={x:0, y:0}} = layout
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
          .x(center.x)
          .y(center.y)
        return text.svg()
      })
      .call(d3.drag()
        .on('drag', this.dragNode))

    // add white opaque background
      .call(this.setTextBBox)
      .insert('rect','text')
      .attr('x', ({layout}) => layout.textBBox.x)
      .attr('y', ({layout}) => layout.textBBox.y)
      .attr('width', ({layout}) => layout.textBBox.width)
      .attr('height', ({layout}) => layout.textBBox.height)
      .attr('tabindex', '-1')
  }

  moveNodes = (transition) => {
    // move nodes
    const nodes = this.svg.select('g.nodes').selectAll('g.node')
    nodes.selectAll('use')
      .interrupt()
      .transition(transition)
      .attr('transform', ({layout}) => {
        const {x, y} = layout
        return `translate(${x - NODE_SIZE/2}, ${y - NODE_SIZE/2})`
      })
    nodes.selectAll('circle')
      .interrupt()
      .transition(transition)
      .attr('cx', ({layout}) => { return layout.x })
      .attr('cy', ({layout}) => { return layout.y })

    // move labels
    this.svg.select('g.nodes').selectAll('g.nodeLabel')
      .each(({layout},i,ns)=>{
        d3.select(ns[i]).selectAll('text')
          .interrupt()
          .transition(transition)
          .attr('x', () => {return layout.x})
          .attr('y', () => {return layout.y+NODE_RADIUS})
        d3.select(ns[i]).selectAll('rect')
          .interrupt()
          .transition(transition)
          .attr('x', () => {return layout.x - (layout.textBBox.width/2)})
          .attr('y', () => {return layout.y + NODE_RADIUS + 2})
        d3.select(ns[i]).selectAll('tspan')
          .interrupt()
          .transition(transition)
          .attr('x', () => {return layout.x})
      })
  }

  setTextBBox = (selection) => {
    selection.each(({layout},i,ns) => {
      layout.textBBox = ns[i].getBBox()
    })
  }

  highlightNodes = (node) => {
    const opacity = 0.15
    const nodeSet = new Set()
    const edgeSet = new Set()
    let highlight = false
    if (node) {
      highlight = this.hiliteSelectMap[node.layout.uid]
      if (highlight) {
        const {elements, ele} = this.cyMap[node.layout.uid]
        if (elements.nodes().length>3) {
          nodeSet.add(node.layout.uid)
          ele.successors()
            .add(ele.predecessors())
            .forEach(ele=>{
              const data = ele.data()
              if (ele.isNode()) {
                nodeSet.add(data.node.layout.uid)
              } else {
                edgeSet.add(data.edge.uid)
              }
            })
          highlight = edgeSet.size>0
        }
      }
    } else {
      this.resetHighlightMode()
    }
    this.svg.select('g.nodes').selectAll('g.node')
      .interrupt()
      .style('opacity', ({layout}) => {
        return highlight && !nodeSet.has(layout.uid) ? opacity : 1.0
      })

    // highlight links
    this.linkHelper.highlightLinks(highlight, edgeSet, opacity)
  }

  dragNode = (d, i, ns) => {
    const {layout} = d
    const node = d3.select(ns[i].parentNode)
    layout.x += d3.event.dx
    layout.y += d3.event.dy
    layout.dragged = {x:layout.x, y:layout.y}

    // drag circle
    node.selectAll('circle')
      .attr('cx', layout.x)
      .attr('cy', layout.y)

    // drag polygons
    node.selectAll('use')
      .attr('transform', () => {
        const x = layout.x
        const y = layout.y
        return `translate(${x - NODE_SIZE/2}, ${y - NODE_SIZE/2})`
      })

    // drag label
    const nodeLabels = node.selectAll('g.nodeLabel')
    nodeLabels.each((d,i,ns)=>{
      d3.select(ns[i]).selectAll('text')
        .attr('x', () => {return layout.x})
        .attr('y', () => {return layout.y+NODE_RADIUS})
      d3.select(ns[i]).selectAll('rect')
        .attr('x', () => {return layout.x - (layout.textBBox.width/2)})
        .attr('y', () => {return layout.y + NODE_RADIUS + 2})
      d3.select(ns[i]).selectAll('tspan')
        .attr('x', () => {return layout.x})
    })

    // drag any connecting link
    this.linkHelper.dragLinks(d)
  }
}

