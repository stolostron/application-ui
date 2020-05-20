/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Loading, Notification } from 'carbon-components-react'
import SearchName from './viewer/SearchName'
import TypeFilterBar, { setActiveTypeFilters } from './viewer/TypeFilterBar'
import RefreshTimeSelect from './viewer/RefreshTimeSelect'
import ResourceFilterModule from './viewer/ResourceFilterModule'
import ChannelControl from './viewer/ChannelControl'
import DiagramViewer from './viewer/DiagramViewer'
import {
  REFRESH_TIMES,
  TOPOLOGY_REFRESH_INTERVAL_COOKIE,
  TOPOLOGY_TYPE_FILTER_COOKIE
} from './viewer/constants'
import { getResourceDefinitions } from './viewer/defaults'
import './scss/topology-details.scss'
import './scss/topology-diagram.scss'
import msgs from '../../../nls/platform.properties'
import _ from 'lodash'

class Topology extends React.Component {
  static propTypes = {
    channelControl: PropTypes.shape({
      allChannels: PropTypes.array,
      activeChannel: PropTypes.string,
      isChangingChannel: PropTypes.bool,
      changeTheChannel: PropTypes.func
    }),
    fetchControl: PropTypes.shape({
      isLoaded: PropTypes.bool,
      isReloading: PropTypes.bool,
      isFailed: PropTypes.bool,
      refetch: PropTypes.func
    }),
    links: PropTypes.array.isRequired,
    locale: PropTypes.string,
    nodes: PropTypes.array.isRequired,
    options: PropTypes.object,
    portals: PropTypes.object,
    processActionLink: PropTypes.func,
    searchUrl: PropTypes.string,
    selectionControl: PropTypes.shape({
      selectedNode: PropTypes.object,
      handleNodeSelected: PropTypes.func
    }),
    startPolling: PropTypes.func,
    stopPolling: PropTypes.func,
    styles: PropTypes.shape({
      shapes: PropTypes.object
    }),
    title: PropTypes.string
  };

  constructor(props) {
    super(props)
    this.state = {
      isLoaded: true,
      searchName: '',
      availableFilters: {},
      activeFilters: {},
      otherTypeFilters: []
    }

    // merge styles and options with defaults
    const { styles, options, searchUrl } = props
    this.staticResourceData = getResourceDefinitions(
      styles,
      options,
      searchUrl
    )

    // what cookie to use to save/restore type filter bar changes
    this.typeFilterCookie = `${TOPOLOGY_TYPE_FILTER_COOKIE}--${
      window.location.href
    }--${options.filtering}`
    this.knownTypes = setActiveTypeFilters(
      this.typeFilterCookie,
      this.state.activeFilters
    )
  }

  componentWillReceiveProps(nextProps) {
    this.setState(prevState => {
      let { timestamp } = prevState
      const { userIsFiltering } = prevState
      const { nodes, fetchControl = {} } = nextProps
      const { isLoaded = true, isReloading = false } = fetchControl
      if (!_.isEqual(nodes, this.props.nodes) && !isReloading) {
        timestamp = new Date().toString()
      }
      this.staticResourceData.updateNodeStatus(nodes, this.props.locale)
      const {
        availableFilters,
        activeFilters,
        otherTypeFilters
      } = this.staticResourceData.getAllFilters(
        isLoaded,
        nodes,
        this.props.options,
        prevState.activeFilters,
        this.knownTypes,
        userIsFiltering,
        this.props.locale
      )
      return {
        isLoaded,
        timestamp,
        availableFilters,
        activeFilters,
        otherTypeFilters
      }
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !_.isEqual(
        this.props.nodes.map(n => n.uid),
        nextProps.nodes.map(n => n.uid)
      ) ||
      !_.isEqual(
        this.props.links.map(n => n.uid),
        nextProps.links.map(n => n.uid)
      ) ||
      !_.isEqual(this.props.fetchControl, nextProps.fetchControl) ||
      !_.isEqual(this.props.channelControl, nextProps.channelControl) ||
      !_.isEqual(this.state.availableFilters, nextState.availableFilters) ||
      !_.isEqual(this.state.activeFilters, nextState.activeFilters) ||
      this.state.searchName !== nextState.searchName ||
      this.state.fetchChannel !== nextState.fetchChannel ||
      this.state.isLoaded !== nextState.isLoaded
    )
  }

  render() {
    const { fetchControl = {}, locale } = this.props
    const { isFailed = false } = fetchControl

    if (isFailed) {
      return (
        <Notification
          title=""
          className="persistent"
          subtitle={msgs.get('error.default.description', locale)}
          kind="error"
        />
      )
    }

    // if everything succeeds, show topology
    return this.renderTopology()
  }

  renderTopology() {
    const {
      title,
      nodes,
      links,
      options,
      styles,
      fetchControl = {},
      selectionControl = {},
      channelControl = {},
      processActionLink,
      locale
    } = this.props
    const { isLoaded = true, isReloading = false } = fetchControl
    const { isChangingChannel = false } = channelControl
    const { selectedNode, handleNodeSelected } = selectionControl
    const { searchName = '', activeFilters, availableFilters } = this.state
    return (
      <div className="topologyDiagramContainer">
        {this.renderRefreshTime()}
        {this.renderRefreshTimeSelect()}
        {this.renderResourceFilterModule()}
        {this.renderSearchName()}
        {this.renderTypeFilterBar()}
        {this.renderChannelControls()}
        <DiagramViewer
          title={title}
          nodes={nodes}
          links={links}
          options={options}
          styles={styles}
          isReloading={isReloading}
          secondaryLoad={isChangingChannel || !isLoaded}
          selectedNode={selectedNode}
          handleNodeSelected={handleNodeSelected}
          searchName={searchName}
          processActionLink={processActionLink}
          locale={locale}
          activeFilters={activeFilters}
          availableFilters={availableFilters}
          staticResourceData={this.staticResourceData}
        />
      </div>
    )
  }

  renderRefreshTime() {
    const { fetchControl = {}, locale } = this.props
    const { isLoaded = true, isReloading = false } = fetchControl
    const { timestamp = new Date().toString() } = this.state
    if (isLoaded) {
      const time = msgs.get(
        'overview.menu.last.update',
        [new Date(timestamp).toLocaleTimeString(locale)],
        locale
      )
      return (
        <div className="refresh-time-container">
          {isReloading && (
            <div className="reloading-container">
              <Loading withOverlay={false} small />
            </div>
          )}
          <div>{time}</div>
        </div>
      )
    }
    return null
  }

  renderRefreshTimeSelect() {
    const {
      portals = {},
      fetchControl,
      startPolling,
      stopPolling
    } = this.props
    const { refreshTimeSelectorPortal } = portals
    if (fetchControl && refreshTimeSelectorPortal) {
      var portal = document.getElementById(refreshTimeSelectorPortal)
      if (portal) {
        const { isReloading, refetch } = fetchControl
        return ReactDOM.createPortal(
          <RefreshTimeSelect
            refreshValues={REFRESH_TIMES}
            refreshCookie={TOPOLOGY_REFRESH_INTERVAL_COOKIE}
            isReloading={isReloading}
            startPolling={startPolling}
            stopPolling={stopPolling}
            refetch={refetch}
          />,
          portal
        )
      }
    }
    return null
  }

  renderResourceFilterModule() {
    const { portals = {} } = this.props
    const { assortedFilterOpenBtn } = portals
    if (assortedFilterOpenBtn) {
      var portal = document.getElementById(assortedFilterOpenBtn)
      if (portal) {
        const { availableFilters, activeFilters } = this.state
        return ReactDOM.createPortal(
          <ResourceFilterModule
            portals={portals}
            activeFilters={activeFilters}
            availableFilters={availableFilters}
            updateActiveFilters={this.onFilterChange.bind(this)}
            locale={this.props.locale}
          />,
          portal
        )
      }
    }
    return null
  }

  renderTypeFilterBar() {
    const { portals = {}, locale } = this.props
    const { typeFilterBar } = portals
    if (typeFilterBar) {
      var portal = document.getElementById(typeFilterBar)
      if (portal) {
        const {
          availableFilters,
          activeFilters,
          otherTypeFilters
        } = this.state
        const filterBarTooltipMap = {
          other: otherTypeFilters.join('\n')
        }
        return ReactDOM.createPortal(
          <TypeFilterBar
            availableFilters={availableFilters['type']}
            activeFilters={activeFilters['type']}
            typeToShapeMap={this.staticResourceData.typeToShapeMap}
            tooltipMap={filterBarTooltipMap}
            typeFilterCookie={this.typeFilterCookie}
            updateActiveFilters={this.onFilterChange.bind(this)}
            locale={locale}
          />,
          portal
        )
      }
    }
    return null
  }

  onFilterChange(activeFilters) {
    this.setState(prevState => {
      // update active filters
      activeFilters = Object.assign({}, prevState.activeFilters, activeFilters)

      // update available filter view filters
      const { nodes, options, locale } = this.props
      const availableFilters = Object.assign(
        {},
        prevState.availableFilters,
        this.staticResourceData.getAvailableFilters(
          nodes,
          options,
          activeFilters,
          locale
        )
      )

      return { activeFilters, availableFilters, userIsFiltering: true }
    })
  }

  renderSearchName() {
    const { portals = {}, locale } = this.props
    const { searchTextbox } = portals
    if (searchTextbox) {
      var portal = document.getElementById(searchTextbox)
      if (portal) {
        const { searchName } = this.state
        return ReactDOM.createPortal(
          <SearchName
            searchName={searchName}
            onNameSearch={this.onNameSearch.bind(this)}
            locale={locale}
          />,
          portal
        )
      }
    }
    return null
  }

  onNameSearch(searchName) {
    this.setState({ searchName })
  }

  renderChannelControls() {
    const { channelControl = {}, locale } = this.props
    const { allChannels } = channelControl
    if (allChannels) {
      return <ChannelControl channelControl={channelControl} locale={locale} />
    }
    return null
  }
}

export default Topology
