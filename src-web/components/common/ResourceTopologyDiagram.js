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
    requiredFilters: PropTypes.object,
    staticResourceData: PropTypes.object,
    status: PropTypes.string,
  }

  constructor (props) {
    super(props)
    this.state = {
      loaded:false
    }
  }

  componentWillReceiveProps(nextProps){
    const { activeFilters, nodes, status} = nextProps
    let { loaded } = this.state

    // get all cluster names
    const set = {}
    nodes.forEach(({clusterName})=>{
      set[clusterName] = true
    })

    // prevent loading... message when just doing a live update
    loaded = (loaded || status === Actions.REQUEST_STATUS.DONE
        || status === Actions.REQUEST_STATUS.ERROR)
      && lodash.isEqual(activeFilters, this.props.activeFilters)

    if (!this.initialNodes && loaded) {
      this.initialNodes = nodes.length
    }
    const keys = Object.keys(set)
    this.setState({ loaded, clusterNames: keys.sort().join(', '), isMulticluster:keys.length>1 })
  }

  shouldComponentUpdate(nextProps, nextState){
    // weave scans can:
    //  1) missing all nodes between scans
    //  2) just barf
    if (this.initialNodes && nextProps.nodes.length===0) {
      if (this.latency===undefined) {
        this.latency = 6
      }
      this.latency -= 1
      // give it 3 scans where all objects are missing before we refresh topology with nothing
      if (this.latency>0) {
        return false
      }
    }
    delete this.latency
    return !lodash.isEqual(this.props.clusters.map(n => n.id), nextProps.clusters.map(n => n.id)) ||
       !lodash.isEqual(this.props.nodes.map(n => n.uid), nextProps.nodes.map(n => n.uid)) ||
       !lodash.isEqual(this.props.links.map(n => n.uid), nextProps.links.map(n => n.uid)) ||
       !lodash.isEqual(this.props.activeFilters, nextProps.activeFilters) ||
       !lodash.isEqual(this.props.requiredFilters, nextProps.requiredFilters) ||
       this.state.loaded !== nextState.loaded
  }

  render() {
    const { activeFilters, requiredFilters={}, nodes, links, status, staticResourceData} = this.props
    const { loaded, clusterNames, isMulticluster } = this.state
    const {locale} = this.context

    if (status === Actions.REQUEST_STATUS.ERROR) {
      return <Notification
        title=''
        className='persistent'
        subtitle={msgs.get('error.default.description', locale)}
        kind='error' />
    }

    // show spinner
    if (!loaded)
      return <Loading withOverlay={false} className='content-spinner' />

    // if there are required filters make sure there's at least one k8 object with a match
    let notification = undefined
    if (Object.keys(requiredFilters).length>0) {
      const reqMap = {}
      requiredFilters.label.forEach(({label, name, value})=>{
        reqMap[name+'='+value] = label
      })
      nodes.forEach(({labels}) =>{
        labels.forEach(({name, value})=>{
          delete reqMap[name+'='+value]
        })
      })
      if (Object.keys(reqMap).length>0) {
        notification = {
          title: msgs.get('topology.required.objects', this.context.locale),
          subtitle: Object.values(reqMap).join('; ')
        }
      }
    }

    // if no objects show "No objects" notification
    if (nodes.length===0) {
      return <Notification
        role="alert"
        className='persistent'
        title={notification?notification.title:''}
        subtitle={notification?notification.subtitle:msgs.get('topology.no.objects', locale)}
        kind='info' />
    }

    return (
      <div className='topologyContainer'>
        <div className="topologyDiagramContainer" >
          <TopologyViewer
            title={clusterNames}
            nodes={nodes}
            links={links}
            isMulticluster={isMulticluster}
            context={this.context}
            staticResourceData={staticResourceData}
            activeFilters={activeFilters}
          />
        </div>
      </div>
    )
  }
}


ResourceTopologyDiagram.contextTypes = {
  locale: PropTypes.string
}

const mapStateToProps = (state) =>{
  const { activeFilters, requiredFilters, status } = state.topology
  const staticResourceData = getResourceDefinitions(RESOURCE_TYPES.HCM_TOPOLOGY)
  const {clusters, links, nodes} =  staticResourceData.topologyTransform(state.topology)
  return {
    clusters,
    links,
    nodes,
    staticResourceData,
    activeFilters,
    requiredFilters,
    status,
  }
}

export default withRouter(connect(mapStateToProps)(ResourceTopologyDiagram))
