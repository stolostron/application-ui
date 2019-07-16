/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react';
import msgs from '../../../nls/platform.properties';
import { connect } from 'react-redux';
import resources from '../../../lib/shared/resources';
import {
  updateSecondaryHeader, /* , fetchResource */
} from '../../actions/common';

resources(() => {
  require('./style.scss');
});

const mapDispatchToProps = (dispatch) => {
  return {
    updateSecondaryHeaderInfo: (title, breadCrumbs) =>
      dispatch(updateSecondaryHeader(title, [], breadCrumbs, [])),
  };
};

const mapStateToProps = (state) => {
  const {} = state;
  return {};
};

class ApplicationDeployableDetails extends React.Component {
  componentWillMount() {
    const { updateSecondaryHeaderInfo, params } = this.props;
    const deployableName =
      (params &&
        params.match &&
        params.match.params &&
        params.match.params.name) ||
      '';
    const applicationName =
      (params &&
        params.match &&
        params.match.params &&
        params.match.params.application) ||
      '';
    const breadCrumbs = [
      {
        label: 'Applications',
        url: '/multicloud/mcmapplications',
      },
      {
        label: `${applicationName}`,
        url: `/multicloud/mcmapplications/services/${applicationName}`,
      },
      {
        label: `${deployableName}`,
        url: `/multicloud/mcmapplications/services/${applicationName}/deployable/${deployableName}`,
      },
    ];

    updateSecondaryHeaderInfo(deployableName, breadCrumbs);
    // pdateSecondaryHeader(deployableName, getTabs(tabs, (tab, index) => (index === 0 ? params.match.url : `${params.match.url}/${tab}`)), this.getBreadcrumb(), launch_links)
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    // if (nextProps.location !== this.props.location) {
    //   const { updateSecondaryHeader, tabs, launch_links, match } = this.props, params = match && match.params
    //   updateSecondaryHeader(params.name, getTabs(tabs, (tab, index) => (index === 0 ? match.url : `${match.url}/${tab}`)), this.getBreadcrumb(nextProps.location), launch_links)
    // }
  }

  componentWillUnmount() {}

  render() {
    const { params } = this.props;
    const { locale } = this.context;

    return <div id="ApplicationDeployableDetails" />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationDeployableDetails);
