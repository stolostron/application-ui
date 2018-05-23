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
import { MultiSelect } from 'carbon-components-react'
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

  /**
   * The <MultiSelect> component uses a shallow compare when computing which items
   * are selected. This function helps to make sure that the array of selected items
   * reference the objects from the items array for the shallow compare to work.
   */
  getSelectedFilters = (items = [], selected = []) =>
    items.filter(i => selected.find(f => i.label === f.label))


  handleFilter = filterType => selection => {
    this.props.onSelectedFilterChange(filterType, selection.selectedItems)
  }


  render() {
    const { activeFilters, availableFilters, fetching } = this.props

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
        <MultiSelect
          key={Math.random()}
          type='inline'
          label={msgs.get('resource.type', this.context.locale)}
          items={availableFilters.types}
          initialSelectedItems={this.getSelectedFilters(availableFilters.types, activeFilters.type)}
          onChange={this.handleFilter('type')}
          disabled={fetching}
        />
        <MultiSelect
          type='inline'
          label={msgs.get('resource.namespace', this.context.locale)}
          items={availableFilters.namespaces}
          initialSelectedItems={this.getSelectedFilters(availableFilters.namespaces, activeFilters.namespace)}
          onChange={this.handleFilter('namespace')}
          disabled={fetching}
        />
        <MultiSelect
          type='inline'
          label={msgs.get('resource.label', this.context.locale)}
          items={this.props.availableFilters.labels}
          initialSelectedItems={this.getSelectedFilters(availableFilters.labels, activeFilters.label)}
          onChange={this.handleFilter('label')}
          disabled={fetching}
        />
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
