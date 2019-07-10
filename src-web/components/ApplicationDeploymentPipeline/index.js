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
import { RESOURCE_TYPES } from '../../../lib/shared/constants';
import { createResources } from '../../actions/common';
import PipelineGrid from './components/PipelineGrid';
import { Search } from 'carbon-components-react';
import {
  getApplicationsList,
  getDeployablesList,
  getChannelsList,
  getSubscriptionsList,
} from './utils';
import CreateResourceModal from '../modals/CreateResourceModal';

resources(() => {
  require('./style.scss');
});

const mapDispatchToProps = (dispatch) => {
  return {
    handleCreateResource: (dispatch, yaml) =>
      dispatch(createResources(RESOURCE_TYPES.HCM_CHANNELS, yaml)),
  };
};

const mapStateToProps = (state) => {
  const {
    HCMApplicationList,
    HCMChannelList,
    HCMSubscriptionList,
    role,
  } = state;
  console.log('lotd', state);
  console.log(
    'stringify',
    JSON.stringify(getDeployablesList(HCMApplicationList)),
  );

  return {
    userRole: role.role,
    HCMApplicationList,
    applications: getApplicationsList(HCMApplicationList),
    deployables: getDeployablesList(HCMApplicationList),
    channels: getChannelsList(HCMChannelList),
    subscriptions: getSubscriptionsList(HCMSubscriptionList),
  };
};

const CreateChannelModal = (handleCreateResource) => {
  return (
    <CreateResourceModal
      key="createChannel"
      headingTextKey="actions.add.channel"
      submitBtnTextKey="actions.add.channel"
      onCreateResource={handleCreateResource}
      resourceDescriptionKey="modal.createresource.application"
    />
  );
};

class ApplicationDeploymentPipeline extends React.Component {
  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const {
      HCMApplicationList,
      applications,
      deployables,
      channels,
      handleCreateResource,
    } = this.props;
    const { locale } = this.context;
    console.log('lotd', HCMApplicationList);
    // const handleCreateResource = (dispatch, yaml) => dispatch(createChannel(RESOURCE_TYPES.HCM_CHANNELS, yaml))
    const modal = React.cloneElement(CreateChannelModal(handleCreateResource), {
      resourceType: RESOURCE_TYPES.HCM_CHANNELS,
    });

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
        <div className="AddChannelButton">{[modal]}</div>
        <PipelineGrid
          applications={applications}
          deployables={deployables}
          channels={channels}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationDeploymentPipeline);
