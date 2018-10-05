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
import _ from 'lodash'

import { NODE_RADIUS } from './constants.js'

const lineFunction = d3.line()
  .x(d=>d.x)
  .y(d=>d.y)
  .curve(d3.curveBundle)

export default class LinkHelper {
  /**
   * Helper class to be used by TopologyDiagram.
   *
   * Contains functions to draw and manage links between nodes in the diagram.
   */
  constructor(svg, links, selfLinks, nodes, topologyShapes, topologyOptions) {
    this.links = links.concat(Object.values(selfLinks))
    this.svg = svg
    this.nodeMap = _.keyBy(nodes, 'layout.uid')
    this.topologyShapes = topologyShapes
    this.topologyOptions = topologyOptions
  }

  /**
   * Removes links from the diagram.
   *
   */
  removeOldLinksFromDiagram = () => {
    // filtered list is of the links that still exist
    // if d3 finds a node that doesn't exist in this list, it removes it
    this.svg.select('g.links')
      .selectAll('g.link')
      .data(this.links.filter((link)=>{
        let {source, target} = link
        const {layout} = link
        if (layout) {
          source = layout.source.uid
          target = layout.target.uid
        }
        return layout && this.nodeMap[source] && this.nodeMap[target]
      }), (l) => {
        return l.uid
      }).exit().remove()
  }

  /**
   * Adds new links to the SVG diagram.
   *
   * @param {*} currentZoom
   */
  addLinksToDiagram = (currentZoom) => {
    const links = this.svg.select('g.links')
      .selectAll('g.link')
    // if nodes have been consolidated, a link might not be drawn
      .data(this.links.filter(({layout})=>!!layout), l => {
        return l.uid
      })
      .enter().append('g')
      .attrs({
        'class': 'link',
        'transform': currentZoom
      })

    // add path
    links.append('path')
      .attrs(({layout, uid}) => {
        return {
          d: lineFunction([layout.center,layout.center]),
          id: `link-${uid}`,
          'marker-start': 'url(#squarehead)',
          'marker-end': 'url(#arrowhead)'
        }
      })
      .style('opacity', 0.0)


    // labels
    if (this.topologyOptions.showLineLabels) {
      const labels = this.svg.select('g.labels')
        .selectAll('g.label')
      // if nodes have been consolidated, a link might not be drawn
        .data(this.links.filter(({layout})=>!!layout), l => {
          return l.uid
        })
        .enter().append('g')
        .attrs({
          'class': 'label',
          'transform': currentZoom
        })

      labels.append('text')
        .attr('class', 'linkText')
        .append('textPath')
        .attrs(({uid}) => {
          return {
            'xlink:href': `#link-${uid}`
          }
        })
        .styles({
          'text-anchor': 'middle',
          'opacity': 0.0
        })
        .text((d) => { return d.label })
    }
  }

  moveLinks = (transition) => {
    // don't move looped dragged links
    const links = this.svg.select('g.links').selectAll('g.link').filter(({layout})=>{
      return !layout.isLoop || !layout.source.dragged
    })

    // set link path
    links.selectAll('path')
      .attr('d', ({layout}) => {
        let {linePath} = layout
        if (!linePath) {
          linePath = layout.linePath = lineFunction(layout.lineData)
        }
        return linePath
      })

    // back link away from node so that end markers just touch the shape
    links.selectAll('path')
      .attr('d', ({layout},i,ns) => {
        return getBackedOffPath(ns[i], layout, this.topologyShapes)
      })
      .transition(transition)
      .attr('transform', ({layout}) => {
        const {x, y} = layout.transform ? layout.transform : {x:0, y:0}
        return `translate(${x}, ${y})`
      })
      .style('opacity', 1.0)


    // move line labels
    if (this.topologyOptions.showLineLabels) {
      const labels = this.svg.select('g.labels').selectAll('g.label')
      labels.selectAll('text')
        .selectAll('textPath')
        .transition(transition)
        .text(({layout={}, label}) => {
          return layout.isParallel ? '< both >' :
            (layout.isLoop ? label :
              (layout.isSwapped ? `< ${label}` : `${label} >`))
        })
        .attrs(() => {
          return {
            'startOffset': '50%'
          }
        })
        .style('opacity', ({layout}) => {
          return layout.hidden ? 0.0 : 1.0
        })
    }
  }
}

export const dragLinks = (svg, d, topologyShapes) => {
  svg.select('g.links').selectAll('g.link').each((l,i,ns)=>{
    if (l.layout.source.uid === d.layout.uid || l.layout.target.uid === d.layout.uid) {
      const link = d3.select(ns[i])
      const path = link.selectAll('path')
      const layout = l.layout

      // set node position
      const {isLoop, source, target} = layout
      if (isLoop) {
        source.x = target.x = d.layout.x
        source.y = target.y = d.layout.y
      } else if (source.uid === d.layout.uid) {
        source.x = d.layout.x
        source.y = d.layout.y
      } else {
        target.x = d.layout.x
        target.y = d.layout.y
      }

      // update path
      setDraggedLineData(layout)
      path.attr('d', () => {
        return lineFunction(layout.lineData)
      })
      path.attr('d', ({layout},i,ns) => {
        return getBackedOffPath(ns[i], layout, topologyShapes)
      })
    }
  })
}

export const appendLinkDefs = (svg) => {
  const defs = svg.append('defs')
  defs
    .append('marker')
    .attrs({
      id: 'arrowhead',
      refX: 2,
      refY: 7,
      orient: 'auto',
      markerWidth: 16,
      markerHeight: 16,
      xoverflow: 'visible'
    })
    .append('svg:path')
    .attr('d', 'M2,2 L2,14 L12,7 L2,2')
    .attr('class', 'arrowDecorator')

  defs
    .append('marker')
    .attrs({
      id: 'squarehead',
      refX: 4,
      refY: 4,
      orient: 'auto',
      markerWidth: 7,
      markerHeight: 7,
      xoverflow: 'visible'
    })
    .append('svg:rect')
    .attrs({
      x: '1',
      y: '1',
      width: '5',
      height: '5'
    })
    .attr('class', 'squareDecorator')
}


export const setDraggedLineData = (layout) => {
  // calculate new lineData
  const {isLoop, source, target} = layout
  const {x: sx, y: sy} = source
  const {x: tx, y: ty} = target
  if (isLoop) {
    // path moved
    layout.lineData = getLoopLineData(sx, sy)
  } else {
    // else straighten out line
    layout.lineData = [
      {x: sx, y: sy},
      {x: tx, y: ty}
    ]
  }

  // path was originally created form the node position without transform applied
  // transform was then applied to the path after it was created
  // therefore to counteract that original transform we need to subtract it now
  // because we're now using the actual mouse position of the node
  const {x: xx, y: yy} = layout.transform ? layout.transform : {x:0, y:0}
  layout.lineData.forEach(pt=>{
    pt.x -= xx
    pt.y -= yy
  })
  delete layout.linePath
  delete layout.backedOff
}

export const getBackedOffPath = (svgPath, layout, topologyShapes) => {
  const {lineData, backedOff, source:{isHub:isSrcHub, type:srcType}, target:{isHub:isTgtHub, type:tgtType}} = layout
  let {linePath} = layout
  if (!backedOff) {
    const srcRadius = topologyShapes[srcType].nodeRadius || NODE_RADIUS
    const tgtRadius = topologyShapes[tgtType].nodeRadius || NODE_RADIUS
    lineData[0] = svgPath.getPointAtLength(srcRadius+(isSrcHub?15:0))
    lineData[lineData.length-1] = svgPath.getPointAtLength(
      svgPath.getTotalLength()-tgtRadius-(isTgtHub?15:5))
    linePath = layout.linePath = lineFunction(layout.lineData)
    layout.backedOff = true
  }
  return linePath
}

// do parallel, avoidance, self link layouts
export const layoutEdges = (newLayout, nodes, cyEdges, edges, selfLinks, adapter) => {
  const laidoutEdges = []
  let nodeMap = null
  if (cyEdges.length>0) {
    let preparedColaRouting = false
    nodeMap = _.keyBy(nodes, 'layout.uid')
    cyEdges.forEach(edge=>{
      const {edge: {layout, uid}} = edge.data()

      // set path data on new edges
      // avoidance -- curve around nodes -- we use webcola's line router
      // else just a straight line
      if (!layout.lineData || newLayout) {
        layout.lineData = []
        delete layout.linePath
        delete layout.backedOff
        const {source: {uid: sid}, target: {uid: tid}} = layout
        const colaEdge = edge.scratch().cola
        const {position: {x:x1, y:y1}} = nodeMap[sid]
        const {position: {x:x2, y:y2}} = nodeMap[tid]

        // if cola layout and a line is long, route the line around the nodes
        if (adapter && Math.hypot(x2 - x1, y2 - y1) > NODE_RADIUS*6) {

          if (!preparedColaRouting) {
            adapter.prepareEdgeRouting(20)
            // nodes need inner bounds
            adapter.nodes().forEach(node=>{
              node.innerBounds = node.bounds.inflate(-20)
            })
            preparedColaRouting = true
          }
          layout.lineData = adapter.routeEdge(colaEdge, 0)

        } else {
          // else do nothing--just a straight line
        }

        // add endpoints
        layout.lineData.unshift({x:x1, y:y1})
        layout.lineData.push({x:x2, y:y2})
      }

      laidoutEdges.push({
        layout,
        uid
      })
    })

    // parallel -- two line between same nodes--we just put "both" as the label on the line
    // mark edges that are parellel so we offset them when drawing
    edges.forEach(({source, target})=>{
      edges.forEach(other=>{
        const {source:tgt, target:src, layout} = other
        if (source===src && target===tgt) {
          layout.isParallel = true
        }
      })
    })
  }

  // add self-links
  if (nodes.length) {
    nodeMap = nodeMap || _.keyBy(nodes, 'layout.uid')
    nodes.forEach(({layout: {selfLink}})=>{
      if (selfLink) {
        const {nodeLayout} = selfLink
        const {link: {uid}} = selfLink
        let link = selfLinks[uid]
        if (!link) {
          link = selfLinks[uid] = selfLink.link
        }
        let {layout={}} = link
        if (!layout.lineData || newLayout) {
          const node = nodeMap[nodeLayout.uid]
          const {position: {x, y}} = node
          // loops-- curve back to itself
          const lineData = getLoopLineData(x,y)
          layout = link.layout = {
            source: nodeLayout,
            target: nodeLayout,
            isLoop: true,
            lineData
          }
        }
        laidoutEdges.push({
          layout,
          uid
        })
      }
    })
  }
  return laidoutEdges
}


export const getLoopLineData = (x,y) => {
  return [
    {x:x+1, y:y},
    {x:x-90, y:y+20},
    {x:x-20, y:y-90},
    {x:x-1, y:y},
  ]
}

