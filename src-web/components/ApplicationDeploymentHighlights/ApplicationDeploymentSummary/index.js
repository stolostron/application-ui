/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import msgs from '../../../../nls/platform.properties'
import { withLocale } from '../../../providers/LocaleProvider'
import resources from '../../../../lib/shared/resources'
import StackedChartCardModule from './components/StackedChartCardModule'
import LineChartCardModule from './components/LineChartCardModule'

import {
  getChannelChartWidth,
  getDeployedResourcesChartData,
  getDeployedResourcesChannelChartData
} from './utils'

resources(() => {
  require('./style.scss')
})

const ApplicationDeploymentSummary = withLocale(
  ({ HCMChannelList, HCMApplicationList, locale }) => {
    const channelChartData = getDeployedResourcesChannelChartData(
      HCMChannelList
    )
    const deployedResourcesChartData = getDeployedResourcesChartData(
      HCMApplicationList
    )
    const chartWidth = getChannelChartWidth(HCMChannelList)

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
        </div>
      </div>
    )
  }
)

export default withLocale(ApplicationDeploymentSummary)
