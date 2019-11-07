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
import resources from '../../../../../../lib/shared/resources'
import { RESOURCE_TYPES } from '../../../../../../lib/shared/constants'
import { fetchResources } from '../../../../../actions/common'
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
  getPolicyViolationData
} from '../utils'
import {
  getSearchLinkForOneApplication,
  getNumPolicyViolationsForList
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
    HCMApplicationList,
    HCMSubscriptionList,
    CEMIncidentList,
    secondaryHeader
  } = state
  const isSingleApplicationView =
    R.pathOr([], ['breadcrumbItems'])(secondaryHeader).length == 2
  return {
    HCMSubscriptionList,
    HCMApplicationList,
    CEMIncidentList,
    isSingleApplicationView
  }
}

const getOverviewCardsData = (
  HCMApplicationList,
  HCMSubscriptionList,
  CEMIncidentList,
  isSingleApplicationView,
  applicationName,
  applicationNamespace,
  targetLinkForSubscriptions,
  targetLinkForClusters,
  targetLinkForPods,
  targetLinkForPolicyViolations,
  locale
) => {
  // const applications = getNumItems(HCMApplicationList)
  const clusters = getNumClusters(HCMApplicationList, HCMSubscriptionList)
  const policyViolations = getNumPolicyViolationsForList(HCMApplicationList)
  const incidents = getNumIncidents(CEMIncidentList)

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
  const policyViolationData = getPolicyViolationData(
    HCMApplicationList,
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
      targetLink: targetLinkForSubscriptions,
      textKey: msgs.get('dashboard.card.deployment.subscriptions.text', locale),
      subtextKeyFirst:
        subscriptionDataOnHub.failed > 0 || subscriptionDataOnHub.noStatus > 0
          ? subscriptionDataOnHub.failed
            .toString()
            .concat(
              ' ',
              msgs.get('dashboard.card.deployment.failed.lowercase', locale)
            )
          : '',
      subtextKeySecond:
        subscriptionDataOnHub.failed > 0 || subscriptionDataOnHub.noStatus > 0
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
      targetLink: targetLinkForClusters,
      textKey: subscriptionDataOnManagedClusters.total
        .toString()
        .concat(
          ' ',
          subscriptionDataOnManagedClusters.total == 1
            ? msgs.get('dashboard.card.deployment.totalSubscription', locale)
            : msgs.get('dashboard.card.deployment.totalSubscriptions', locale)
        ),
      subtextKeyFirst:
        subscriptionDataOnManagedClusters.failed > 0 ||
        subscriptionDataOnManagedClusters.noStatus > 0
          ? subscriptionDataOnManagedClusters.failed
            .toString()
            .concat(
              ' ',
              msgs.get('dashboard.card.deployment.failed.lowercase', locale)
            )
          : '',
      subtextKeySecond:
        subscriptionDataOnManagedClusters.failed > 0 ||
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
      targetLink: targetLinkForPods,
      subtextKeyFirst: podData.running
        .toString()
        .concat(' ', msgs.get('dashboard.card.deployment.running', locale)),
      subtextKeySecond: podData.failed
        .toString()
        .concat(
          ' ',
          msgs.get('dashboard.card.deployment.failed.lowercase', locale)
        )
    },
    {
      msgKey:
        policyViolations == 1
          ? msgs.get('dashboard.card.deployment.policy.violation', locale)
          : msgs.get('dashboard.card.deployment.policy.violations', locale),
      count: policyViolations,
      alert: policyViolations > 0 ? true : false,
      targetLink: targetLinkForPolicyViolations,
      subtextKeyFirst: policyViolationData.VAViolations.toString().concat(
        ' ',
        policyViolationData.VAViolations == 1
          ? msgs.get('dashboard.card.deployment.policy.violation.VA', locale)
          : msgs.get('dashboard.card.deployment.policy.violations.VA', locale)
      ),
      subtextKeySecond: policyViolationData.MAViolations.toString().concat(
        ' ',
        policyViolationData.MAViolations == 1
          ? msgs.get('dashboard.card.deployment.policy.violation.MA', locale)
          : msgs.get('dashboard.card.deployment.policy.violations.MA', locale)
      )
    },
    {
      msgKey:
        incidents == 1
          ? msgs.get('dashboard.card.deployment.incident', locale)
          : msgs.get('dashboard.card.deployment.incidents', locale),
      count: incidents,
      alert: incidents > 0 ? true : false
    }
  ]

  return result
}

class OverviewCards extends React.Component {
  componentWillMount() {}
  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const {
      HCMSubscriptionList,
      HCMApplicationList,
      CEMIncidentList,
      isSingleApplicationView
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
    const targetLinkForPolicyViolations = getSearchLinkForOneApplication({
      name: encodeURIComponent(applicationName),
      showRelated: 'mutationpolicy,vulnerabilitypolicy'
    })

    const overviewCardsData = getOverviewCardsData(
      HCMApplicationList,
      HCMSubscriptionList,
      CEMIncidentList,
      isSingleApplicationView,
      applicationName,
      applicationNamespace,
      targetLinkForSubscriptions,
      targetLinkForClusters,
      targetLinkForPods,
      targetLinkForPolicyViolations,
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
      <div className={'overview-cards-info' + singleAppStyle}>
        {Object.keys(overviewCardsData).map(key => {
          const card = overviewCardsData[key]
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
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OverviewCards)
