/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import * as d3 from 'd3'
import * as c from './constants.js'
import {interruptTitles, counterZoomTitles} from './titleHelper'
import {interruptLinks, counterZoomLinks} from './linkHelper'
import {interruptNodes, counterZoomLabels} from './nodeHelper'
import _ from 'lodash'


export default class ZoomHelper {

  constructor(viewer, diagramOptions) {
    this.viewer = viewer
    this.diagramOptions = diagramOptions
    this.currentZoom = {x:0, y:0, k:1}
    this.isAutoZoom = true
    this.viewer.resize = _.debounce(()=>{
      if (this.isAutoZoom) {
        this.zoomFit(true)
      }
    }, 150)
  }

  mountViewer = () => {
    window.addEventListener('resize', this.viewer.resize)
  }

  dismountViewer = () => {
    window.removeEventListener('resize', this.viewer.resize)
  }

  isAutoZoomToFit = () => {
    return this.isAutoZoom
  }

  getCurrentZoom = () => {
    return this.currentZoom
  }

  zoomFit = (zoomElements, resetScrollbar, cb) => {
    const {y1, width, height} = this.viewer.layoutBBox
    if (width && height) {
      const svg = d3.select(`#${c.DIAGRAM_SVG_ID}`)
      if (svg) {
        if (this.viewer.viewerContainerContainerRef) {
          const {width: availableWidth, height: availableHeight} = this.viewer.viewerContainerContainerRef.getBoundingClientRect()
          let scale = Math.min( 1, .95 / Math.max(width / availableWidth, height / availableHeight))

          // don't allow scale to drop too far for accessability reasons
          // below threshHold, show scrollbar instead
          if (scale<c.MINIMUM_ZOOM_FIT) {
            scale = c.MINIMUM_ZOOM_FIT//Math.min(c.MINIMUM_ZOOM_FIT, .8/(width / availableWidth)) // even below threshhold keep entire row visible
            this.viewer.viewerContainerContainerRef.classList.add('scrolled')
            this.viewer.viewerContainerRef.setAttribute('style', `height: ${height*scale+c.TOPOLOGY_PADDING}px;`)
          } else {
            this.viewer.viewerContainerContainerRef.classList.remove('scrolled')
            this.viewer.viewerContainerRef.setAttribute('style', 'height: 100%;')
          }
          this.viewer.clientRef = this.viewer.viewerContainerContainerRef
          d3.zoom().scaleTo(svg, scale)
          if (resetScrollbar) {
            this.viewer.viewerContainerContainerRef.scrollTo(0, 0)
          }
          this.isAutoZoom = true

          // center diagram horizontally
          const cx = width/2
          // put c.TOPOLOGY_PADDING from top
          const viewerHeight = this.viewer.viewerContainerRef.getBoundingClientRect().height
          const dy = (viewerHeight/2 - c.TOPOLOGY_PADDING) * 1/scale
          const cy =  y1 + dy
          d3.zoom().on('zoom', () => {
            this.currentZoom = d3.event.transform
            if (zoomElements) {
              this.zoomElements(200)
            }
            if (cb) cb(this.currentZoom)
          }).translateTo(svg, cx, cy)
        }
      }
    }
  }

  // zoom with mouse wheel
  canvasZoom(){
    return this.manualZoom(0)
  }

  // zoom with diagram buttons
  buttonZoom(scale, cb){
    const svg = d3.select(`#${c.DIAGRAM_SVG_ID}`)
    return this.manualZoom(200, cb).scaleBy(svg, scale)
  }

  manualZoom(duration, cb){
    return d3.zoom()
      .scaleExtent([ 0.1, 2 ]) // can manually scale from 0.1 up to 2
      .on('zoom', () => {
        this.currentZoom = d3.event.transform
        this.isAutoZoom = false
        this.zoomElements(duration)
        if (cb) cb(this.currentZoom)
      })
  }

  zoomElements(duration) {
    const svg = d3.select(`#${c.DIAGRAM_SVG_ID}`)
    if (svg) {
      this.interruptElements(svg)
      const transition = d3.transition()
        .duration(duration)
        .ease(d3.easeSinOut)
      svg.select('g.nodes').selectAll('g.node')
        .transition(transition)
        .attr('transform', this.currentZoom)
      svg.select('g.links').selectAll('g.link')
        .transition(transition)
        .attr('transform', this.currentZoom)
      svg.select('g.links').selectAll('g.label')
        .transition(transition)
        .attr('transform', this.currentZoom)
      svg.select('g.titles').selectAll('g.title')
        .transition(transition)
        .attr('transform', this.currentZoom)
      this.counterZoomElements(svg)
    }
  }

  counterZoomElements() {
    const svg = d3.select(`#${c.DIAGRAM_SVG_ID}`)
    counterZoomLabels(svg, this.currentZoom)
    counterZoomTitles(svg, this.currentZoom)
    counterZoomLinks(svg, this.currentZoom, this.diagramOptions.showLineLabels)
  }

  interruptElements() {
    // stop any transitions and make sure
    // elements have their final value
    const svg = d3.select(`#${c.DIAGRAM_SVG_ID}`)
    interruptNodes(svg)
    interruptLinks(svg)
    interruptTitles(svg)
  }

}
