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
  getIncidentsData
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
      subtextKeyFirst:
        subscriptionDataOnHub.total === -1
          ? -1
          : subscriptionDataOnHub.total > 0
            ? subscriptionDataOnHub.failed
              .toString()
              .concat(
                ' ',
                msgs.get('dashboard.card.deployment.failed.lowercase', locale)
              )
            : '',
      subtextKeySecond:
        subscriptionDataOnHub.total === -1
          ? -1
          : subscriptionDataOnHub.noStatus > 0
            ? subscriptionDataOnHub.noStatus
              .toString()
              .concat(
                ' ',
                msgs.get('dashboard.card.deployment.noStatus', locale)
              )
            : ''
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
      textKey:
        subscriptionDataOnManagedClusters.clusters === -1
          ? -1
          : subscriptionDataOnManagedClusters.total
            .toString()
            .concat(
              ' ',
              subscriptionDataOnManagedClusters.total === 1
                ? msgs.get(
                  'dashboard.card.deployment.totalSubscription',
                  locale
                )
                : msgs.get(
                  'dashboard.card.deployment.totalSubscriptions',
                  locale
                )
            ),
      subtextKeyFirst:
        subscriptionDataOnManagedClusters.clusters === -1
          ? -1
          : subscriptionDataOnManagedClusters.clusters > 0
            ? subscriptionDataOnManagedClusters.failed
              .toString()
              .concat(
                ' ',
                msgs.get('dashboard.card.deployment.failed.lowercase', locale)
              )
            : '',
      subtextKeySecond:
        subscriptionDataOnManagedClusters.clusters === -1
          ? -1
          : subscriptionDataOnManagedClusters.noStatus > 0
            ? subscriptionDataOnManagedClusters.noStatus
              .toString()
              .concat(
                ' ',
                msgs.get('dashboard.card.deployment.noStatus', locale)
              )
            : ''
    },
    {
      msgKey:
        podData.total === 1
          ? msgs.get('dashboard.card.deployment.pod', locale)
          : msgs.get('dashboard.card.deployment.pods', locale),
      count: podData.total,
      targetLink: podData.total === 0 ? '' : targetLinkForPods,
      subtextKeyFirst:
        podData.total === -1
          ? -1
          : podData.total > 0
            ? podData.running
              .toString()
              .concat(
                ' ',
                msgs.get('dashboard.card.deployment.running', locale)
              )
            : '',
      subtextKeySecond:
        podData.total === -1
          ? -1
          : podData.total > 0
            ? podData.failed
              .toString()
              .concat(
                ' ',
                msgs.get('dashboard.card.deployment.failed.lowercase', locale)
              )
            : ''
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
      subtextKeyFirst:
        incidents === -1
          ? -1
          : incidents > 0
            ? incidentsData.priority1
              .toString()
              .concat(
                ' ',
                msgs.get(
                  'dashboard.card.deployment.incidents.priority1',
                  locale
                )
              )
            : '',
      subtextKeySecond:
        incidents === -1
          ? -1
          : incidents > 0
            ? incidentsData.priority2
              .toString()
              .concat(
                ' ',
                msgs.get(
                  'dashboard.card.deployment.incidents.priority2',
                  locale
                )
              )
            : ''
    })
  }
  return result
}

class OverviewCards extends React.Component {
  componentWillMount() {
    const { fetchApplications } = this.props

    fetchApplications()

    if (parseInt(config['featureFlags:liveUpdates']) === 2) {
      var intervalId = setInterval(
        this.reload.bind(this),
        config['featureFlags:liveUpdatesPollInterval']
      )
      this.setState({ intervalId: intervalId })
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId)
  }

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
                {card.count !== -1 ? (
                  card.count
                ) : (
                  <SkeletonText
                    width={'60%'}
                    className="loading-skeleton-text-header"
                  />
                )}
              </div>
              <div className="card-type">{card.msgKey}</div>
              <div className="card-text">
                {card.textKey !== -1 ? (
                  card.textKey
                ) : (
                  <SkeletonText
                    width={'80%'}
                    className="loading-skeleton-text-lrg"
                  />
                )}
              </div>
              {(card.subtextKeyFirst || card.subtextKeySecond) && (
                <div className="row-divider" />
              )}
              {card.subtextKeyFirst && (
                <div className="card-subtext">
                  {card.subtextKeyFirst !== -1 ? (
                    card.subtextKeyFirst
                  ) : (
                    <SkeletonText
                      width={'40%'}
                      className="loading-skeleton-text-sm"
                    />
                  )}
                </div>
              )}
              {card.subtextKeySecond && (
                <div className="card-subtext">
                  {card.subtextKeySecond !== -1 ? (
                    card.subtextKeySecond
                  ) : (
                    <SkeletonText
                      width={'60%'}
                      className="loading-skeleton-text-med"
                    />
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
