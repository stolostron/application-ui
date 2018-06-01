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
import FilterableMultiSelect from '../components/common/FilterableMultiSelect'
import resources from '../../lib/shared/resources'
import msgs from '../../nls/platform.properties'
import { fetchTopologyFilters, updateTopologyFilters } from '../actions/topology'
import * as Actions from '../actions'

resources(() => {
  require('../../scss/topology-diagram.scss')
})


const filterItemShape = PropTypes.shape({
  label: PropTypes.string.isRequired,
  name: PropTypes.string,
  value: PropTypes.string,
})

class TopologyFiltersContainer extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.shape({
      clusters: PropTypes.arrayOf(filterItemShape),
      labels: PropTypes.arrayOf(filterItemShape),
      namespaces: PropTypes.arrayOf(filterItemShape),
      types: PropTypes.arrayOf(filterItemShape),
    }),
    availableFilters: PropTypes.shape({
      clusters: PropTypes.arrayOf(filterItemShape),
      labels: PropTypes.arrayOf(filterItemShape),
      namespaces: PropTypes.arrayOf(filterItemShape),
      types: PropTypes.arrayOf(filterItemShape),
    }),
    fetchFilters: PropTypes.func,
    fetching: PropTypes.bool,
    onSelectedFilterChange: PropTypes.func,
  }

  componentWillMount() {
    this.props.fetchFilters()
  }

  render() {
    const { activeFilters, availableFilters, fetching, onSelectedFilterChange } = this.props

    const filters = [
      {
        type: 'namespace',
        titleKey: 'resource.namespaces',
        availableKey: 'namespaces',
        activeKey: 'namespace'
      },
      {
        type: 'label',
        titleKey: 'resource.labels',
        availableKey: 'labels',
        activeKey: 'label'
      },
      {
        type: 'type',
        titleKey: 'resource.types',
        availableKey: 'types',
        activeKey: 'type'
      },
    ]
    return (
      <div className='topologyFilters'>
        {/* TODO: Add filter by cluster
        availableFilters.clusters.length > 0 && <MultiSelect
          type='inline'
          label={msgs.get('resource.cluster', this.context.locale)}
          items={this.props.availableFilters.clusters}
          initialSelectedItems={this.props.availableFilters.clusters}
          onChange={this.handleFilter('cluster')}
        /> */}
        {filters.map((filter) =>
          <FilterableMultiSelect
            key={Math.random()}
            filterType={filter.type}
            title={msgs.get(filter.titleKey, this.context.locale)}
            availableFilters={availableFilters[filter.availableKey]}
            activeFilters={activeFilters[filter.activeKey]}
            onChange={onSelectedFilterChange}
            disabled={fetching} />
        )}
      </div>
    )
  }
}

TopologyFiltersContainer.contextTypes = {
  locale: PropTypes.string
}


const mapStateToProps = (state) =>{
  const { activeFilters = {}, availableFilters = {}, filtersStatus } = state.topology

  return {
    activeFilters,
    availableFilters,
    fetching: filtersStatus !== Actions.REQUEST_STATUS.DONE,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchFilters: () => dispatch(fetchTopologyFilters()),
    onSelectedFilterChange: (filterType, filter) => {
      dispatch(updateTopologyFilters(filterType, filter))
    },
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TopologyFiltersContainer))
