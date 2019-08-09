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
import { bindActionCreators } from 'redux'
import * as Actions from '../../actions'
import resources from '../../../lib/shared/resources'
import { RESOURCE_TYPES } from '../../../lib/shared/constants'
import {
  createResources,
  fetchResources,
  updateModal
} from '../../actions/common'
import PipelineGrid from './components/PipelineGrid'
import DeployableModal from './components/DeployableModal'
import { Search } from 'carbon-components-react'
import {
  getApplicationsList,
  getDeployablesList,
  getChannelsList,
  getSubscriptionsList
} from './utils'
import CreateResourceModal from '../modals/CreateResourceModal'

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
    editChannel: (resourceType, data) =>
      handleEditResource(dispatch, resourceType, data),
    fetchSubscriptions: () =>
      dispatch(fetchResources(RESOURCE_TYPES.HCM_SUBSCRIPTIONS)),
    editSubscription: (resourceType, data) =>
      handleEditResource(dispatch, resourceType, data)
  }
}

const mapStateToProps = state => {
  const {
    HCMApplicationList,
    HCMChannelList,
    HCMSubscriptionList,
    AppDeployments,
    role
  } = state
  console.log('state2', state)
  // TODO use AppDeployments.deploymentPipelineSearch to search and narrow down
  // the applications, deployables, and channels
  return {
    displayDeployableModal: AppDeployments.displayDeployableModal,
    deployableModalHeaderInfo: AppDeployments.deployableModalHeaderInfo,
    deployableModalSubscriptionInfo:
      AppDeployments.deployableModalSubscriptionInfo,
    userRole: role.role,
    HCMApplicationList,
    HCMChannelList,
    applications: getApplicationsList(HCMApplicationList),
    deployables: getDeployablesList(HCMApplicationList), // right now its only used for total number
    channels: getChannelsList(HCMChannelList),
    subscriptions: getSubscriptionsList(HCMSubscriptionList)
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
      subscriptions,
      actions,
      editChannel,
      editSubscription,
      displayDeployableModal,
      deployableModalHeaderInfo,
      deployableModalSubscriptionInfo
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
          subscriptions={subscriptions}
          editChannel={editChannel}
          openDeployableModal={actions.openDisplayDeployableModal}
          setDeployableModalHeaderInfo={actions.setDeployableModalHeaderInfo}
          setCurrentDeployableSubscriptionData={
            actions.setCurrentDeployableSubscriptionData
          }
        />
        <DeployableModal
          displayModal={displayDeployableModal}
          closeModal={actions.closeModals}
          header={deployableModalHeader}
          label={deployableModalLabel}
          modalSubscription={modalSubscription}
          editSubscription={editSubscription}
          deployableModalSubscriptionInfo={deployableModalSubscriptionInfo}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ApplicationDeploymentPipeline
)
