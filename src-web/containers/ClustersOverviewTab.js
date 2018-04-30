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
import resources from '../../lib/shared/resources'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { RESOURCE_TYPES } from '../../lib/shared/constants'
import { updateSecondaryHeader, fetchResources } from '../actions/common'
import msgs from '../../nls/platform.properties'
import headerMsgs from '../../nls/header.properties'
import PropTypes from 'prop-types'
import TopologyDiagram from '../components/TopologyDiagram'
import { ClusterDetailsCard, ClusterSummaryCard } from '../components/ClusterCards'

import { Button } from 'carbon-components-react'

resources(() => {
  require('../../scss/clusters.scss')
})


class Clusters extends React.Component {

  // TODO: Jorge: Use Redux state
  state = { }

  componentWillMount() {
    this.props.updateSecondaryHeader(headerMsgs.get('routes.clusters', this.context.locale))
    this.props.fetchResources(RESOURCE_TYPES.HCM_CLUSTER)
  }

  handleSelectedNodeChange = (selectedNodeId) =>{
    this.setState({ selectedNodeId })
  }

  handleCardFocus = clusterId => () => {
    this.setState({ selectedNodeId: clusterId })
  }

  render() {
    const currentNode = this.props.topology.nodes.find((n) => n.uid === this.state.selectedNodeId) || {}

    const title = currentNode && currentNode.name
    const details = []
    if (currentNode && currentNode.cluster){
      details.push(`Nodes: ${currentNode.cluster.TotalNodes}`)
      details.push(`Clusters: ${currentNode.cluster.TotalDeployments}`)
    }
    const status = currentNode.cluster && currentNode.cluster.Status

    return (
      <div className='clusters'>
        <div className="buttonGroup">
          <Button
            small
            icon="add--glyph"
            iconDescription={msgs.get('cluster.add', this.context.locale)}
            onClick={() => alert('TODO: Show dialog to start managing existing clusters.') }   // TODO: Show modal
          > {msgs.get('cluster.add', this.context.locale)} </Button>
        </div>
        <div className='topologyDiagramContainer'>
          <TopologyDiagram
            nodes={this.props.topology.nodes}
            links={this.props.topology.links}
            onSelectedNodeChange={this.handleSelectedNodeChange}
            selectedNodeId={this.state.selectedNodeId}
          />
          { this.state.selectedNodeId && <ClusterDetailsCard context={this.context} title={title} details={details} status={status} /> }
        </div>
        {this.props.clusters.map((cluster, i) => (
          <ClusterSummaryCard
            key={i}
            context={this.context}
            onFocus={this.handleCardFocus(cluster.ClusterName)}
            {...cluster}
          />)
        )}
      </div>
    )
  }
}


Clusters.contextTypes = {
  locale: PropTypes.string
}

const mapStateToProps = (state) =>{
  const clusters = state[RESOURCE_TYPES.HCM_CLUSTER.list] ? state[RESOURCE_TYPES.HCM_CLUSTER.list].items : []

  const topology = { nodes: [
    { uid: 'manager', type: '1', name: 'Cluster Manager' }
  ], links: []}

  clusters.forEach((cluster) =>{
    const clustName = cluster.ClusterName
    topology.nodes.push({ uid: clustName, type: '2', name: clustName, cluster })
    topology.links.push({ source: 'manager', target: clustName, label: 'manages', type: '1' })
  })

  return {
    // TODO: handle status and error states
    // const error = state[type.list].err
    // props[`status_${type.list}`] = state[type.list].status
    // props[`error_${type.list}`] = error && error.response && error.response.status
    clusters,
    topology
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateSecondaryHeader: title => dispatch(updateSecondaryHeader(title)),
    fetchResources: resourceType => dispatch(fetchResources(resourceType))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Clusters))
