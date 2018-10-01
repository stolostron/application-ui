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
  constructor(svg, links, selfLinks, nodes) {
    this.links = links.concat(Object.values(selfLinks))
    this.svg = svg
    this.nodeMap = _.keyBy(nodes, 'layout.uid')
  }

  /**
   * Removes links from the diagram.
   *
   * TODO: Currently it removes all the links, but we should only remove stale
   * old links. We can do that adding a uid to every link. For a sample
   * implementation see removeOldNodesFromDiagram().
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
          id: `link-${uid}`
        }
      })
      .style('opacity', 0.0)

    // arrow
    links.append('polygon')
      .attr('class', 'directionDecorator')
      .attr('points', ({layout}) => {
        const radius = NODE_RADIUS + (layout.target && layout.target.isHub ? 10 : 0)
        return `0,${radius}, -4,${radius + 7}, 4,${radius + 7}`
      })
      .attr('transform', ({layout}) => {
        const {x, y} = layout.center
        return `translate(${x}, ${y})`
      })
      .style('opacity', 0.0)

    // labels
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

  moveLinks = (transition) => {
    // don't move looped dragged links
    const links = this.svg.select('g.links').selectAll('g.link').filter(({layout})=>{
      return !layout.isLoop || !layout.source.dragged
    })

    // set link path
    links.selectAll('path')
      .attr('d', ({layout}) => {
        return lineFunction(layout.lineData)
      })
      .transition(transition)
      .attr('transform', ({layout}) => {
        const {x, y} = layout.transform ? layout.transform : {x:0, y:0}
        return `translate(${x}, ${y})`
      })
      .style('opacity', 1.0)

    // set position of arrow
    links.selectAll('polygon')
      .transition(transition)
      .attr('transform', ({layout: {lineData, transform, isSwapped}}) => {
        let idx2 = lineData.length - 1
        let idx1 = idx2-1
        if (isSwapped) {
          idx1 = 1
          idx2 = 0
        }
        const {x: sx, y: sy} = lineData[idx1]
        const {x: tx, y: ty} = lineData[idx2]
        const {x: xx, y: yy} = transform ? transform : {x:0, y:0}
        const angle = Math.atan2(ty - sy, tx - sx) * 180 / Math.PI
        return `translate(${tx+xx}, ${ty+yy}) rotate(${angle + 90})`
      })
      .style('opacity', 1.0)

    const labels = this.svg.select('g.labels').selectAll('g.label')
    labels.selectAll('text')
      .selectAll('textPath')
      .transition(transition)
      .text(({layout={}, label}) => {
        return layout.isParallel ? '< both >' :
          (layout.isLoop ? label :
            (layout.isSwapped ? `< ${label}` : `${label} >`))
      })
      .attrs(({layout: {isParallel, isLoop, isSwapped}}) => {
        return {
          'startOffset': isParallel||isLoop ? '50%' : (isSwapped?'66%':'33%')
        }
      })
      .style('opacity', () => {
        return 1.0 //layout.hidden ? 0.0 : 1.0
      })
  }
}

export const dragLinks = (svg, d) => {
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

      // move arrow
      link.selectAll('polygon')
        .attr('transform', () => {
          const {source, target} = layout
          const x = target.x
          const y = target.y
          const angle = Math.atan2(target.y - source.y, target.x - source.x) * 180 / Math.PI
          return `translate(${x}, ${y}) rotate(${angle + 90})`
        })
    }
  })
}


export const setDraggedLineData = (layout) => {
  // calculate new lineData
  const {isLoop, source, target} = layout
  const {x: sx, y: sy} = source
  const {x: tx, y: ty} = target
  if (isLoop) {
    // path moved
    layout.lineData = [
      {x:sx+1, y:sy},
      {x:sx-70, y:sy+15},
      {x:sx-20, y:sy-70},
      {x:sx-1, y:sy},
    ]
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
        let {source: {uid: sid}, target: {uid: tid}} = layout
        const colaEdge = edge.scratch().cola
        // flip line so that line label isn't upside down :(
        layout.isSwapped = nodeMap[sid].position.x > nodeMap[tid].position.x
        if (layout.isSwapped) {
          const id = sid
          sid=tid
          tid=id
          if (colaEdge) {
            const other = colaEdge.source
            colaEdge.source = colaEdge.target
            colaEdge.target = other
          }
        }
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
          layout.isSwapped = false
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
          const lineData = [
            {x:x+1,y},
            {x:x-70, y:y+15},
            {x:x-20, y:y-70},
            {x:x-1,y},
          ]
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

