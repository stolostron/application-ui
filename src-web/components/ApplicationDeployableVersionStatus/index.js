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
    <div className="version-status-grid-container">
      <div className="horizontal-scroll-row">
        {channels.map((channel) => {
          return (
            <div className="version-status-column">

              <Tile>
                <div className="yaml-edit"><span className="yamlEditIconTitle">{msgs.get('tabs.yaml')}</span><Icon name="icon--edit" fill="#6089bf" description=""
                  className="yamlEditIcon" /></div>
                <div className="environment"> {channel.name} </div>
                <div className="gate-conditions">{msgs.get('description.title.deployableVersionStatus.gateConditions')}</div>
              </Tile>

            </div>
          );

        }
        )
        }
      </div>

      <div className="horizontal-scroll-row">
        {channels.map((channel) => {
          return (
            <div className="version-status-column">
              <Tile>
                <span className="statusTag"> {channel.status}</span>

                <span className="lastUpdateTime">{channel.lastUpdateTime}</span>
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

      <div className="deployable-version-status-container">
        <div className="deployable-left-column">
          <Tile></Tile>
          <Tile><div className="deployable-version-name">{deployableDetails.deployables.metadata.name} {subscriptions.version}</div></Tile>
        </div>

        {deployableColumns(channels)}
      </div>
    </div >
  );
});

export default withLocale(ApplicationDeployableVersionStatus);
