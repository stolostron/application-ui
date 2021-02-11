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

export const getResourceTypeForLocation = location => {
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
      status
    } = this.props

    const refetch = () => {
      //don't call refresh if the page is still refreshing from the previous call
      //or this is the initial call
      if (
        this.props.status !== 'IN_PROGRESS' &&
        this.props.status !== 'INCEPTION'
      ) {
        if (this.props.resourceType === RESOURCE_TYPES.HCM_APPLICATIONS) {
          fetchAppTopology(
            this.props.topologyFilters,
            this.props.topologyReloading
          )
        } else {
          fetchTableResources(this.props.resourceType, [])
        }
      }
    }

    return (
      <Fragment>
        <AcmAutoRefreshSelect
          refetch={refetch}
          refreshIntervals={REFRESH_TIMES}
        />
        <AcmRefreshTime timestamp={timestamp} reloading={status !== 'DONE'} />
      </Fragment>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const resourceType = getResourceTypeForLocation(ownProps.location)
  const typeListName = resourceType.list
  const status = state[typeListName].status
  return {
    timestamp: Date.now(),
    resourceType,
    status,
    topologyFilters: state.topology ? state.topology.fetchFilters : {},
    topologyReloading: state.topology ? state.topology.reloading : undefined,
    forceReload: state[typeListName].forceReload
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
  fetchTableResources: PropTypes.func,
  resourceType: PropTypes.object,
  status: PropTypes.string,
  timestamp: PropTypes.number,
  topologyFilters: PropTypes.object,
  topologyReloading: PropTypes.string
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AutoRefreshSelect)
)
