/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from '../../../node_modules/react';
import msgs from '../../../nls/platform.properties';
import { Tile, Icon } from 'carbon-components-react'
import { withLocale } from '../../providers/LocaleProvider';
import { connect } from '../../../node_modules/react-redux';
import resources from '../../../lib/shared/resources';

resources(() => {
  require('./style.scss');
});


const deployableColumns = (channels) => {






  return (
    <div class="versionStatusGridContainer">
      <div class="horizontalScrollRow">
        {channels.map((channel) => {
          return (
            <div class="versionStatusColumn">

              <Tile>
                <div class="yaml-edit">YAML <Icon name="icon--edit" fill="#6089bf"
                  className="channelEditIcon" /></div>
                <div class="environment"> {channel.name} </div>
                <div class="gate-conditions">Gate conditions to arrive to this channel</div>
              </Tile>

            </div>
          );

        }
        )
        }
      </div>



      <div class="horizontalScrollRow">
        {channels.map((channel) => {
          return (
            <div class="versionStatusColumn">

              <Tile>
                <span class="statusTag"> {channel.status}</span>


                <span class="lastUpdateTime">{channel.lastUpdateTime}</span>
              </Tile>
            </div>
          );

        }
        )
        }
      </div></div>);


};


const ApplicationDeployableVersionStatus = withLocale(({ deployableDetails, channels, subscriptions, locale }) => {
  return (
    <div id="ApplicationDeployableVersionStatus" >


      <div className="deployable-versionStatus-header">
        {msgs.get('description.title.deployableVersionStatus', locale)}
      </div>

      <div className="deployable-grouping">
        <div className="deployableLeftColumn">
          <Tile></Tile>
          <Tile>{deployableDetails.deployables.metadata.name} {subscriptions.version}</Tile>
        </div>

        {deployableColumns(channels)}
      </div>
    </div >
  );
});

export default withLocale(ApplicationDeployableVersionStatus);
