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
import { Tile } from 'carbon-components-react';

resources(() => {
  require('./style.scss');
});

const DisplayDeployables = ({ dList }, { locale }) => {
  return (
    <React.Fragment>
      {dList.map((deployable) => {
        const dName =
          (deployable && deployable.metadata && deployable.metadata.name) || '';
        return (
          <div>
            {dName}
          </div>
        );
      })}
    </React.Fragment>
  );
};

const PipelineGrid = withLocale(({ deployables, applications, locale }) => {
  const applicationRows = createApplicationRows(applications);
  const applicationRowsLookUp = createApplicationRowsLookUp(applications);
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
      <div className="horizontalScroll-outer">
        <div className="horizontalScroll-inner">
          {'start'}
        </div>
      </div>
    </div>
  );
});

export default withLocale(PipelineGrid);
