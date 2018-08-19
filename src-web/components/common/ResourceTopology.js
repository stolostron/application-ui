/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { updateSecondaryHeader } from '../../actions/common'
import { withRouter } from 'react-router-dom'
import msgs from '../../../nls/platform.properties'
import config from '../../../lib/shared/config'
import { getTabs } from '../../../lib/client/resource-helper'
import lodash from 'lodash'
import { fetchTopology, fetchActiveTopologyFilters, updateTopologyFilters } from '../../actions/topology'
import ResourceTopologyDiagram from './ResourceTopologyDiagram'
import ResourceTopologyFilters from './ResourceTopologyFilters'

class ResourceTopology extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.object,
    baseUrl: PropTypes.string,
    fetchActiveTopologyFilters: PropTypes.func,
    fetchTopology: PropTypes.func,
    location: PropTypes.object,
    params: PropTypes.object,
    resourceType: PropTypes.object,
    tabs: PropTypes.array,
    updateSecondaryHeader: PropTypes.func,
  }


  componentWillMount() {
    const { updateSecondaryHeader, baseUrl, params, tabs } = this.props
    // details page mode
    if (params) {
      updateSecondaryHeader(params.name, getTabs(tabs, (tab, index) => {
        return index === 0 ? baseUrl : `${baseUrl}/${tab}`
      }), this.getBreadcrumb())

      // fetch the filters for this resource
      // changing active filtes will then load the toplogy diagram
      this.props.fetchActiveTopologyFilters()
    } else {
    // full tab mode
      updateSecondaryHeader(msgs.get('routes.topology', this.context.locale))
      this.reload()
    }

    if (parseInt(config['featureFlags:liveUpdates']) === 2) {
      var intervalId = setInterval(this.reload.bind(this), config['featureFlags:liveUpdatesPollInterval'])
      this.setState({ intervalId: intervalId })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeFilters !== this.props.activeFilters) {
      this.props.fetchTopology(nextProps.activeFilters)
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId)
  }

  reload() {
    this.props.fetchTopology(this.props.activeFilters)
  }

  render() {
    return (
      <div className={this.props.params ? 'topologyPage': 'topologyTab'}>
        <ResourceTopologyFilters />
        <ResourceTopologyDiagram />
      </div>
    )
  }


  getBreadcrumb() {
    const breadcrumbItems = []
    const { tabs, location, params, resourceType } = this.props,
          { locale } = this.context,
          urlSegments = location.pathname.split('/'),
          lastSegment = urlSegments[urlSegments.length - 1],
          currentTab = tabs.find(tab => tab === lastSegment)

    // The base path, calculated by the current location minus params
    let paramsLength = 0
    lodash.forOwn(params, (value) => {
      if (value) {
        paramsLength++
      }
    })
    breadcrumbItems.push({
      label: msgs.get(`tabs.${resourceType.name.toLowerCase()}`, locale),
      url: urlSegments.slice(0, (urlSegments.length - (paramsLength + (currentTab ? 1 : 0)))).join('/')
    })
    // The details path
    breadcrumbItems.push({
      label: params.name,
      url: currentTab ? location.pathname.replace(`/${currentTab}`, '') : location.pathname
    })

    return breadcrumbItems
  }

}

ResourceTopology.contextTypes = {
  locale: PropTypes.string
}

const mapStateToProps = (state, ownProps) =>{
  const { activeFilters = {} } = state.topology
  const { match: {url}} = ownProps
  const urlSegments = url.split('/')
  urlSegments.pop()
  return {
    activeFilters,
    baseUrl: urlSegments.join('/')
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchTopology: (filters) => {
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
      dispatch(fetchTopology({ filter: {...f}}))
    },
    fetchActiveTopologyFilters: () => {
      const { resourceType, params: {name, namespace}, staticResourceData} = ownProps
      dispatch(fetchActiveTopologyFilters(resourceType, namespace, name, staticResourceData))
    },
    onSelectedFilterChange: (filterType, filter) => {
      dispatch(updateTopologyFilters(filterType, filter))
    },
    updateSecondaryHeader: (title, tabs, breadcrumbItems, links) => dispatch(updateSecondaryHeader(title, tabs, breadcrumbItems, links))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResourceTopology))


