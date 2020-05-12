/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import R from 'ramda'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { SkeletonText } from 'carbon-components-react'
import resources from '../../../../../../lib/shared/resources'
import { RESOURCE_TYPES } from '../../../../../../lib/shared/constants'
import { fetchResources } from '../../../../../actions/common'
import { bindActionCreators } from 'redux'
import * as Actions from '../../../../../actions'
import msgs from '../../../../../../nls/platform.properties'
import {
  getNumIncidents,
  getSubscriptionDataOnHub,
  getSubscriptionDataOnManagedClustersSingle,
  getPodData,
  getIncidentsData,
  concatDataForTextKey,
  concatDataForSubTextKey
} from '../utils'
import { getSearchLinkForOneApplication } from '../../../../common/ResourceOverview/utils'
import config from '../../../../../../lib/shared/config'

/* eslint-disable react/prop-types */

resources(() => {
  require('../style.scss')
})

const mapDispatchToProps = dispatch => {
  return {
    fetchApplications: () =>
      dispatch(fetchResources(RESOURCE_TYPES.QUERY_APPLICATIONS)),
    actions: bindActionCreators(Actions, dispatch)
  }
}

const mapStateToProps = state => {
  const {
    QueryApplicationList,
    CEMIncidentList,
    secondaryHeader,
    AppOverview
  } = state
  const isSingleApplicationView =
    R.pathOr([], ['breadcrumbItems'])(secondaryHeader).length === 2
  const enableCEM = AppOverview.showCEMAction
  return {
    QueryApplicationList,
    CEMIncidentList,
    isSingleApplicationView,
    enableCEM
  }
}

const getOverviewCardsData = (
  QueryApplicationList,
  CEMIncidentList,
  isSingleApplicationView,
  enableCEM,
  applicationName,
  applicationNamespace,
  targetLinkForSubscriptions,
  targetLinkForClusters,
  targetLinkForPods,
  locale
) => {
  // All functions will return -1 if data or data.items is undefined... this will be used for skeleton text load bar
  const subscriptionDataOnHub = getSubscriptionDataOnHub(
    QueryApplicationList,
    isSingleApplicationView,
    applicationName,
    applicationNamespace
  )
  var subscriptionDataOnManagedClusters = getSubscriptionDataOnManagedClustersSingle(
    QueryApplicationList,
    applicationName,
    applicationNamespace
  )
  const podData = getPodData(
    QueryApplicationList,
    applicationName,
    applicationNamespace
  )
  const incidents = getNumIncidents(CEMIncidentList)
  const incidentsData = getIncidentsData(CEMIncidentList)

  const result = [
    {
      msgKey:
        subscriptionDataOnHub.total === 1
          ? msgs.get('dashboard.card.deployment.subscription', locale)
          : msgs.get('dashboard.card.deployment.subscriptions', locale),
      count: subscriptionDataOnHub.total,
      targetLink:
        subscriptionDataOnHub.total === 0 ? '' : targetLinkForSubscriptions,
      textKey: msgs.get('dashboard.card.deployment.subscriptions.text', locale),
      subtextKeyFirst: concatDataForSubTextKey(
        subscriptionDataOnHub.total,
        subscriptionDataOnHub.total,
        subscriptionDataOnHub.failed,
        msgs.get('dashboard.card.deployment.failed.lowercase', locale)
      ),
      subtextKeySecond: concatDataForSubTextKey(
        subscriptionDataOnHub.total,
        subscriptionDataOnHub.noStatus,
        subscriptionDataOnHub.noStatus,
        msgs.get('dashboard.card.deployment.noStatus', locale)
      )
    },
    {
      msgKey:
        subscriptionDataOnManagedClusters.clusters === 1
          ? msgs.get('dashboard.card.deployment.managedCluster', locale)
          : msgs.get('dashboard.card.deployment.managedClusters', locale),
      count: subscriptionDataOnManagedClusters.clusters,
      targetLink:
        subscriptionDataOnManagedClusters.clusters === 0
          ? ''
          : targetLinkForClusters,
      textKey: concatDataForTextKey(
        subscriptionDataOnManagedClusters.clusters,
        subscriptionDataOnManagedClusters.total,
        msgs.get('dashboard.card.deployment.totalSubscription', locale),
        msgs.get('dashboard.card.deployment.totalSubscriptions', locale)
      ),
      subtextKeyFirst: concatDataForSubTextKey(
        subscriptionDataOnManagedClusters.clusters,
        subscriptionDataOnManagedClusters.clusters,
        subscriptionDataOnManagedClusters.failed,
        msgs.get('dashboard.card.deployment.failed.lowercase', locale)
      ),
      subtextKeySecond: concatDataForSubTextKey(
        subscriptionDataOnManagedClusters.clusters,
        subscriptionDataOnManagedClusters.noStatus,
        subscriptionDataOnManagedClusters.noStatus,
        msgs.get('dashboard.card.deployment.noStatus', locale)
      )
    },
    {
      msgKey:
        podData.total === 1
          ? msgs.get('dashboard.card.deployment.pod', locale)
          : msgs.get('dashboard.card.deployment.pods', locale),
      count: podData.total,
      targetLink: podData.total === 0 ? '' : targetLinkForPods,
      subtextKeyFirst: concatDataForSubTextKey(
        podData.total,
        podData.total,
        podData.running,
        msgs.get('dashboard.card.deployment.running', locale)
      ),
      subtextKeySecond: concatDataForSubTextKey(
        podData.total,
        podData.total,
        podData.failed,
        msgs.get('dashboard.card.deployment.failed.lowercase', locale)
      )
    }
  ]

  if (enableCEM) {
    result.push({
      msgKey:
        incidents === 1
          ? msgs.get('dashboard.card.deployment.incident', locale)
          : msgs.get('dashboard.card.deployment.incidents', locale),
      count: incidents,
      alert: incidents > 0 ? true : false,
      targetTab: incidents === 0 ? null : 2,
      subtextKeyFirst: concatDataForSubTextKey(
        incidents,
        incidents,
        incidentsData.priority1,
        msgs.get('dashboard.card.deployment.incidents.priority1', locale)
      ),
      subtextKeySecond: concatDataForSubTextKey(
        incidents,
        incidents,
        incidentsData.priority2,
        msgs.get('dashboard.card.deployment.incidents.priority2', locale)
      )
    })
  }
  return result
}

class OverviewCards extends React.Component {
  componentDidMount() {
    const { fetchApplications } = this.props

    fetchApplications()

    this.startPolling()
    document.addEventListener('visibilitychange', this.onVisibilityChange)
  }

  componentWillUnmount() {
    this.stopPolling()
    document.removeEventListener('visibilitychange', this.onVisibilityChange)
  }

  startPolling() {
    if (parseInt(config['featureFlags:liveUpdates'], 10) === 2) {
      var intervalId = setInterval(
        this.reload.bind(this),
        config['featureFlags:liveUpdatesPollInterval']
      )
      this.setState({ intervalId: intervalId })
    }
  }

  stopPolling() {
    if (this.state && this.state.intervalId) {
      clearInterval(this.state.intervalId)
    }
  }

  onVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      this.startPolling()
    } else {
      this.stopPolling()
    }
  };

  reload() {
    const { fetchApplications } = this.props
    fetchApplications()
  }

  render() {
    const {
      QueryApplicationList,
      CEMIncidentList,
      isSingleApplicationView,
      enableCEM,
      actions,
      selectedAppName,
      selectedAppNS
    } = this.props
    const { locale } = this.context
    const singleAppStyle = isSingleApplicationView ? ' single-app' : ''
    const applicationName = selectedAppName
    const applicationNamespace = selectedAppNS

    const targetLinkForSubscriptions = getSearchLinkForOneApplication({
      name: encodeURIComponent(applicationName),
      showRelated: 'subscription'
    })
    const targetLinkForClusters = getSearchLinkForOneApplication({
      name: encodeURIComponent(applicationName),
      showRelated: 'cluster'
    })
    const targetLinkForPods = getSearchLinkForOneApplication({
      name: encodeURIComponent(applicationName),
      showRelated: 'pod'
    })

    const overviewCardsData = getOverviewCardsData(
      QueryApplicationList,
      CEMIncidentList,
      isSingleApplicationView,
      enableCEM,
      applicationName,
      applicationNamespace,
      targetLinkForSubscriptions,
      targetLinkForClusters,
      targetLinkForPods,
      locale
    )

    return (
      <div className={'overview-cards-info' + singleAppStyle}>
        <InfoCards overviewCardsData={overviewCardsData} actions={actions} />
      </div>
    )
  }
}

const showCardData = (cardCount, width, className) => {
  return cardCount !== -1 ? (
    cardCount
  ) : (
    <SkeletonText width={width} className={className} />
  )
}

const InfoCards = ({ overviewCardsData, actions }) => {
  return (
    <React.Fragment>
      {Object.keys(overviewCardsData).map(key => {
        const card = overviewCardsData[key]
        const id = `${key}_overviewCardsData`
        var cemStatus = 'card-cem-disabled'
        if (overviewCardsData.length === 4) {
          cemStatus = 'card-cem-enabled'
        }
        const handleClick = (e, resource) => {
          if (resource.targetTab != null) {
            actions.setSelectedAppTab(resource.targetTab)
          } else if (resource.targetLink) {
            window.open(resource.targetLink, '_blank')
          }
        }
        const handleKeyPress = (e, resource) => {
          if (e.key === 'Enter') {
            handleClick(e, resource)
          }
        }

        return (
          <React.Fragment key={key}>
            <div
              id={id}
              key={card}
              className={
                card.targetLink || card.targetTab
                  ? `single-card clickable ${cemStatus}`
                  : `single-card ${cemStatus}`
              }
              role="button"
              tabIndex="0"
              onClick={e => handleClick(e, card)}
              onKeyPress={e => handleKeyPress(e, card)}
            >
              <div className={card.alert ? 'card-count alert' : 'card-count'}>
                {showCardData(
                  card.count,
                  '60%',
                  'loading-skeleton-text-header'
                )}
              </div>
              <div className="card-type">{card.msgKey}</div>
              <div className="card-text">
                {showCardData(card.textKey, '80%', 'loading-skeleton-text-lrg')}
              </div>
              {(card.subtextKeyFirst || card.subtextKeySecond) && (
                <div className="row-divider" />
              )}
              {card.subtextKeyFirst && (
                <div className="card-subtext">
                  {showCardData(
                    card.subtextKeyFirst,
                    '40%',
                    'loading-skeleton-text-sm'
                  )}
                </div>
              )}
              {card.subtextKeySecond && (
                <div className="card-subtext">
                  {showCardData(
                    card.subtextKeySecond,
                    '60%',
                    'loading-skeleton-text-med'
                  )}
                </div>
              )}
            </div>
            {key < Object.keys(overviewCardsData).length - 1 && (
              <div className="column-divider" />
            )}
          </React.Fragment>
        )
      })}
    </React.Fragment>
  )
}

InfoCards.propTypes = {
  actions: PropTypes.object,
  overviewCardsData: PropTypes.array
}

OverviewCards.propTypes = {}

export default connect(mapStateToProps, mapDispatchToProps)(OverviewCards)
