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
import counterZoom from './counterZoom'

export default class TitleHelper {
  /**
   * Helper class to be used by TopologyDiagram.
   *
   * Contains functions to draw and manage nodes in the diagram.
   */
  constructor(svg, titles) {
    this.svg = svg
    this.titles = titles
  }


  /**
   * Remove nodes that aren't in the current nodeData array.
   */
  removeOldTitlesFromDiagram = () => {
    this.svg.select('g.titles')
      .selectAll('g.title')
      .data(this.titles, t => {
        return t.hashCode
      })
      .exit().remove()
  }

  addTitlesToDiagram = (currentZoom) => {
    const draw = typeof SVG === 'function' ? SVG(document.createElementNS('http://www.w3.org/2000/svg', 'svg')) : undefined

    // Add title groups to diagram
    const titles = this.svg.select('g.titles')
      .selectAll('g.title')
      .data(this.titles, t => {
        return t.hashCode
      })
      .enter().append('g')
      .attr('class','title')
      .attr('transform', currentZoom)

    titles.append('title')
      .text((t) => { return t.title })

    // create label
    titles.append('g')
      .attr('class','titleLabel')
      .html((d)=>{
        const {x, y, title} = d
        var text = draw.text((add) => {
          title.split('\n').forEach((line, idx)=>{
            if (line) {
              add.tspan(line)
                .addClass('counter-zoom')
                .addClass(idx===0?'first-line':'')
                .newLine()
            }
          })
        })
        text
          .x(x)
          .y(y)
        return text.svg()
      })
  }

  moveTitles = (transition) => {
    this.svg.select('g.titles').selectAll('g.titleLabel')
      .each((d,i,ns)=>{
        const {x, y} = d
        const titleLabel = d3.select(ns[i])
        titleLabel.selectAll('text')
          .transition(transition)
          .attrs(() => {
            return {
              'x': x,
              'y': y
            }
          })
        titleLabel.selectAll('tspan')
          .transition(transition)
          .attr('x', () => {return x})
      })
  }
}

export const counterZoomTitles = (svg, currentZoom) => {
  if (svg) {
    const fontSize = counterZoom(currentZoom.k, 0.2, 0.85, 14, 32)
    const titles = svg.select('g.titles')
    titles
      .selectAll('tspan.counter-zoom')
      .style('font-size', fontSize+'px')
    titles
      .selectAll('tspan.first-line.counter-zoom')
      .style('font-size', fontSize+5+'px')
      .style('font-weight', 'bold')
  }
}
