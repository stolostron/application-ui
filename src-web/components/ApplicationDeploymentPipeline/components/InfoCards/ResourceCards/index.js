/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import { connect } from 'react-redux'
import resources from '../../../../../../lib/shared/resources'
import msgs from '../../../../../../nls/platform.properties'
import { SkeletonText } from 'carbon-components-react'
import {
  getNumPlacementRules,
  getSubscriptionDataOnHub,
  getSubscriptionDataOnManagedClustersSingle,
  getSubscriptionDataOnManagedClustersRoot,
  concatDataForTextKey,
  concatDataForSubTextKey
} from '../utils'
import {
  getSearchLinkForOneApplication,
  getSearchLinkForAllSubscriptions,
  getSearchLinkForAllClusters,
  getSearchLinkForAllChannels,
  getSearchLinkForAllPlacementRules
} from '../../../../common/ResourceOverview/utils'

/* eslint-disable react/prop-types */

resources(() => {
  require('../style.scss')
})

const mapStateToProps = state => {
  const { HCMSubscriptionList, QueryApplicationList } = state
  return {
    HCMSubscriptionList,
    QueryApplicationList
  }
}

const getResourceCardsData = (
  HCMSubscriptionList,
  QueryApplicationList,
  globalAppData,
  isSingleApplicationView,
  applicationName,
  applicationNamespace,
  targetLinkForSubscriptions,
  targetLinkForClusters,
  targetLinkForChannels,
  targetLinkForPlacementRules,
  locale
) => {
  // All functions will return -1 if data or data.items is undefined... this will be used for skeleton text load bar
  const subscriptionDataOnHub = getSubscriptionDataOnHub(
    QueryApplicationList,
    isSingleApplicationView,
    applicationName,
    applicationNamespace
  )
  let subscriptionDataOnManagedClusters
  if (isSingleApplicationView) {
    subscriptionDataOnManagedClusters = getSubscriptionDataOnManagedClustersSingle(
      QueryApplicationList,
      applicationName,
      applicationNamespace
    )
  } else {
    subscriptionDataOnManagedClusters = getSubscriptionDataOnManagedClustersRoot(
      globalAppData
    )
  }
  const placementRules = getNumPlacementRules(
    HCMSubscriptionList,
    isSingleApplicationView,
    applicationName,
    applicationNamespace
  )

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
        subscriptionDataOnHub.channels === 1
          ? msgs.get('dashboard.card.deployment.channel', locale)
          : msgs.get('dashboard.card.deployment.channels', locale),
      count: subscriptionDataOnHub.channels,
      targetLink:
        subscriptionDataOnHub.channels === 0 ? '' : targetLinkForChannels,
      textKey: isSingleApplicationView
        ? msgs.get('dashboard.card.deployment.used', locale)
        : msgs.get('dashboard.card.deployment.total', locale)
    },
    {
      msgKey:
        placementRules === 1
          ? msgs.get('dashboard.card.deployment.placementRule', locale)
          : msgs.get('dashboard.card.deployment.placementRules', locale),
      count: placementRules,
      targetLink: placementRules === 0 ? '' : targetLinkForPlacementRules,
      textKey: isSingleApplicationView
        ? msgs.get('dashboard.card.deployment.used', locale)
        : msgs.get('dashboard.card.deployment.total', locale)
    }
  ]

  return result
}

const showCardData = (cardCount, width, className) => {
  return cardCount !== -1 ? (
    cardCount
  ) : (
    <SkeletonText width={width} className={className} />
  )
}

class ResourceCards extends React.Component {
  render() {
    const {
      HCMSubscriptionList,
      QueryApplicationList,
      isSingleApplicationView,
      selectedAppName,
      selectedAppNS,
      globalAppData
    } = this.props
    const { locale } = this.context
    const singleAppStyle = isSingleApplicationView ? ' single-app' : ''
    const applicationName = selectedAppName
    const applicationNamespace = selectedAppNS

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
      HCMSubscriptionList,
      QueryApplicationList,
      globalAppData,
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
          const id = `${key}_resourceCardsData`
          return (
            <React.Fragment key={key}>
              <div
                id={id}
                key={card}
                className={
                  card.targetLink ? 'single-card clickable' : 'single-card'
                }
                role="button"
                tabIndex="0"
                onClick={e => handleClick(e, card)}
                onKeyPress={e => handleKeyPress(e, card)}
              >
                <div className="card-count">
                  {showCardData(
                    card.count,
                    '60%',
                    'loading-skeleton-text-header'
                  )}
                </div>
                <div className="card-type">{card.msgKey}</div>
                <div className="card-text">
                  {showCardData(
                    card.textKey,
                    '80%',
                    'loading-skeleton-text-lrg'
                  )}
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

export default connect(mapStateToProps)(ResourceCards)
