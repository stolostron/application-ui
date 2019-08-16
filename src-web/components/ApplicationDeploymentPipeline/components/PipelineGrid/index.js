/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import msgs from '../../../../../nls/platform.properties'
import { withLocale } from '../../../../providers/LocaleProvider'
import resources from '../../../../../lib/shared/resources'
import ProgressBar from '../ProgressBar/index'
import {
  tileClick,
  editChannelClick,
  findMatchingSubscription,
  getDeployableData,
  getDeployablesChannels,
  getResourcesStatusPerChannel,
  getDeployableDataByChannels
} from './utils'
import { pullOutKindPerApplication } from '../../utils'
import { Tile, Icon, Tag } from 'carbon-components-react'
import config from '../../../../../lib/shared/config'
import { RESOURCE_TYPES } from '../../../../../lib/shared/constants'

/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key*/

resources(() => {
  require('./style.scss')
})

// This component displays all the LEFT column applications in the table.
// It displays all the applications names and their number of deployables.
const LeftColumnForApplicationNames = (
  {
    applications,
    /*deployables,*/ subscriptions,
    updateAppDropDownList,
    appDropDownList
  },
  { locale }
) => {
  return (
    <div className="applicationColumnContainer">
      <div className="tileContainer">
        <Tile className="firstTotalTile">
          <div className="totalApplications">
            {`${applications.length} `}
            {msgs.get('description.title.applications', locale)}
          </div>
          <div className="totalDeployables">
            {`${subscriptions.length} `}
            {msgs.get('description.title.deployables', locale)}
          </div>
        </Tile>
      </div>
      {applications.map(application => {
        const appName = application.name
        // const appNamespace = application.namespace
        const subscriptionsFetched = pullOutKindPerApplication(
          application,
          'subscription'
        )
        const subscriptions =
          (subscriptionsFetched &&
            subscriptionsFetched[0] &&
            subscriptionsFetched[0].items) ||
          []
        const expandRow = appDropDownList.includes(appName)
        return (
          <div key={Math.random()} className="tileContainerApp">
            <Tile
              className="applicationTile"
              onClick={
                subscriptions.length > 0
                  ? () => updateAppDropDownList(appName)
                  : () => {
                    /* onClick expects a function thus we have placeholder */
                  }
              }
            >
              {subscriptions.length > 0 && (
                <Icon
                  id={`${appName}chevron`}
                  name="icon--chevron--right"
                  fill="#6089bf"
                  description=""
                  className={expandRow ? 'openRowChevron' : 'closeRowChevron'}
                />
              )}
              <div className="ApplicationContents">
                <div className="appName">{`${appName} `}</div>
                <div className="appDeployables">
                  {`${subscriptions.length} `}
                  {msgs.get('description.title.deployables', locale)}
                </div>
              </div>
            </Tile>
            <div
              id={appName}
              className="deployablesDisplay"
              style={expandRow ? { display: 'block' } : { display: 'none' }}
            >
              {subscriptions.map(subscription => {
                const subscriptionName =
                  (subscription && subscription.name) || ''
                return (
                  <Tile key={Math.random()} className="deployableTile">
                    <div className="DeployableContents">
                      <div className="deployableName">
                        {`${subscriptionName} `}
                      </div>
                    </div>
                  </Tile>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

const ChannelColumnGrid = (
  {
    channelList,
    subscriptionList,
    applicationList,
    editChannel,
    getChannelResource,
    openDeployableModal,
    setDeployableModalHeaderInfo,
    setCurrentDeployableSubscriptionData,
    setCurrentDeployableModalData,
    appDropDownList,
    bulkDeployableList
  },
  locale
) => {
  return (
    <div className="channelGridContainer">
      <div className="horizontalScrollRow">
        {/* This is the where the channel header information will go */}
        {channelList.map(channel => {
          const channelName = channel.name
          return (
            <div key={Math.random()} className="channelColumn">
              <Tile className="channelColumnHeader">
                <div className="channelNameHeader">
                  <div className="yamlTitle">
                    {msgs.get('actions.yaml', locale)}
                  </div>
                  <Icon
                    name="icon--edit"
                    fill="#6089bf"
                    description=""
                    className="channelEditIcon"
                    onClick={() =>
                      editChannelClick(
                        editChannel,
                        RESOURCE_TYPES.HCM_CHANNELS,
                        channel,
                        getChannelResource
                      )
                    }
                  />
                  <div className="channelNameTitle">{`${channelName}`}</div>
                </div>
              </Tile>
            </div>
          )
        })}
      </div>
      {/* All the applicaion totals and the subscription information is found here */}
      {applicationList.map(application => {
        const applicationName = application.name || ''
        const subscriptionsFetched = pullOutKindPerApplication(
          application,
          'subscription'
        )
        const subscriptionsForThisApplication =
          (subscriptionsFetched &&
            subscriptionsFetched[0] &&
            subscriptionsFetched[0].items) ||
          []
        const expandRow = appDropDownList.includes(applicationName)
        return (
          <React.Fragment key={Math.random()}>
            <div className="horizontalScrollRow">
              {/* This is the where the row totals will go for the applications */}
              {channelList.map(() => {
                return (
                  <div key={Math.random()} className="channelColumn">
                    <Tile className="channelColumnHeaderApplication">
                      <Tag type="custom" className="statusTag">
                        {msgs.get('description.na', locale)}
                      </Tag>
                    </Tile>
                  </div>
                )
              })}
            </div>
            <div
              id={`${applicationName}deployableRows`}
              className="horizontalScrollRow spaceOutBelow"
              style={expandRow ? { display: 'block' } : { display: 'none' }}
            >
              {subscriptionsForThisApplication.map(subscription => {
                // // Gather the deployable data that contains the matching UID
                // const deployableData = getDeployableData(
                //   bulkDeployableList,
                //   deployable._uid
                // )
                // // Gather all the channels that this deployable is in
                // const deployableChannels = getDeployablesChannels(
                //   deployableData
                // )
                return (
                  <div key={Math.random()} className="deployableRow">
                    {channelList.map(channel => {
                      // Determine if this deployable is present in this channel
                      // const channelMatch = deployableChannels.includes(
                      //   `${channel.namespace}/${channel.name}`
                      // )
                      const channelMatch = subscription.channel.includes(
                        channel.name
                      )
                      // const deployableDataByChannel = getDeployableDataByChannels(
                      //   deployableData,
                      //   channel.namespace
                      // )
                      // Get status of resources within the deployable specific
                      // to the channel. We will match the resources that contain
                      // the same namespace as the channel
                      // status = [0, 0, 0, 0, 0] // pass, fail, inprogress, pending, unidentifed
                      const status = getResourcesStatusPerChannel(
                        subscription,
                        false
                      )
                      // This will find the matching subscription for the given channel
                      // const matchingSubscription = findMatchingSubscription(
                      //   subscriptionList,
                      //   channel.name
                      // )
                      // const matchingSubscription = subscription
                      return (
                        <div key={Math.random()} className="channelColumnDep">
                          {channelMatch ? (
                            <Tile className="channelColumnDeployable">
                              <ProgressBar status={status} />
                            </Tile>
                          ) : (
                            <Tile className="channelColumnDeployable">
                              <Tag type="custom" className="statusTag">
                                {msgs.get('description.na', locale)}
                              </Tag>
                            </Tile>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}

const PipelineGrid = withLocale(({ // deployables,
  applications, channels, subscriptions, editChannel, getChannelResource, openDeployableModal, setDeployableModalHeaderInfo, setCurrentDeployableSubscriptionData, setCurrentDeployableModalData, updateAppDropDownList, appDropDownList, bulkDeployableList }) => {
  return (
    <div id="PipelineGrid">
      <div className="tableGridContainer">
        <LeftColumnForApplicationNames
          // deployables={deployables}
          subscriptions={subscriptions}
          applications={applications}
          updateAppDropDownList={updateAppDropDownList}
          appDropDownList={appDropDownList}
        />
        <ChannelColumnGrid
          channelList={channels}
          subscriptionList={subscriptions}
          applicationList={applications}
          editChannel={editChannel}
          getChannelResource={getChannelResource}
          openDeployableModal={openDeployableModal}
          setDeployableModalHeaderInfo={setDeployableModalHeaderInfo}
          setCurrentDeployableSubscriptionData={
            setCurrentDeployableSubscriptionData
          }
          setCurrentDeployableModalData={setCurrentDeployableModalData}
          appDropDownList={appDropDownList}
          bulkDeployableList={bulkDeployableList}
        />
      </div>
    </div>
  )
})

export default withLocale(PipelineGrid)
