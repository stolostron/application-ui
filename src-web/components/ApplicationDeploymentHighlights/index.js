/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react';
// import { Tabs } from 'carbon-components-react'
import msgs from '../../../nls/platform.properties';
import { withLocale } from '../../providers/LocaleProvider';
import resources from '../../../lib/shared/resources';
import ApplicationDeploymentHighlightsTerminology from './ApplicationDeploymentHighlightsTerminology';
import ApplicationDeploymentHighlightsSummary from './ApplicationDeploymentHighlightsSummary';

resources(() => {
  require('./style.scss');
});

const ApplicationDeploymentHighlights = withLocale(({ locale }) => {
  return (
    <div id="DeploymentHighlights">
      <div className="deployment-highlights-header">
        {msgs.get('description.title.deploymentHighlights', locale)}
      </div>
      <ApplicationDeploymentHighlightsTerminology />
      <ApplicationDeploymentHighlightsSummary />
      <br />
    </div>
  );
});
export default withLocale(ApplicationDeploymentHighlights);
