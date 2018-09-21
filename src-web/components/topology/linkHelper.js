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
import _ from 'lodash'

import { NODE_RADIUS } from './constants.js'


export default class LinkHelper {
  /**
   * Helper class to be used by TopologyDiagram.
   *
   * Contains functions to draw and manage links between nodes in the diagram.
   */
  constructor(svg, links, nodes) {
    this.links = links
    this.svg = svg
    this.nodeMap = _.keyBy(nodes, 'layout.uid')
    this.lineFunction = d3.line()
      .x(d=>d.x)
      .y(d=>d.y)
      .curve(d3.curveBundle)
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
        return this.nodeMap[source] && this.nodeMap[target]
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
      .attr('class', 'link')
      .attr('transform', currentZoom)

    // add path
    links.append('path')
      .attr('d', ({layout}) => {
        return this.lineFunction([layout.center,layout.center])
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

    // label
    links.append('text')
      .attr('class', 'linkText')
      .text((d) => { return d.label })
      .attr('transform', ({layout}) => {
        const {x, y} = layout.center
        return `translate(${x}, ${y})`
      })
      .style('opacity', 0.0)
  }

  moveLinks = (transition) => {
    const links = this.svg.select('g.links').selectAll('g.link')

    // set link path
    links.selectAll('path')
      .attr('d', ({layout}) => {
        return this.lineFunction(layout.lineData)
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
      .attr('transform', ({layout}) => {
        const lastSeg = layout.lineData.slice(-2)
        const {x: sx, y: sy} = lastSeg[0]
        const {x: tx, y: ty} = lastSeg[1]
        const {x: xx, y: yy} = layout.transform ? layout.transform : {x:0, y:0}
        const angle = Math.atan2(ty - sy, tx - sx) * 180 / Math.PI
        return `translate(${tx+xx}, ${ty+yy}) rotate(${angle + 90})`
      })
      .style('opacity', 1.0)

      // set position of label
    links.selectAll('text')
      .transition(transition)
      .text((d) => {
        return d.layout && d.layout.isParallel ? 'both' : d.label
      })
      .attr('transform', ({layout}) => {
        let midSeg = layout.lineData
        if (layout.lineData.length>2) {
          const idx = Math.floor(layout.lineData.length/2)
          midSeg = layout.lineData.slice(idx)
        }
        let {x: sx, y: sy} = midSeg[0]
        let {x: tx, y: ty} = midSeg[1]
        const {x: xx, y: yy} = layout.transform ? layout.transform : {x:0, y:0}
        sx+=xx
        sy+=yy
        tx+=xx
        ty+=yy
        const x = (sx + tx)/2
        const y = (sy + ty)/2
        const angle = Math.atan2(ty - sy, tx - sx) * 180 / Math.PI
        return `translate(${x}, ${y}) rotate(${x > tx ? angle + 180 : angle})`
      })
      .style('opacity', ({layout}) => {
        return layout.hidden ? 0.0 : 1.0
      })
  }


  dragLinks = (d) => {
    this.svg.select('g.links').selectAll('g.link').each((l,i,ns)=>{
      if (l.layout.source.uid === d.layout.uid || l.layout.target.uid === d.layout.uid) {
        const link = d3.select(ns[i])
        const path = link.selectAll('path')
        const layout = l.layout

        // set node position
        const {source, target} = layout
        if (source.uid === d.layout.uid) {
          source.x = d.layout.x
          source.y = d.layout.y
        } else {
          target.x = d.layout.x
          target.y = d.layout.y
        }

        // straighten line out
        setDraggedLineData(layout)

        path
          .attr('d', ({layout}) => {
            return this.lineFunction(layout.lineData)
          })

        link.selectAll('text')
          .attr('transform', ({layout}) => {
            const {source, target} = layout
            const x = (source.x + target.x)/2
            const y = (source.y + target.y)/2
            const angle = Math.atan2(target.y - source.y,target.x - source.x) * 180 / Math.PI
            return `translate(${x}, ${y}) rotate(${x > target.x ? angle + 180 : angle})`
          })

        link.selectAll('polygon')
          .attr('transform', ({layout}) => {
            const {source, target} = layout
            const x = target.x
            const y = target.y
            const angle = Math.atan2(target.y - source.y, target.x - source.x) * 180 / Math.PI
            return `translate(${x}, ${y}) rotate(${angle + 90})`
          })
      }
    })
  }
}

export const setDraggedLineData = (layout) => {
  // calculate new straight lineData
  const {source, target} = layout
  const {x: xx, y: yy} = layout.transform ? layout.transform : {x:0, y:0}
  const {x: sx, y: sy} = source
  const {x: tx, y: ty} = target
  layout.lineData = [
    {x: sx-xx, y: sy-yy},
    {x: tx-xx, y: ty-yy}
  ]
}

export const layoutEdges = (newLayout, nodes, edges, adapter) => {
  const laidoutEdges = []
  if (edges.length>0) {
    let preparedColaRouting = false
    const nodeMap = _.keyBy(nodes, 'layout.uid')
    edges.forEach(edge=>{
      const {edge: {layout, uid}} = edge.data()

      // set path data on new edges
      // loops-- curve back to itself -- we filter it out but draw a circular arrow line on the node
      // parallel -- two line between same nodes--we just put "both" as the label on the line
      // avoidance -- curve around nodes -- we use webcola's line router
      // else just a straight line
      if (!layout.lineData || newLayout) {
        layout.lineData = []
        const {source: {uid: sid}, target: {uid: tid}} = layout
        var {position: {x:x1, y:y1}} = nodeMap[sid]
        var {position: {x:x2, y:y2}} = nodeMap[tid]

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
          layout.lineData = adapter.routeEdge(edge.scratch().cola, 0)

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
  }
  return laidoutEdges
}

