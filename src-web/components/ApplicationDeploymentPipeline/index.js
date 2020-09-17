/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
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
import { RESOURCE_TYPES, DOC_LINKS } from '../../../lib/shared/constants'
import {
  fetchResources,
  fetchGlobalAppsData,
  updateModal,
  updateSecondaryHeader,
  clearSuccessFinished
} from '../../actions/common'
import { refetchIntervalUpdate } from '../../actions/refetch'
import {
  fetchChannelResource,
  fetchSubscriptionResource,
  fetchPlacementRuleResource,
  fetchApplicationResource,
  closeModals
} from '../../reducers/reducerAppDeployments'
import PipelineGrid from './components/PipelineGrid'
import SubscriptionModal from './components/SubscriptionModal'
import { Search, Notification } from 'carbon-components-react'
import {
  getChannelsList,
  getApplicationsForSelection,
  getSubscribedChannels
} from './utils'
import {
  loadingComponent,
  handleEditResource,
  handleDeleteResource,
  showEditModalByType
} from '../../components/common/ResourceOverview/utils'
import apolloClient from '../../../lib/client/apollo-client'
import ApplicationDeploymentHighlights from '../ApplicationDeploymentHighlights'

import {
  renderRefreshTime,
  stopPolling,
  handleRefreshPropertiesChanged,
  handleVisibilityChanged,
  startPolling
} from '../../shared/utils/refetch'

/* eslint-disable react/prop-types */

resources(() => {
  require('./style.scss')
})

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(Actions, dispatch),
    fetchChannels: () => dispatch(fetchResources(RESOURCE_TYPES.HCM_CHANNELS)),
    fetchApplications: () =>
      dispatch(fetchResources(RESOURCE_TYPES.QUERY_APPLICATIONS)),
    fetchApplicationsGlobalData: () =>
      dispatch(fetchGlobalAppsData(RESOURCE_TYPES.GLOBAL_APPLICATIONS_DATA)),
    editResource: (resourceType, data) =>
      handleEditResource(dispatch, updateModal, resourceType, data),
    deleteResource: (resourceType, data) =>
      handleDeleteResource(apolloClient.getClient(), resourceType, data),
    fetchSubscriptions: () =>
      dispatch(fetchResources(RESOURCE_TYPES.HCM_SUBSCRIPTIONS)),
    fetchPlacementRules: () =>
      dispatch(fetchResources(RESOURCE_TYPES.HCM_PLACEMENT_RULES)),
    editSubscription: (resourceType, data) =>
      handleEditResource(dispatch, updateModal, resourceType, data),
    //apolloClient requires CONTEXT .. so I have to pass it in here
    getChannelResource: (selfLink, namespace, name, cluster) =>
      dispatch(
        fetchChannelResource(apolloClient, selfLink, namespace, name, cluster)
      ),
    getApplicationResource: (selfLink, namespace, name, cluster) =>
      dispatch(
        fetchApplicationResource(
          apolloClient,
          selfLink,
          namespace,
          name,
          cluster
        )
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
    getPlacementRuleResource: (selfLink, namespace, name, cluster) =>
      dispatch(
        fetchPlacementRuleResource(
          apolloClient,
          selfLink,
          namespace,
          name,
          cluster
        )
      ),
    closeModal: () => dispatch(closeModals()),
    clearSuccessFinished: () => clearSuccessFinished(dispatch),
    refetchIntervalUpdateDispatch: data =>
      dispatch(refetchIntervalUpdate(data)),
    updateSecondaryHeader: (title, tabs, links) =>
      dispatch(updateSecondaryHeader(title, tabs, null, links))
  }
}

const mapStateToProps = state => {
  const {
    HCMChannelList,
    HCMSubscriptionList,
    AppDeployments,
    QueryApplicationList,
    GlobalApplicationDataList,
    refetch
  } = state
  // Filter Application List based on search input
  // Currently just filterin on application name

  return {
    HCMChannelList,
    HCMSubscriptionList,
    AppDeployments,
    QueryApplicationList,
    GlobalApplicationDataList,
    loading: AppDeployments.loading,
    mutateStatus:
      state['HCMChannelList'].mutateStatus ||
      state['HCMSubscriptionList'].mutateStatus ||
      state['HCMPlacementRuleList'].mutateStatus,
    deleteStatus:
      state['HCMChannelList'].deleteStatus ||
      state['HCMSubscriptionList'].deleteStatus ||
      state['HCMPlacementRuleList'].deleteStatus,
    deleteMsg:
      state['HCMChannelList'].deleteMsg ||
      state['HCMSubscriptionList'].deleteMsg ||
      state['HCMPlacementRuleList'].deleteMsg,
    refetch
  }
}

class ApplicationDeploymentPipeline extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      xhrPoll: false
    }
  }

  componentDidMount() {
    const {
      fetchChannels,
      fetchSubscriptions,
      fetchApplications,
      fetchApplicationsGlobalData,
      secondaryHeaderProps,
      updateSecondaryHeader,
      locale
    } = this.props

    updateSecondaryHeader(
      msgs.get(secondaryHeaderProps.title, locale),
      secondaryHeaderProps.tabs,
      secondaryHeaderProps.links
    )
    fetchApplications()
    fetchChannels()
    fetchSubscriptions()
    fetchApplicationsGlobalData()

    document.addEventListener('visibilitychange', this.onVisibilityChange)
    startPolling(this, setInterval)
  }

  componentWillUnmount() {
    stopPolling(this.state, clearInterval)
    document.removeEventListener('visibilitychange', this.onVisibilityChange)
    this.mutateFinished()
  }

  mutateFinished() {
    this.props.clearSuccessFinished()
  }

  onVisibilityChange = () => {
    handleVisibilityChanged(this, clearInterval, setInterval)
  };

  componentDidUpdate(prevProps) {
    handleRefreshPropertiesChanged(prevProps, this, clearInterval, setInterval)
  }

  reload() {
    const {
      selectedApp,
      fetchApplications,
      fetchApplicationsGlobalData,
      fetchSubscriptions,
      fetchChannels
    } = this.props

    // only reload data if there are nothing being fetched and no modals are open
    this.setState({ xhrPoll: true })
    if (!selectedApp) {
      // reload all the applications
      fetchApplications()
      fetchApplicationsGlobalData()
      fetchSubscriptions()
    }
    fetchChannels()
  }

  render() {
    // // wait for it
    // const {
    //   HCMSubscriptionList,
    //   HCMChannelList,
    //   QueryApplicationList
    // } = this.props
    // if (
    //   QueryApplicationList.status === Actions.REQUEST_STATUS.ERROR ||
    //   HCMSubscriptionList.status === Actions.REQUEST_STATUS.ERROR ||
    //   HCMChannelList.status === Actions.REQUEST_STATUS.ERROR
    // ) {
    //   return (
    //     <Notification
    //       title=""
    //       className="overview-notification"
    //       kind="error"
    //       subtitle={msgs.get('overview.error.default', locale)}
    //     />
    //   )
    // } else if (
    //   (QueryApplicationList.status !== Actions.REQUEST_STATUS.DONE ||
    //     HCMSubscriptionList.status !== Actions.REQUEST_STATUS.DONE ||
    //     HCMChannelList.status !== Actions.REQUEST_STATUS.DONE) &&
    //   !this.state.xhrPoll
    // ) {
    //   return loadingComponent()
    // }

    const {
      selectedApp,
      AppDeployments,
      actions,
      editResource,
      deleteResource,
      getChannelResource,
      getSubscriptionResource,
      getPlacementRuleResource,
      editSubscription,
      loading,
      fetchChannels,
      closeModal,
      mutateStatus,
      deleteStatus,
      deleteMsg,
      refetchIntervalUpdateDispatch,
      locale
    } = this.props

    // const { isLoaded = true, isReloading = false } = fetchChannels
    // const { timestamp = new Date().toString() } = this.state

    // const applications = getApplicationsForSelection(
    //   QueryApplicationList,
    //   selectedApp,
    //   AppDeployments
    // )

    // const bulkSubscriptionList =
    //   (HCMSubscriptionList && HCMSubscriptionList.items) || []

    // const channels = getSubscribedChannels(
    //   getChannelsList(HCMChannelList),
    //   applications,
    //   selectedApp,
    //   AppDeployments
    // )

    // const subscriptionModalHeader =
    //   AppDeployments.subscriptionModalHeaderInfo &&
    //   AppDeployments.subscriptionModalHeaderInfo.deployable
    // const subscriptionModalLabel =
    //   AppDeployments.subscriptionModalHeaderInfo &&
    //   AppDeployments.subscriptionModalHeaderInfo.application

    // // This will trigger the edit Channel Modal because openEditChannelModal
    // // is true AFTER the fetch of the channel data has been completed
    // if (AppDeployments.openEditChannelModal) {
    //   showEditModalByType(
    //     closeModal,
    //     editResource,
    //     RESOURCE_TYPES.HCM_CHANNELS,
    //     AppDeployments.currentChannelInfo || {},
    //     DOC_LINKS.CHANNELS
    //   )
    // } else if (AppDeployments.openEditApplicationModal) {
    //   showEditModalByType(
    //     closeModal,
    //     editResource,
    //     RESOURCE_TYPES.HCM_APPLICATIONS,
    //     AppDeployments.currentApplicationInfo || {},
    //     DOC_LINKS.APPLICATIONS
    //   )
    // } else if (AppDeployments.openEditSubscriptionModal) {
    //   showEditModalByType(
    //     closeModal,
    //     editResource,
    //     RESOURCE_TYPES.HCM_SUBSCRIPTIONS,
    //     AppDeployments.currentSubscriptionInfo || {},
    //     DOC_LINKS.SUBSCRIPTIONS
    //   )
    // } else if (AppDeployments.openEditPlacementRuleModal) {
    //   showEditModalByType(
    //     closeModal,
    //     editResource,
    //     RESOURCE_TYPES.HCM_PLACEMENT_RULES,
    //     AppDeployments.currentPlacementRuleInfo || {},
    //     DOC_LINKS.PLACEMENT_RULES
    //   )
    // }
    return (
      <div id="DeploymentPipeline">
        {deleteStatus === Actions.REQUEST_STATUS.DONE && (
          <Notification
            title={msgs.get('success.update.resource', locale)}
            subtitle={msgs.get(
              'success.delete.description',
              [deleteMsg],
              locale
            )}
            kind="success"
          />
        )}
        {mutateStatus === Actions.REQUEST_STATUS.DONE && (
          <Notification
            title=""
            subtitle={msgs.get('success.create.description', locale)}
            kind="success"
          />
        )}
        <ApplicationDeploymentHighlights />
        {/* <div className="searchAndButtonContainer">
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
        </div>
        <PipelineGrid
          applications={applications}
          channels={channels}
          appSubscriptions={HCMSubscriptionList.items}
          getChannelResource={getChannelResource}
          getSubscriptionResource={getSubscriptionResource}
          getPlacementRuleResource={getPlacementRuleResource}
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
          appDropDownList={AppDeployments.appDropDownList || []}
          bulkSubscriptionList={bulkSubscriptionList}
          editResource={editResource}
          deleteResource={deleteResource}
          selectedApp={selectedApp}
        />
        <SubscriptionModal
          displayModal={AppDeployments.displaySubscriptionModal}
          closeModal={actions.closeModals}
          header={subscriptionModalHeader}
          label={subscriptionModalLabel}
          editSubscription={editSubscription}
          subscriptionModalSubscriptionInfo={
            AppDeployments.subscriptionModalSubscriptionInfo
          }
          bulkSubscriptionList={bulkSubscriptionList}
          applications={QueryApplicationList}
        /> */}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ApplicationDeploymentPipeline
)
