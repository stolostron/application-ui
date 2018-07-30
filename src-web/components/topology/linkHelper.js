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

import { CIRCLE_NODE_RADIUS, POLY_NODE_RADIUS, POLY_TYPES } from './constants.js'


export default class LinkHelper {
  /**
   * Helper class to be used by TopologyDiagram.
   *
   * Contains functions to draw and manage links between nodes in the diagram.
   */
  constructor(svg, links, bounds) {
    this.links = links
    this.bounds = bounds
    this.svg = svg
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
    const map = _.keyBy(this.links, 'uid')
    this.svg.select('g.links')
      .selectAll('g.link')
      .data(this.links.filter(l=>{return !!map[l.uid]}), (l) => {
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

    // line
    links.append('line')
      .attr('x1', ({layout}) => { return layout.center.x })
      .attr('y1', ({layout}) => { return layout.center.y })
      .attr('x2', ({layout}) => { return layout.center.x })
      .attr('y2', ({layout}) => { return layout.center.y })

    // arrow
    links.append('polygon')
      .attr('class', 'directionDecorator')
      .attr('points', ({layout}) => {
        const radius = POLY_TYPES.includes(layout.target.type) ?
          POLY_NODE_RADIUS : CIRCLE_NODE_RADIUS
        return `0,${radius}, -4,${radius + 7}, 4,${radius + 7}`
      })
      .attr('transform', ({layout}) => {
        const {x, y} = layout.center
        return `translate(${x}, ${y})`
      })

    // label
    links.append('text')
      .attr('class', 'linkText')
      .text((d) => { return d.label })
      .attr('transform', ({layout}) => {
        const {x, y} = layout.center
        return `translate(${x}, ${y})`
      })

  }

  moveLinks = (moveTrans, opacityTrans) => {
    const links = this.svg.select('g.links').selectAll('g.link')

    // set position of line
    links.selectAll('line')
      .interrupt()
      .transition(moveTrans)
      .attr('x1', ({layout}) => { return layout.source.x })
      .attr('y1', ({layout}) => { return layout.source.y })
      .attr('x2', ({layout}) => { return layout.target.x })
      .attr('y2', ({layout}) => { return layout.target.y })
      .on('end', (d,i,ns)=>{
        d3.select(ns[i])
          .transition(opacityTrans)
          .style('opacity', ({layout}) => {
            return layout.hidden ? 0.2 : 1.0
          })
      })

    // set position of arrow
    links.selectAll('polygon')
      .interrupt()
      .transition(moveTrans)
      .attr('transform', ({layout}) => {
        const {source, target} = layout
        const x = target.x
        const y = target.y
        const angle = Math.atan2(target.y - source.y, target.x - source.x) * 180 / Math.PI
        return `translate(${x}, ${y}) rotate(${angle + 90})`
      })
      .on('end', (d,i,ns)=>{
        d3.select(ns[i])
          .transition(opacityTrans)
          .style('opacity', ({layout}) => {
            return layout.hidden ? 0.2 : 1.0
          })
      })

      // set position of label
    links.selectAll('text')
      .interrupt()
      .transition(moveTrans)
      .attr('transform', ({layout}) => {
        const {source, target} = layout
        const x = (source.x + target.x)/2
        const y = (source.y + target.y)/2
        const angle = Math.atan2(target.y - source.y,target.x - source.x) * 180 / Math.PI
        return `translate(${x}, ${y}) rotate(${x > target.x ? angle + 180 : angle})`
      })
      .on('end', (d,i,ns)=>{
        d3.select(ns[i])
          .transition(opacityTrans)
          .style('opacity', ({layout}) => {
            return layout.hidden ? 0.0 : 1.0
          })
      })
  }

  dragLinks = (d) => {
    this.svg.select('g.links').selectAll('g.link').each((l,i,ns)=>{
      if (l.layout.source.uid === d.layout.uid || l.layout.target.uid === d.layout.uid) {
        const link = d3.select(ns[i])
        const line = link.selectAll('line')
        if (l.layout.source.uid === d.layout.uid) {
          line
            .attr('x1', ({layout}) => {return layout.source.x = d.layout.x})
            .attr('y1', ({layout}) => { return layout.source.y = d.layout.y })
        } else {
          line
            .attr('x2', ({layout}) => { return layout.target.x = d.layout.x })
            .attr('y2', ({layout}) => { return layout.target.y = d.layout.y })
        }

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
