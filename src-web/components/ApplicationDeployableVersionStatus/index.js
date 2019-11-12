/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import React from '../../../node_modules/react'
import msgs from '../../../nls/platform.properties'
import { Tile, Icon } from 'carbon-components-react'
import { withLocale } from '../../providers/LocaleProvider'
import resources from '../../../lib/shared/resources'

import {
  getChannelStatusClass,
  getDeployableInfo,
  getChannelClustersNb,
  getSubscriptionForChannel
} from './utils'

resources(() => {
  require('./style.scss')
})

const deployableColumns = (channels, subscriptions, locale) => {
  return (
    <div className="version-status-grid-container">
      <div className="horizontal-scroll-row">
        {channels.map(channel => {
          const channelName = (channel && channel.name) || ''
          const clusterCount = getChannelClustersNb(channel)
          const subscriptionName = getSubscriptionForChannel(
            channel,
            subscriptions
          )

          return (
            <div className="version-status-column" key="{channel.name}">
              <Tile>
                <div className="yaml-edit">
                  <span className="yamlEditIconTitle">
                    {msgs.get('tabs.yaml')}
                  </span>
                  <Icon
                    name="icon--edit"
                    fill="#6c7b85"
                    description=""
                    className="yamlEditIcon"
                  />
                </div>
                <div className="environment"> {channelName} </div>
                <div className="subscription-header">
                  {`Subscription: ${subscriptionName}`}
                </div>

                <div className="gate-conditions-header">
                  {msgs.get(
                    'description.title.deployableVersionStatus.gateConditions',
                    locale
                  )}
                </div>
                <div className="gate-conditions">--</div>
                <div>
                  <div className="clusters">
                    {msgs.get('resource.clusters', locale)}
                    <Icon
                      name="icon--arrow--right"
                      fill="#2772b7"
                      description=""
                      className="clustersIcon"
                    />
                  </div>
                  <div className="clusters-count">
                    {clusterCount} {msgs.get('resource.clusters', locale)}
                  </div>
                </div>
              </Tile>
            </div>
          )
        })}
      </div>

      <div className="horizontal-scroll-row">
        {channels.map(channel => {
          const channelStatus = (channel && channel.status) || ''
          const channelLastUpdateTime =
            (channel && channel.lastUpdateTime) || ''

          return (
            <div className="version-status-column" key="{channel.name}">
              <Tile>
                <span className={getChannelStatusClass(channelStatus)}>
                  {channelStatus}
                </span>
                <span className="lastUpdateTime">
                  {channelStatus == 'failed' && channelLastUpdateTime}
                </span>
              </Tile>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const ApplicationDeployableVersionStatus = withLocale(
  ({ deployableDetails, channels, subscriptions, locale }) => {
    const deployableInfo = getDeployableInfo(deployableDetails)

    const deployableName = (deployableInfo && deployableInfo.name) || ''

    return (
      <div id="ApplicationDeployableVersionStatus">
        <div className="deployable-versionStatus-header">
          {msgs.get('description.title.deployableVersionStatus', locale)}
        </div>

        <div className="deployable-version-status-container">
          <div className="deployable-left-column">
            <Tile className="deployable-left-column-header" />

            <Tile>
              <div className="deployable-version-name">{deployableName}</div>
              <div className="incidents-count">
                0 {msgs.get('description.title.incidents', locale)}
              </div>
            </Tile>
          </div>

          {channels && deployableColumns(channels, subscriptions, locale)}
        </div>
      </div>
    )
  }
)

export default withLocale(ApplicationDeployableVersionStatus)
