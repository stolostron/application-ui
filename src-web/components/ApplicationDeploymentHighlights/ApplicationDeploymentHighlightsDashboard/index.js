/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
import R from 'ramda'
import React from '../../../../node_modules/react'
import CountsCardModule from '../../CountsCardModule'
import { withLocale } from '../../../providers/LocaleProvider'
import resources from '../../../../lib/shared/resources'
import {
  getAllDeployablesStatus,
  getNumClusters,
  getApplicationName,
  getSingleApplicationObject,
  getChannelsCountFromSubscriptions
} from './utils'
import {
  getSearchLinkForOneApplication,
  getSearchLinkForAllApplications,
  getSearchLinkForAllChannels,
  getSearchLinkForAllSubscriptions
} from '../../common/ResourceOverview/utils'
import { pullOutKindPerApplication } from '../../ApplicationDeploymentPipeline/utils'
import { getNumItems } from '../../../../lib/client/resource-helper'

resources(() => {
  require('./style.scss')
})

const countsCardDataSummary = (
  HCMApplicationList,
  HCMChannelList,
  HCMSubscriptionList,
  isSingleApplicationView,
  targetLink,
  targetLinkForSubscriptions,
  targetLinkForChannels
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

  const result = [
    {
      msgKey:
        applications > 1
          ? 'dashboard.card.deployment.applications'
          : 'dashboard.card.deployment.application',
      count: applications,
      targetLink
    },
    {
      msgKey:
        channels > 1
          ? 'dashboard.card.deployment.channels'
          : 'dashboard.card.deployment.channel',
      count: channels,
      targetLink: targetLinkForChannels
    },
    {
      msgKey:
        subscriptions > 1
          ? 'dashboard.card.deployment.subscriptions'
          : 'dashboard.card.deployment.subscription',
      count: subscriptions,
      targetLink: targetLinkForSubscriptions
    },
    {
      msgKey:
        clusters > 1
          ? 'dashboard.card.deployment.clusters'
          : 'dashboard.card.deployment.cluster',
      count: clusters,
      textKey: 'dashboard.card.deployment.clustersInfo',
      targetLink
    }
  ]

  if (isSingleApplicationView) {
    // remove the application count from the single application view
    return R.tail(result)
  }

  return result
}

const ApplicationDeploymentHighlightsDashboard = withLocale(
  ({
    HCMApplicationList,
    HCMChannelList,
    HCMSubscriptionList,
    isSingleApplicationView
  }) => {
    const applicationName = getApplicationName(HCMApplicationList)
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

    const countsCardData = countsCardDataSummary(
      HCMApplicationList,
      HCMChannelList,
      HCMSubscriptionList,
      isSingleApplicationView,
      targetLink,
      targetLinkForSubscriptions,
      targetLinkForChannels
    )
    const summary = getAllDeployablesStatus(HCMApplicationList, false)
    const countsCardDataStatus = [
      {
        msgKey: 'dashboard.card.deployment.completed',
        count: summary[0],
        targetLink
      },
      {
        msgKey: 'dashboard.card.deployable.inProgress',
        count: summary[2],
        targetLink
      },
      {
        msgKey: 'dashboard.card.deployable.failed',
        count: summary[1],
        targetLink,
        alert: summary[1] > 0 ? true : false
      }
    ]

    const singleAppStyle = isSingleApplicationView ? ' single-app' : ''

    return (
      <React.Fragment>
        <div id="ApplicationDeploymentsDashboard">
          <div className={'deployment-summary' + singleAppStyle}>
            <CountsCardModule
              data={countsCardData}
              title="dashboard.card.deployment.summary.title"
            />
          </div>
          <div className={'deployment-status' + singleAppStyle}>
            <CountsCardModule
              data={countsCardDataStatus}
              title="dashboard.card.deployment.status.title"
            />
          </div>
        </div>
      </React.Fragment>
    )
  }
)

export default withLocale(ApplicationDeploymentHighlightsDashboard)
