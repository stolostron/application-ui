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
import * as Actions from '../actions'
import { Loading, Notification } from 'carbon-components-react'
import resources from '../../lib/shared/resources'
import config from '../../lib/shared/config'
import ClusterHelper from './topology/clusterHelper'
import LayoutHelper from './topology/layoutHelper'
import LinkHelper from './topology/linkHelper'
import NodeHelper from './topology/nodeHelper'
import SimulationHelper from './topology/simulationHelper'
import msgs from '../../nls/platform.properties'
import lodash from 'lodash'

resources(() => {
  require('../../scss/topology-details.scss')
  require('../../scss/topology-diagram.scss')
  require('../../scss/topology-link.scss')
  require('../../scss/topology-node.scss')
})


var currentZoom = 'translate(0,0) scale(1)'
class TopologyDiagram extends React.Component {
    static propTypes = {
      clusters: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string
      })),
      links: PropTypes.arrayOf(PropTypes.shape({
        source: PropTypes.any,
        target: PropTypes.any,
        label: PropTypes.string,
        type: PropTypes.string,
      })),
      nodes: PropTypes.arrayOf(PropTypes.shape({
        cluster: PropTypes.string,
        uid: PropTypes.string.isRequired,
        type: PropTypes.string,
        name: PropTypes.string,
      })),
      onSelectedNodeChange: PropTypes.func,
      status: PropTypes.string,
    }

    constructor (props) {
      super(props)

      this.setContainerRef = elem => {
        this.containerRef = elem
      }

      this.simulationHelper = new SimulationHelper()
      this.generateDiagram = this.generateDiagram.bind(this)
    }

    handleNodeClick = (node) => {
      this.props.onSelectedNodeChange(node.uid)
      d3.event.stopPropagation()
    }


    generateDiagram() {
      const svg = d3.select('svg.topologyDiagram')
      const  {clientHeight:height, clientWidth:width} = lodash.get(this, 'containerRef.attributes.class.ownerElement')
        || {clientHeight: 500, clientWidth: 1200}

      // Create or refresh clusters rendering
      const clusterHelper = new ClusterHelper(height, width, this.props.clusters)
      clusterHelper.removeOldClustersFromDiagram()
      clusterHelper.addClustersToDiagram()

      // Stop all running simulations.
      this.simulationHelper.stopSimulations()
      // Start a new simulation to position the nodes.
      this.simulationHelper.createSimulation(height, width, this.props.clusters, this.props.nodes, this.props.links, ticked)

      // Create or refresh the links in the diagram.
      const linkHelper = new LinkHelper(this.props.links)
      linkHelper.removeOldLinksFromDiagram()
      linkHelper.addLinksToDiagram(currentZoom)

      // Create or refresh the nodes in the diagram.
      const nodeHelper = new NodeHelper(this.props.nodes, this.simulationHelper.getSimulation())
      nodeHelper.removeOldNodesFromDiagram()
      nodeHelper.addNodesToDiagram(currentZoom, this.handleNodeClick)


      const layoutHelper = new LayoutHelper(height, width, this.props.clusters)
      function ticked() {
        // Compute position of links
        layoutHelper.moveLinks()

        // Compute position of nodes
        layoutHelper.moveNodes( )
      }


      // Add zoom feature to diagram
      svg.call(this.getSvgSpace(svg))
    }

    getSvgSpace(svg){
      const clusters = svg.select('g.clusters').selectAll('g.cluster')
      const nodes = svg.select('g.nodes').selectAll('g.node')
      const links = svg.select('g.links').selectAll('g.link')
      const svgSpace = d3.zoom()
        .scaleExtent([ 0.25, 4 ])
        .on('zoom', () => {
          currentZoom = d3.event.transform
          clusters.attr('transform', d3.event.transform)
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
      this.getSvgSpace(svg).scaleTo(svg, 1)
    }

    render() {
      const { status } = this.props
      const { locale } = this.context

      if (status === Actions.REQUEST_STATUS.ERROR) {
        return <Notification
          title=''
          className='persistent'
          subtitle={msgs.get('error.default.description', locale)}
          kind='error' />
      }

      if (status !== Actions.REQUEST_STATUS.DONE)
        return <Loading withOverlay={false} className='content-spinner' />


      return (
        <div className="topologyDiagramContainer" ref={this.setContainerRef} >
          <svg className="topologyDiagram" />
          <input type='image' alt='zoom-in' className='zoom-in'
            onClick={this.handleZoomIn} src={`${config.contextPath}/graphics/zoom-in.svg`} />
          <input type='image' alt='zoom-out' className='zoom-out'
            onClick={this.handleZoomOut} src={`${config.contextPath}/graphics/zoom-out.svg`} />
          <input type='image' alt='zoom-target' className='zoom-target'
            onClick={this.handleTarget} src={`${config.contextPath}/graphics/zoom-center.svg`} />
        </div>
      )
    }

    componentDidMount() {
      window.addEventListener('resize', lodash.debounce(this.generateDiagram, 100))
    }
    componentWillUnmount() {
      window.removeEventListener('resize', this.generateDiagram)
    }

    componentDidUpdate(){
      if (this.containerRef) {
        const svg = d3.select('svg.topologyDiagram')
        svg.append('g').attr('class', 'clusters')
        svg.append('g').attr('class', 'links') // Links must be added before nodes, so nodes are painted on top.
        svg.append('g').attr('class', 'nodes')
        svg.on('click', this.props.onSelectedNodeChange)

        this.generateDiagram()
      }
    }
}

export default TopologyDiagram
