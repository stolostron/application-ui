/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react';
import msgs from '../../../../nls/platform.properties';
import { withLocale } from '../../../providers/LocaleProvider';
import resources from '../../../../lib/shared/resources';

resources(() => {
  require('./style.scss');
});

const ApplicationDeploymentHighlightsSummary = withLocale(({ locale }) => {
  return (
    <div id="ApplicationDeploymentHighlightsSummary">
      <div className="content-container">
        <div className="deployment-summary-container">
          {msgs.get(
            'description.title.deploymentHighlightsSummary.summary',
            locale,
          )}
          <div className="deployment-summary-content" />
        </div>
        <div className="deployment-status-container">
          {msgs.get(
            'description.title.deploymentHighlightsSummary.status',
            locale,
          )}
          <div className="deployment-status-content" />
        </div>
      </div>
    </div>
  );
});
export default withLocale(ApplicationDeploymentHighlightsSummary);
