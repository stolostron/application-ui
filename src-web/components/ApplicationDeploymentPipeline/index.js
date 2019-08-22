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
  fetchSubscriptionResource,
  closeModals
} from '../../reducers/reducerAppDeployments'
import PipelineGrid from './components/PipelineGrid'
import SubscriptionModal from './components/SubscriptionModal'
import { Search, Loading } from 'carbon-components-react'
import {
  getApplicationsList,
  getChannelsList,
  getSubscriptionsList,
  filterApps
} from './utils'
import CreateResourceModal from '../modals/CreateResourceModal'
import apolloClient from '../../../lib/client/apollo-client'
import R from 'ramda'

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
  dispatch(createResources(RESOURCE_TYPES.HCM_SUBSCRIPTIONS, yaml))

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
    currentSubscriptionInfo: AppDeployments.currentSubscriptionInfo || {},
    openEditChannelModal: AppDeployments.openEditChannelModal,
    openEditSubscriptionModal: AppDeployments.openEditSubscriptionModal,
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
      userRole
    } = this.props
    const hasAdminRole = userRole && userRole === 'ClusterAdministrator'
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
      const data = R.pathOr([], ['data', 'items'], currentChannelInfo)[0]
      const name = R.pathOr('', ['metadata', 'name'], data)
      const namespace = R.pathOr('', ['metadata', 'namespace'], data)
      closeModal()
      editResource(RESOURCE_TYPES.HCM_CHANNELS, {
        name: name,
        namespace: namespace,
        data: data
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
        data: data
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
        {hasAdminRole ? (
          <span>
            <div className="AddChannelButton">{[modalChannel]}</div>
            <div className="AddSubscriptionButton">
              {[modalSubscription]}
            </div>{' '}
          </span>
        ) : (
          <div />
        )}
        <PipelineGrid
          applications={applications}
          channels={channels}
          subscriptions={subscriptions}
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
          hasAdminRole={hasAdminRole}
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
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ApplicationDeploymentPipeline
)
