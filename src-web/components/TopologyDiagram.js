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
import * as Actions from '../actions'
import { Loading, Notification } from 'carbon-components-react'
import resources from '../../lib/shared/resources'
import ClusterViewer from './topology/ClusterViewer'
import msgs from '../../nls/platform.properties'
import _ from 'lodash'

resources(() => {
  require('../../scss/topology-details.scss')
  require('../../scss/topology-diagram.scss')
})


class TopologyDiagram extends React.Component {
    static propTypes = {
      activeFilters: PropTypes.object,
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
      this.state = { clusters: props.clusters }
    }

    componentWillReceiveProps(nextProps){
      // sort nodes and links into each cluster
      // sort clusters alphabetically
      const clusters = _.cloneDeep(nextProps.clusters)
      clusters.forEach(cluster=>{
        const set = new Set()
        cluster.nodes = nextProps.nodes.filter(node=>{
          if (node.cluster===cluster.id) {
            set.add(node.uid)
            return true
          }
        })
        cluster.links = nextProps.links.filter(link=>{
          return set.has(link.source) || set.has(link.target)
        })
      })
      clusters.sort((a,b) => {
        return a.name.localeCompare(b.name)
      })
      this.setState({ clusters })
    }

    shouldComponentUpdate(nextProps){
      return !_.isEqual(this.props.clusters.map(n => n.id), nextProps.clusters.map(n => n.id)) ||
         !_.isEqual(this.props.nodes.map(n => n.uid), nextProps.nodes.map(n => n.uid)) ||
         !_.isEqual(this.props.links.map(n => n.uid), nextProps.links.map(n => n.uid))
    }

    render() {
      const { activeFilters, status, onSelectedNodeChange} = this.props
      const { clusters } = this.state
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
        <div className="topologyDiagramContainer" >
          {clusters.map(({id, name, nodes, links}) =>
            <ClusterViewer
              key={id}
              id={id}
              name={name}
              nodes={nodes}
              links={links}
              activeFilters={activeFilters}
              onSelectedNodeChange={onSelectedNodeChange}
            />
          )}
        </div>
      )
    }
}

export default TopologyDiagram
