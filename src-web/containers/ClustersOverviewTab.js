/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

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

import {
  Card,
  CardContent,
  CardFooter,
  CardStatus,
} from 'carbon-components-react'

resources(() => {
  require('../../scss/clusters.scss')
})


class Clusters extends React.Component {

  // TODO: Jorge: Use Redux state
  state = { topology: { nodes: [], links: []} }

  componentWillMount() {
    this.props.updateSecondaryHeader(headerMsgs.get('routes.clusters', this.context.locale))
    this.props.fetchResources(RESOURCE_TYPES.HCM_CLUSTER)
  }

  handleSelectedNodeChange = (selectedNodeId) =>{
    this.setState({ selectedNodeId })
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
        <div className='topologyDiagram'>
          <TopologyDiagram
            nodes={this.props.topology.nodes}
            links={this.props.topology.links}
            onSelectedNodeChange={this.handleSelectedNodeChange}
            selectedNodeId={this.state.selectedNodeId}
          />
          { this.state.selectedNodeId && (<Card className="detailsCard" >
            <CardContent
              cardTitle={title}
              cardIcon="services"
              cardInfo={details} />
            <CardFooter>
              {status && (<CardStatus
                status={status == 'healthy' ? CardStatus.appStatus.RUNNING : CardStatus.appStatus.NOT_RUNNING}
                runningText={`${msgs.get('table.header.status.healthy', this.context.locale)}`}
                notRunningText={`${msgs.get('table.header.status.unhealthy', this.context.locale)}`}
              />)}
            </CardFooter>
          </Card>)}
        </div>
        {this.props.clusters.map((cluster, i) => <ClusterCard key={i} context={this.context} {...cluster} />)}
      </div>
    )
  }
}

const ClusterCard = ({ context, ClusterName, TotalDeployments, TotalNodes, Status }) => (
  <Card className="cluster-card" >
    <CardContent
      cardTitle={ClusterName}
      cardIcon="services"
      cardInfo={[
        `${msgs.get('table.header.nodes', context.locale)}: ${TotalNodes}`,
        `${msgs.get('table.header.deployments', context.locale)}: ${TotalDeployments}`,
      ]} >
    </CardContent>
    <CardFooter>
      <CardStatus
        status={ Status == 'healthy' ? CardStatus.appStatus.RUNNING : CardStatus.appStatus.NOT_RUNNING }
        runningText={`${msgs.get('table.header.status.healthy', context.locale)}`}
        notRunningText={`${msgs.get('table.header.status.unhealthy', context.locale)}`}
      />
    </CardFooter>
  </Card>
)

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
