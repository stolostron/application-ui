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
import '../../../graphics/topologySprite.svg'

import { NODE_RADIUS, NODE_SIZE } from './constants.js'

export default class NodeHelper {
  /**
   * Helper class to be used by TopologyDiagram.
   *
   * Contains functions to draw and manage nodes in the diagram.
   */
  constructor(svg, nodes, topologyShapes, linkHelper, layoutMap) {
    this.svg = svg
    this.layoutMap = layoutMap
    this.nodes = nodes
    this.topologyShapes = topologyShapes
    this.linkHelper = linkHelper

    // create self link path
    const lineFunction = d3.line()
      .x(d=>d.x)
      .y(d=>d.y)
      .curve(d3.curveBundle)
    this.selfLinkPath = lineFunction([{x:0, y:0},{x:-20, y:-70},{x:-70, y:15},{x:0, y:0}])
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
    const draw = typeof SVG === 'function' ? SVG(document.createElementNS('http://www.w3.org/2000/svg', 'svg')) : undefined
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
        nodeClickHandler(d)
      })

    // node hover
    this.createNodeShapes(nodes, 'shadow')
    // link to self--create before shape so shape covers it
    this.createLinkToSelf(nodes)
    // node shape
    this.createNodeShapes(nodes, 'main', '1')
    // central circle
    this.createCircle(nodes)

    // Add node labels to diagram
    if (draw) {
      this.createLabels(draw, nodes)
    }
  }

  createNodeShapes = (nodes, className, tabindex=-1) => {
    nodes.append('use')
      .attr('href', ({layout: {type}})=>{
        const shape = this.topologyShapes[type] ? this.topologyShapes[type].shape : 'circle'
        return `#topologySprite_${shape}`
      })
      .attr('width', NODE_SIZE)
      .attr('height', NODE_SIZE)
      .attr('tabindex', tabindex)
      .attr('class', ({layout: {type}}) => {
        type = this.topologyShapes[type] ? this.topologyShapes[type].className : 'default'
        return `${type} ${className}`
      })
      .style('opacity', ({layout: {newComer}}) => {
        return newComer && newComer.grid ? 0:1
      })
      .style('fill-opacity', ({layout: {newComer}}) => {
        return newComer && newComer.grid ? 0:1
      })
      .attr('transform', ({layout}) => {
        let {x, y} = layout.center||{x:0, y:0}
        if (layout.newComer) {
          if (layout.newComer.grid) {
            ({x, y} = layout)
          }
          layout.newComer.displayed = true
        }
        const sz = NODE_SIZE * (layout.scale||1)
        return `translate(${x - sz/2}, ${y - sz/2})`
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
  }

  // add a circular link to self
  createLinkToSelf = (nodes) => {
    const selfLinkNodes =
      nodes
        .filter((node) => {
          return node.hasLinkToSelf
        })

    // link
    selfLinkNodes
      .append('path')
      .attr('d', this.selfLinkPath)
      .attr('class', 'loop')
      .attr('tabindex', -1)
      .attr('transform', ({layout}) => {
        const {x, y} = layout.center||{x:0, y:0}
        return `translate(${x}, ${y})`
      })

    // arrow
    selfLinkNodes
      .append('polygon')
      .attr('class', 'directionDecorator')
      .attr('points', ({layout}) => {
        const radius = NODE_RADIUS + (layout.target && layout.target.isHub ? 10 : 0)
        return `0,${radius}, -4,${radius + 7}, 4,${radius + 7}`
      })
      .attr('transform', ({layout}) => {
        const {x, y} = layout.center
        return `translate(${x}, ${y})`
      })
  }

  createLabels = (draw, nodes) => {
    nodes.append('title')
      .text((d) => { return d.name })

    // create label
    nodes.append('g')
      .attr('class','nodeLabel')
      .style('opacity', ({layout: {newComer}}) => (newComer && newComer.grid ? 0:1))
      .html(({layout})=>{
        const {center={x:0, y:0}, newComer} = layout
        let scale = 1
        let {x, y} = center
        if (newComer && newComer.grid) {
          ({x, y, scale=1} = layout)
          y += (NODE_RADIUS*scale)
        }
        var text = draw.text((add) => {
          layout.label.split('\n').forEach((line, idx, arr)=>{
            if (line) {
              const middleLine = idx!=0&&idx!==arr.length-1
              add.tspan(line)
                .addClass(idx===0?'first-line':'')
                .addClass(!middleLine?'counter-zoom':'')
                .addClass(middleLine?'middle-line':'')
                .newLine()
            }
          })
          if (layout.info) {
            add.tspan(layout.info).fill('gray').font({size: 9}).addClass('opacity-zoom').newLine()
          }
        })
        text
          .leading(0.8)
          .x(x)
          .y(y)
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
    const nodes = this.svg.select('g.nodes').selectAll('g.node')

    // move node shapes
    nodes.selectAll('use')
      .transition(transition)
      .style('opacity', 1)
      .attr('width', ({layout:{scale=1}}) => {
        return NODE_SIZE*scale
      })
      .attr('height', ({layout:{scale=1}}) => {
        return NODE_SIZE*scale
      })
      .attr('transform', ({layout}) => {
        const {x, y, scale=1} = layout
        const sz = NODE_SIZE*scale
        return `translate(${x - sz/2}, ${y - sz/2})`
      })

    // move node self link
    nodes.selectAll('path')
      .transition(transition)
      .attr('transform', ({layout}) => {
        const {x, y} = layout
        return `translate(${x}, ${y})`
      })

    // move self link arrow
    nodes.selectAll('polygon')
      .transition(transition)
      .attr('transform', ({layout}) => {
        const {x, y} = layout
        return `translate(${x}, ${y+5}) rotate(${90})`
      })

    // move center circle
    nodes.selectAll('circle')
      .transition(transition)
      .attr('cx', ({layout}) => { return layout.x })
      .attr('cy', ({layout}) => { return layout.y })

    // move labels
    this.svg.select('g.nodes').selectAll('g.nodeLabel')
      .each(({layout},i,ns)=>{
        const {scale=1} = layout
        const nodeLabel = d3.select(ns[i])
        nodeLabel
          .selectAll('tspan')
          .classed('counter-bigger-zoom', scale>1)

        nodeLabel
          .transition(transition)
          .style('opacity', 1)
          .style('fill-opacity', 1)
        nodeLabel.selectAll('text')
          .transition(transition)
          .style('opacity', 1)
          .attr('x', () => {return layout.x})
          .attr('y', () => {return layout.y + (NODE_RADIUS*scale)})
        nodeLabel.selectAll('rect')
          .transition(transition)
          .attr('x', () => {return layout.x - (layout.textBBox.width/2)})
          .attr('y', () => {return layout.y + (NODE_RADIUS*scale) + 2})
        nodeLabel.selectAll('tspan')
          .transition(transition)
          .attr('x', () => {return layout.x})
      })
  }

  setTextBBox = (selection) => {
    selection.each(({layout},i,ns) => {
      layout.textBBox = ns[i].getBBox()
    })
  }

  dragNode = (d, i, ns) => {
    this.svg.interrupt().selectAll('*').interrupt()
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
        const {x, y, scale=1} = layout
        const sz = NODE_SIZE*scale
        return `translate(${x - sz/2}, ${y - sz/2})`
      })

    // drag label
    const nodeLabels = node.selectAll('g.nodeLabel')
    nodeLabels.each((d,i,ns)=>{
      d3.select(ns[i]).selectAll('text')
        .attr('x', () => {return layout.x})
        .attr('y', () => {return layout.y+(NODE_RADIUS*(layout.scale||1))})
      d3.select(ns[i]).selectAll('rect')
        .attr('x', () => {return layout.x - (layout.textBBox.width/2)})
        .attr('y', () => {return layout.y + (NODE_RADIUS*(layout.scale||1)) + 2})
      d3.select(ns[i]).selectAll('tspan')
        .attr('x', () => {return layout.x})
    })

    // drag any connecting link
    this.linkHelper.dragLinks(d)
  }
}

export const counterZoomLabels = (svg, currentZoom) => {
  if (svg) {
    const s = currentZoom.k
    const fontSize = s<=0.35 ? 22 : (s<=0.45 ? 20 : (s<=0.65? 18:(s<=0.85? 14: 12)))
    svg
      .selectAll('tspan.counter-zoom')
      .style('font-size', fontSize+'px')
    svg
      .selectAll('tspan.first-line.counter-bigger-zoom')
      .style('font-size', fontSize+4+'px')
      .style('font-weight', 'bold')
    svg
      .selectAll('tspan.middle-line')
      .style('font-size', fontSize-(s<=0.7 ? 4 : 0)+'px')
    svg
      .selectAll('tspan.opacity-zoom')
      .style('opacity', (s<=0.7 ? 0 : 1))
  }
}
