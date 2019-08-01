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
import { createApplicationRows, tileClick } from './utils'
import { Tile, Icon, Tag } from 'carbon-components-react'
import config from '../../../../../lib/shared/config'
import { RESOURCE_TYPES } from '../../../../../lib/shared/constants'

/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key*/

resources(() => {
  require('./style.scss')
})

// This method takes in an ID and then changes the css to either display or
// hide the row
const showHideTrigger = id => {
  // This will display or hide the deplable rows under the applications
  const x = document.getElementById(id)
  if (x.style.display === 'none') {
    x.style.display = 'block'
  } else {
    x.style.display = 'none'
  }
  // This will display or hide the deployable rows under the channels
  const y = document.getElementById(`${id}deployableRows`)
  if (y.style.display === 'none') {
    y.style.display = 'block'
  } else {
    y.style.display = 'none'
  }
  // Toggle the chevron Icon which is the drop down indicator for the deployables
  const z = document.getElementById(`${id}chevron`)
  if (z.className.animVal === 'closeRowChevron') {
    z.classList.remove('closeRowChevron')
    z.classList.add('openRowChevron')
  } else {
    z.classList.remove('openRowChevron')
    z.classList.add('closeRowChevron')
  }
}

// This component displays all the LEFT column applications in the table.
// It displays all the applications names and their number of deployables.
const LeftColumnForApplicationNames = (
  { applicationRows, applications, deployables },
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
        const appDeployables = application.deployables
        return (
          <div className="tileContainerApp">
            <Tile
              className="applicationTile"
              onClick={() => showHideTrigger(appName)}
            >
              {appDeployables.length > 0 && (
                <Icon
                  id={`${appName}chevron`}
                  name="icon--chevron--right"
                  fill="#6089bf"
                  description=""
                  className="closeRowChevron"
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
              style={{ display: 'none' }}
            >
              {appDeployables.map(deployable => {
                const deployableName = deployable.metadata.name
                return (
                  <Tile className="deployableTile">
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
    applicationList,
    editChannel,
    openDeployableModal,
    setDeployableModalHdeaderInfo
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
            <div className="channelColumn">
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
                      editChannel(RESOURCE_TYPES.HCM_CHANNELS, channel)
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
        const applicationName = application.metadata.name || ''
        return (
          <React.Fragment>
            <div className="horizontalScrollRow">
              {/* This is the where the row totals will go for the applications */}
              {channelList.map(() => {
                return (
                  <div className="channelColumn">
                    <Tile className="channelColumnHeaderApplication">
                      <Tag className="statusTag">N/A</Tag>
                    </Tile>
                  </div>
                )
              })}
            </div>
            <div
              id={`${applicationName}deployableRows`}
              className="horizontalScrollRow deployablesDisplay"
              style={{ display: 'none' }}
            >
              {application.deployables.map(deployable => {
                // TODO will need to fix once we have the API fully returning everything
                const deployableChannels = deployable.channel || [
                  'channel1',
                  'channel2'
                ]
                const deployableName = deployable.metadata.name
                return (
                  <div className="deployableRow">
                    {channelList.map(channel => {
                      const channelMatch = deployableChannels.includes(
                        channel.name
                      )
                      return (
                        <div className="channelColumn">
                          {channelMatch ? (
                            <Tile
                              className="channelColumnDeployable"
                              onClick={() =>
                                tileClick(
                                  openDeployableModal,
                                  setDeployableModalHdeaderInfo,
                                  applicationName,
                                  deployableName
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
                                  setDeployableModalHdeaderInfo,
                                  applicationName,
                                  deployableName
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
    editChannel,
    openDeployableModal,
    setDeployableModalHdeaderInfo
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
          />
          <ChannelColumnGrid
            channelList={channels}
            applicationList={applications}
            editChannel={editChannel}
            openDeployableModal={openDeployableModal}
            setDeployableModalHdeaderInfo={setDeployableModalHdeaderInfo}
          />
        </div>
      </div>
    )
  }
)

export default withLocale(PipelineGrid)
