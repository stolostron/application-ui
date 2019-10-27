/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import R from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import resources from '../../../../../lib/shared/resources'
import { RESOURCE_TYPES } from '../../../../../lib/shared/constants'
import { fetchResources } from '../../../../actions/common'
import msgs from '../../../../../nls/platform.properties'
import {
  getNumClusters,
  getApplicationName,
  getApplicationNamespace,
  getSingleApplicationObject,
  getChannelsCountFromSubscriptions,
  getSubscriptionDataOnHub,
  getSubscriptionDataOnManagedClusters
} from './utils'
import {
  getSearchLinkForOneApplication,
  getSearchLinkForAllApplications,
  getSearchLinkForAllChannels,
  getSearchLinkForAllSubscriptions
} from '../../../common/ResourceOverview/utils'
import { pullOutKindPerApplication } from '../../utils'
import { getNumItems } from '../../../../../lib/client/resource-helper'

/* eslint-disable react/prop-types */

resources(() => {
  require('./style.scss')
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
  targetLink,
  targetLinkForSubscriptions,
  targetLinkForChannels,
  locale
) => {
  const applications = getNumItems(HCMApplicationList)
  const clusters = getNumClusters(HCMApplicationList, HCMSubscriptionList)
  let channels = getNumItems(HCMChannelList)

  //count only hub subscriptions
  const isHubSubscr = item => !item._hostingSubscription
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

  const result = [
    {
      msgKey:
        subscriptions > 1
          ? msgs.get('dashboard.card.deployment.subscriptions', locale)
          : msgs.get('dashboard.card.deployment.subscription', locale),
      count: subscriptions,
      targetLink: targetLinkForSubscriptions,
      textKey: msgs.get('dashboard.card.deployment.subscriptions.text', locale),
      subtextKeyFirst: subscriptionDataOnHub.failed.length
        .toString()
        .concat(
          ' ',
          msgs.get('dashboard.card.deployment.failed.lowercase', locale)
        ),
      subtextKeySecond: subscriptionDataOnHub.noStatus.length
        .toString()
        .concat(' ', msgs.get('dashboard.card.deployment.noStatus', locale))
    },
    {
      msgKey:
        clusters > 1
          ? msgs.get('dashboard.card.deployment.managedClusters', locale)
          : msgs.get('dashboard.card.deployment.managedCluster', locale),
      count: clusters,
      targetLink,
      textKey: subscriptionDataOnManagedClusters.total.length
        .toString()
        .concat(
          ' ',
          subscriptionDataOnManagedClusters.total.length > 1 ||
          subscriptionDataOnManagedClusters.total.length == 0
            ? msgs.get('dashboard.card.deployment.totalSubscriptions', locale)
            : msgs.get('dashboard.card.deployment.totalSubscription', locale)
        ),
      subtextKeyFirst: subscriptionDataOnManagedClusters.failed.length
        .toString()
        .concat(
          ' ',
          msgs.get('dashboard.card.deployment.failed.lowercase', locale)
        ),
      subtextKeySecond: subscriptionDataOnManagedClusters.noStatus.length
        .toString()
        .concat(' ', msgs.get('dashboard.card.deployment.noStatus', locale))
    },
    {
      msgKey:
        channels > 1
          ? msgs.get('dashboard.card.deployment.channels', locale)
          : msgs.get('dashboard.card.deployment.channel', locale),
      count: channels,
      targetLink: targetLinkForChannels,
      textKey: msgs.get('dashboard.card.deployment.total', locale)
    },
    {
      msgKey:
        applications > 1
          ? msgs.get('dashboard.card.deployment.placementRules', locale)
          : msgs.get('dashboard.card.deployment.placementRule', locale),
      count: 123,
      targetLink,
      textKey: msgs.get('dashboard.card.deployment.total', locale)
    }
  ]

  return result
}

class ResourceCardsInformation extends React.Component {
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

    const targetLink = isSingleApplicationView
      ? getSearchLinkForOneApplication({
        name: encodeURIComponent(applicationName)
      })
      : getSearchLinkForAllApplications()

    const targetLinkForSubscriptions = isSingleApplicationView
      ? getSearchLinkForOneApplication({
        name: encodeURIComponent(applicationName)
      })
      : getSearchLinkForAllSubscriptions()

    const targetLinkForChannels = isSingleApplicationView
      ? getSearchLinkForOneApplication({
        name: encodeURIComponent(applicationName)
      })
      : getSearchLinkForAllChannels()

    const resourceCardsData = getResourceCardsData(
      HCMApplicationList,
      HCMChannelList,
      HCMSubscriptionList,
      isSingleApplicationView,
      applicationName,
      applicationNamespace,
      targetLink,
      targetLinkForSubscriptions,
      targetLinkForChannels,
      locale
    )

    const onClick = i => {
      window.open(resourceCardsData[i].targetLink, '_blank')
    }

    const onKeyPress = (e, i) => {
      if (e.key === 'Enter') {
        onClick(i)
      }
    }

    return (
      <div className={'resource-cards-info' + singleAppStyle}>
        {Object.keys(resourceCardsData).map(key => {
          const card = resourceCardsData[key]
          return (
            <React.Fragment key={card}>
              <div
                key={card}
                className="single-card"
                role="button"
                tabIndex="0"
                onClick={onClick(key)}
                onKeyPress={onKeyPress(key)}
              >
                <div className="card-count">{card.count}</div>
                <div className="card-type">{card.msgKey}</div>
                <div className="card-text">{card.textKey}</div>
                {(card.subtextKeyFirst || card.subtextKeySecond) && (
                  <div className="row-divider" />
                )}
                {card.subtextKeyFirst && (
                  <div className="card-text">{card.subtextKeyFirst}</div>
                )}
                {card.subtextKeySecond && (
                  <div className="card-text">{card.subtextKeySecond}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(
  ResourceCardsInformation
)
