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
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { InlineNotification } from 'carbon-components-react'
import lodash from 'lodash'
import { RESOURCE_TYPES } from '../../lib/shared/constants'
import { updateSecondaryHeader, fetchResources } from '../actions/common'
import headerMsgs from '../../nls/header.properties'
import msgs from '../../nls/platform.properties'
import * as Actions from '../actions'
import { updateTopologyFilters } from '../actions/topology'
import DiagramWithDetails from './DiagramWithDetails'
import TopologyFiltersContainer from './TopologyFiltersContainer'


class TopologyTab extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.object,
    fetchResources: PropTypes.func,
    updateSecondaryHeader: PropTypes.func,
  }

  componentWillMount() {
    this.props.updateSecondaryHeader(headerMsgs.get('routes.topology', this.context.locale))
    this.props.fetchResources(RESOURCE_TYPES.HCM_TOPOLOGY, this.props.activeFilters)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeFilters !== this.props.activeFilters) {
      this.props.fetchResources(RESOURCE_TYPES.HCM_TOPOLOGY, nextProps.activeFilters)
    }
  }

  render() {
    return (
      <div className='topologyTab'>
        {status === Actions.REQUEST_STATUS.ERROR &&
          <InlineNotification
            kind="error"
            title={msgs.get('error', this.context.locale)}
            subtitle={msgs.get('error.default.description', this.context.locale)}
            iconDescription={msgs.get('error.dismiss', this.context.locale)}
          />
        }
        <TopologyFiltersContainer />
        {/* status === Actions.REQUEST_STATUS.IN_PROGRESS &&
          <Loading small withOverlay={false} />
        */}
        <DiagramWithDetails />
      </div>
    )
  }
}

TopologyTab.contextTypes = {
  locale: PropTypes.string
}

const mapStateToProps = (state) =>{
  const { activeFilters = {} } = state.topology

  return {
    activeFilters,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchResources: (resourceType, filters) => {
      const f = lodash.cloneDeep(filters)
      if (f.namespace){
        f.namespace = f.namespace.map(n => n.label)
      }
      if (f.type){
        f.type = f.type.map(n => n.label)
      }
      if (f.label){
        f.label = f.label.map(l => ({ name: l.name, value: l.value }))
      }
      dispatch(fetchResources(resourceType, { filter: {...f}}))
    },
    onSelectedFilterChange: (filterType, filter) => {
      dispatch(updateTopologyFilters(filterType, filter))
    },
    updateSecondaryHeader: title => dispatch(updateSecondaryHeader(title))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TopologyTab))
