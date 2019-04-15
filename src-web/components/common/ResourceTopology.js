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
import classNames from 'classnames'
import * as Actions from '../../actions'
import msgs from '../../../nls/platform.properties'
import NoResource from '../common/NoResource'
import AutoRefreshSelect, {getPollInterval} from './AutoRefreshSelect'
import { TOPOLOGY_REFRESH_INTERVAL_COOKIE, REFRESH_TIMES } from '../../../lib/shared/constants'
import { fetchTopology,  updateTopologyFilters } from '../../actions/topology'
import ResourceTopologyDiagram from './ResourceTopologyDiagram'
import ResourceTopologyFilters from './ResourceTopologyFilters'
import lodash from 'lodash'

class ResourceTopology extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.object,
    availableFilters: PropTypes.object,
    fetchTopology: PropTypes.func,
    location: PropTypes.object,
    otherTypeFilters: PropTypes.array,
    params: PropTypes.object,
    resourceType: PropTypes.object,
    restoreSavedTopologyFilters: PropTypes.func,
    savingFilters: PropTypes.bool,
    staticResourceData: PropTypes.object,
    status: PropTypes.string,
    tabs: PropTypes.array,
    updateSecondaryHeader: PropTypes.func,
  }


  constructor (props) {
    super(props)
    this.state = {
      loaded:false,
      firstLoad:false
    }
    this.startPolling = this.startPolling.bind(this)
    this.stopPolling = this.stopPolling.bind(this)
    this.refetch = this.refetch.bind(this)
  }

  componentWillMount() {
    const { updateSecondaryHeader } = this.props
    updateSecondaryHeader(msgs.get('routes.topology', this.context.locale))
    // changing active filters will then load the toplogy diagram
    this.props.restoreSavedTopologyFilters()
    this.startPolling()
  }

  componentWillUnmount() {
    if (this.state) {
      this.stopPolling()
    }
  }

  startPolling(newInterval) {
    this.stopPolling()
    let intervalId = undefined
    const interval = newInterval || getPollInterval(TOPOLOGY_REFRESH_INTERVAL_COOKIE)
    if (interval) {
      intervalId = setInterval(this.refetch, Math.max(interval, 5*1000))
    }
    this.setState({ intervalId: intervalId })
  }

  stopPolling() {
    const {intervalId} = this.state
    if (intervalId)
      clearInterval(intervalId)
    this.setState({ intervalId: undefined })
  }

  refetch() {
    const { activeFilters, otherTypeFilters } = this.props
    this.props.fetchTopology(activeFilters, otherTypeFilters)
  }

  componentWillReceiveProps(nextProps) {
    let { loaded, firstLoad } = this.state
    const { activeFilters, otherTypeFilters, savingFilters, status } = nextProps
    if (!lodash.isEqual(activeFilters, this.props.activeFilters) ||
        savingFilters !== this.props.savingFilters) {
      loaded = false
      this.props.fetchTopology(activeFilters, otherTypeFilters)
    } else {
      // prevent loading... message when just doing a live update
      loaded = (loaded || status === Actions.REQUEST_STATUS.DONE
          || status === Actions.REQUEST_STATUS.ERROR)
        && lodash.isEqual(activeFilters, this.props.activeFilters)
    }
    firstLoad = firstLoad || loaded
    this.setState({ loaded, firstLoad })
  }

  shouldComponentUpdate(nextProps){
    return !lodash.isEqual(this.props.activeFilters, nextProps.activeFilters) ||
      nextProps.status !== this.props.status
  }

  setTopologyContainerRef = ref => {this.topologyContainerRef = ref}
  setDiagramShown = shown => {
    if (this.topologyContainerRef) {
      this.topologyContainerRef.classList.toggle('diagram-shown', shown)
    }
  }

  render() {
    const { loaded, firstLoad } = this.state
    const { availableFilters ={}, params, otherTypeFilters, staticResourceData} = this.props
    if (availableFilters.cluster && availableFilters.cluster.length === 0) {
      return (
        <div className='topologyTab'>
          <div className='topologyNoCluster'>
            <NoResource
              title={msgs.get('no-cluster.title')}
              detail={msgs.get('no-cluster.detail')}>
            </NoResource>
          </div>
        </div>
      )
    }
    const classnames = classNames('topologyTab', {'first-load diagram-shown': firstLoad})
    return (
      <div className={classnames} ref={this.setTopologyContainerRef} >
        <ResourceTopologyFilters params={params||{}}
          staticResourceData={staticResourceData}
          otherTypeFilters={otherTypeFilters} />
        <div className='topology-diagram-toolbar' >
          <AutoRefreshSelect
            startPolling={this.startPolling}
            stopPolling={this.stopPolling}
            pollInterval={getPollInterval(TOPOLOGY_REFRESH_INTERVAL_COOKIE)}
            refetch={this.refetch}
            refreshValues = {REFRESH_TIMES}
            refreshCookie={TOPOLOGY_REFRESH_INTERVAL_COOKIE}
          />
        </div>
        <ResourceTopologyDiagram loaded={loaded} setDiagramShown={this.setDiagramShown} />
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
  const { activeFilters = {}, otherTypeFilters, savingFilters, status } = state.topology
  const { match: {url}} = ownProps
  const urlSegments = url.split('/')
  urlSegments.pop()
  return {
    activeFilters,
    otherTypeFilters,
    savingFilters,
    baseUrl: urlSegments.join('/'),
    status
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchTopology: (filters, otherTypeFilters) => {
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
        // if user selected 'other' type use these instead
        const idx = f.type.indexOf('other')
        if (idx!==-1) {
          f.type.splice(idx, 1, ...otherTypeFilters)
        }
      }
      if (f.label){
        f.label = f.label.map(l => ({ name: l.name, value: l.value }))
      }
      dispatch(fetchTopology({ filter: {...f}}, filters))
    },
    restoreSavedTopologyFilters: () => {
      dispatch({type: Actions.TOPOLOGY_RESTORE_SAVED_FILTERS})
    },
    onSelectedFilterChange: (filterType, filter) => {
      const { params: {name, namespace}} = ownProps
      dispatch(updateTopologyFilters(filterType, filter, namespace, name))
    },
    updateSecondaryHeader: (title, tabs, breadcrumbItems, links) => dispatch(updateSecondaryHeader(title, tabs, breadcrumbItems, links))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResourceTopology))


