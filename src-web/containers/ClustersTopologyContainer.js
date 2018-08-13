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
import ClustersTopologyDiagram from '../components/ClustersTopologyDiagram'
import { RESOURCE_TYPES } from '../../lib/shared/constants'
import getResourceDefinitions from '../definitions'

resources(() => {
  require('../../scss/topology-diagram.scss')
})


class ClustersTopologyContainer extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.object,
    clusters: PropTypes.array,
    links: PropTypes.array,
    nodes: PropTypes.array,
    staticResourceData: PropTypes.object,
    status: PropTypes.string,
  }

  render() {
    return (
      <div className='topologyContainer'>
        <ClustersTopologyDiagram
          clusters={this.props.clusters}
          nodes={this.props.nodes}
          links={this.props.links}
          context={this.context}
          staticResourceData = {this.props.staticResourceData}
          activeFilters={this.props.activeFilters}
          status={this.props.status}
        />
      </div>
    )
  }
}

ClustersTopologyContainer.contextTypes = {
  locale: PropTypes.string
}

const mapStateToProps = (state) =>{
  const { activeFilters, status } = state.topology
  const staticResourceData = getResourceDefinitions(RESOURCE_TYPES.HCM_TOPOLOGY)
  const {clusters, links, nodes} =  staticResourceData.topologyTransform(state.topology)
  return {
    clusters,
    links,
    nodes,
    staticResourceData,
    activeFilters,
    status,
  }
}

export default withRouter(connect(mapStateToProps)(ClustersTopologyContainer))
