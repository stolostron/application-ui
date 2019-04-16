/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
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
import DiagramViewer from '../diagrams/DiagramViewer'
import msgs from '../../../nls/platform.properties'

resources(() => {
  require('../../../scss/topology-diagram.scss')
})

const MAX_CLUSTERNAMES_TITLE = 6

class ResourceTopologyDiagram extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.object,
    clusters: PropTypes.array,
    links: PropTypes.array,
    loaded: PropTypes.bool,
    nodes: PropTypes.array,
    requiredFilters: PropTypes.object,
    searchName: PropTypes.string,
    setDiagramShown: PropTypes.func,
    staticResourceData: PropTypes.object,
    status: PropTypes.string,
  }

  constructor (props) {
    super(props)
    this.state = {}
  }

  componentWillReceiveProps(nextProps){
    const { nodes, loaded, status } = nextProps

    // get all cluster names
    const set = {}
    nodes.forEach(({clusterName})=>{
      set[clusterName] = true
    })
    const keys = Object.keys(set).sort()
    const length = keys.length
    const clusterNames = length<=MAX_CLUSTERNAMES_TITLE+1 ? keys.join(', ') :
      msgs.get('topology.more.cluster.names',
        [keys.slice(0, MAX_CLUSTERNAMES_TITLE).join(', '), length-MAX_CLUSTERNAMES_TITLE ], this.context.locale)
    this.setState({ clusterNames, isMulticluster:length>1, loaded })

    // update loading spinner
    if (this.updateDiagramRefreshTime) {
      this.updateDiagramRefreshTime(status===Actions.REQUEST_STATUS.IN_PROGRESS)
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return !lodash.isEqual(this.props.clusters.map(n => n.id), nextProps.clusters.map(n => n.id)) ||
       !lodash.isEqual(this.props.nodes.map(n => n.uid), nextProps.nodes.map(n => n.uid)) ||
       !lodash.isEqual(this.props.links.map(n => n.uid), nextProps.links.map(n => n.uid)) ||
       !lodash.isEqual(this.props.activeFilters, nextProps.activeFilters) ||
       !lodash.isEqual(this.props.requiredFilters, nextProps.requiredFilters) ||
       this.props.status !== nextProps.status ||
       this.props.searchName !== nextProps.searchName ||
       this.state.loaded !== nextState.loaded
  }

  setUpdateDiagramRefreshTimeFunc = func => {this.updateDiagramRefreshTime = func}

  render() {
    const { activeFilters, requiredFilters={}, nodes, links,
      searchName, loaded, status, staticResourceData, setDiagramShown} = this.props
    const { clusterNames, isMulticluster } = this.state
    const {locale} = this.context

    if (status === Actions.REQUEST_STATUS.ERROR) {
      setDiagramShown(false)
      return <Notification
        title=''
        className='persistent'
        subtitle={msgs.get('error.default.description', locale)}
        kind='error' />
    }

    // show spinner
    if (!loaded) {
      setDiagramShown(false)
      return <Loading withOverlay={false} className='content-spinner' />
    }

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
      setDiagramShown(false)
      return <Notification
        role="alert"
        className='persistent'
        title={notification?notification.title:''}
        subtitle={notification?notification.subtitle:msgs.get('topology.no.objects', locale)}
        kind='info' />
    }
    setDiagramShown(true)
    const title = msgs.get('cluster.names', [clusterNames], locale)
    return (
      <div className='topologyContainer'>
        <div className="topologyDiagramContainer" >
          <DiagramViewer
            title={title}
            nodes={nodes}
            links={links}
            isMulticluster={isMulticluster}
            context={this.context}
            staticResourceData={staticResourceData}
            setUpdateDiagramRefreshTimeFunc={this.setUpdateDiagramRefreshTimeFunc}
            activeFilters={activeFilters}
            searchName={searchName}
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
  const { activeFilters, requiredFilters, searchName, status } = state.topology
  const staticResourceData = getResourceDefinitions(RESOURCE_TYPES.HCM_TOPOLOGY)
  const {clusters, links, nodes} =  staticResourceData.getTopologyElements(state.topology)
  return {
    clusters,
    links,
    nodes,
    staticResourceData,
    activeFilters,
    requiredFilters,
    searchName,
    status,
  }
}

export default withRouter(connect(mapStateToProps)(ResourceTopologyDiagram))
