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
import { InlineNotification, Loading } from 'carbon-components-react'
import { RESOURCE_TYPES } from '../../lib/shared/constants'
import { updateSecondaryHeader, fetchResources } from '../actions/common'
import headerMsgs from '../../nls/header.properties'
import msgs from '../../nls/platform.properties'
import TopologyDiagram from '../components/TopologyDiagram'
import { ClusterDetailsCard } from '../components/ClusterCards'
import * as Actions from '../actions'

resources(() => {
  require('../../scss/clusters.scss')
})


class TopologyTab extends React.Component {
  static propTypes = {
    fetchResources: PropTypes.func,
    status: PropTypes.string,
    topology: PropTypes.shape({
      nodes: PropTypes.array,
      links: PropTypes.array,
    }),
    updateSecondaryHeader: PropTypes.func,
  }

  state = { }

  componentWillMount() {
    this.props.updateSecondaryHeader(headerMsgs.get('routes.topology', this.context.locale))
    this.props.fetchResources(RESOURCE_TYPES.HCM_TOPOLOGY)
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
    if (currentNode){
      // TODO: Need to decide which details to show and retrieve latest details from the backend.
      details.push(`uid: ${currentNode.uid}`)
      details.push(`cluster: ${currentNode.cluster}`)
      details.push(`type: ${currentNode.type}`)
      details.push(`namespace: ${currentNode.namespace}`)
      details.push(`topology: ${currentNode.topology}`)
    }

    return (
      <div className='topologyOnly'>
        {this.props.status === Actions.REQUEST_STATUS.IN_PROGRESS &&
          <Loading small withOverlay={false} />
        }
        {this.props.status === Actions.REQUEST_STATUS.ERROR &&
          <InlineNotification
            kind="error"
            title={msgs.get('error', this.context.locale)}
            subtitle={msgs.get('error.default.description', this.context.locale)}
            iconDescription={msgs.get('error.dismiss', this.context.locale)}
          />
        }
        <TopologyDiagram
          nodes={this.props.topology.nodes}
          links={this.props.topology.links}
          onSelectedNodeChange={this.handleSelectedNodeChange}
          selectedNodeId={this.state.selectedNodeId}
        />
        { this.state.selectedNodeId &&
          <ClusterDetailsCard context={this.context} title={title} details={details} /> }
      </div>
    )
  }
}

TopologyTab.contextTypes = {
  locale: PropTypes.string
}

const mapStateToProps = (state) =>{
  // TODO: Use selectors.
  const nodes = (state.topology && state.topology.nodes) || []
  const links = (state.topology && state.topology.links) || []
  const status = (state.topology && state.topology.status) || ''
  const modifiedLinks = links.filter((l) => l.from && l.from.uid && l.to && l.to.uid)
    .map((l)=>({ source: l.from.uid, target: l.to.uid, label: l.type, type: l.type}))

  return { status, topology: { nodes, links: modifiedLinks } }
}

const mapDispatchToProps = dispatch => {
  return {
    updateSecondaryHeader: title => dispatch(updateSecondaryHeader(title)),
    fetchResources: resourceType => dispatch(fetchResources(resourceType))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TopologyTab))
