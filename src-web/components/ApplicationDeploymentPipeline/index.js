/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
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
  fetchUserInfo,
  updateModal
} from '../../actions/common'
import {
  fetchChannelResource,
  fetchSubscriptionResource,
  closeModals
} from '../../reducers/reducerAppDeployments'
import PipelineGrid from './components/PipelineGrid'
import SubscriptionModal from './components/SubscriptionModal'
import { Search, Loading } from 'carbon-components-react'
import {
  getApplicationsList,
  getChannelsList,
  filterApps,
  getSubscriptionListGivenApplicationList
} from './utils'
import CreateResourceModal from '../modals/CreateResourceModal'
import apolloClient from '../../../lib/client/apollo-client'
import R from 'ramda'
import { showCreate } from '../../../lib/client/access-helper'

/* eslint-disable react/prop-types */

resources(() => {
  require('./style.scss')
})

const handleCreateChannelResource = (dispatch, yaml) =>
  dispatch(createResources(RESOURCE_TYPES.HCM_CHANNELS, yaml))

// Create Resource for Channel
const CreateChannelModal = (fetchChannels, locale) => {
  return (
    <CreateResourceModal
      key="createChannel"
      headingTextKey="actions.add.channel"
      submitBtnTextKey="actions.add.channel"
      onCreateResource={handleCreateChannelResource}
      onSubmitFunction={fetchChannels}
      resourceDescriptionKey="modal.createresource.channel"
      helpLink="https://www.ibm.com/support/knowledgecenter/SSFC4F_1.1.0/mcm/applications/managing_channels.html"
      iconDescription={msgs.get('actions.add.channel.iconDescription', locale)}
    />
  )
}

const handleCreateSubscriptionResource = (dispatch, yaml) =>
  dispatch(createResources(RESOURCE_TYPES.HCM_SUBSCRIPTIONS, yaml))

// Create Resource for Subscription
const CreateSubscriptionModal = (fetchSubscriptions, locale) => {
  return (
    <CreateResourceModal
      key="createSubscription"
      headingTextKey="actions.add.subscription"
      submitBtnTextKey="actions.add.subscription"
      onCreateResource={handleCreateSubscriptionResource}
      onSubmitFunction={fetchSubscriptions}
      resourceDescriptionKey="modal.createresource.subscription"
      helpLink="https://www.ibm.com/support/knowledgecenter/SSFC4F_1.1.0/mcm/applications/managing_subscriptions.html"
      iconDescription={msgs.get(
        'actions.add.subscription.iconDescription',
        locale
      )}
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
      helpLink: (data && data.helpLink) || '',
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
    fetchApplications: () =>
      dispatch(fetchResources(RESOURCE_TYPES.HCM_APPLICATIONS)),
    fetchUserInfo: () => dispatch(fetchUserInfo(RESOURCE_TYPES.USER_INFO)),
    editResource: (resourceType, data) =>
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
    //apolloClient requires CONTEXT .. so I have to pass it in here
    getSubscriptionResource: (selfLink, namespace, name, cluster) =>
      dispatch(
        fetchSubscriptionResource(
          apolloClient,
          selfLink,
          namespace,
          name,
          cluster
        )
      ),
    closeModal: () => dispatch(closeModals())
  }
}

const mapStateToProps = state => {
  const {
    HCMApplicationList,
    HCMChannelList,
    userInfoList,
    AppDeployments,
    secondaryHeader,
    role
  } = state
  // Filter Application List based on search input
  // Currently just filterin on application name
  const filteredApplications = filterApps(
    HCMApplicationList,
    AppDeployments.deploymentPipelineSearch
  )
  const activeAccountId = R.pathOr(
    '',
    ['items', 'activeAccountId'],
    userInfoList
  )
  const channelsList = getChannelsList(HCMChannelList)
  const applicationsList = getApplicationsList(filteredApplications)
  const appSubscriptionsList = getSubscriptionListGivenApplicationList(
    applicationsList
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
    currentSubscriptionInfo: AppDeployments.currentSubscriptionInfo || {},
    openEditChannelModal: AppDeployments.openEditChannelModal,
    openEditSubscriptionModal: AppDeployments.openEditSubscriptionModal,
    loading: AppDeployments.loading,
    breadcrumbItems: secondaryHeader.breadcrumbItems || [],
    applications: applicationsList,
    channels: channelsList,
    appSubscriptions: appSubscriptionsList,
    activeAccountId
  }
}

class ApplicationDeploymentPipeline extends React.Component {
  componentWillMount() {
    const {
      fetchChannels,
      fetchSubscriptions,
      fetchUserInfo,
      fetchApplications,
      bulkSubscriptionList
    } = this.props
    fetchChannels()
    fetchSubscriptions()
    fetchUserInfo()

    if (!bulkSubscriptionList || bulkSubscriptionList.length == 0) {
      //fetch applications if this call was not yet made
      fetchApplications()
    }
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const {
      serverProps,
      applications,
      channels,
      appSubscriptions,
      actions,
      editResource,
      getChannelResource,
      getSubscriptionResource,
      editSubscription,
      displaySubscriptionModal,
      subscriptionModalHeaderInfo,
      subscriptionModalSubscriptionInfo,
      currentChannelInfo,
      currentSubscriptionInfo,
      closeModal,
      openEditChannelModal,
      openEditSubscriptionModal,
      loading,
      appDropDownList,
      bulkSubscriptionList,
      userRole,
      breadcrumbItems,
      activeAccountId,
      fetchSubscriptions,
      fetchChannels
    } = this.props
    const { locale } = this.context
    const modalChannel = React.cloneElement(
      CreateChannelModal(fetchChannels, locale),
      {
        resourceType: RESOURCE_TYPES.HCM_CHANNELS
      }
    )
    const modalSubscription = React.cloneElement(
      CreateSubscriptionModal(fetchSubscriptions, locale),
      {
        resourceType: RESOURCE_TYPES.HCM_SUBSCRIPTIONS
      }
    )
    const subscriptionModalHeader =
      subscriptionModalHeaderInfo && subscriptionModalHeaderInfo.deployable
    const subscriptionModalLabel =
      subscriptionModalHeaderInfo && subscriptionModalHeaderInfo.application

    // This will trigger the edit Channel Modal because openEditChannelModal
    // is true AFTER the fetch of the channel data has been completed
    if (openEditChannelModal) {
      const data = R.pathOr([], ['data', 'items'], currentChannelInfo)[0]
      const name = R.pathOr('', ['metadata', 'name'], data)
      const namespace = R.pathOr('', ['metadata', 'namespace'], data)
      closeModal()
      editResource(RESOURCE_TYPES.HCM_CHANNELS, {
        name: name,
        namespace: namespace,
        data: data,
        helpLink:
          'https://www.ibm.com/support/knowledgecenter/SSFC4F_1.1.0/mcm/applications/managing_channels.html'
      })
    }
    // This will trigger the edit Subscription Modal because openEditSubscriptionModal
    // is true AFTER the fetch of the subscription data has been completed
    if (openEditSubscriptionModal) {
      const data = R.pathOr([], ['data', 'items'], currentSubscriptionInfo)[0]
      const name = R.pathOr('', ['metadata', 'name'], data)
      const namespace = R.pathOr('', ['metadata', 'namespace'], data)
      closeModal()
      editResource(RESOURCE_TYPES.HCM_SUBSCRIPTIONS, {
        name: name,
        namespace: namespace,
        data: data,
        helpLink:
          'https://www.ibm.com/support/knowledgecenter/SSFC4F_1.1.0/mcm/applications/managing_subscriptions.html'
      })
    }

    return (
      <div id="DeploymentPipeline">
        {loading && <Loading withOverlay={true} />}
        <div className="pipelineHeader">
          {msgs.get('description.title.deploymentPipeline', locale)}{' '}
          {channels && <span>({channels.length})</span>}
        </div>
        <div className="searchAndButtonContainer">
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
          {showCreate(userRole) && (
            <React.Fragment>
              <div className="AddChannelButton">{[modalChannel]}</div>
              <div className="AddSubscriptionButton">{[modalSubscription]}</div>
            </React.Fragment>
          )}
        </div>
        <PipelineGrid
          applications={applications}
          channels={channels}
          appSubscriptions={appSubscriptions}
          getChannelResource={getChannelResource}
          getSubscriptionResource={getSubscriptionResource}
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
          editResource={editResource}
          breadcrumbItems={breadcrumbItems}
        />
        <SubscriptionModal
          displayModal={displaySubscriptionModal}
          closeModal={actions.closeModals}
          header={subscriptionModalHeader}
          label={subscriptionModalLabel}
          modalSubscription={modalSubscription}
          editSubscription={editSubscription}
          subscriptionModalSubscriptionInfo={subscriptionModalSubscriptionInfo}
          bulkSubscriptionList={bulkSubscriptionList}
          activeAccountId={activeAccountId}
          userRole={userRole}
          serverProps={serverProps}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ApplicationDeploymentPipeline
)
