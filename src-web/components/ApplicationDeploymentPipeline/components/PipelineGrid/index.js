/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react';
import msgs from '../../../../../nls/platform.properties';
import { withLocale } from '../../../../providers/LocaleProvider';
import resources from '../../../../../lib/shared/resources';
import { createApplicationRows, createApplicationRowsLookUp } from './utils';
import { Tile, Icon } from 'carbon-components-react';

resources(() => {
  require('./style.scss');
});

// This method takes in an ID and then changes the css to either display or
// hide the row
const showHideTrigger = (id) => {
  const x = document.getElementById(id);
  if (x.style.display === 'none') {
    x.style.display = 'block';
  } else {
    x.style.display = 'none';
  }
  const y = document.getElementById(`${id}deployableRows`);
  if (y.style.display === 'none') {
    y.style.display = 'block';
  } else {
    y.style.display = 'none';
  }
  const z = document.getElementById(`${id}chevron`);
  if (z.className.animVal === 'closeRowChevron') {
    z.classList.remove('closeRowChevron');
    z.classList.add('openRowChevron');
  } else {
    z.classList.remove('openRowChevron');
    z.classList.add('closeRowChevron');
  }
};

// This component displays all the LEFT column applications in the table.
// It displays all the applications names and their number of deployables.
const LeftColumnForApplicationNames = (
  { applicationRows, applications, deployables },
  { locale },
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
      {applicationRows.map((application) => {
        const appName = application.name;
        const appDeployables = application.deployables;
        return (
          <div className="tileContainerApp">
            <Tile
              className="applicationTile"
              onClick={() => showHideTrigger(appName)}
            >
              <Icon
                id={`${appName}chevron`}
                name="icon--chevron--right"
                fill="#6089bf"
                description=""
                className="closeRowChevron"
              />
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
              {appDeployables.map((deployable) => {
                // const placementRule = deployable.rule;
                const deployableName = deployable.metadata.name;
                return (
                  <Tile className="deployableTile">
                    <div className="DeployableContents">
                      <div className="deployableName">
                        {`${deployableName} `}
                      </div>
                      <div className="deployablePlacement">
                        {'Placement rule'}
                      </div>
                    </div>
                  </Tile>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ChannelColumnGrid = ({ channelList, applicationList }, { locale }) => {
  return (
    <div className="channelGridContainer">
      <div className="horizontalScrollRow">
        {/* This is the where the channel header information will go */}
        {channelList.map((channel) => {
          const channelName = channel.name;
          return (
            <div className="channelColumn">
              <Tile className="channelColumnHeader">
                <div className="channelNameHeader">
                  {`${channelName}`}
                  <Icon
                    name="icon--edit"
                    fill="#6089bf"
                    description=""
                    className="channelEditIcon"
                  />
                </div>
              </Tile>
            </div>
          );
        })}
      </div>
      {/* All the applicaion totals and the deployable information is found here */}
      {applicationList.map((application) => {
        return (
          <React.Fragment>
            <div className="horizontalScrollRow">
              {/* This is the where the row totals will go for the applications */}
              {channelList.map(() => {
                return (
                  <div className="channelColumn">
                    <Tile className="channelColumnHeaderApplication">---</Tile>
                  </div>
                );
              })}
            </div>
            <div
              id={`${application.metadata.name}deployableRows`}
              className="horizontalScrollRow deployablesDisplay"
              style={{ display: 'none' }}
            >
              {application.deployables.map((deployable) => {
                // TODO will need to fix once we have the API fully returning everything
                const deployableChannels = deployable.channel || [
                  'channel1',
                  'channel2',
                ];
                return (
                  <div className="deployableRow">
                    {channelList.map((channel) => {
                      const channelMatch = deployableChannels.includes(channel.name);
                      return (
                        <div className="channelColumn">
                          {channelMatch ? (
                            <Tile className="channelColumnDeployable">
                              does have the channel
                            </Tile>
                          ) : (
                            <Tile className="channelColumnDeployable" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

const PipelineGrid = withLocale(({ deployables, applications, channels, locale }) => {
  const applicationRows = createApplicationRows(applications);
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
        />
      </div>
    </div>
  );
});

export default withLocale(PipelineGrid);
