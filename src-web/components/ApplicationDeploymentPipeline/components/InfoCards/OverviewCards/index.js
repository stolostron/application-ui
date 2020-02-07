/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import R from 'ramda'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import resources from '../../../../../../lib/shared/resources'
import { RESOURCE_TYPES } from '../../../../../../lib/shared/constants'
import { fetchResources } from '../../../../../actions/common'
import { bindActionCreators } from 'redux'
import * as Actions from '../../../../../actions'
import msgs from '../../../../../../nls/platform.properties'
import {
  getNumClusters,
  getNumIncidents,
  getApplicationName,
  getApplicationNamespace,
  getSingleApplicationObject,
  getSubscriptionDataOnHub,
  getSubscriptionDataOnManagedClusters,
  getPodData,
  getIncidentData
} from '../utils'
import {
  getSearchLinkForOneApplication
} from '../../../../common/ResourceOverview/utils'
import { pullOutKindPerApplication } from '../../../utils'
import { getNumItems } from '../../../../../../lib/client/resource-helper'

/* eslint-disable react/prop-types */

resources(() => {
  require('../style.scss')
})

const mapDispatchToProps = dispatch => {
  return {
    fetchChannels: () => dispatch(fetchResources(RESOURCE_TYPES.HCM_CHANNELS)),
    fetchSubscriptions: () =>
      dispatch(fetchResources(RESOURCE_TYPES.HCM_SUBSCRIPTIONS)),
    actions: bindActionCreators(Actions, dispatch)
  }
}

const mapStateToProps = state => {
  const {
    HCMApplicationList,
    HCMSubscriptionList,
    CEMIncidentList,
    secondaryHeader,
    AppOverview
  } = state
  const isSingleApplicationView =
    R.pathOr([], ['breadcrumbItems'])(secondaryHeader).length == 2
  const enableCEM = AppOverview.showCEMAction
  return {
    HCMSubscriptionList,
    HCMApplicationList,
    CEMIncidentList,
    isSingleApplicationView,
    enableCEM
  }
}

const getOverviewCardsData = (
  HCMApplicationList,
  HCMSubscriptionList,
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
  const clusters = getNumClusters(HCMApplicationList)
  const incidents = getNumIncidents(CEMIncidentList)

  //count only hub subscriptions
  const isHubSubscr = item =>
    !item._hostingSubscription &&
    (!item.status || (item.status && item.status != 'Subscribed'))
  let subscriptions = getNumItems(HCMSubscriptionList, isHubSubscr)
  if (isSingleApplicationView) {
    const subscriptionsArray = pullOutKindPerApplication(
      getSingleApplicationObject(HCMApplicationList),
      'subscription'
    )
    subscriptions =
      subscriptionsArray &&
        subscriptionsArray.length > 0 &&
        subscriptionsArray[0] &&
        subscriptionsArray[0].items &&
        subscriptionsArray[0].items instanceof Array
        ? subscriptionsArray[0].items.length
        : 0
  }

  const subscriptionDataOnHub = getSubscriptionDataOnHub(
    HCMApplicationList,
    isSingleApplicationView,
    applicationName,
    applicationNamespace
  )
  const subscriptionDataOnManagedClusters = getSubscriptionDataOnManagedClusters(
    HCMApplicationList,
    isSingleApplicationView,
    applicationName,
    applicationNamespace
  )
  const podData = getPodData(
    HCMApplicationList,
    applicationName,
    applicationNamespace
  )
  const incidentData = getIncidentData(CEMIncidentList)

  const result = [
    {
      msgKey:
        subscriptions == 1
          ? msgs.get('dashboard.card.deployment.subscription', locale)
          : msgs.get('dashboard.card.deployment.subscriptions', locale),
      count: subscriptions,
      targetLink: subscriptions == 0 ? '' : targetLinkForSubscriptions,
      textKey: msgs.get('dashboard.card.deployment.subscriptions.text', locale),
      subtextKeyFirst:
        subscriptions > 0
          ? subscriptionDataOnHub.failed
            .toString()
            .concat(
              ' ',
              msgs.get('dashboard.card.deployment.failed.lowercase', locale)
            )
          : '',
      subtextKeySecond:
        subscriptionDataOnHub.noStatus > 0
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
        clusters == 1
          ? msgs.get('dashboard.card.deployment.managedCluster', locale)
          : msgs.get('dashboard.card.deployment.managedClusters', locale),
      count: clusters,
      targetLink: clusters == 0 ? '' : targetLinkForClusters,
      textKey: subscriptionDataOnManagedClusters.total
        .toString()
        .concat(
          ' ',
          subscriptionDataOnManagedClusters.total == 1
            ? msgs.get('dashboard.card.deployment.totalSubscription', locale)
            : msgs.get('dashboard.card.deployment.totalSubscriptions', locale)
        ),
      subtextKeyFirst:
        clusters > 0
          ? subscriptionDataOnManagedClusters.failed
            .toString()
            .concat(
              ' ',
              msgs.get('dashboard.card.deployment.failed.lowercase', locale)
            )
          : '',
      subtextKeySecond:
        subscriptionDataOnManagedClusters.noStatus > 0
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
        podData.total == 1
          ? msgs.get('dashboard.card.deployment.pod', locale)
          : msgs.get('dashboard.card.deployment.pods', locale),
      count: podData.total,
      targetLink: podData.total == 0 ? '' : targetLinkForPods,
      subtextKeyFirst:
        podData.total > 0
          ? podData.running
            .toString()
            .concat(
              ' ',
              msgs.get('dashboard.card.deployment.running', locale)
            )
          : '',
      subtextKeySecond:
        podData.total > 0
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
        incidents == 1
          ? msgs.get('dashboard.card.deployment.incident', locale)
          : msgs.get('dashboard.card.deployment.incidents', locale),
      count: incidents,
      alert: incidents > 0 ? true : false,
      targetTab: incidents == 0 ? null : 2,
      subtextKeyFirst:
        incidents > 0
          ? incidentData.priority1
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
        incidents > 0
          ? incidentData.priority2
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
    const { fetchSubscriptions } = this.props
    fetchSubscriptions()
  }
  componentDidMount() { }

  componentWillUnmount() { }

  render() {
    const {
      HCMSubscriptionList,
      HCMApplicationList,
      CEMIncidentList,
      isSingleApplicationView,
      enableCEM,
      actions
    } = this.props
    const { locale } = this.context
    const singleAppStyle = isSingleApplicationView ? ' single-app' : ''
    const applicationName = getApplicationName(HCMApplicationList)
    const applicationNamespace = getApplicationNamespace(HCMApplicationList)

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
      HCMApplicationList,
      HCMSubscriptionList,
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
              key={card}
              className={
                card.targetLink || card.targetTab
                  ? 'single-card clickable'
                  : 'single-card'
              }
              role="button"
              tabIndex="0"
              onClick={e => handleClick(e, card)}
              onKeyPress={e => handleKeyPress(e, card)}
            >
              <div className={card.alert ? 'card-count alert' : 'card-count'}>
                {card.count}
              </div>
              <div className="card-type">{card.msgKey}</div>
              <div className="card-text">{card.textKey}</div>
              {(card.subtextKeyFirst || card.subtextKeySecond) && (
                <div className="row-divider" />
              )}
              {card.subtextKeyFirst && (
                <div className="card-subtext">{card.subtextKeyFirst}</div>
              )}
              {card.subtextKeySecond && (
                <div className="card-subtext">{card.subtextKeySecond}</div>
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
