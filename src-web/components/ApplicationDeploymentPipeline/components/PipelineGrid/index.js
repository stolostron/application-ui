/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react';
import { Tile } from 'carbon-components-react';
import msgs from '../../../../../nls/platform.properties';
import { withLocale } from '../../../../providers/LocaleProvider';
import resources from '../../../../../lib/shared/resources';

resources(() => {
  require('./style.scss');
});

const PipelineGrid = withLocale(({ deployables, applications, locale }) => {
  return (
    <div id="PipelineGrid">
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
    </div>
  );
});
export default withLocale(PipelineGrid);
