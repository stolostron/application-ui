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
import * as Actions from '../../actions'
import { Loading, Notification } from 'carbon-components-react'
import resources from '../../../lib/shared/resources'
import TopologyViewer from '../topology/TopologyViewer'
import msgs from '../../../nls/platform.properties'
import _ from 'lodash'

resources(() => {
  require('../../../scss/topology-details.scss')
  require('../../../scss/topology-diagram.scss')
})


class ApplicationTopologyDiagram extends React.Component {
    static propTypes = {
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
    }

    componentWillMount() {
      const links = _.cloneDeep(this.props.links)
      const nodes = _.cloneDeep(this.props.nodes)
      this.setState({ links, nodes })
    }

    shouldComponentUpdate(nextProps){
      return !_.isEqual(this.props.nodes.map(n => n.uid), nextProps.nodes.map(n => n.uid)) ||
         !_.isEqual(this.props.links.map(n => n.uid), nextProps.links.map(n => n.uid))
    }

    render() {
      const { status, onSelectedNodeChange} = this.props
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
        <div className="topologyDiagramContainer" >
          <TopologyViewer
            id={'application'}
            nodes={nodes}
            links={links}
            onSelectedNodeChange={onSelectedNodeChange}
          />
        </div>
      )
    }
}

export default ApplicationTopologyDiagram
