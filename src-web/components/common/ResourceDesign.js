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
import { fetchResource } from '../../actions/common'
import { getSingleResourceItem, resourceItemByName } from '../../reducers/common'
import { Loading } from 'carbon-components-react'
import resources from '../../../lib/shared/resources'
import TopologyViewer from '../topology/TopologyViewer'
import _ from 'lodash'

resources(() => {
  require('../../../scss/resource-design.scss')
  require('../../../scss/topology-details.scss')
  require('../../../scss/topology-diagram.scss')
})

class ResourceDesign extends React.Component {
    static propTypes = {
      fetchDesign: PropTypes.func,
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
      staticResourceData: PropTypes.object,
    }

    constructor (props) {
      super(props)
      this.state = {
        links: [],
        nodes: []
      }
    }

    componentWillMount() {
      this.props.fetchDesign()
    }

    componentWillReceiveProps(nextProps) {
      const links = _.cloneDeep(nextProps.links||[])
      const nodes = _.cloneDeep(nextProps.nodes||[])
      this.setState({ links, nodes })
    }

    shouldComponentUpdate(nextProps, nextState){
      return !_.isEqual(this.state.nodes.map(n => n.uid), nextState.nodes.map(n => n.uid)) ||
         !_.isEqual(this.state.links.map(n => n.uid), nextState.links.map(n => n.uid))    }

    render() {
      if (!this.props.nodes)
        return <Loading withOverlay={false} className='content-spinner' />

      const { staticResourceData} = this.props
      const { links, nodes } = this.state
      return (
        <div className="resourceDesignContainer" >
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

}

const mapStateToProps = (state, ownProps) => {
  const { resourceType, staticResourceData, params } = ownProps
  const name = decodeURIComponent(params.name)
  const item = getSingleResourceItem(state, { storeRoot: resourceType.list, resourceType, name, predicate: resourceItemByName,
    namespace: params.namespace ? decodeURIComponent(params.namespace) : null })
  const {links, nodes} = staticResourceData.topologyTransform(item)
  return {
    links,
    nodes
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { resourceType, params: {name, namespace} } = ownProps
  return {
    fetchDesign: () => dispatch(fetchResource(resourceType, namespace, name))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResourceDesign))
