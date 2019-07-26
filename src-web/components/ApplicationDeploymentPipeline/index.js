/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import msgs from '../../../nls/platform.properties'
import { connect } from 'react-redux'
// import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import * as Actions from '../../actions'
import resources from '../../../lib/shared/resources'
import { RESOURCE_TYPES } from '../../../lib/shared/constants'
import { createResources, fetchResources } from '../../actions/common'
import PipelineGrid from './components/PipelineGrid'
import DeployableModal from './components/DeployableModal'
import { Search } from 'carbon-components-react'
import {
  getApplicationsList,
  getDeployablesList,
  getChannelsList
} from './utils'
import CreateResourceModal from '../modals/CreateResourceModal'
import { updateModal } from '../../actions/common'

/* eslint-disable react/prop-types */

resources(() => {
  require('./style.scss')
})

const handleCreateChannelResource = (dispatch, yaml) =>
  dispatch(createResources(RESOURCE_TYPES.HCM_CHANNELS, yaml))

// Create Resource for Channel
const CreateChannelModal = () => {
  return (
    <CreateResourceModal
      key="createChannel"
      headingTextKey="actions.add.channel"
      submitBtnTextKey="actions.add.channel"
      onCreateResource={handleCreateChannelResource}
      resourceDescriptionKey="modal.createresource.channel"
    />
  )
}

const handleCreateSubscriptionResource = (dispatch, yaml) =>
  dispatch(createResources(RESOURCE_TYPES.HCM_CHANNELS, yaml))

// Create Resource for Subscription
const CreateSubscriptionModal = () => {
  return (
    <CreateResourceModal
      key="createSubscription"
      headingTextKey="actions.add.subscription"
      submitBtnTextKey="actions.add.subscription"
      onCreateResource={handleCreateSubscriptionResource}
      resourceDescriptionKey="modal.createresource.subscription"
    />
  )
}

const handleEditResource = (dispatch, resourceType, data) => {
  return dispatch(
    updateModal({
      open: true,
      type: 'resource-edit',
      action: 'put',
      resourceType,
      editorMode: 'yaml',
      label: {
        primaryBtn: 'modal.button.submit',
        label: `modal.edit-${resourceType.name.toLowerCase()}.label`,
        heading: `modal.edit-${resourceType.name.toLowerCase()}.heading`
      },
      name: (data && data.name) || '',
      namespace: (data && data.namespace) || '',
      data: (data && data.data) || ''
    })
  )
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(Actions, dispatch),
    fetchChannels: () => dispatch(fetchResources(RESOURCE_TYPES.HCM_CHANNELS)),
    fetchSubscriptions: () =>
      dispatch(fetchResources(RESOURCE_TYPES.HCM_SUBSCRIPTIONS)),
    editChannel: (resourceType, data) =>
      handleEditResource(dispatch, resourceType, data)
  }
}

const mapStateToProps = state => {
  const { HCMApplicationList, HCMChannelList, AppDeployments, role } = state
  // TODO use AppDeployments.deploymentPipelineSearch to search and narrow down
  // the applications, deployables, and channels
  return {
    displayDeployableModal: AppDeployments.displayDeployableModal,
    deployableModalHeaderInfo: AppDeployments.deployableModalHeaderInfo,
    userRole: role.role,
    HCMApplicationList,
    HCMChannelList,
    applications: getApplicationsList(HCMApplicationList),
    deployables: getDeployablesList(HCMApplicationList), // right now its only used for total number
    channels: getChannelsList(HCMChannelList)
  }
}

class ApplicationDeploymentPipeline extends React.Component {
  componentWillMount() {
    const { fetchChannels, fetchSubscriptions } = this.props
    fetchChannels()
    fetchSubscriptions()
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const {
      // HCMApplicationList,
      // HCMChannelList,
      applications,
      deployables,
      channels,
      actions,
      editChannel,
      displayDeployableModal,
      deployableModalHeaderInfo
    } = this.props
    const { locale } = this.context
    const modalChannel = React.cloneElement(CreateChannelModal(), {
      resourceType: RESOURCE_TYPES.HCM_CHANNELS
    })
    const modalSubscription = React.cloneElement(CreateSubscriptionModal(), {
      resourceType: RESOURCE_TYPES.HCM_SUBSCRIPTIONS
    })
    const deployableModalHeader =
      deployableModalHeaderInfo && deployableModalHeaderInfo.deployable
    const deployableModalLabel =
      deployableModalHeaderInfo && deployableModalHeaderInfo.application

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
          onChange={event => {
            actions.setDeploymentSearch(event.target.value)
          }}
          id="search-1"
        />
        <div className="AddChannelButton">{[modalChannel]}</div>
        <PipelineGrid
          applications={applications}
          deployables={deployables}
          channels={channels}
          editChannel={editChannel}
          openDeployableModal={actions.openDisplayDeployableModal}
          setDeployableModalHdeaderInfo={actions.setDeployableModalHdeaderInfo}
          addSubscriptionModal={modalSubscription}
        />
        <DeployableModal
          displayModal={displayDeployableModal}
          closeModal={actions.closeModals}
          header={deployableModalHeader}
          label={deployableModalLabel}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ApplicationDeploymentPipeline
)
