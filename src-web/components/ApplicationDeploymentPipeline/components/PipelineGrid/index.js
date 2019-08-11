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
import {
  createApplicationRows,
  tileClick,
  editChannelClick,
  findMatchingSubscription,
  getDeployablesPerApplication
} from './utils'
import { Tile, Icon, Tag } from 'carbon-components-react'
import config from '../../../../../lib/shared/config'
import { RESOURCE_TYPES } from '../../../../../lib/shared/constants'
import R from 'ramda'

/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key*/

resources(() => {
  require('./style.scss')
})

// This component displays all the LEFT column applications in the table.
// It displays all the applications names and their number of deployables.
const LeftColumnForApplicationNames = (
  {
    applicationRows,
    applications,
    deployables,
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
            {`${deployables.length} `}
            {msgs.get('description.title.deployables', locale)}
          </div>
        </Tile>
      </div>
      {applicationRows.map(application => {
        const appName = application.name
        const appNamespace = application.namespace
        const isKind = n => n.kind === 'deployable'
        const appDeployables = R.filter(isKind, application.deployables)
        const expandRow = appDropDownList.includes(appName)
        return (
          <div key={Math.random()} className="tileContainerApp">
            <Tile
              className="applicationTile"
              onClick={() => updateAppDropDownList(appName)}
            >
              {appDeployables.length > 0 && (
                <Icon
                  id={`${appName}chevron`}
                  name="icon--chevron--right"
                  fill="#6089bf"
                  description=""
                  className={expandRow ? 'closeRowChevron' : 'closeRowChevron'}
                />
              )}
              <div className="ApplicationContents">
                <div className="appName">{`${appName} `}</div>
                <div className="appDeployables">
                  {`${appDeployables.length} `}
                  {msgs.get('description.title.deployables', locale)}
                </div>
              </div>
            </Tile>
            <div
              id={appName}
              className="deployablesDisplay"
              style={expandRow ? { display: 'block' } : { display: 'none' }}
            >
              {appDeployables.map(deployable => {
                const deployableName =
                  (deployable &&
                    deployable.items &&
                    deployable.items[0].name) ||
                  ''
                return (
                  <Tile key={Math.random()} className="deployableTile">
                    <div className="DeployableContents">
                      <a
                        className="deployableName"
                        href={`${
                          config.contextPath
                        }/${appNamespace}/${appName}/deployable/${deployableName}`}
                      >
                        {`${deployableName} `}
                      </a>
                      <div className="deployablePlacement" />
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
    appDropDownList
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
      {/* All the applicaion totals and the deployable information is found here */}
      {applicationList.map(application => {
        const applicationName = application.name || ''
        const deployables = getDeployablesPerApplication(application)
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
                        N/A
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
              {deployables.map(deployable => {
                // TODO will need to fix once we have the API fully returning everything
                const deployableChannels = ['channel1', 'channel2']
                const deployableName = (deployable && deployable.name) || ''
                return (
                  <div key={Math.random()} className="deployableRow">
                    {channelList.map(channel => {
                      const channelMatch = deployableChannels.includes(
                        channel.name
                      )
                      // This will find the matching subscription for the given channel
                      const matchingSubscription = findMatchingSubscription(
                        subscriptionList,
                        channel.name
                      )
                      return (
                        <div key={Math.random()} className="channelColumn">
                          {channelMatch ? (
                            <Tile
                              className="channelColumnDeployable"
                              onClick={() =>
                                tileClick(
                                  openDeployableModal,
                                  setDeployableModalHeaderInfo,
                                  setCurrentDeployableSubscriptionData,
                                  applicationName,
                                  deployableName,
                                  matchingSubscription
                                )
                              }
                            >
                              does have the channel
                            </Tile>
                          ) : (
                            <Tile
                              className="channelColumnDeployable"
                              onClick={() =>
                                tileClick(
                                  openDeployableModal,
                                  setDeployableModalHeaderInfo,
                                  setCurrentDeployableSubscriptionData,
                                  applicationName,
                                  deployableName,
                                  matchingSubscription
                                )
                              }
                            >
                              <Tag className="statusTag">N/A</Tag>
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
    deployables,
    applications,
    channels,
    subscriptions,
    editChannel,
    getChannelResource,
    openDeployableModal,
    setDeployableModalHeaderInfo,
    setCurrentDeployableSubscriptionData,
    updateAppDropDownList,
    appDropDownList
  }) => {
    const applicationRows = createApplicationRows(applications)
    // const applicationRowsLookUp = createApplicationRowsLookUp(applications);
    // const channelRows = createChannelRow(application, channels)
    return (
      <div id="PipelineGrid">
        <div className="tableGridContainer">
          <LeftColumnForApplicationNames
            applicationRows={applicationRows}
            deployables={deployables}
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
            appDropDownList={appDropDownList}
          />
        </div>
      </div>
    )
  }
)

export default withLocale(PipelineGrid)
