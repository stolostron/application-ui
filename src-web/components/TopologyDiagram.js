/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import lodash from 'lodash'
import resources from '../../lib/shared/resources'
import config from '../../lib/shared/config'

resources(() => {
  require('../../scss/topology-details.scss')
  require('../../scss/topology-diagram.scss')
  require('../../scss/topology-link.scss')
  require('../../scss/topology-node.scss')
})

const NODE_RADIUS = 20
const NODE_SEPARATION = 100

var currentZoom = 'translate(0,0) scale(1)'
class TopologyDiagram extends React.Component {
    static propTypes = {
      links: PropTypes.arrayOf(PropTypes.shape({
        source: PropTypes.any,
        target: PropTypes.any,
        label: PropTypes.string,
        type: PropTypes.string,
      })),
      nodes: PropTypes.arrayOf(PropTypes.shape({
        uid: PropTypes.string.isRequired,
        type: PropTypes.string,
        name: PropTypes.string,
      })),
      onSelectedNodeChange: PropTypes.func,
    }

    constructor (props) {
      super(props)

      this.setContainerRef = elem => {
        this.containerRef = elem
      }
    }

    handleNodeClick = (node) => {
      this.props.onSelectedNodeChange(node.uid)
      d3.event.stopPropagation()
    }


    generateDiagram(height, width) {
      const polygonTypes = ['cluster', 'service']
      const circleArray = this.props.nodes.filter(node => polygonTypes.indexOf(node.type) === -1)
      const polygonArray = this.props.nodes.filter(node => polygonTypes.indexOf(node.type) !== -1)

      const svg = d3.select('svg.topologyDiagram')
      // Remove old links.
      cleanUpDiagramLinks(svg)

      // Add new links to the diagram.
      const link = svg.select('g.links')
        .selectAll('g.link')
        .data(this.props.links)
        .enter().append('g')
        .attr('class', 'link')
        .attr('transform', currentZoom)

      // Add links to the diagram
      createLinkSVG(link)

      // Remove nodes that aren't in the current this.props.nodes array
      svg.select('g.nodes')
        .selectAll('g.node')
        .data(this.props.nodes, (n) => n.uid)
        .exit().remove()

      // Add nodes to the diagram
      const circleNode = svg.select('g.nodes')
        .selectAll('g.node')
        .data(circleArray, (n) => n.uid)
        .enter().append('g')
        .attr('class','node')
        .attr('transform', currentZoom)
        .attr('type', (d) => { return d.name })
        .on('click', this.handleNodeClick)

      // circle shallow
      createCircleSVG(circleNode, 'shadow', '19.6078431')
      // main circle
      createCircleSVG(circleNode, 'main', '19.6078431', '1')
      // central circle
      createCircleSVG(circleNode, 'centralCircle', '4', '', '21.650625', '25.65625')
      circleNode.append('title')
        .text((d) => { return d.name })
      circleNode.append('text')
        .text((d) => { return d.name })
        .attr('tabindex', '-1')


      // Add nodes to the diagram
      const polygonNode = svg.select('g.nodes')
        .selectAll('g.node')
        .data(polygonArray, (n) => n.uid)
        .enter().append('g')
        .attr('class','node')
        .attr('transform', currentZoom)
        .attr('type', (d) => { return d.name })
        .on('click', this.handleNodeClick)

      // polygon shallow
      createPolygonSVG(polygonNode, 'shadow')
      // main polygon
      createPolygonSVG(polygonNode, 'main', '1')
      // central circle
      createCircleSVG(polygonNode, 'centralCircle', '4', '', '21.650625', '25.65625')
      polygonNode.append('title')
        .text((d) => { return d.name })
      polygonNode.append('text')
        .text((d) => { return d.name })
        .attr('tabindex', '-1')

      const simulation = d3.forceSimulation()
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('link', d3.forceLink().id((d) => d.uid).strength(.1).distance(NODE_SEPARATION))
        .force('collide', d3.forceCollide().strength(.5).radius(NODE_RADIUS * 2)) // Prevents nodes from overlapping
        .on('tick', ticked)

      simulation
        .nodes(this.props.nodes)

      simulation.force('link')
        .links(this.props.links)

      function cleanUpDiagramLinks(svg) {
        // Remove old links.
        // TODO: add a uid to links, so we don't have to remove all links. (See nodes)
        svg.select('g.links')
          .selectAll('g.link').remove()
      }

      function createLinkSVG(link) {
        link.append('line')
          .attr('stroke-width', (d) => { return Math.sqrt(d.type) })

        link.append('text')
          .attr('class', 'linkText')
          .text((d) => { return d.label })

        link.append('polygon')
          .attr('class', 'directionDecorator')
          .attr('points', `0,${NODE_RADIUS}, -2,${NODE_RADIUS + 5}, 2,${NODE_RADIUS + 5}`)
      }

      function createPolygonSVG(node, className, tabindex) {
        node.append('polygon')
          .attr('tabindex', tabindex)
          .attr('class', (d) => {
            return `${d.type} ${className}`
          })
          .attr('tabindex', tabindex)
          .attr('points', '21.65075 0.65625 0 13.15625 0 38.15625 21.65075 50.65625 43.30125 38.15625 43.30125 13.15625')
          .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended))
      }

      function createCircleSVG(node, className, rad, tabindex, cx, cy) {
        node.append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', rad)
          .attr('class', (d) => {
            return `${d.type} ${className}`
          })
          .attr('tabindex', tabindex)
          .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended))
      }

      function ticked() {
        // Compute position of link line
        const link = svg.select('g.links').selectAll('g.link')
        link.selectAll('line')
          .attr('x1', (d) => { return d.source.x })
          .attr('y1', (d) => { return d.source.y })
          .attr('x2', (d) => { return d.target.x })
          .attr('y2', (d) => { return d.target.y })

        // Compute position of link text
        link.selectAll('text')
          .attr('transform', (d) => {
            const x = (d.source.x + d.target.x)/2
            const y = (d.source.y + d.target.y)/2
            const angle = Math.atan2(d.target.y - d.source.y, d.target.x - d.source.x) * 180 / Math.PI
            return `translate(${x}, ${y}) rotate(${x > d.target.x ? angle + 180 : angle})`
          })

        // Compute position of direction indicator
        link.selectAll('polygon')
          .attr('transform', (d) => {
            const x = d.target.x
            const y = d.target.y
            const angle = Math.atan2(d.target.y - d.source.y, d.target.x - d.source.x) * 180 / Math.PI
            return `translate(${x}, ${y}) rotate(${angle + 90})`
          })

        // Compute position of node circle
        const node = svg.select('g.nodes').selectAll('g.node')
        // Compute position of direction indicator
        node.selectAll('polygon')
          .attr('transform', (d) => {
            const x = d.x
            const y = d.y
            return `translate(${x - 21.650625}, ${y - 25.65625})`
          })
        node.selectAll('circle')
          .attr('cx', (d) => { return d.x })
          .attr('cy', (d) => { return d.y })
        //Compute position of node's text
        node.selectAll('text')
          .attr('x', (d) => { return d.x })
          .attr('y', (d) => { return d.y + 35 })
      }

      function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      }

      function dragged(d) {
        d.fx = d3.event.x
        d.fy = d3.event.y
      }

      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      }

      const nodes = svg.select('g.nodes').selectAll('g.node')
      const links = svg.select('g.links').selectAll('g.link')
      // Adds Zoom and Drag to diagram
      svg.call(d3.zoom()
        .scaleExtent([ 0.25, 4 ])
        .on('zoom', () => {
          currentZoom = d3.event.transform
          nodes.attr('transform', d3.event.transform)
          links.attr('transform', d3.event.transform)
        }))
    }

    componentWillReceiveProps(nextProps){
      if(this.props.links !== nextProps.links){
        nextProps = nextProps.links.map((newLink) => {
          const existing = this.props.links.find((oldLink) =>
            newLink.source === oldLink.source.uid && newLink.target === oldLink.target.uid)
          if(existing){
            newLink.source = existing.source
            newLink.target = existing.target
          }
        })
      }
    }

    shouldComponentUpdate(nextProps){
      return !lodash.isEqual(this.props.nodes, nextProps.nodes) ||
      !lodash.isEqual(this.props.links, nextProps.links)
    }

    getSvgSpace(svg){
      const nodes = svg.select('g.nodes').selectAll('g.node')
      const links = svg.select('g.links').selectAll('g.link')
      const svgSpace = d3.zoom()
        .scaleExtent([ 0.25, 4 ])
        .on('zoom', () => {
          currentZoom = d3.event.transform
          nodes.attr('transform', d3.event.transform)
          links.attr('transform', d3.event.transform)
        })
      return svgSpace
    }

    handleZoomIn = () => {
      const svg = d3.select('svg.topologyDiagram')
      this.getSvgSpace(svg).scaleBy(svg, 1.3)
    }

    handleZoomOut = () => {
      const svg = d3.select('svg.topologyDiagram')
      this.getSvgSpace(svg).scaleBy(svg, 1 / 1.3)
    }

    handleTarget = () => {
      const svg = d3.select('svg.topologyDiagram')
      var width = svg.style('width').replace('px', '')/2
      var height = svg.style('height').replace('px', '')/2
      this.getSvgSpace(svg).translateTo(svg, width, height)
    }

    render() {
      return (
        <div className="topologyDiagramContainer" ref={this.setContainerRef} >
          <svg className="topologyDiagram" />
          <button onClick={this.handleZoomIn}>
            <img alt='zoom-in' className='zoom-in' src={`${config.contextPath}/graphics/zoom-in.svg`} />
          </button>
          <button onClick={this.handleZoomOut}>
            <img alt='zoom-out' className='zoom-out' src={`${config.contextPath}/graphics/zoom-out.svg`} />
          </button>
          <button onClick={this.handleTarget}>
            <img alt='zoom-target' className='zoom-target' src={`${config.contextPath}/graphics/zoom-center.svg`} />
          </button>
        </div>
      )
    }

    componentDidMount(){
      const svg = d3.select('svg.topologyDiagram')
      svg.append('g').attr('class', 'links') // Links must be added before nodes, so nodes are painted on top.
      svg.append('g').attr('class', 'nodes')
      svg.on('click', this.props.onSelectedNodeChange)
    }

    componentDidUpdate(){
      const ownerElement = this.containerRef.attributes.class && this.containerRef.attributes.class.ownerElement
      this.generateDiagram(ownerElement.clientHeight, ownerElement.clientWidth)
    }
}

export default TopologyDiagram
