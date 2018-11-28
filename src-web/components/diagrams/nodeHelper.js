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
import {counterZoom, getTooltip} from '../../../lib/client/diagram-helper'
import '../../../graphics/diagramShapes.svg'
import '../../../graphics/diagramIcons.svg'

import { FilterResults, RELATED_OPACITY, NODE_RADIUS, NODE_SIZE } from './constants.js'

export const tooltip = d3.select('body').append('div')
  .attr('class', 'tooltip')
  .styles(()=>{
    return {
      'display': 'none',
      'opacity': 0
    }
  })

export default class NodeHelper {
  /**
   * Helper class to be used by TopologyDiagram.
   *
   * Contains functions to draw and manage nodes in the diagram.
   */
  constructor(svg, nodes, typeToShapeMap, getClientRect) {
    this.svg = svg
    this.nodes = nodes
    this.typeToShapeMap = typeToShapeMap
    this.getClientRect = getClientRect
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
        tooltip.style('display', 'none')
        nodeClickHandler(d)
      })
      // accessability--user presses enter key when node has focus
      .on('keypress', (d) => {
        if ( d3.event.keyCode === 32 || d3.event.keyCode === 13) {
          tooltip.style('display', 'none')
          nodeClickHandler(d)
        }
      })
      // tooltip
      .on('mouseover', ({layout}, i, ns) => {
        const bb = ns[i].getBoundingClientRect()
        tooltip.style('display', undefined)
        tooltip.transition()
          .duration(200)
          .style('opacity', 1)
        tooltip.html(()=>{
          return getTooltip(layout.tooltips)
        })
          .styles((d, j, ts)=>{
            const {width, height} = ts[j].getBoundingClientRect()
            let top = bb.top+32
            if (top+height > this.getClientRect().bottom) {
              top = bb.top - height
            }
            return {
              'top': top + 'px',
              'left': (bb.left-width/2+30) + 'px',
            }
          })
      })
      .on('mouseout', () => {
        tooltip.transition()
          .duration(1000)
          .style('opacity', 0)
          .on('end', ()=>{
            tooltip.style('display', 'none')
          })
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
      .attrs((d) => {
        const {layout} = d
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
      .filter(({layout: {nodeIcons}}) => {
        return !!nodeIcons
      })
      .append('g')
      .attr('class','nodeIcons')
      .each(({layout},i,ns) => {
        const {nodeIcons} = layout
        d3.select(ns[i])
          .selectAll('use.icon')
          .data(nodeIcons, ({icon}) => {
            return icon
          })
          .enter().append('use')
          .attrs(({icon, classType, width, height}) => {
            return {
              'xlink:href': `#diagramIcons_${icon}`,
              'width': width+'px',
              'height': height+'px',
              'pointer-events': 'none',
              'tabindex': -1,
              'class': `icon ${classType}`,
            }
          })
      })
  }

  createLabels = (draw, nodes) => {
    // create label
    nodes.append('g')
      .attr('class','nodeLabel')
      .html(({layout})=>{
        const nodeLabelGroup = draw.group()

        // white background
        nodeLabelGroup.rect()

        // normal label
        nodeLabelGroup.text((add) => {
          layout.label.split('\n').forEach((line)=>{
            if (line) {
              add.tspan(line)
                .addClass('counter-zoom beg')
                .newLine()
            }
          })
          if (layout.description) {
            add.tspan(layout.description)
              .fill('gray')
              .font({size: 9})
              .addClass('description beg')
              .newLine()
          }
        })
          .addClass('regularLabel')
          .leading(1)

        // compact label
        nodeLabelGroup.text((add) => {
          layout.compactLabel.split('\n').forEach((line)=>{
            if (line) {
              add.tspan(line)
                .addClass('counter-zoom beg')
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
        const {x, y, lastPosition, search=FilterResults.nosearch} = layout
        if (!lastPosition || (lastPosition &&
            (Math.abs(lastPosition.x-x)>10 ||
                Math.abs(lastPosition.y-y)>10))) {
          opacity = 0.1
        }
        layout.lastPosition = {x, y}

        return {
          'visibility': (search===FilterResults.hidden) ? 'hidden' : 'visible',
          'opacity': searchChanged ? 0.0 : (search===FilterResults.related ? RELATED_OPACITY : opacity)
        }
      })
      .attr('transform', currentZoom)

    nodes
      .transition(transition)
      .styles(({layout:{search=FilterResults.nosearch}}) => {
        return {
          'opacity': search===FilterResults.related ? RELATED_OPACITY : 1.0
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
    const visible = nodes.filter(({layout: {search=FilterResults.nosearch}})=>{
      return (search!==FilterResults.hidden)
    })
      .classed('selected', ({layout})=>{
        const {search=FilterResults.nosearch, selected} = layout
        if (search===FilterResults.matched || selected) {
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
          .attrs(({width, height}) => {
            if (!layout.nodeIcons) {
              return {
                'visibility': 'hidden',
              }
            } else {
              const {x, y} = layout
              return {
                'visibility': 'visible',
                'transform': `translate(${x - width/2}, ${y - height/2})`,
              }
            }
          })
      })

    // move labels
    moveLabels(this.svg)
  }

  dragNode = (d, i, ns) => {
    const {layout} = d
    const node = d3.select(ns[i].parentNode)
    tooltip.style('display', 'none')

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
      layout.search = FilterResults.nosearch
      layout.selected = selected && selected.uid===layout.uid
      return layout.selected
    })
}

// interrupt any transition and make sure it has its final value
export const interruptNodes = (svg) => {
  svg.select('g.nodes').selectAll('g.node').interrupt().call((selection)=>{
    selection.each(({layout},i,ns) => {
      if (layout) {
        const {search=FilterResults.nosearch} = layout
        d3.select(ns[i]).style('opacity', (search===FilterResults.related ? RELATED_OPACITY : 1.0))
      }
    })
  })
}

// counter zoom labels-- if smaller, show an abreviated smaller label
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
      .each(({layout: {search=FilterResults.nosearch}},i,ns)=>{
        const nodeLabel = d3.select(ns[i])

        // not in search mode, selectively show labels based on zoom
        let shownLabel
        if (search===FilterResults.nosearch) {
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
              return search===FilterResults.hidden?'hidden':'visible'
            })
          // always show description if a match
          nodeLabel
            .selectAll('tspan.description')
            .style('visibility',  ()=>{
              return search===FilterResults.hidden?'hidden':'visible'
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
        // if description make smaller
        shownLabel
          .selectAll('tspan.description')
          .style('font-size', fontSize-2+'px')

        // fix leading between lines
        shownLabel.selectAll('tspan.beg')
          .each((d,j,ts)=>{
            ts[j].setAttribute('dy', fontSize)
          })
      })
  }
}

// during search mode, show match in label in boldface
export const showMatches = (svg, searchNames) => {
  if (svg) {
    searchNames = searchNames.filter(s=>!!s)
    const draw = typeof SVG === 'function' ? SVG(document.createElementNS('http://www.w3.org/2000/svg', 'svg')) : undefined
    svg.select('g.nodes').selectAll('g.nodeLabel')
      .each((d,i,ns)=>{
        const {name, layout} = d
        const {x, y, scale=1, label, search=FilterResults.nosearch} = layout
        if (search!==FilterResults.hidden && x && y) {
          const regex = new RegExp(`(${searchNames.join('|')})`, 'g')
          const acrossLines = search===FilterResults.match && label.split(regex).length<=1
          d3.select(ns[i])
            .selectAll('text.regularLabel')
            .each((d,j,ln)=>{
              ln[j].outerHTML = draw.text((add) => {
                const lines = label.split('\n').map((line,idx)=>{
                  if (search===FilterResults.match) {
                    // if match falls across label lines, put result in middle line
                    if (acrossLines) {
                      if (idx===1) {
                        return name.split(regex)
                          .filter(str=>searchNames.indexOf(str)!==-1)
                          .concat(line.substr(searchNames[0].length))
                      } else {
                        return [line]
                      }
                    } else {
                      return line.split(regex).filter(s=>!!s)
                    }
                  } else {
                    return [line]
                  }
                })
                lines.forEach((strs)=>{
                  strs.forEach((str, idx)=>{
                    const tspan = add.tspan(str)
                    if (searchNames.indexOf(str)!==-1) {
                      tspan
                        .addClass('matched')
                    }
                    tspan
                      .addClass('counter-zoom')
                    if (scale>1) {
                      tspan
                        .addClass('hub-label')
                    }
                    if (idx===0) {
                      tspan
                        .addClass('beg')
                        .newLine()
                    }
                  })
                })
              })
                .addClass('regularLabel')
                .svg()
            })
        }
      })
    moveLabels(svg)
  }
}

export const moveLabels = (svg) => {
  svg.select('g.nodes').selectAll('g.nodeLabel')
    .filter(({layout: {x, y}}) => {
      return x!==undefined && y!==undefined
    })
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
      nodeLabel.selectAll('tspan.beg')
        .attr('x', () => {return x})
    })
}
