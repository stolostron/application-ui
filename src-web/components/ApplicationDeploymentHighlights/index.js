/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react';
import Masonry from 'react-masonry-component';

// import { Tabs } from 'carbon-components-react'
import msgs from '../../../nls/platform.properties';
import { withLocale } from '../../providers/LocaleProvider';
import resources from '../../../lib/shared/resources';
import ApplicationDeploymentHighlightsTerminology from './ApplicationDeploymentHighlightsTerminology';
import StackedChartCardModule from '../common/StackedChartCardModule';

resources(() => {
  require('./style.scss');
  require('../../../scss/resource-overview.scss');
  require('../../../scss/overview-page.scss');
});

const masonryOptions = {
  layoutInstant: true,
  horizontalOrder: true,
  fitWidth: true,
  initLayout: true,
  resizeContainer: true,
  columnWidth: 10,
  gutter: 0,
}


const ApplicationDeploymentHighlights = withLocale(({ locale }) => {

  const stackChartCardData = [
    {
      name: "Development",
      cm: 500,
      pr: 900,
      fl: 700
    },
    {
      name: "QA",
      cm: 200,
      pr: 400,
      fl: 900
    },
    {
      name: "Production",
      cm: 800,
      pr: 300,
      fl: 900
    }
  ];

  return (
    <div id="DeploymentHighlights">
      <div className="deployment-highlights-header">
        {msgs.get('description.title.deploymentHighlights', locale)}
      </div>
      <ApplicationDeploymentHighlightsTerminology />
      <div className='overview-view'>
        <div className='masonry-container'>
          <Masonry enableResizableChildren
            disableImagesLoaded
            className={'masonry-class'}
            style={masonryOptions}>
            <div className='overview-providers' >
              <div className='grid-item'>
                <StackedChartCardModule data={stackChartCardData} locale={locale} />
              </div>
            </div>
          </Masonry>
        </div>
      </div>
    </div>
  );
});
export default withLocale(ApplicationDeploymentHighlights);
