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
import lodash from 'lodash'
import { RESOURCE_TYPES } from '../../lib/shared/constants'
import { updateSecondaryHeader, fetchResources } from '../actions/common'
import msgs from '../../nls/platform.properties'
import { updateTopologyFilters } from '../actions/topology'
import DiagramWithDetails from './DiagramWithDetails'
import TopologyFiltersContainer from './TopologyFiltersContainer'
import config from '../../lib/shared/config'


class TopologyTab extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.object,
    fetchResources: PropTypes.func,
    updateSecondaryHeader: PropTypes.func,
  }


  componentWillMount() {
    this.props.updateSecondaryHeader(msgs.get('routes.topology', this.context.locale))
    if (parseInt(config['featureFlags:liveUpdates']) === 2) {
      var intervalId = setInterval(this.reload.bind(this), config['featureFlags:liveUpdatesPollInterval'])
      this.setState({ intervalId: intervalId })
    }
    this.reload()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeFilters !== this.props.activeFilters) {
      this.props.fetchResources(RESOURCE_TYPES.HCM_TOPOLOGY, nextProps.activeFilters)
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId)
  }

  reload() {
    this.props.fetchResources(RESOURCE_TYPES.HCM_TOPOLOGY, this.props.activeFilters)
  }

  render() {
    return (
      <div className='topologyTab'>
        <TopologyFiltersContainer />
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
      if (f.cluster){
        // Each cluster label can be associated with multiple filterValues
        // This creates a single list of values for the clusters filter.
        let clusterFilters = []
        f.cluster.forEach(n => {
          clusterFilters = lodash.union(clusterFilters, n.filterValues)
        })
        f.cluster = clusterFilters
      }
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
