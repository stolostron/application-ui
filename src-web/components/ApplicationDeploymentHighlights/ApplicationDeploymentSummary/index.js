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
import msgs from '../../../../nls/platform.properties';
import { connect } from 'react-redux';
import { RESOURCE_TYPES } from '../../../../lib/shared/constants';
import { fetchResources } from '../../../actions/common';
import resources from '../../../../lib/shared/resources';
import StackedChartCardModule from './components/StackedChartCardModule';
import { masonryOptions, getChannelChartData } from './utils';

resources(() => {
  require('./style.scss');
});

const mapDispatchToProps = (dispatch) => {
  return {
    fetchChannels: () => dispatch(fetchResources(RESOURCE_TYPES.HCM_CHANNELS)),
  };
};

const mapStateToProps = (state) => {
  const { HCMChannelList } = state;

  return {
    HCMChannelList,
    channelChartData: getChannelChartData(HCMChannelList),
  };
};

class ApplicationDeploymentSummary extends React.Component {
  componentWillMount() {
    const { fetchChannels } = this.props;
    fetchChannels();
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const { channelChartData } = this.props;

    const { locale } = this.context;

    return (
      <div id="ApplicationDeploymentSummary">
        <div className="masonry-container">
          <Masonry
            enableResizableChildren
            disableImagesLoaded
            className="masonry-class"
            style={masonryOptions}
          >
            <div className="grid-item">
              <div className="grid-view">
                <div className="title">
                  {msgs.get('channel.deployments.chart.title', locale)}
                </div>
                <StackedChartCardModule
                  data={channelChartData}
                  locale={locale}
                />
              </div>
            </div>
          </Masonry>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationDeploymentSummary);
