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
import 'd3-selection-multi'
import SVG from 'svg.js'
import {dragLinks} from './linkHelper'
import '../../../graphics/topologySprite.svg'

import { NODE_RADIUS, NODE_SIZE } from './constants.js'

export default class NodeHelper {
  /**
   * Helper class to be used by TopologyDiagram.
   *
   * Contains functions to draw and manage nodes in the diagram.
   */
  constructor(svg, nodes, topologyShapes, layoutMap) {
    this.svg = svg
    this.layoutMap = layoutMap
    this.nodes = nodes
    this.topologyShapes = topologyShapes
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
      // accessability--user presses enter key when node has focus
      .on('keypress', (d) => {
        if ( d3.event.keyCode === 32 || d3.event.keyCode === 13) {
          nodeClickHandler(d)
        }
      })

    // node hover
    this.createNodeShapes(nodes, 'shadow')
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
      .attrs(({layout}) => {
        const {type} = layout
        const shape = this.topologyShapes[type] ? this.topologyShapes[type].shape : 'circle'
        const classType = this.topologyShapes[type] ? this.topologyShapes[type].className : 'default'
        let {x, y} = layout.center||{x:0, y:0}
        if (layout.newComer) {
          if (layout.newComer.grid) {
            ({x, y} = layout)
          }
          layout.newComer.displayed = true
        }
        const sz = NODE_SIZE * (layout.scale||1)
        return {
          'xlink:href': `#topologySprite_${shape}`,
          'width': NODE_SIZE,
          'height': NODE_SIZE,
          'tabindex': tabindex,
          'class': `${classType} ${className}`,
          'transform': `translate(${x - sz/2}, ${y - sz/2})`,
        }
      })
      .styles(({layout: {newComer}}) => {
        const opacity = newComer && newComer.grid ? 0:1
        return {
          'opacity': opacity,
          'fill-opacity': opacity
        }
      })
      .call(d3.drag()
        .on('drag', this.dragNode))
  }

  // add circles to nodes that represent mmore then one k8 object
  createCircle = (nodes) => {
    nodes
      .filter(({layout: {showDot}}) => {
        return showDot
      })
      .append('circle')
      .attrs(({layout}) => {
        const {type, center} = layout
        return {
          'r': 4,
          'cx': center.x,
          'cy': center.y,
          'tabindex': -1,
          'class': `${type} centralCircle`,
        }
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
      .attrs(({layout: {textBBox}}) => {
        return {
          'x': textBBox.x,
          'y': textBBox.y,
          'width': textBBox.width,
          'height': textBBox.height,
          'tabindex': -1,
        }
      })
  }

  moveNodes = (transition) => {
    const nodes = this.svg.select('g.nodes').selectAll('g.node')

    // move node shapes
    nodes.selectAll('use')
      .transition(transition)
      .style('opacity', 1)
      .attrs(({layout}) => {
        const {x, y, scale=1} = layout
        const sz = NODE_SIZE*scale
        return {
          'width': sz,
          'height': sz,
          'transform': `translate(${x - sz/2}, ${y - sz/2})`,
        }
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
      .attrs(({layout}) => {
        const {x, y} = layout
        return {
          'cx': x,
          'cy': y
        }
      })

    // move labels
    this.svg.select('g.nodes').selectAll('g.nodeLabel')
      .each(({layout},i,ns)=>{
        const {x, y, textBBox, scale=1} = layout
        const dy = (NODE_RADIUS*(scale===1?1:scale+.3))
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
          .attrs(() => {
            return {
              'x': x,
              'y': y + dy
            }
          })
        nodeLabel.selectAll('rect')
          .transition(transition)
          .attrs(() => {
            return {
              'x': x - (textBBox.width/2),
              'y': y + dy
            }
          })
        nodeLabel.selectAll('tspan')
          .transition(transition)
          .attr('x', () => {return x})
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
    dragLinks(this.svg, d, this.topologyShapes)
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
      .style('visibility', (s<=0.7 ? 'hidden' : 'visible'))
  }
}
