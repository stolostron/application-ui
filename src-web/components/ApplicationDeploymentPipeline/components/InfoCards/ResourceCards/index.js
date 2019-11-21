/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import R from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import resources from '../../../../../../lib/shared/resources'
import { RESOURCE_TYPES } from '../../../../../../lib/shared/constants'
import { fetchResources } from '../../../../../actions/common'
import msgs from '../../../../../../nls/platform.properties'
import {
  getNumClusters,
  getApplicationName,
  getApplicationNamespace,
  getSingleApplicationObject,
  getChannelsCountFromSubscriptions,
  getNumPlacementRules,
  getSubscriptionDataOnHub,
  getSubscriptionDataOnManagedClusters
} from '../utils'
import {
  getSearchLinkForOneApplication,
  getSearchLinkForAllSubscriptions,
  getSearchLinkForAllClusters,
  getSearchLinkForAllChannels,
  getSearchLinkForAllPlacementRules
} from '../../../../common/ResourceOverview/utils'
import { pullOutKindPerApplication } from '../../../utils'
import { getNumItems } from '../../../../../../lib/client/resource-helper'

/* eslint-disable react/prop-types */

resources(() => {
  require('../style.scss')
})

const mapDispatchToProps = dispatch => {
  return {
    fetchChannels: () => dispatch(fetchResources(RESOURCE_TYPES.HCM_CHANNELS))
  }
}

const mapStateToProps = state => {
  const {
    HCMChannelList,
    HCMApplicationList,
    HCMSubscriptionList,
    secondaryHeader
  } = state
  const isSingleApplicationView =
    R.pathOr([], ['breadcrumbItems'])(secondaryHeader).length == 2
  return {
    HCMChannelList,
    HCMSubscriptionList,
    HCMApplicationList,
    isSingleApplicationView
  }
}

const getResourceCardsData = (
  HCMApplicationList,
  HCMChannelList,
  HCMSubscriptionList,
  isSingleApplicationView,
  applicationName,
  applicationNamespace,
  targetLinkForSubscriptions,
  targetLinkForClusters,
  targetLinkForChannels,
  targetLinkForPlacementRules,
  locale
) => {
  // const applications = getNumItems(HCMApplicationList)
  const clusters = getNumClusters(HCMApplicationList, HCMSubscriptionList)
  let channels = getNumItems(HCMChannelList)

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
    channels = getChannelsCountFromSubscriptions(subscriptionsArray)
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
  const placementRules = getNumPlacementRules(
    HCMApplicationList,
    isSingleApplicationView,
    applicationName,
    applicationNamespace
  )

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
        channels == 1
          ? msgs.get('dashboard.card.deployment.channel', locale)
          : msgs.get('dashboard.card.deployment.channels', locale),
      count: channels,
      targetLink: channels == 0 ? '' : targetLinkForChannels,
      textKey: isSingleApplicationView
        ? msgs.get('dashboard.card.deployment.used', locale)
        : msgs.get('dashboard.card.deployment.total', locale)
    },
    {
      msgKey:
        placementRules == 1
          ? msgs.get('dashboard.card.deployment.placementRule', locale)
          : msgs.get('dashboard.card.deployment.placementRules', locale),
      count: placementRules,
      targetLink: placementRules == 0 ? '' : targetLinkForPlacementRules,
      textKey: isSingleApplicationView
        ? msgs.get('dashboard.card.deployment.used', locale)
        : msgs.get('dashboard.card.deployment.total', locale)
    }
  ]

  return result
}

class ResourceCards extends React.Component {
  componentWillMount() {}
  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const {
      HCMChannelList,
      HCMSubscriptionList,
      HCMApplicationList,
      isSingleApplicationView
    } = this.props
    const { locale } = this.context
    const singleAppStyle = isSingleApplicationView ? ' single-app' : ''
    const applicationName = getApplicationName(HCMApplicationList)
    const applicationNamespace = getApplicationNamespace(HCMApplicationList)

    const targetLinkForSubscriptions = isSingleApplicationView
      ? getSearchLinkForOneApplication({
        name: encodeURIComponent(applicationName),
        showRelated: 'subscription'
      })
      : getSearchLinkForAllSubscriptions()
    const targetLinkForClusters = isSingleApplicationView
      ? getSearchLinkForOneApplication({
        name: encodeURIComponent(applicationName),
        showRelated: 'cluster'
      })
      : getSearchLinkForAllClusters()
    const targetLinkForChannels = isSingleApplicationView
      ? getSearchLinkForOneApplication({
        name: encodeURIComponent(applicationName),
        showRelated: 'channel'
      })
      : getSearchLinkForAllChannels()
    const targetLinkForPlacementRules = isSingleApplicationView
      ? getSearchLinkForOneApplication({
        name: encodeURIComponent(applicationName),
        showRelated: 'placementrule'
      })
      : getSearchLinkForAllPlacementRules()

    const resourceCardsData = getResourceCardsData(
      HCMApplicationList,
      HCMChannelList,
      HCMSubscriptionList,
      isSingleApplicationView,
      applicationName,
      applicationNamespace,
      targetLinkForSubscriptions,
      targetLinkForClusters,
      targetLinkForChannels,
      targetLinkForPlacementRules,
      locale
    )

    const handleClick = (e, resource) => {
      if (resource.targetLink) {
        window.open(resource.targetLink, '_blank')
      }
    }
    const handleKeyPress = (e, resource) => {
      if (e.key === 'Enter') {
        handleClick(e, resource)
      }
    }

    return (
      <div className={'resource-cards-info' + singleAppStyle}>
        {Object.keys(resourceCardsData).map(key => {
          const card = resourceCardsData[key]
          return (
            <React.Fragment key={key}>
              <div
                key={card}
                className={
                  card.targetLink ? 'single-card clickable' : 'single-card'
                }
                role="button"
                tabIndex="0"
                onClick={e => handleClick(e, card)}
                onKeyPress={e => handleKeyPress(e, card)}
              >
                <div className="card-count">{card.count}</div>
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
              {key < Object.keys(resourceCardsData).length - 1 && (
                <div className="column-divider" />
              )}
            </React.Fragment>
          )
        })}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResourceCards)
