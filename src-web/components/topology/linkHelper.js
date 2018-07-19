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

    links.append('line')

    links.append('text')
      .attr('class', 'linkText')
      .text((d) => { return d.label })

    links.append('polygon')
      .attr('class', 'directionDecorator')
      .attr('points', `0,${NODE_RADIUS}, -2,${NODE_RADIUS + 5}, 2,${NODE_RADIUS + 5}`)
  }

  moveLinks = (transition) => {
    this.centerLinks()
    const links = this.svg.select('g.links').selectAll('g.link')

    // set position of line
    links.selectAll('line')
      .transition(transition)
      .attr('x1', ({layout}) => { return layout.source.x })
      .attr('y1', ({layout}) => { return layout.source.y })
      .attr('x2', ({layout}) => { return layout.target.x })
      .attr('y2', ({layout}) => { return layout.target.y })

    // set position of link text
    links.selectAll('text')
      .transition(transition)
      .attr('transform', ({layout}) => {
        const {source, target} = layout
        const x = (source.x + target.x)/2
        const y = (source.y + target.y)/2
        const angle = Math.atan2(target.y - source.y,target.x - source.x) * 180 / Math.PI
        return `translate(${x}, ${y}) rotate(${x > target.x ? angle + 180 : angle})`
      })

    // set position of direction indicator
    links.selectAll('polygon')
      .transition(transition)
      .attr('transform', ({layout}) => {
        const {source, target} = layout
        const x = target.x
        const y = target.y
        const angle = Math.atan2(target.y - source.y, target.x - source.x) * 180 / Math.PI
        return `translate(${x}, ${y}) rotate(${angle + 90})`
      })
  }

  // center everything so transition zooms out from center
  centerLinks = () => {
    const links = this.svg.select('g.links').selectAll('g.link')
      .filter(({layout})=>{return !layout.positioned})
    links.selectAll('line')
      .attr('x1', ({layout}) => { return layout.center.x })
      .attr('y1', ({layout}) => { return layout.center.y })
      .attr('x2', ({layout}) => { return layout.center.x })
      .attr('y2', ({layout}) => { return layout.center.y })
    links.selectAll('text')
      .attr('transform', ({layout}) => {
        const {x, y} = layout.center
        return `translate(${x}, ${y})`
      })
    links.selectAll('polygon')
      .attr('transform', ({layout}) => {
        const {x, y} = layout.center
        return `translate(${x}, ${y})`
      })
    links.each(({layout})=>{
      layout.positioned = true
    })
  }

  dragLinks = (d) => {
    this.svg.select('g.links').selectAll('g.link').each((l,i,ns)=>{
      if (l.source === d.uid || l.target === d.uid) {
        const link = d3.select(ns[i])
        const line = link.selectAll('line')
        if (l.source === d.uid) {
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
