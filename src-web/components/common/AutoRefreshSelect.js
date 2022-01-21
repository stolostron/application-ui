// Copyright Contributors to the Open Cluster Management project
'use strict'

import _ from 'lodash'

import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  AcmAutoRefreshSelect,
  AcmRefreshTime
} from '@stolostron/ui-components'

import { getSelectedId } from './QuerySwitcher'
import {
  INITIAL_REFRESH_TIME,
  RESOURCE_TYPES,
  REFRESH_TIMES,
  LOCAL_HUB_NAME
} from '../../../lib/shared/constants'
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
      status,
      isEditTab
    } = this.props

    const refetch = () => {
      // skip refresh, if the page is still refreshing from the previous call, if this is the initial load page
      // or if it's less then 5s from the previous fetch
      const deltaSinceLastUpdate = this.props.resourceRefreshTime
        ? Date.now() - this.props.resourceRefreshTime
        : 6000
      if (
        !_.includes(['IN_PROGRESS', 'INCEPTION'], this.props.status) &&
        deltaSinceLastUpdate > 5000
      ) {
        if (this.props.resourceType === RESOURCE_TYPES.HCM_APPLICATIONS) {
          const search = window.location.search
          const searchItems = search ? new URLSearchParams(search) : undefined
          let cluster = LOCAL_HUB_NAME
          let apiVersion = 'app.k8s.io/v1beta1'
          if (searchItems && searchItems.get('apiVersion')) {
            apiVersion = searchItems.get('apiVersion')
          }
          if (searchItems && searchItems.get('cluster')) {
            cluster = searchItems.get('cluster')
          }
          const name = _.get(this.props.fetchFilters, 'application.name', '')
          const namespace = _.get(
            this.props.fetchFilters,
            'application.namespace',
            ''
          )
          const channel = _.get(
            this.props.fetchFilters,
            'application.channel',
            ''
          )
          const filterWithLocation = {
            application: {
              name,
              namespace,
              channel,
              apiVersion,
              cluster
            }
          }
          fetchAppTopology(filterWithLocation, true) //fetch single app
        } else {
          fetchTableResources(this.props.resourceType, []) //fetch table resources
        }
      }
    }

    return (
      <Fragment>
        {!isEditTab && (
          <div className="auto-refresh">
            <AcmAutoRefreshSelect
              refetch={refetch}
              refreshIntervals={REFRESH_TIMES}
              initPollInterval={INITIAL_REFRESH_TIME}
            />
            <AcmRefreshTime
              timestamp={this.props.resourceRefreshTime || Date.now()}
              reloading={status !== 'DONE'}
            />
          </div>
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
    (routePaths.length === 4 &&
      ['create' || 'argoappset'].indexOf(routePaths[3]) !== -1) //new app or argoappset
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
    resourceRefreshTime: _.get(state[typeListName], 'responseTime'),
    resourceType,
    status,
    fetchFilters,
    forceReload: state[typeListName].forceReload,
    isEditTab: false
  }
}

const mapDispatchToProps = dispatch => {
  const search = window.location.search
  const searchItems = search ? new URLSearchParams(search) : undefined
  let cluster
  let apiVersion = 'app.k8s.io/v1beta1'
  if (searchItems && searchItems.get('apiVersion')) {
    apiVersion = searchItems.get('apiVersion')
  }
  if (searchItems && searchItems.get('cluster')) {
    cluster = searchItems.get('cluster')
  }
  return {
    fetchTableResources: (resourceType, selectedFilters) => {
      dispatch(fetchResources(resourceType, combineFilters(selectedFilters)))
    },
    fetchAppTopology: (fetchFilters, reloading) => {
      const name = _.get(fetchFilters, 'application.name', '')
      const namespace = _.get(fetchFilters, 'application.namespace', '')
      const channel = _.get(fetchFilters, 'application.channel', '')
      const filterApiVersion =
        _.get(fetchFilters, 'application.apiVersion') || apiVersion
      const filterCluster =
        _.get(fetchFilters, 'application.cluster') || cluster
      const filterWithLocation = {
        application: {
          name,
          namespace,
          channel,
          apiVersion: filterApiVersion,
          cluster: filterCluster
        }
      }
      dispatch(
        fetchTopology(
          { filter: { ...filterWithLocation } },
          filterWithLocation,
          reloading
        )
      )
    }
  }
}

AutoRefreshSelect.propTypes = {
  fetchAppTopology: PropTypes.func,
  fetchFilters: PropTypes.object,
  fetchTableResources: PropTypes.func,
  isEditTab: PropTypes.bool,
  resourceRefreshTime: PropTypes.number,
  resourceType: PropTypes.object,
  status: PropTypes.string
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AutoRefreshSelect)
)
