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
import counterZoom from './counterZoom'
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

  addNodesToDiagram = (currentZoom, nodeClickHandler, nodeDragHandler) => {
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
      .on('click', (d, i, ns)=>{
        nodeClickHandler(d, d3.select(ns[i]))
      })
      // accessability--user presses enter key when node has focus
      .on('keypress', (d, i, ns) => {
        if ( d3.event.keyCode === 32 || d3.event.keyCode === 13) {
          nodeClickHandler(d, d3.select(ns[i]))
        }
      })

    // node shape
    this.createNodeShapes(nodes, nodeDragHandler)

    // node icons--if any
    this.createNodeIcons(nodes)

    // node labels
    if (draw) {
      this.createLabels(draw, nodes)
    }

    // node hover/select shape
    this.createNodeHilites(nodes)
  }

  createNodeHilites = (nodes) => {
    nodes.append('use')
      .attrs(({layout}) => {
        const {type} = layout
        const shape = this.topologyShapes[type] ? this.topologyShapes[type].shape : 'circle'
        return {
          'xlink:href': `#topologySprite_${shape}`,
          'width': NODE_SIZE,
          'height': NODE_SIZE,
          'tabindex': -1,
          'class': 'shadow'
        }
      })
  }

  createNodeShapes = (nodes, nodeDragHandler) => {
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
          'tabindex': 1,
          'class': `shape ${classType}`,
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
        .on('drag', this.dragNode)
        .on('start', ()=>{
          if (nodeDragHandler)
            nodeDragHandler(true)
        })
        .on('end', ()=>{
          if (nodeDragHandler)
            nodeDragHandler(false)
        }))
  }

  // add node icons
  createNodeIcons = (nodes) => {
    nodes
      .filter(({layout: {shapeIcons}}) => {
        return !!shapeIcons
      })
      .append('g')
      .attr('class','nodeIcons')
      .style('opacity', 0)
      .each(({layout},i,ns) => {
        const {shapeIcons} = layout
        d3.select(ns[i])
          .selectAll('use.icon')
          .data(shapeIcons, ({icon}) => {
            return icon
          })
          .enter().append('use')
          .attrs(({icon, classType, width, height}) => {
            return {
              'xlink:href': `#topologySprite_${icon}`,
              'width': width+'px',
              'height': height+'px',
              'pointer-events': 'none', //TODO -- at some point icons may be clickable
              'tabindex': -1,           //TODO --  and if clickable this has to be a 1 for accesibility
              'class': `icon ${classType}`,
            }
          })
      })
  }

  createLabels = (draw, nodes) => {
    // tooltip
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
        const nodeLabelGroup = draw.group()

        // white background
        nodeLabelGroup.rect()

        // normal label
        nodeLabelGroup.text((add) => {
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
            add.tspan(layout.info)
              .fill('gray')
              .font({size: 9})
              .addClass('description')
              .newLine()
          }
        })
          .addClass('regularLabel')
          .leading(0.8)
          .x(x)
          .y(y)

        // compact label
        nodeLabelGroup.text((add) => {
          layout.compactLabel.split('\n').forEach((line, idx)=>{
            if (line) {
              add.tspan(line)
                .addClass(idx===0?'first-line':'')
                .addClass('counter-zoom')
                .newLine()
            }
          })
        })
          .addClass('compactLabel')
          .x(x)
          .y(y)


        return nodeLabelGroup.svg()
      })
      .call(d3.drag()
        .on('drag', this.dragNode))

    // determine sizes of white opaque background
      .call(this.layoutBackgroundRect)
  }

  layoutBackgroundRect = (selection) => {
    selection.each(({layout},i,ns) => {
      layout.textBBox = ns[i].getBBox()
      d3.select(ns[i]).select('rect')
        .attrs(({layout: {textBBox}}) => {
          return {
            'x': textBBox.x,
            'y': textBBox.y,
            'width': textBBox.width,
            'height': textBBox.height,
            'tabindex': -1,
          }
        })

    })
  }

  moveNodes = (transition) => {
    const nodeLayer = this.svg.select('g.nodes')

    // move node shapes
    const nodes = nodeLayer.selectAll('g.node')
    nodes.selectAll('use.shape')
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

    // move highlight/select shape
    nodes.selectAll('use.shadow')
      .transition(transition)
      .attrs(({layout}) => {
        const {x, y, scale=1} = layout
        const sz = NODE_SIZE*scale + 20
        return {
          'width': sz,
          'height': sz,
          'transform': `translate(${x - sz/2}, ${y - sz/2})`,
        }
      })

    // move icons
    nodeLayer.selectAll('g.nodeIcons')
      .each(({layout},i,ns)=>{
        const nodeIcons = d3.select(ns[i])
        nodeIcons
          .transition(transition)
          .style('opacity', 1)

        nodeIcons.selectAll('use.icon')
          .transition(transition)
          .attrs(({width, height}) => {   //TODO -- just one centered icon now
            const {x, y} = layout
            return {
              'transform': `translate(${x - width/2}, ${y - height/2})`,
            }
          })
      })

    // move labels
    nodeLayer.selectAll('g.nodeLabel')
      .each(({layout},i,ns)=>{
        const {x, y, textBBox, scale=1} = layout
        const dy = (NODE_RADIUS*(scale===1?1:scale+.3))
        const nodeLabel = d3.select(ns[i])
        nodeLabel
          .selectAll('tspan')
          .classed('hub-label', scale>1)

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

  dragNode = (d, i, ns) => {
    const {layout} = d
    const node = d3.select(ns[i].parentNode)

    // don't consider it dragged until more then 5 pixels away from original
    if (!layout.undragged) {
      layout.undragged = {
        x: layout.x,
        y: layout.y
      }
    }
    layout.x += d3.event.dx
    layout.y += d3.event.dy
    if (Math.hypot(layout.x - layout.undragged.x, layout.y - layout.undragged.y) > 5) {
      // keep dragged distance relative to it section in case the whole section moves
      layout.dragged = {
        x:layout.x-layout.section.x,
        y:layout.y-layout.section.y
      }

      // drag shape
      node.selectAll('use.shape')
        .attr('transform', () => {
          const {x, y, scale=1} = layout
          const sz = NODE_SIZE*scale
          return `translate(${x - sz/2}, ${y - sz/2})`
        })


      // drag hilights
      node.selectAll('use.shadow')
        .attr('transform', () => {
          const {x, y, scale=1} = layout
          const sz = NODE_SIZE*scale + 20
          return `translate(${x - sz/2}, ${y - sz/2})`
        })

      // drag icons
      node.selectAll('use.icon')
        .attrs(({width, height}) => {
          const {x, y} = layout
          return {
            'transform': `translate(${x - width/2}, ${y - height/2})`,
          }
        })

      // drag node label
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

      // drag any connecting links
      dragLinks(this.svg, d, this.topologyShapes)
    }
  }
}

export const counterZoomLabels = (svg, currentZoom) => {
  if (svg) {
    const s = currentZoom.k
    const fontSize = counterZoom(s, 0.35, 0.85, 12, 22)
    const nodes = svg.select('g.nodes')

    // show regular labels
    let showClass, hideClass
    if (s>0.6) {
      showClass = 'regularLabel'
      hideClass = 'compactLabel'
    } else {
      showClass = 'compactLabel'
      hideClass = 'regularLabel'
    }

    // show the label
    const showLabels = nodes
      .selectAll(`text.${showClass}`)
    showLabels
      .style('visibility', 'visible')
    // apply counter zoom font
    showLabels
      .selectAll('tspan.counter-zoom')
      .style('font-size', fontSize+'px')
    // if middle line, make even smaller
    showLabels
      .selectAll('tspan.middle-line')
      .style('font-size', fontSize-(s<=0.7 ? 4 : 0)+'px')
    // hide description at a certain point
    showLabels
      .selectAll('tspan.description')
      .style('visibility', (s<=0.7 ? 'hidden' : 'visible'))
    // if hub, make font even bigger
    showLabels
      .selectAll('tspan.hub-label')
      .style('font-size', fontSize+4+'px')
      .style('font-weight', 'bold')

    // hide compact label if regular should show and vice versa
    nodes
      .selectAll(`text.${hideClass}`)
      .style('visibility', 'hidden')


  }
}

export const getWrappedNodeLabel = (label, width=18, rows=3) => {
  // if too long, add elipse and split the rest
  if (label.length-3>width*rows) {
    if (rows===2) {
      label = label.substr(0, width)+ '...\n' + label.substr(-width)
    } else {
      label = splitLabel(label.substr(0, width*2), width, rows-1)+ '...\n' + label.substr(-width)
    }
  } else {
    label = splitLabel(label, width, rows)
  }
  return label
}

const splitLabel = (label, width, rows) => {
  const lines = []
  let remaining = label
  const brkRange = width/3
  while (remaining.length>width && rows>1) {
    // if close enough, don't wrap
    if (remaining.length<width+3) {
      lines.push(remaining)
      remaining = ''
    } else {
      let brk = remaining.substr(width-brkRange, brkRange*2).search(/[^A-Za-z0-9]/)
      if (brk!==-1) {
        brk = width+brk-(brkRange-1)
        lines.push(remaining.substr(0, brk))
        remaining = remaining.substr(brk)
      } else {
        // else force a wrap
        lines.push(remaining.substr(0, width)+(remaining.length>width?'-':''))
        remaining = remaining.substr(width)
      }
    }
    rows-=1
  }
  if (remaining.length) {
    lines.push(remaining)
  }
  return lines.join('\n')

}
