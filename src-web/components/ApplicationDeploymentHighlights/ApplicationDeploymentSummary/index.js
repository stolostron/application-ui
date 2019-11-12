/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import msgs from '../../../../nls/platform.properties'
import { withLocale } from '../../../providers/LocaleProvider'
import resources from '../../../../lib/shared/resources'
import StackedChartCardModule from './components/StackedChartCardModule'
import LineChartCardModule from './components/LineChartCardModule'
import {
  getCurrentApplication,
  formatToChannel
} from '../../common/ResourceOverview/utils'
import { pullOutKindPerApplication } from '../../ApplicationDeploymentPipeline/utils'
import {
  getChannelChartWidth,
  getDeployedResourcesChartData,
  getDeployedResourcesChannelChartData
} from './utils'
import config from '../../../../lib/shared/config'

resources(() => {
  require('./style.scss')
})

const ApplicationDeploymentSummary = withLocale(
  ({
    HCMChannelList,
    HCMApplicationList,
    HCMSubscriptionList,
    isSingleAppView,
    locale
  }) => {
    const deployedResourcesChartData = getDeployedResourcesChartData(
      HCMApplicationList
    )
    // Get the current application given it being a single view
    const currentApp = getCurrentApplication(
      HCMApplicationList,
      isSingleAppView
    )
    // Get all the subscriptions for the current Appliction if its single view
    const subscriptionForApplication = pullOutKindPerApplication(
      currentApp,
      'subscription'
    )
    // Now generate a list of objects that has all the resources of each subscription
    // per channel
    const channelsWithSubscriptionTiedRelatedData = formatToChannel(
      subscriptionForApplication,
      HCMSubscriptionList
    )
    // If its a single app view show the bar graphs for single application
    // else show all channellist
    const channelChartData = getDeployedResourcesChannelChartData(
      isSingleAppView
        ? { items: channelsWithSubscriptionTiedRelatedData }
        : HCMChannelList
    )
    const chartWidth = getChannelChartWidth(
      isSingleAppView
        ? channelsWithSubscriptionTiedRelatedData
        : channelChartData
    )

    return (
      <div id="ApplicationDeploymentSummary">
        <div className="masonry-container">
          {deployedResourcesChartData.length > 0 && (
            <div className="grid-item grid-item-deployable">
              <div className="title">
                {msgs.get('recent.deployments.chart.title', locale)}
              </div>
              <LineChartCardModule
                data={deployedResourcesChartData}
                locale={locale}
              />
            </div>
          )}
          {deployedResourcesChartData.length <= 0 && (
            <div className="grid-item grid-item-deployable">
              <div className="title">
                {msgs.get('recent.deployments.chart.title', locale)}
              </div>
              <div />
              <div>
                <img
                  className="no-res-icon"
                  src={`${config.contextPath}/graphics/nothing-moon-copy.svg`}
                  alt={msgs.get('description.noDeplResDescr', locale)}
                />
                <div className="noResDescriptionText">
                  <div className="noResTitle">
                    {msgs.get('description.noChannels', locale)}
                  </div>
                  <div className="noResDescription">
                    {msgs.get('description.noChannelsDescr', locale)}
                  </div>
                </div>
              </div>
            </div>
          )}
          {channelChartData.length > 0 && (
            <div className="grid-item">
              <div className="title">
                {msgs.get('channel.deployments.chart.title', locale)}
              </div>
              <StackedChartCardModule
                data={channelChartData}
                locale={locale}
                chartWidth={chartWidth}
              />
            </div>
          )}
          {channelChartData.length <= 0 && (
            <div className="grid-item">
              <div className="title">
                {msgs.get('channel.deployments.chart.title', locale)}
              </div>
              <div>
                <img
                  className="no-res-icon"
                  src={`${config.contextPath}/graphics/nothing-moon-copy.svg`}
                  alt={msgs.get('description.noChannelsDescr', locale)}
                />
                <div className="noResDescriptionText">
                  <div className="noResTitle">
                    {msgs.get('description.noChannels', locale)}
                  </div>
                  <div className="noResDescription">
                    {msgs.get('description.noChannelsDescr', locale)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
)

export default withLocale(ApplicationDeploymentSummary)
