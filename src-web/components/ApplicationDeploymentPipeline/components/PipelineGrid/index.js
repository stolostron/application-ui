/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
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
  getApplicationLevelStatus,
  subscriptionPresentInGivenChannel,
  createSubscriptionPerChannel,
  subscriptionsUnderColumnsGrid,
  getLongestArray
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
    getSubscriptionResource,
    channelList,
    oneApplication
  },
  { locale }
) => {
  // If there is just one application we want to find the subscription
  // count for that one so that we can display it rather that that total
  // subscription count
  const subscriptionsForOneApp = pullOutKindPerApplication(
    applications[0],
    'subscription'
  )
  return (
    <div className="applicationColumnContainer">
      <div className="tileContainer">
        <Tile className="firstTotalTile">
          <div className="totalApplications">
            {`${applications.length} `}
            {msgs.get('description.title.applications', locale)}
          </div>
          <div className="totalDeployables">
            {`${(oneApplication &&
              subscriptionsForOneApp &&
              subscriptionsForOneApp[0] &&
              subscriptionsForOneApp[0].count) ||
              subscriptions.length} `}
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
        // get the subscriptions that fall under each column
        // each index is a channel
        // [[{sub1}], [], [], [{sub2}, {sub3}]]
        const subscriptionsUnderColumns = createSubscriptionPerChannel(
          channelList,
          subscriptions
        )
        // We need to know the longest subscriptionArray because we want to extend
        // the drop down for the left most column to that length
        const longestSubscriptionArray = getLongestArray(
          subscriptionsUnderColumns
        )
        const expandRow = appDropDownList.includes(appName)
        return (
          <div key={Math.random()} className="tileContainerApp">
            <Tile
              className="applicationTile"
              onClick={
                longestSubscriptionArray.length > 0
                  ? () => updateAppDropDownList(appName)
                  : () => {
                    /* onClick expects a function thus we have placeholder */
                  }
              }
            >
              {longestSubscriptionArray.length > 0 && (
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
                  {`${longestSubscriptionArray.length} `}
                  {msgs.get('description.title.subscriptions', locale)}
                </div>
              </div>
            </Tile>
            <div
              id={appName}
              className="deployablesDisplay"
              style={expandRow ? { display: 'block' } : { display: 'none' }}
            >
              {longestSubscriptionArray.map(subscription => {
                // const subscriptionName =
                //   (subscription && subscription.name) || ''
                return (
                  <Tile key={Math.random()} className="deployableTile">
                    {/*<div className="DeployableContents">
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
                      <span>
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
                      </span>
                    </div>*/}
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
    bulkSubscriptionList,
    oneApplication
  },
  locale
) => {
  const containerClass =
    (oneApplication && 'channelGridContainerSingleApp') ||
    'channelGridContainer'
  return (
    <div className={containerClass}>
      <div className="horizontalScrollRow">
        {/* This is the where the channel header information will go */}
        {channelList.map(channel => {
          const channelName = channel.name
          return (
            <div key={Math.random()} className="channelColumn">
              <Tile className="channelColumnHeader">
                <div className="channelNameHeader">
                  <span>
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
                  </span>
                  <div className="channelTitle">
                    {msgs.get('description.Pipeline.channel', locale)}
                  </div>
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
        // get the subscriptions that fall under each column
        // each index is a channel
        // [[{sub1}], [], [], [{sub2}, {sub3}]]
        const subscriptionsUnderColumns = createSubscriptionPerChannel(
          channelList,
          subscriptionsForThisApplication
        )
        const subscriptoinsRowFormat = subscriptionsUnderColumnsGrid(
          subscriptionsUnderColumns
        )

        const expandRow = appDropDownList.includes(applicationName)
        return (
          <React.Fragment key={Math.random()}>
            <div className="horizontalScrollRow">
              {/* This is the where the row totals will go for the applications */}
              {/*channelList.map(channel => {
                // Given the subscriptionsForThisApplication, the channel,
                // we will look through match the subscription with the channel
                // and then tally up all the status under that application to give
                // the total status that will be displayed at the header level
                const appStatus = getApplicationLevelStatus(
                  subscriptionsForThisApplication,
                  channel,
                  bulkSubscriptionList
                )
                const subscriptionPresentInChannel = subscriptionPresentInGivenChannel(
                  subscriptionsForThisApplication,
                  channel
                )
                const showStatus =
                  subscriptionsForThisApplication.length > 0 &&
                  subscriptionPresentInChannel
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
              })*/}
              {subscriptionsUnderColumns.map(subscriptions => {
                return (
                  <div key={Math.random()} className="channelColumn">
                    <Tile className="channelColumnHeaderApplication">
                      <div className="subTotal">{subscriptions.length}</div>
                      <div className="subTotalDescription">
                        {msgs.get('description.subsInChannel', locale)}
                      </div>
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
              {/*subscriptionsForThisApplication.map(subscription => {
                // Gather the subscription data that contains the matching UID
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
              })*/}
              {subscriptoinsRowFormat.map(subRow => {
                return (
                  <div key={Math.random()} className="deployableRow">
                    {subRow.map(subCol => {
                      console.log('subCol', subCol)
                      return (
                        <div key={Math.random()} className="channelColumnDep">
                          <Tile className="channelColumnDeployable">
                            {'here'}
                          </Tile>
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
    bulkSubscriptionList,
    hasAdminRole,
    breadcrumbItems
  }) => {
    const oneApplication = breadcrumbItems.length == 2
    return (
      <div id="PipelineGrid">
        <div className="tableGridContainer">
          {!oneApplication && (
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
              hasAdminRole={hasAdminRole}
              channelList={channels}
              oneApplication={oneApplication}
            />
          )}
          <ChannelColumnGrid
            channelList={channels}
            applicationList={applications}
            getChannelResource={getChannelResource}
            appDropDownList={appDropDownList}
            bulkSubscriptionList={bulkSubscriptionList} // the bulk subscriptions list that came back only ones found in applications
            hasAdminRole={hasAdminRole}
            oneApplication={oneApplication}
          />
        </div>
      </div>
    )
  }
)

export default withLocale(PipelineGrid)
