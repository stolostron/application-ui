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
import { connect } from 'react-redux';
// import { withRouter } from 'react-router-dom'
import resources from '../../../lib/shared/resources';
import { getApplicationsListTotal } from './utils';

resources(() => {
  require('./style.scss');
});

const mapDispatchToProps = (dispatch) => {
  return {

  };
};

const mapStateToProps = (state) => {
  const {
    HCMApplicationList,
    role,
  } = state;

  return {
    userRole: role.role,
    HCMApplicationList,
    totalApplications: getApplicationsListTotal(HCMApplicationList),
    // totalDeployables,
  };
};

class ApplicationDeploymentPipeline extends React.Component {
  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    const {
      HCMApplicationList
    } = this.props;
    const { locale } = this.context;
    return (
      <div id="DeploymentPipeline">
        {msgs.get('description.title.deploymentPipeline', locale)}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationDeploymentPipeline)
