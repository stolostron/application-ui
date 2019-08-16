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
import {
  fetchChannelResource,
  closeModals
} from '../../reducers/reducerAppDeployments'
import PipelineGrid from './components/PipelineGrid'
import subscriptionModal from './components/SubscriptionModal'
import { Search, Loading } from 'carbon-components-react'
import {
  getApplicationsList,
  getChannelsList,
  getSubscriptionsList,
  filterApps
} from './utils'
import CreateResourceModal from '../modals/CreateResourceModal'
import apolloClient from '../../../lib/client/apollo-client'

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
      handleEditResource(dispatch, resourceType, data),
    //apolloClient requires CONTEXT .. so I have to pass it in here
    getChannelResource: (selfLink, namespace, name, cluster) =>
      dispatch(
        fetchChannelResource(apolloClient, selfLink, namespace, name, cluster)
      ),
    closeModal: () => dispatch(closeModals())
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
  // Filter Application List based on search input
  // Currently just filterin on application name
  const filteredApplications = filterApps(
    HCMApplicationList,
    AppDeployments.deploymentPipelineSearch
  )
  return {
    displaySubscriptionModal: AppDeployments.displaySubscriptionModal,
    subscriptionModalHeaderInfo: AppDeployments.subscriptionModalHeaderInfo,
    subscriptionModalSubscriptionInfo:
      AppDeployments.subscriptionModalSubscriptionInfo,
    bulkSubscriptionList: AppDeployments.bulkSubscriptionList,
    userRole: role.role,
    appDropDownList: AppDeployments.appDropDownList || [],
    HCMApplicationList: filteredApplications,
    HCMChannelList,
    currentChannelInfo: AppDeployments.currentChannelInfo || {},
    openEditChannelModal: AppDeployments.openEditChannelModal,
    loading: AppDeployments.loading,
    applications: getApplicationsList(filteredApplications),
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
      applications,
      channels,
      subscriptions,
      actions,
      editChannel,
      getChannelResource,
      editSubscription,
      displaySubscriptionModal,
      subscriptionModalHeaderInfo,
      subscriptionModalSubscriptionInfo,
      currentChannelInfo,
      closeModal,
      openEditChannelModal,
      loading,
      appDropDownList,
      bulkSubscriptionList
    } = this.props
    const { locale } = this.context
    const modalChannel = React.cloneElement(CreateChannelModal(), {
      resourceType: RESOURCE_TYPES.HCM_CHANNELS
    })
    const modalSubscription = React.cloneElement(CreateSubscriptionModal(), {
      resourceType: RESOURCE_TYPES.HCM_SUBSCRIPTIONS
    })
    const subscriptionModalHeader =
      subscriptionModalHeaderInfo && subscriptionModalHeaderInfo.deployable
    const subscriptionModalLabel =
      subscriptionModalHeaderInfo && subscriptionModalHeaderInfo.application

    // This will trigger the edit Channel Modal because openEditChannelModal
    // is true AFTER the fetch of the channel data has been completed
    if (openEditChannelModal) {
      closeModal()
      editChannel(RESOURCE_TYPES.HCM_CHANNELS, {
        name: currentChannelInfo.data.items[0].metadata.name,
        namespace: currentChannelInfo.data.items[0].metadata.namespace,
        data: currentChannelInfo.data.items[0]
      })
    }

    return (
      <div id="DeploymentPipeline">
        {loading && <Loading withOverlay={true} />}
        <div className="piplineHeader">
          {msgs.get('description.title.deploymentPipeline', locale)}
        </div>
        <Search
          className="deploymentPipelineSearch"
          light
          name=""
          defaultValue=""
          labelText={msgs.get('actions.searchApplications', locale)}
          closeButtonLabelText=""
          placeHolderText={msgs.get('actions.searchApplications', locale)}
          onChange={event => {
            actions.setDeploymentSearch(event.target.value)
          }}
          id="search-1"
        />
        <div className="AddChannelButton">{[modalChannel]}</div>
        <PipelineGrid
          applications={applications}
          channels={channels}
          subscriptions={subscriptions}
          getChannelResource={getChannelResource}
          openSubscriptionModal={actions.openDisplaySubscriptionModal}
          setSubscriptionModalHeaderInfo={
            actions.setSubscriptionModalHeaderInfo
          }
          setCurrentDeployableSubscriptionData={
            actions.setCurrentDeployableSubscriptionData
          }
          setCurrentsubscriptionModalData={
            actions.setCurrentsubscriptionModalData
          }
          updateAppDropDownList={actions.updateAppDropDownList}
          appDropDownList={appDropDownList}
          bulkSubscriptionList={bulkSubscriptionList}
        />
        <subscriptionModal
          displayModal={displaySubscriptionModal}
          closeModal={actions.closeModals}
          header={subscriptionModalHeader}
          label={subscriptionModalLabel}
          modalSubscription={modalSubscription}
          editSubscription={editSubscription}
          subscriptionModalSubscriptionInfo={subscriptionModalSubscriptionInfo}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ApplicationDeploymentPipeline
)
