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
import {counterZoom} from './otherHelpers'
import '../../../graphics/diagramShapes.svg'

import { SearchResult, RELATED_OPACITY, NODE_RADIUS, NODE_SIZE } from './constants.js'

export default class NodeHelper {
  /**
   * Helper class to be used by TopologyDiagram.
   *
   * Contains functions to draw and manage nodes in the diagram.
   */
  constructor(svg, nodes, typeToShapeMap, layoutMap) {
    this.svg = svg
    this.layoutMap = layoutMap
    this.nodes = nodes
    this.typeToShapeMap = typeToShapeMap
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
      .style('opacity', 0.0)
      .on('click', (d)=>{
        nodeClickHandler(d)
      })
      // accessability--user presses enter key when node has focus
      .on('keypress', (d) => {
        if ( d3.event.keyCode === 32 || d3.event.keyCode === 13) {
          nodeClickHandler(d)
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
        const shape = this.typeToShapeMap[type] ? this.typeToShapeMap[type].shape : 'circle'
        return {
          'xlink:href': `#diagramShapes_${shape}`,
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
        const shape = this.typeToShapeMap[type] ? this.typeToShapeMap[type].shape : 'circle'
        const classType = this.typeToShapeMap[type] ? this.typeToShapeMap[type].className : 'default'
        //layout.newComer) {
        return {
          'xlink:href': `#diagramShapes_${shape}`,
          'width': NODE_SIZE,
          'height': NODE_SIZE,
          'tabindex': 1,
          'class': `shape ${classType}`,
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
              'xlink:href': `#diagramShapes_${icon}`,
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
      .html(({layout})=>{
        const nodeLabelGroup = draw.group()

        // white background
        nodeLabelGroup.rect()

        // normal label
        nodeLabelGroup.text((add) => {
          layout.label.split('\n').forEach((line, idx)=>{
            if (line) {
              add.tspan(line)
                .addClass(idx===0?'first-line':'')
                .addClass('counter-zoom')
                .newLine()
            }
          })
          if (layout.description) {
            add.tspan(layout.description)
              .fill('gray')
              .font({size: 9})
              .addClass('description')
              .newLine()
          }
        })
          .addClass('regularLabel')
          .leading(1)

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

  moveNodes = (transition, currentZoom, searchChanged) => {
    const nodeLayer = this.svg.select('g.nodes')

    // move node shapes
    const nodes = nodeLayer.selectAll('g.node')
      .styles(({layout}) => {

        // set opacity to 0 if search changed or node moved
        // we will transition it back when in new position
        let opacity = 1.0
        const {x, y, lastPosition, search=SearchResult.nosearch} = layout
        if (!lastPosition || (lastPosition &&
            (Math.abs(lastPosition.x-x)>10 ||
                Math.abs(lastPosition.y-y)>10))) {
          opacity = 0.1
        }
        layout.lastPosition = {x, y}

        return {
          'visibility': (search!==SearchResult.nomatch)?'visible':'hidden',
          'opacity': searchChanged ? 0.0 : (search===SearchResult.related ? RELATED_OPACITY : opacity)
        }
      })
      .attr('transform', currentZoom)

    nodes
      .transition(transition)
      .styles(({layout:{search=SearchResult.nosearch}}) => {
        return {
          'opacity': search===SearchResult.related ? RELATED_OPACITY : 1.0
        }
      })

    // clean up any selections if search changed
    if (searchChanged) {
      nodes
        .classed('selected', ({layout})=>{
          layout.selected = false
          return false
        })
    }

    // if name search only position visible nodes
    const visible = nodes.filter(({layout: {search=SearchResult.nosearch}})=>{
      return (search===SearchResult.nosearch||search!==SearchResult.nomatch)
    })
      .classed('selected', ({layout})=>{
        const {search=SearchResult.nosearch, selected} = layout
        if (search===SearchResult.matched || selected) {
          return true
        }
        return false
      })

    visible.selectAll('use.shape')
      .attrs(({layout}) => {
        const {x, y, scale=1} = layout
        const sz = NODE_SIZE*scale
        return {
          'width': sz,
          'height': sz,
          'transform': `translate(${x- sz/2}, ${y - sz/2})`,
        }
      })

    // move highlight/select shape
    visible.selectAll('use.shadow')
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

        nodeIcons.selectAll('use.icon')
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

        nodeLabel.selectAll('text')
          .attrs(() => {
            return {
              'x': x,
              'y': y + dy
            }
          })
        nodeLabel.selectAll('rect')
          .attrs(() => {
            return {
              'x': x - (textBBox.width/2),
              'y': y + dy
            }
          })
        nodeLabel.selectAll('tspan')
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
      dragLinks(this.svg, d, this.typeToShapeMap)
    }
  }
}

export const setSelections = (svg, selected) => {
  svg.select('g.nodes').selectAll('g.node')
    .classed('selected', ({layout})=>{
      layout.search = SearchResult.nosearch
      layout.selected = selected && selected.uid===layout.uid
      return layout.selected
    })
}

// interrupt any transition and make sure it has its final value
export const interruptNodes = (svg) => {
  svg.select('g.nodes').selectAll('g.node').interrupt().call((selection)=>{
    selection.each(({layout:{search=SearchResult.nosearch}},i,ns) => {
      d3.select(ns[i]).style('opacity', (search===SearchResult.related ? RELATED_OPACITY : 1.0))
    })
  })
}

export const counterZoomLabels = (svg, currentZoom) => {
  if (svg) {
    const s = currentZoom.k
    const fontSize = counterZoom(s, 0.35, 0.85, 12, 22)

    // show regular labels
    let showClass, hideClass
    if (s>0.6) {
      showClass = 'regularLabel'
      hideClass = 'compactLabel'
    } else {
      showClass = 'compactLabel'
      hideClass = 'regularLabel'
    }

    // set label visibility based on search or zoom
    svg.select('g.nodes').selectAll('g.nodeLabel')
      .each(({layout: {search=SearchResult.nosearch}},i,ns)=>{
        const nodeLabel = d3.select(ns[i])

        // not in search mode, selectively show labels based on zoom
        let shownLabel
        if (search===SearchResult.nosearch) {
          shownLabel = nodeLabel
            .selectAll(`text.${showClass}`)
          shownLabel
            .style('visibility',  'visible')
          // hide description at a certain point
          shownLabel
            .selectAll('tspan.description')
            .style('visibility', (s<=0.7 ? 'hidden' : 'visible'))

          // hide compact label if regular should show and vice versa
          nodeLabel
            .selectAll(`text.${hideClass}`)
            .style('visibility', 'hidden')

        } else {
        // show labels only if matched or related
        // if match, always show regular label and hide compact
          shownLabel = nodeLabel
            .selectAll('text.regularLabel')
            .style('visibility',  ()=>{
              return search!==SearchResult.nomatch?'visible':'hidden'
            })
          // always show description if a match
          nodeLabel
            .selectAll('tspan.description')
            .style('visibility',  ()=>{
              return search!==SearchResult.nomatch?'visible':'hidden'
            })

          nodeLabel
            .selectAll('text.compactLabel')
            .style('visibility',  'hidden')
        }

        // counter zoom whatever is still visible
        // apply counter zoom font
        shownLabel
          .selectAll('tspan.counter-zoom')
          .style('font-size', fontSize+'px')
        // if hub, make font even bigger
        shownLabel
          .selectAll('tspan.hub-label')
          .style('font-size', fontSize+4+'px')
          .style('font-weight', 'bold')
        // if description make smaller
        shownLabel
          .selectAll('tspan.description')
          .style('font-size', fontSize-2+'px')
      })
  }
}
