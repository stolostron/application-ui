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
import resources from '../../lib/shared/resources'

resources(() => {
  require('../../scss/topology-diagram.scss')
})

const NODE_RADIUS = 20
const NODE_SEPARATION = 100

var currentZoom = 'translate(0,0) scale(1)'
class TopologyDiagram extends React.PureComponent {
    static propTypes = {
      links: PropTypes.arrayOf(PropTypes.shape({
        source: PropTypes.any,
        target: PropTypes.any,
        label: PropTypes.string,
        type: PropTypes.string,
      })),
      nodes: PropTypes.arrayOf(PropTypes.shape({
        uid: PropTypes.string,
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
      const svg = d3.select('svg.topologyDiagram')

      // Remove old links.
      // TODO: add a uid to links, so we don't have to remove all links. (See nodes)
      svg.select('g.links')
        .selectAll('g.link').remove()

      // Add new links to the diagram.
      const link = svg.select('g.links')
        .selectAll('g.link')
        .data(this.props.links)
        .enter().append('g')
        .attr('class', 'link')
        .attr('transform', currentZoom)

      link.append('line')
        .attr('stroke-width', (d) => { return Math.sqrt(d.type) })

      link.append('text')
        .attr('class', 'linkText')
        .text((d) => { return d.label })

      link.append('polygon')
        .attr('class', 'directionDecorator')
        .attr('points', `0,${NODE_RADIUS}, -2,${NODE_RADIUS + 5}, 2,${NODE_RADIUS + 5}`)


      // Remove nodes that aren't in the current this.props.nodes array
      svg.select('g.nodes')
        .selectAll('g.node')
        .data(this.props.nodes, (n) => n.uid)
        .exit().remove()

      // Add nodes to the diagram
      const node = svg.select('g.nodes')
        .selectAll('g.node')
        .data(this.props.nodes, (n) => n.uid)
        .enter().append('g')
        .attr('class','node')
        .attr('transform', currentZoom)
        .on('click', this.handleNodeClick)

      const color = d3.scaleOrdinal(d3.schemeCategory20)
      node.append('circle')
        .attr('class', 'node')
        .attr('tabindex', '1')
        .attr('r', NODE_RADIUS)
        .attr('fill', (d) => { return color(d.type) })
        .call(d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended))

      node.append('title')
        .text((d) => { return d.name })
      node.append('text')
        .text((d) => { return d.name })


      const simulation = d3.forceSimulation()
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('link', d3.forceLink().id((d) => d.uid).strength(.1).distance(NODE_SEPARATION))
        .force('charge', d3.forceManyBody())
        .force('collide', d3.forceCollide().strength(.5).radius(NODE_RADIUS)) // Prevents nodes from overlapping
        .on('tick', ticked)

      simulation
        .nodes(this.props.nodes)

      simulation.force('link')
        .links(this.props.links)


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
        node.selectAll('circle')
          .attr('cx', (d) => { return d.x })
          .attr('cy', (d) => { return d.y })
        //Compute position of node's text
        node.selectAll('text')
          .attr('x', (d) => { return d.x })
          .attr('y', (d) => { return d.y })
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
        .scaleExtent([ 0.25, 8 ])
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

    render() {
      return (
        <div className="topologyDiagramContainer" ref={this.setContainerRef} >
          <svg className="topologyDiagram" />
        </div>
      )
    }

    componentDidMount(){
      const svg = d3.select('svg.topologyDiagram')
      svg.append('g').attr('class', 'links') // Links must be added before nodes, so nodes are painted first.
      svg.append('g').attr('class', 'nodes')
      svg.on('click', this.props.onSelectedNodeChange)
    }

    componentDidUpdate(){
      const ownerElement = this.containerRef.attributes.class && this.containerRef.attributes.class.ownerElement
      this.generateDiagram(ownerElement.clientHeight, ownerElement.clientWidth)
    }
}

export default TopologyDiagram
