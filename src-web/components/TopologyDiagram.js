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
      selectedNodeId: PropTypes.string,
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
      svg.on('click', this.props.onSelectedNodeChange) // Gets called without args so it will set the selection to undefined

      // Add links to the diagram.
      // Links are added first because nodes will be drawn on top later.
      const link = svg.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(this.props.links)
        .enter().append('g')
        .attr('class', 'link')

      link.append('line')
        .attr('stroke-width', (d) => { return Math.sqrt(d.type) })

      link.append('text')
        .attr('class', 'linkText')
        .text((d) => { return d.label })

      link.append('polygon')
        .attr('class', 'directionDecorator')
        .attr('points', `0,${NODE_RADIUS}, -2,${NODE_RADIUS + 5}, 2,${NODE_RADIUS + 5}`)


      // Add nodes to the diagram
      const node = svg.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(this.props.nodes)
        .enter().append('g')
        .attr('class','node')
        .on('click', this.handleNodeClick)

      const color = d3.scaleOrdinal(d3.schemeCategory20)
      node.append('circle')
        .attr('class', (d) => this.props.selectedNodeId === d.uid ? 'node selected' : 'node')
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

      simulation
        .nodes(this.props.nodes)
        .on('tick', ticked)

      simulation.force('link')
        .links(this.props.links)


      function ticked() {
        // Compute position of link line
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

      // Adds Zoom and Drag to diagram
      svg.call(d3.zoom()
        .scaleExtent([ 0.25, 8 ])
        .on('zoom', () => {
          node.attr('transform', d3.event.transform)
          link.attr('transform', d3.event.transform)
        }))
    }

    render() {
      return (
        <div key={Math.random()} className="topologyDiagramContainer" ref={this.setContainerRef} >
          <svg className="topologyDiagram" />
        </div>
      )
    }

    componentDidUpdate(){
      const ownerElement = this.containerRef.attributes.class && this.containerRef.attributes.class.ownerElement
      this.generateDiagram(ownerElement.clientHeight, ownerElement.clientWidth)
    }
}

export default TopologyDiagram
