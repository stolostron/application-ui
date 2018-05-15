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
import { InlineNotification, MultiSelect } from 'carbon-components-react'
import lodash from 'lodash'
import { RESOURCE_TYPES } from '../../lib/shared/constants'
import { updateSecondaryHeader, fetchResources } from '../actions/common'
import resources from '../../lib/shared/resources'
import headerMsgs from '../../nls/header.properties'
import msgs from '../../nls/platform.properties'
import * as Actions from '../actions'
import { updateTopologyFilters } from '../actions/topology'
import DiagramWithDetails from './DiagramWithDetails'

resources(() => {
  require('../../scss/clusters.scss')
})


class TopologyTab extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.shape({
      clusters: PropTypes.arrayOf(PropTypes.string),
      labels: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        value: PropTypes.string,
      })),
      namespaces: PropTypes.arrayOf(PropTypes.string),
      types: PropTypes.arrayOf(PropTypes.string),
    }),
    availableFilters: PropTypes.shape({
      clusters: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
      })),
      labels: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
      })),
      namespaces: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
      })),
      types: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
      })),
    }),
    fetchResources: PropTypes.func,
    onSelectedFilterChange: PropTypes.func,
    updateSecondaryHeader: PropTypes.func,
  }

  // FIXME: Move this to the container. May need to use `mergeProps`.
  componentWillReceiveProps(nextProps) {
    if (nextProps.activeFilters !== this.props.activeFilters) {
      this.props.fetchResources(RESOURCE_TYPES.HCM_TOPOLOGY, nextProps.activeFilters)
    }
  }

  // Workaround: The <MultiSelect> component isn't remembering the selections during a
  // re-render as we'd expect, so I'm minimizing the number of re-renders to avoid
  // this problem. Will need to look closely at the Carbon implementation for a better
  // long term solution.
  shouldComponentUpdate(nextProps) {
    return !lodash.isEqual(this.props.availableFilters, nextProps.availableFilters)
  }

  componentWillMount() {
    this.props.updateSecondaryHeader(headerMsgs.get('routes.topology', this.context.locale))
    this.props.fetchResources(RESOURCE_TYPES.HCM_TOPOLOGY, this.props.activeFilters)
  }

  handleFilter = filterType => selection => {
    this.props.onSelectedFilterChange(filterType, selection.selectedItems)
  }


  render() {
    const { activeFilters, availableFilters } = this.props

    return (
      <div className='topologyOnly'>
        {status === Actions.REQUEST_STATUS.ERROR &&
          <InlineNotification
            kind="error"
            title={msgs.get('error', this.context.locale)}
            subtitle={msgs.get('error.default.description', this.context.locale)}
            iconDescription={msgs.get('error.dismiss', this.context.locale)}
          />
        }
        <div className='diagramActionBar'>
          {/* WIP: Add filter by cluster
          availableFilters.clusters.length > 0 && <MultiSelect
            type='inline'
            label={msgs.get('filter.cluster', this.context.locale)}
            items={this.props.availableFilters.clusters}
            initialSelectedItems={this.props.availableFilters.clusters}
            onChange={this.handleFilter('cluster')}
          /> */}
          {availableFilters.types.length > 0 && <MultiSelect
            type='inline'
            label={msgs.get('filter.type', this.context.locale)}
            items={availableFilters.types}
            initialSelectedItems={activeFilters.type}
            onChange={this.handleFilter('type')}
          />}
          {availableFilters.namespaces.length > 0 && <MultiSelect
            type='inline'
            label={msgs.get('filter.namespace', this.context.locale)}
            items={availableFilters.namespaces}
            onChange={this.handleFilter('namespace')}
          />}
          {availableFilters.labels.length > 0 && <MultiSelect
            type='inline'
            label={msgs.get('filter.label', this.context.locale)}
            items={this.props.availableFilters.labels}
            onChange={this.handleFilter('label')}
          /> }
          {/* status === Actions.REQUEST_STATUS.IN_PROGRESS &&
            <Loading small withOverlay={false} />
          */}
        </div>
        <DiagramWithDetails />
      </div>
    )
  }
}

TopologyTab.contextTypes = {
  locale: PropTypes.string
}

const mapStateToProps = (state) =>{
  const { activeFilters = {}, availableFilters = {} } = state.topology

  return {
    activeFilters,
    availableFilters: lodash.cloneDeep(availableFilters),
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
