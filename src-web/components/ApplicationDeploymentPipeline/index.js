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
// import { withRouter } from 'react-router-dom'
import resources from '../../../lib/shared/resources';
import PipelineGrid from './components/PipelineGrid';
import { Search, Button, Icon } from 'carbon-components-react';
import { getApplicationsList, getDeployablesList } from './utils';

resources(() => {
  require('./style.scss');
});

const mapDispatchToProps = (/* dispatch*/) => {
  return {};
};

const mapStateToProps = (state) => {
  const { HCMApplicationList, role } = state;

  return {
    userRole: role.role,
    HCMApplicationList,
    applications: getApplicationsList(HCMApplicationList),
    deployables: getDeployablesList(HCMApplicationList),
  };
};

class ApplicationDeploymentPipeline extends React.Component {
  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const { HCMApplicationList, applications, deployables } = this.props;
    const { locale } = this.context;
    console.log('lotd', HCMApplicationList);
    return (
      <div id="DeploymentPipeline">
        <div className="piplineHeader">
          {msgs.get('description.title.deploymentPipeline', locale)}
        </div>
        <Search
          className="deploymentPipelineSearch"
          light
          name=""
          defaultValue=""
          labelText="Search"
          closeButtonLabelText=""
          placeHolderText="Search"
          onChange={() => {}}
          id="search-1"
        />
        <Button className="AddChannelButton">
          {msgs.get('actions.add.channel', locale)}
          <Icon className="addChannelIcon" name="icon--add" />
        </Button>
        <PipelineGrid applications={applications} deployables={deployables} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationDeploymentPipeline);
