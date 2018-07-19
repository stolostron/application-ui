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
import resources from '../../lib/shared/resources'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import TopologyDiagram from '../components/TopologyDiagram'
import { DetailsView } from '../components/topology/DetailsView'
import { updateTopologySelection } from '../actions/topology'

resources(() => {
  require('../../scss/topology-diagram.scss')
})


class DiagramWithDetails extends React.Component {
  static propTypes = {
    clusters: PropTypes.array,
    links: PropTypes.array,
    nodes: PropTypes.array,
    onSelectedNodeChange: PropTypes.func,
    selectedNodeId: PropTypes.string,
    status: PropTypes.string,
  }

  handleDetailsClose = () => this.props.onSelectedNodeChange()

  render() {
    const currentNode = this.props.nodes.find((n) => n.uid === this.props.selectedNodeId) || {}
    const title = currentNode && currentNode.name
    const resourceType = currentNode.type
    const details = []
    if (currentNode){
      currentNode.type && details.push({
        type: 'label',
        labelKey: 'resource.type',
        value: currentNode.type,
      })
      currentNode.cluster && details.push({
        type: 'label',
        labelKey: 'resource.cluster',
        value: this.props.clusters.find(n => n.id === currentNode.cluster).name
      })
      currentNode.namespace && details.push({
        type: 'label',
        labelKey: 'resource.namespace',
        value: currentNode.namespace,
      })
      currentNode.topology && details.push({
        type: 'label',
        labelKey: 'resource.topology',
        value: currentNode.topology,
      })
    }

    return (
      <div className='topologyWithDetails'>
        <TopologyDiagram
          clusters={this.props.clusters}
          nodes={this.props.nodes}
          links={this.props.links}
          onSelectedNodeChange={this.props.onSelectedNodeChange}
          selectedNodeId={this.props.selectedNodeId}
          status={this.props.status}
        />
        { this.props.selectedNodeId &&
          <DetailsView
            context={this.context}
            details={details}
            onClose={this.handleDetailsClose}
            resourceType={resourceType}
            title={title}
          /> }
      </div>
    )
  }
}

DiagramWithDetails.contextTypes = {
  locale: PropTypes.string
}

const mapStateToProps = (state) =>{
  const { nodes = [], links = [], selectedNodeId, status } = state.topology

  // We need to change "to/from" to "source/target" to satisfy D3's API.
  let modifiedLinks = links.map((l)=>({
    source: l.from.uid,
    target: l.to.uid,
    label: l.type,
    type: l.type,
    uid: l.from.uid + l.to.uid,
  }))

  // FIXME: We don't have a way to show links to self, so removing those links until the diagram can paint those correctly.
  modifiedLinks = modifiedLinks.filter(l => l.source !== l.target)


  const nodesWithoutClusters = nodes.filter(n => n.type !== 'cluster' && n.uid)
  const clusters = nodes.reduce((prev, curr) => {
    if (curr.cluster !== null && !prev.find(c => c.id === curr.cluster)){
      const node = nodes.find(n => n.id === curr.cluster)
      if (node && node.name) {
        prev.push({
          id: curr.cluster,
          index: prev.length,
          name: node.name
        })
      }
    }
    return prev
  }, [])

  return {
    clusters,
    links: modifiedLinks,
    nodes: nodesWithoutClusters,
    selectedNodeId,
    status,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSelectedNodeChange: (nodeId) => dispatch(updateTopologySelection(nodeId)),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DiagramWithDetails))
