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
  onSubscriptionClick,
  editResourceClick,
  getDataByKind,
  getResourcesStatusPerChannel,
  getApplicationLevelStatus
} from './utils'
import { pullOutKindPerApplication } from '../../utils'
import { Tile, Icon, Tag } from 'carbon-components-react'

/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key*/
/* jsx-a11y/no-static-element-interactions*/
/* jsx-a11y/click-events-have-key-events*/

resources(() => {
  require('./style.scss')
})

// This component displays all the LEFT column applications in the table.
// It displays all the applications names and their number of deployables.
const LeftColumnForApplicationNames = (
  {
    applications,
    subscriptions,
    updateAppDropDownList,
    appDropDownList,
    openSubscriptionModal,
    setSubscriptionModalHeaderInfo,
    setCurrentDeployableSubscriptionData,
    setCurrentsubscriptionModalData,
    getSubscriptionResource
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
            {msgs.get('description.title.subscriptions', locale)}
          </div>
        </Tile>
      </div>
      {applications.map(application => {
        const appName = application.name
        // Get the subscriptions given the application object
        const subscriptionsFetched = pullOutKindPerApplication(
          application,
          'subscription'
        )
        // Pull the data up to the top
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
                  {msgs.get('description.title.subscriptions', locale)}
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
                      <div
                        className="deployableName"
                        onClick={() =>
                          onSubscriptionClick(
                            openSubscriptionModal,
                            setSubscriptionModalHeaderInfo,
                            setCurrentDeployableSubscriptionData,
                            setCurrentsubscriptionModalData,
                            subscription,
                            appName,
                            subscriptionName
                          )
                        }
                      >
                        {`${subscriptionName} `}
                      </div>
                      <div className="yamlTitleSub">
                        {msgs.get('actions.yaml', locale)}
                      </div>
                      <Icon
                        name="icon--edit"
                        fill="#6089bf"
                        description=""
                        className="subscriptionEditIcon"
                        onClick={() =>
                          editResourceClick(
                            subscription,
                            getSubscriptionResource
                          )
                        }
                      />
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
    applicationList,
    getChannelResource,
    appDropDownList,
    bulkSubscriptionList
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
                      editResourceClick(channel, getChannelResource)
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
        // Given the application pull out its object of kind subscription
        const subscriptionsFetched = pullOutKindPerApplication(
          application,
          'subscription'
        )
        // Pull up the subscription data from the nested object
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
              {channelList.map(channel => {
                // Given the subscriptionsForThisApplication, the channel,
                // we will look through match the subscription with the channel
                // and then tally up all the status under that application to give
                // the total status that will be displayed at the header level
                const appStatus = getApplicationLevelStatus(
                  subscriptionsForThisApplication,
                  channel,
                  bulkSubscriptionList
                )
                const showStatus =
                  subscriptionsForThisApplication.length > 0 && appStatus
                return (
                  <div key={Math.random()} className="channelColumn">
                    <Tile className="channelColumnHeaderApplication">
                      {showStatus ? (
                        <ProgressBar status={appStatus} />
                      ) : (
                        <Tag type="custom" className="statusTag">
                          {msgs.get('description.na', locale)}
                        </Tag>
                      )}
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
                // // Gather the subscription data that contains the matching UID
                const thisSubscriptionData = getDataByKind(
                  bulkSubscriptionList,
                  subscription._uid
                )
                return (
                  <div key={Math.random()} className="deployableRow">
                    {channelList.map(channel => {
                      // Determine if this subscription is present in this channel
                      const channelMatch = subscription.channel.includes(
                        channel.name
                      )
                      // Get status of resources within the subscription specific
                      // to the channel. We will match the resources that contain
                      // the same namespace as the channel
                      // status = [0, 0, 0, 0, 0] // pass, fail, inprogress, pending, unidentifed
                      const status = getResourcesStatusPerChannel(
                        thisSubscriptionData
                      )
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

const PipelineGrid = withLocale(
  ({
    applications,
    channels,
    subscriptions,
    getChannelResource,
    getSubscriptionResource,
    openSubscriptionModal,
    setSubscriptionModalHeaderInfo,
    setCurrentDeployableSubscriptionData,
    setCurrentsubscriptionModalData,
    updateAppDropDownList,
    appDropDownList,
    bulkSubscriptionList
  }) => {
    return (
      <div id="PipelineGrid">
        <div className="tableGridContainer">
          <LeftColumnForApplicationNames
            subscriptions={subscriptions} // TOTAL subscriptions even if they aren't applied to an application
            applications={applications}
            updateAppDropDownList={updateAppDropDownList}
            appDropDownList={appDropDownList}
            openSubscriptionModal={openSubscriptionModal}
            setSubscriptionModalHeaderInfo={setSubscriptionModalHeaderInfo}
            setCurrentDeployableSubscriptionData={
              setCurrentDeployableSubscriptionData
            }
            setCurrentsubscriptionModalData={setCurrentsubscriptionModalData}
            getSubscriptionResource={getSubscriptionResource}
          />
          <ChannelColumnGrid
            channelList={channels}
            applicationList={applications}
            getChannelResource={getChannelResource}
            appDropDownList={appDropDownList}
            bulkSubscriptionList={bulkSubscriptionList} // the bulk subscriptions list that came back only ones found in applications
          />
        </div>
      </div>
    )
  }
)

export default withLocale(PipelineGrid)
