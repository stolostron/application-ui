/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 * Copyright (c) 2021 Red Hat, Inc.
 *******************************************************************************/
'use strict'

import _ from 'lodash'

import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  AcmAutoRefreshSelect,
  AcmRefreshTime
} from '@open-cluster-management/ui-components'

import { getSelectedId } from './QuerySwitcher'
import { RESOURCE_TYPES, REFRESH_TIMES } from '../../../lib/shared/constants'
import { fetchResources } from '../../actions/common'
import { combineFilters } from '../../actions/filters'
import { fetchTopology } from '../../actions/topology'

const getResourceTypeForLocation = location => {
  const defaultOption = location.pathname.includes(
    'multicloud/applications/advanced'
  )
    ? 'subscriptions'
    : 'applications'

  const options = [
    { id: 'applications', resourceType: RESOURCE_TYPES.QUERY_APPLICATIONS },
    {
      id: 'subscriptions',
      resourceType: RESOURCE_TYPES.QUERY_SUBSCRIPTIONS
    },
    {
      id: 'placementrules',
      resourceType: RESOURCE_TYPES.QUERY_PLACEMENTRULES
    },
    { id: 'channels', resourceType: RESOURCE_TYPES.QUERY_CHANNELS }
  ]

  const selectedId = getSelectedId({ location, options, defaultOption })
  const resourceType = options.find(o => o.id === selectedId).resourceType
  const routePaths = location ? _.get(location, 'pathname', '').split('/') : []

  if (defaultOption === 'applications' && routePaths.length === 5) {
    //this is the single app page
    return RESOURCE_TYPES.HCM_APPLICATIONS
  } else {
    //this is one of the resource tables
    return resourceType
  }
}

class AutoRefreshSelect extends Component {
  render() {
    const {
      fetchTableResources,
      fetchAppTopology,
      timestamp,
      status,
      isEditTab
    } = this.props

    const refetch = () => {
      //don't call refresh if the page is still refreshing from the previous call
      //or this is the initial call
      if (!_.includes(['IN_PROGRESS', 'INCEPTION'], this.props.status)) {
        if (this.props.resourceType === RESOURCE_TYPES.HCM_APPLICATIONS) {
          fetchAppTopology(this.props.fetchFilters, true) //fetch single app
        } else {
          fetchTableResources(this.props.resourceType, []) //fetch table resources
        }
      }
    }

    return (
      <Fragment>
        {!isEditTab && (
          <AcmAutoRefreshSelect
            refetch={refetch}
            refreshIntervals={REFRESH_TIMES}
          />
        )}
        {!isEditTab && (
          <AcmRefreshTime timestamp={timestamp} reloading={status !== 'DONE'} />
        )}
      </Fragment>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const location = ownProps.route
  const resourceType = getResourceTypeForLocation(location)
  const routePaths = location ? _.get(location, 'pathname', '').split('/') : []
  const isEditTab =
    routePaths.length === 6 || //edit app
    (routePaths.length === 4 && routePaths[3] === 'create') //new app
  if (isEditTab) {
    //this is the editor tab, the refresh action is not showing here
    return { isEditTab: true }
  }

  let fetchFilters = _.get(state, 'topology.fetchFilters', {})
  if (resourceType === RESOURCE_TYPES.HCM_APPLICATIONS) {
    //make sure the topology stored by state matches the application route
    //if going to the editor from the app table then switch to the Topology tab,
    //the status returns the topology displayed previously by the topology tab
    const name = routePaths[4]
    const namespace = routePaths[3]
    if (
      _.get(state, 'topology.activeFilters.application.name', '') !== name ||
      _.get(state, 'topology.activeFilters.application.namespace', '') !==
        namespace
    ) {
      //need to rebase the state topology to the router app
      fetchFilters = { application: { name, namespace, channel: '' } }
    }
  }
  const typeListName = resourceType.list
  const status = state[typeListName].status
  return {
    timestamp: Date.now(),
    resourceType,
    status,
    fetchFilters,
    forceReload: state[typeListName].forceReload,
    isEditTab: false
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchTableResources: (resourceType, selectedFilters) => {
      dispatch(fetchResources(resourceType, combineFilters(selectedFilters)))
    },
    fetchAppTopology: (fetchFilters, reloading) => {
      dispatch(
        fetchTopology({ filter: { ...fetchFilters } }, fetchFilters, reloading)
      )
    }
  }
}

AutoRefreshSelect.propTypes = {
  fetchAppTopology: PropTypes.func,
  fetchFilters: PropTypes.object,
  fetchTableResources: PropTypes.func,
  isEditTab: PropTypes.bool,
  resourceType: PropTypes.object,
  status: PropTypes.string,
  timestamp: PropTypes.number
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AutoRefreshSelect)
)
