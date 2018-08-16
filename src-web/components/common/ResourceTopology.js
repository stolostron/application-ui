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
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { RESOURCE_TYPES } from '../../../lib/shared/constants'
import { fetchResource } from '../../actions/common'
import { getSingleResourceItem, resourceItemByName } from '../../reducers/common'
import * as Actions from '../../actions'
import { Loading, Notification } from 'carbon-components-react'
import resources from '../../../lib/shared/resources'
import TopologyViewer from '../topology/TopologyViewer'
import msgs from '../../../nls/platform.properties'
import _ from 'lodash'

resources(() => {
  require('../../../scss/resource-topology.scss')
  require('../../../scss/topology-details.scss')
  require('../../../scss/topology-diagram.scss')
})

class ResourceTopology extends React.Component {
    static propTypes = {
      fetchTopology: PropTypes.func,
      links: PropTypes.arrayOf(PropTypes.shape({
        source: PropTypes.any,
        target: PropTypes.any,
        label: PropTypes.string,
        type: PropTypes.string,
      })),
      name: PropTypes.string,
      namespace: PropTypes.string,
      nodes: PropTypes.arrayOf(PropTypes.shape({
        cluster: PropTypes.string,
        uid: PropTypes.string.isRequired,
        type: PropTypes.string,
        name: PropTypes.string,
      })),
      staticResourceData: PropTypes.object,
      status: PropTypes.string,
    }

    constructor (props) {
      super(props)
      this.state = {
        links: [],
        nodes: []
      }
    }

    componentWillMount() {
      //      if (parseInt(config['featureFlags:liveUpdates']) === 2) {
      //        const intervalId = setInterval(this.reload.bind(this), config['featureFlags:liveUpdatesPollInterval'])
      //        this.setState({ intervalId: intervalId })
      //      }
      this.reload()
    }

    componentWillUnmount() {
      //     clearInterval(this.state.intervalId)
    }

    componentWillReceiveProps(nextProps) {
      const links = _.cloneDeep(nextProps.links)
      const nodes = _.cloneDeep(nextProps.nodes)
      this.setState({ links, nodes })
    }

    shouldComponentUpdate(nextProps, nextState){
      return !_.isEqual(this.state.nodes.map(n => n.uid), nextState.nodes.map(n => n.uid)) ||
         !_.isEqual(this.state.links.map(n => n.uid), nextState.links.map(n => n.uid)) ||
         this.props.status !== nextProps.status
    }

    render() {
      const { status, staticResourceData} = this.props
      const { links, nodes } = this.state
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
        <div className="resourceTopologyContainer" >
          <div className="topologyDiagramContainer" >
            <TopologyViewer
              id={'application'}
              nodes={nodes}
              links={links}
              context={this.context}
              staticResourceData={staticResourceData}
            />
          </div>
        </div>
      )
    }


    reload() {
      const {name, namespace} = this.props
      this.props.fetchTopology(RESOURCE_TYPES.HCM_APPLICATIONS, name, namespace)
    }

}

const mapStateToProps = (state, ownProps) => {
  const { resourceType, staticResourceData, match } = ownProps
  const segments = match.path.split('/')
  const name = decodeURIComponent(segments[segments.length - 2])
  const namespace = null//TODO  segments[segments.length - 3]
  const resourceItem = getSingleResourceItem(state, { storeRoot: resourceType.list, name, resourceType, predicate: resourceItemByName, namespace })
  const status = state[resourceType.list].status
  const {links, nodes} =  staticResourceData.topologyTransform(resourceItem)
  return {
    name,
    namespace,
    links,
    nodes,
    status
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchTopology: (resourceType, name, namespace) => dispatch(fetchResource(resourceType, name, namespace))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResourceTopology))
