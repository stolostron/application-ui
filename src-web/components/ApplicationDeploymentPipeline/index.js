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
import { RESOURCE_TYPES } from '../../../lib/shared/constants'
import {
  fetchResources,
  fetchGlobalAppsData,
  updateModal,
  mutateResourceSuccessFinished
} from '../../actions/common'
import {
  fetchChannelResource,
  fetchSubscriptionResource,
  fetchPlacementRuleResource,
  fetchApplicationResource,
  closeModals
} from '../../reducers/reducerAppDeployments'
import PipelineGrid from './components/PipelineGrid'
import SubscriptionModal from './components/SubscriptionModal'
import {
  Search,
  Loading,
  Notification,
  Checkbox,
  Tooltip
} from 'carbon-components-react'
import {
  getChannelsList,
  getApplicationsForSelection,
  getSubscribedChannels
} from './utils'
import apolloClient from '../../../lib/client/apollo-client'
import ApplicationDeploymentHighlights from '../ApplicationDeploymentHighlights'
import ResourceCards from './components/InfoCards/ResourceCards'
import { getNamespaceAccountId } from '../common/ResourceDetails/utils'
import config from '../../../lib/shared/config'
import {
  handleEditResource,
  showEditModalByType
} from '../common/ResourceOverview/utils'
import HeaderActions from '../common/HeaderActions'
import CreateResourceActions from './components/CreateResourceActions'
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
    mutateSuccessFinished: resourceType =>
      dispatch(mutateResourceSuccessFinished(resourceType))
  }
}

const mapStateToProps = state => {
  const {
    HCMChannelList,
    HCMSubscriptionList,
    HCMNamespaceList,
    AppDeployments,
    secondaryHeader,
    QueryApplicationList,
    GlobalApplicationDataList,
    role
  } = state
  // Filter Application List based on search input
  // Currently just filterin on application name

  return {
    userRole: role && role.role,
    HCMChannelList,
    HCMSubscriptionList,
    AppDeployments,
    QueryApplicationList,
    GlobalApplicationDataList,
    HCMNamespaceList,
    loading: AppDeployments.loading,
    breadcrumbItems: secondaryHeader.breadcrumbItems || [],
    mutateStatus:
      state['HCMChannelList'].mutateStatus ||
      state['HCMSubscriptionList'].mutateStatus ||
      state['HCMPlacementRuleList'].mutateStatus
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
      fetchApplicationsGlobalData
    } = this.props

    fetchApplications()
    fetchChannels()
    fetchSubscriptions()
    fetchApplicationsGlobalData()

    this.startPolling()
    document.addEventListener('visibilitychange', this.onVisibilityChange)
  }

  componentWillUnmount() {
    this.stopPolling()
    document.removeEventListener('visibilitychange', this.onVisibilityChange)
  }

  startPolling() {
    if (parseInt(config['featureFlags:liveUpdates'], 10) === 2) {
      var intervalId = setInterval(
        this.reload.bind(this),
        config['featureFlags:liveUpdatesPollInterval']
      )
      this.setState({ intervalId: intervalId })
    }
  }

  stopPolling() {
    if (this.state && this.state.intervalId) {
      clearInterval(this.state.intervalId)
    }
  }

  onVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      this.startPolling()
    } else {
      this.props.mutateSuccessFinished(RESOURCE_TYPES.HCM_CHANNELS)
      this.props.mutateSuccessFinished(RESOURCE_TYPES.HCM_SUBSCRIPTIONS)
      this.props.mutateSuccessFinished(RESOURCE_TYPES.HCM_PLACEMENT_RULES)
      this.stopPolling()
    }
  };

  reload() {
    const {
      breadcrumbItems,
      fetchApplications,
      fetchApplicationsGlobalData,
      fetchSubscriptions,
      fetchChannels
    } = this.props

    // only reload data if there are nothing being fetched and no modals are open

    this.setState({ xhrPoll: true })
    const isSingleApplicationView = breadcrumbItems.length === 2
    if (!isSingleApplicationView) {
      // reload all the applications
      fetchApplications()
      fetchApplicationsGlobalData()
      fetchSubscriptions()
    }
    fetchChannels()
  }

  render() {
    // wait for it
    const {
      HCMSubscriptionList,
      HCMChannelList,
      HCMNamespaceList,
      QueryApplicationList,
      GlobalApplicationDataList
    } = this.props
    if (
      QueryApplicationList.status === Actions.REQUEST_STATUS.ERROR ||
      HCMSubscriptionList.status === Actions.REQUEST_STATUS.ERROR ||
      HCMChannelList.status === Actions.REQUEST_STATUS.ERROR
    ) {
      return (
        <Notification
          title=""
          className="overview-notification"
          kind="error"
          subtitle={msgs.get('overview.error.default', locale)}
        />
      )
    } else if (
      (QueryApplicationList.status !== Actions.REQUEST_STATUS.DONE ||
        HCMSubscriptionList.status !== Actions.REQUEST_STATUS.DONE ||
        HCMChannelList.status !== Actions.REQUEST_STATUS.DONE) &&
      !this.state.xhrPoll
    ) {
      return <Loading withOverlay={false} className="content-spinner" />
    }

    const {
      serverProps,
      AppDeployments,
      actions,
      editResource,
      getChannelResource,
      getApplicationResource,
      getSubscriptionResource,
      getPlacementRuleResource,
      editSubscription,
      loading,
      userRole,
      breadcrumbItems,
      fetchSubscriptions,
      fetchChannels,
      fetchPlacementRules,
      closeModal,
      mutateStatus
    } = this.props
    const { locale } = this.context

    const applications = getApplicationsForSelection(
      QueryApplicationList,
      breadcrumbItems,
      AppDeployments
    )

    const bulkSubscriptionList =
      (HCMSubscriptionList && HCMSubscriptionList.items) || []

    const channels = getSubscribedChannels(
      getChannelsList(HCMChannelList),
      applications,
      breadcrumbItems,
      AppDeployments
    )

    const isSingleApplicationView =
      breadcrumbItems && breadcrumbItems.length === 2
    let selectedAppName = ''
    let selectedAppNS = ''
    let app = null
    if (
      applications &&
      applications instanceof Array &&
      applications.length === 1
    ) {
      app = applications[0]
      selectedAppNS = app.namespace
      selectedAppName = app.name
    }

    const subscriptionModalHeader =
      AppDeployments.subscriptionModalHeaderInfo &&
      AppDeployments.subscriptionModalHeaderInfo.deployable
    const subscriptionModalLabel =
      AppDeployments.subscriptionModalHeaderInfo &&
      AppDeployments.subscriptionModalHeaderInfo.application

    // This will trigger the edit Channel Modal because openEditChannelModal
    // is true AFTER the fetch of the channel data has been completed
    if (AppDeployments.openEditChannelModal) {
      showEditModalByType(
        closeModal,
        editResource,
        RESOURCE_TYPES.HCM_CHANNELS,
        AppDeployments.currentChannelInfo || {},
        'https://www.ibm.com/support/knowledgecenter/SSFC4F_1.2.0/mcm/applications/managing_channels.html'
      )
    } else if (AppDeployments.openEditApplicationModal) {
      showEditModalByType(
        closeModal,
        editResource,
        RESOURCE_TYPES.HCM_APPLICATIONS,
        AppDeployments.currentApplicationInfo || {},
        'https://www.ibm.com/support/knowledgecenter/SSFC4F_1.2.0/mcm/applications/managing_apps.html'
      )
    } else if (AppDeployments.openEditSubscriptionModal) {
      showEditModalByType(
        closeModal,
        editResource,
        RESOURCE_TYPES.HCM_SUBSCRIPTIONS,
        AppDeployments.currentSubscriptionInfo || {},
        'https://www.ibm.com/support/knowledgecenter/SSFC4F_1.2.0/mcm/applications/managing_subscriptions.html'
      )
    } else if (AppDeployments.openEditPlacementRuleModal) {
      showEditModalByType(
        closeModal,
        editResource,
        RESOURCE_TYPES.HCM_PLACEMENT_RULES,
        AppDeployments.currentPlacementRuleInfo || {},
        'https://www.ibm.com/support/knowledgecenter/SSFC4F_1.2.0/mcm/applications/managing_placement_rules.html'
      )
    }
    return (
      <div id="DeploymentPipeline">
        {loading && <Loading withOverlay={true} />}
        {mutateStatus === Actions.REQUEST_STATUS.DONE && (
          <Notification
            title=""
            subtitle={msgs.get('success.create.description', locale)}
            kind="success"
          />
        )}
        {isSingleApplicationView && (
          <HeaderActions
            serverProps={serverProps}
            getApplicationResource={getApplicationResource}
            app={app}
            namespaceAccountId={getNamespaceAccountId(
              HCMNamespaceList,
              selectedAppNS
            )}
          />
        )}
        <div className="pipelineHeader">
          {msgs.get('description.title.deploymentPipeline', locale)}{' '}
          {channels && <span>({channels.length})</span>}
        </div>
        <ApplicationDeploymentHighlights />
        <div className="resource-cards-container">
          <div className="resource-cards-info-container">
            <ResourceCards
              selectedAppName={selectedAppName}
              selectedAppNS={selectedAppNS}
              isSingleApplicationView={isSingleApplicationView}
              globalAppData={GlobalApplicationDataList}
            />
          </div>
          <CreateResourceActions
            fetchChannels={fetchChannels}
            fetchSubscriptions={fetchSubscriptions}
            fetchPlacementRules={fetchPlacementRules}
            userRole={userRole}
          />
        </div>
        {!isSingleApplicationView && (
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
          </div>
        )}
        {isSingleApplicationView && (
          <div className="show-channels-container">
            <div>
              <Checkbox
                id="ShowAllChannels"
                checked={AppDeployments.showAllChannels}
                onChange={event => {
                  actions.setShowAllChannels(event)
                }}
                labelText={msgs.get('actions.showAllChannels', locale)}
              />
            </div>
            <div className="show-channels-icon">
              <Tooltip triggerText="">
                <p>
                  {msgs.get('description.show.all.channels.tooltip', locale)}
                </p>
              </Tooltip>
            </div>
          </div>
        )}
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
          breadcrumbItems={breadcrumbItems}
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
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ApplicationDeploymentPipeline
)
