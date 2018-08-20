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
import resources from '../../../lib/shared/resources'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { RESOURCE_TYPES } from '../../../lib/shared/constants'
import getResourceDefinitions from '../../definitions'
import * as Actions from '../../actions'
import lodash from 'lodash'
import { Loading, Notification } from 'carbon-components-react'
import TopologyViewer from '../topology/TopologyViewer'
import msgs from '../../../nls/platform.properties'

resources(() => {
  require('../../../scss/topology-diagram.scss')
})


class ResourceTopologyDiagram extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.object,
    clusters: PropTypes.array,
    links: PropTypes.array,
    nodes: PropTypes.array,
    staticResourceData: PropTypes.object,
    status: PropTypes.string,
  }

  constructor (props) {
    super(props)
    this.state = { clusters: props.clusters }
  }

  componentWillReceiveProps(nextProps){
    const { activeFilters, clusters, nodes, links} = nextProps

    // if all clusters requested, put all nodes in that cluster
    const ALL = 'all'
    const allClusters = !activeFilters.clusters || activeFilters.clusters.length===0
    const clstrs = !allClusters ? lodash.cloneDeep(clusters) :
      nodes.length ? [
        {id: ALL, name: msgs.get('resource.filterAll', this.context.locale)}
      ] : []

    // sort nodes and links into each cluster
    // sort clusters alphabetically
    clstrs.forEach(cluster=>{
      const set = new Set()
      cluster.nodes = nodes.filter(node=>{
        if (cluster.id===ALL || node.cluster===cluster.id) {
          set.add(node.uid)
          return true
        }
      })
      cluster.links = links.filter(link=>{
        return set.has(link.source) || set.has(link.target)
      })
    })
    clusters.sort((a,b) => {
      return a.name.localeCompare(b.name)
    })
    this.setState({ clusters: clstrs })
  }

  shouldComponentUpdate(nextProps){
    return !lodash.isEqual(this.props.clusters.map(n => n.id), nextProps.clusters.map(n => n.id)) ||
       !lodash.isEqual(this.props.nodes.map(n => n.uid), nextProps.nodes.map(n => n.uid)) ||
       !lodash.isEqual(this.props.links.map(n => n.uid), nextProps.links.map(n => n.uid)) ||
       this.props.status !== Actions.REQUEST_STATUS.DONE
  }

  render() {
    const { activeFilters, status, staticResourceData} = this.props
    const { clusters } = this.state
    const {locale} = this.context

    if (status === Actions.REQUEST_STATUS.ERROR) {
      return <Notification
        title=''
        className='persistent'
        subtitle={msgs.get('error.default.description', locale)}
        kind='error' />
    }

    if (status !== Actions.REQUEST_STATUS.DONE)
      return <Loading withOverlay={false} className='content-spinner' />

    if (clusters.length===0) {
      return <Notification
        title=''
        className='persistent'
        subtitle={msgs.get('topology.no.objects', locale)}
        kind='info' />
    }

    return (
      <div className='topologyContainer'>
        <div className="topologyDiagramContainer" >
          {clusters.map(({id, name, nodes, links}) =>
            <TopologyViewer
              key={id}
              id={id}
              title={name}
              nodes={nodes}
              links={links}
              context={this.context}
              staticResourceData={staticResourceData}
              activeFilters={activeFilters}
            />
          )}
        </div>
      </div>
    )
  }
}


ResourceTopologyDiagram.contextTypes = {
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

export default withRouter(connect(mapStateToProps)(ResourceTopologyDiagram))
