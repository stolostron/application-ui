/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Accordion, AccordionItem, Icon, SkeletonText } from 'carbon-components-react'
import resources from '../../../../lib/shared/resources'
import { fetchTopology } from '../../../actions/topology'
import msgs from '../../../../nls/platform.properties'
import {
  getSearchLinkForOneApplication,
  getAppOverviewCardsData,
  getAppOverviewSubsData
} from '../ResourceOverview/utils'
import {
  startPolling,
  stopPolling,
  handleRefreshPropertiesChanged,
  handleVisibilityChanged
} from '../../../shared/utils/refetch'

/* eslint-disable react/prop-types */

resources(() => {
  require('./style.scss')
})

const mapDispatchToProps = (dispatch, ownProps) => {
  const { selectedAppNS, selectedAppName } = ownProps
  return {
    fetchAppTopology: (fetchChannel, reloading) => {
      const fetchFilters = {
        application: { selectedAppName, selectedAppNS, channel: fetchChannel }
      }
      dispatch(
        fetchTopology({ filter: { ...fetchFilters } }, fetchFilters, reloading)
      )
    }
  }
}

const mapStateToProps = state => {
  const {
    HCMApplicationList,
    topology
  } = state
  return {
    HCMApplicationList,
    topology
  }
}

class OverviewCards extends React.Component {
  static propTypes = {
    fetchAppTopology: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      nodeStatuses: {green: 0, yellow: 0, red: 0, orange: 0},
      appSubscriptions: {subsList: []},
      updateFlags: {nodesLoaded: false, subsLoaded: false},
    }
    // this.reload = this.reload.bind(this)
  }

  componentDidMount() {
    const { fetchAppTopology } = this.props
    const activeChannel = '__ALL__/__ALL__//__ALL__/__ALL__'
    fetchAppTopology(activeChannel, true)

    document.addEventListener('visibilitychange', this.onVisibilityChange)
    startPolling(this, setInterval)
  }

  componentWillUnmount() {
    stopPolling(this.state, clearInterval)
    document.removeEventListener('visibilitychange', this.onVisibilityChange)
  }

  onVisibilityChange = () => {
    handleVisibilityChanged(this, clearInterval, setInterval)
  };

  componentDidUpdate(prevProps) {
    handleRefreshPropertiesChanged(prevProps, this, clearInterval, setInterval)
  }

  // reload() {
  //   const { fetchAppTopology } = this.props
  //   const activeChannel = '__ALL__/__ALL__//__ALL__/__ALL__'
  //   fetchAppTopology(activeChannel, true)
  // }

  render() {
    const {
      HCMApplicationList,
      topology,
      selectedAppName,
      selectedAppNS
    } = this.props
    const { nodeStatuses, appSubscriptions, updateFlags } = this.state
    const { locale } = this.context

    const targetLink = getSearchLinkForOneApplication({
      name: encodeURIComponent(selectedAppName),
      namespace: encodeURIComponent(selectedAppNS),
    })

    const appOverviewCardsData = getAppOverviewCardsData(
      topology,
      selectedAppName,
      selectedAppNS,
      nodeStatuses,
      updateFlags,
      targetLink,
    )

    const appOverviewSubsData = getAppOverviewSubsData(
      HCMApplicationList,
      selectedAppName,
      selectedAppNS,
      appSubscriptions,
      updateFlags
    )

    return (
      <div className={'overview-cards-container'}>
        <OverviewCardsData appOverviewCardsData={appOverviewCardsData} appOverviewSubsData={appOverviewSubsData} locale={locale} />
      </div>
    )
  }
}

const showCardData = (checkData, showData, width) => {
  return checkData !== -1 ? (
    showData
  ) : (
    <SkeletonText width={width} className='loading-skeleton-text' />
  )
}

const createStatusIcons = (nodeStatuses) => {
  return (
    <React.Fragment>
      <div className='status-icon-container green-status'>
        <Icon
          name="icon--checkmark--glyph"
          fill="#3E8635"
          description=""
          className="status-icon"
        />
        <div className='status-count'>
          {nodeStatuses.green}
        </div>
      </div>
      <div className='status-icon-container yellow-status'>
        <Icon
          name="icon--warning--glyph"
          fill="#F0AB00"
          description=""
          className="status-icon"
        />
        <div className='status-count'>
          {nodeStatuses.yellow}
        </div>
      </div>
      <div className='status-icon-container red-status'>
        <Icon
          name="icon--error--glyph"
          fill="#C9190B"
          description=""
          className="status-icon"
        />
        <div className='status-count'>
          {nodeStatuses.red}
        </div>
      </div>
      <div className='status-icon-container orange-status'>
        <Icon
          name="icon--subtract--glyph"
          fill="#5c5c5c"
          description=""
          className="status-icon"
        />
        <div className='status-count'>
          {nodeStatuses.orange}
        </div>
      </div>
    </React.Fragment>
  )
}

const OverviewCardsData = ({ appOverviewCardsData, appOverviewSubsData, locale }) => {
  let getUrl = window.location.href
  getUrl = getUrl.substring(0, getUrl.indexOf('/multicloud/applications/'))

  return (
    <React.Fragment>
      <Accordion>
        <AccordionItem
          open={true}
          title={msgs.get('dashboard.card.overview.cards.title', locale)}
          className='overview-cards-details-section'
        >
          <div className='details-col' id='left-col'>
            <div className='details-item'>
              <div className='details-item-title left-item'>
                {msgs.get('dashboard.card.overview.cards.name')}
              </div>
              <div className='details-item-content'>
                {appOverviewCardsData.appName}
              </div>
            </div>

            <div className='details-item'>
              <div className='details-item-title left-item'>
                {msgs.get('dashboard.card.overview.cards.namespace')}
              </div>
              <div className='details-item-content'>
                {appOverviewCardsData.appNamespace}
              </div>
            </div>

            <div className='details-item'>
              <div className='details-item-title left-item'>
                {msgs.get('dashboard.card.overview.cards.created')}
              </div>
              <div className='details-item-content'>
                {showCardData(
                  appOverviewCardsData.creationTimestamp,
                  appOverviewCardsData.creationTimestamp,
                  '30%'
                )}
              </div>
            </div>
          </div>

          <div className='details-col' id='right-col'>
            <div className='details-item'>
              <div className='details-item-title right-item'>
                {msgs.get('dashboard.card.overview.cards.remote.clusters')}
              </div>
              <div className='details-item-content'>
                {showCardData(
                  appOverviewCardsData.remoteClusterCount,
                  appOverviewCardsData.remoteClusterCount,
                  '30%'
                )}
              </div>
            </div>

            <div className='details-item'>
              <div className='details-item-title right-item'>
                {msgs.get('dashboard.card.overview.cards.cluster.resource.status')}
              </div>
              <div className='details-item-content'>
                {showCardData(
                  appOverviewCardsData.nodeStatuses,
                  createStatusIcons(appOverviewCardsData.nodeStatuses),
                  '30%'
                )}
              </div>
            </div>

            <div className='details-item'>
              <a className='details-item-link' href={(getUrl + appOverviewCardsData.targetLink)} target="_blank">
                <div>
                  {msgs.get('dashboard.card.overview.cards.search.resource')}
                  <Icon
                    name="icon--arrow--right"
                    fill="#0066CC"
                    description=""
                    className="details-item-link-icon"
                  />
                </div>
              </a>
            </div>
          </div>
        </AccordionItem>
      </Accordion>
    </React.Fragment>
  )
}

OverviewCards.propTypes = {}

export default connect(mapStateToProps, mapDispatchToProps)(OverviewCards)
