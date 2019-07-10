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

const ChannelColumnList = ({ channelList }, { locale }) => {
  return (
    <div className="channelGridContainer">
      <div className="horizontalScroll">
        {channelList.map((channel) => {
          const channelName = channel.metaData.name;
          return (
            <div className="channelColumn">
              <Tile className="channelColumnHeader">{`${channelName}`}</Tile>
            </div>
          );
        })}
      </div>
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
        <ChannelColumnList channelList={channels} />
      </div>
    </div>
  );
});

export default withLocale(PipelineGrid);
