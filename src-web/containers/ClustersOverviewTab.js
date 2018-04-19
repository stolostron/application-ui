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
import { updateSecondaryHeader } from '../actions/common'
import { fetchClusters } from '../actions/multicluster'
import msgs from '../../nls/platform.properties'
import PropTypes from 'prop-types'
import HCMClient from '../../lib/client/hcm-client'
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
    this.props.fetchResources(RESOURCE_TYPES.HCM_CLUSTER.name)
    this.props.updateSecondaryHeader(msgs.get('routes.clusters', this.context.locale))
    HCMClient.getClusters(
      (success) =>{
        this.setState({ topology:  success.topology })
      }
    )
  }
  handleSelectedNodeChange = (selectedNodeId) =>{
    this.setState({ selectedNodeId })
  }

  render() {
    const currentNode = this.state.topology.nodes.find((n) => n.uid === this.state.selectedNodeId) || {}

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
            nodes={this.state.topology.nodes}
            links={this.state.topology.links}
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
                runningText={`${msgs.get('healthy', this.context.locale)}`}
                notRunningText={`${msgs.get('unhealthy', this.context.locale)}`}
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
        `${msgs.get('routes.platform.nodes', context.locale)}: ${TotalNodes}`,
        `${msgs.get('routes.workloads.deployments', context.locale)}: ${TotalDeployments}`,
      ]} >
    </CardContent>
    <CardFooter>
      <CardStatus
        status={ Status == 'healthy' ? CardStatus.appStatus.RUNNING : CardStatus.appStatus.NOT_RUNNING }
        runningText={`${msgs.get('healthy', context.locale)}`}
        notRunningText={`${msgs.get('unhealthy', context.locale)}`}
      />
    </CardFooter>
  </Card>
)

Clusters.contextTypes = {
  locale: PropTypes.string
}

const mapStateToProps = (state) =>
  ({
    // TODO: handle status and error states
    // const error = state[type.list].err
    // props[`status_${type.list}`] = state[type.list].status
    // props[`error_${type.list}`] = error && error.response && error.response.status
    clusters: state[RESOURCE_TYPES.HCM_CLUSTER.list] ? state[RESOURCE_TYPES.HCM_CLUSTER.list].items : []
  })

const mapDispatchToProps = dispatch => {
  return {
    updateSecondaryHeader: title => dispatch(updateSecondaryHeader(title)),
    fetchResources: resourceType => dispatch(fetchClusters(resourceType))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Clusters))
