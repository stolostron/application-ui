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
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions';
import resources from '../../../lib/shared/resources';
import { RESOURCE_TYPES } from '../../../lib/shared/constants';
import { createResources } from '../../actions/common';
import PipelineGrid from './components/PipelineGrid';
import { Search } from 'carbon-components-react';
import {
  getApplicationsList,
  getDeployablesList,
  getChannelsList,
} from './utils';
import CreateResourceModal from '../modals/CreateResourceModal';

resources(() => {
  require('./style.scss');
});

const mapDispatchToProps = (dispatch) => {
  return {
    handleCreateResource: (yaml) => {
      dispatch(createResources(RESOURCE_TYPES.HCM_CHANNELS, yaml));
    },
    actions: bindActionCreators(Actions, dispatch),
  };
};

const mapStateToProps = (state) => {
  const {
    HCMApplicationList,
    HCMChannelList,
    // AppDeployments,
    role,
  } = state;
  // TODO use AppDeployments.deploymentPipelineSearch to search and narrow down
  // the applications, deployables, and channels
  return {
    userRole: role.role,
    HCMApplicationList,
    applications: getApplicationsList(HCMApplicationList),
    deployables: getDeployablesList(HCMApplicationList),
    channels: getChannelsList(HCMChannelList),
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
      applications,
      deployables,
      channels,
      handleCreateResource,
      actions,
    } = this.props;
    const { locale } = this.context;
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
          onChange={(event) => {
            actions.setDeploymentSearch(event.target.value);
          }}
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
