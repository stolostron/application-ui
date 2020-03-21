/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc
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
  fetchGlobalAppsData,
  updateModal
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
import { Search, Loading, Notification } from 'carbon-components-react'
import { getApplicationsList, getChannelsList, filterApps } from './utils'
import {
  getChannelSample,
  getSubscriptionSample,
  getPlacementRuleSample
} from '../../shared/yamlSamples/index'
import CreateResourceModal from '../modals/CreateResourceModal'
import apolloClient from '../../../lib/client/apollo-client'
import R from 'ramda'
import { showCreate } from '../../../lib/client/access-helper'
import ApplicationDeploymentHighlights from '../ApplicationDeploymentHighlights'
import ResourceCards from './components/InfoCards/ResourceCards'
import { getNamespaceAccountId } from '../common/ResourceDetails/utils'
import config from '../../../lib/shared/config'
import {
  handleEditResource,
  HeaderActions,
  showEditModalByType
} from '../common/ResourceOverview/utils'
/* eslint-disable react/prop-types */

resources(() => {
  require('./style.scss')
})

const handleCreateChannelResource = (dispatch, yaml) =>
  dispatch(createResources(RESOURCE_TYPES.HCM_CHANNELS, yaml))

// Create Resource for Channel
const CreateChannelModal = (fetchChannels, locale) => {
  const channelTabs = {
    tab1: msgs.get('modal.title.namespace', locale),
    tab2: msgs.get('modal.title.helmRepo', locale),
    tab3: msgs.get('modal.title.objectBucket', locale),
    tab4: msgs.get('modal.title.gitRepo', locale)
  }

  return (
    <CreateResourceModal
      key="createChannel"
      headingTextKey="actions.add.channel"
      resourceTypeName="description.channel"
      onCreateResource={handleCreateChannelResource}
      onSubmitFunction={fetchChannels}
      resourceDescriptionKey="modal.createresource.channel"
      helpLink="https://www.ibm.com/support/knowledgecenter/SSFC4F_1.2.0/mcm/applications/managing_channels.html"
      iconDescription={msgs.get('actions.add.channel.iconDescription', locale)}
      sampleTabs={channelTabs}
      sampleContent={[
        getChannelSample('Namespace', locale),
        getChannelSample('HelmRepo', locale),
        getChannelSample('ObjectBucket', locale),
        getChannelSample('GitRepo', locale)
      ]}
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
      resourceTypeName="description.subscription"
      onCreateResource={handleCreateSubscriptionResource}
      onSubmitFunction={fetchSubscriptions}
      resourceDescriptionKey="modal.createresource.subscription"
      helpLink="https://www.ibm.com/support/knowledgecenter/SSFC4F_1.2.0/mcm/applications/managing_subscriptions.html"
      iconDescription={msgs.get(
        'actions.add.subscription.iconDescription',
        locale
      )}
      sampleContent={[getSubscriptionSample(locale)]}
    />
  )
}

const handleCreatePlacementRuleResource = (dispatch, yaml) =>
  dispatch(createResources(RESOURCE_TYPES.HCM_PLACEMENT_RULES, yaml))

// Create Resource for Subscription
const CreatePlacementRuleModal = (fetchPlacementRuleResource, locale) => {
  return (
    <CreateResourceModal
      key="createPlacementRule"
      headingTextKey="actions.add.placementRule"
      resourceTypeName="description.placementRule"
      onCreateResource={handleCreatePlacementRuleResource}
      onSubmitFunction={fetchPlacementRuleResource}
      resourceDescriptionKey="modal.createresource.placementrule"
      helpLink="https://www.ibm.com/support/knowledgecenter/SSFC4F_1.2.0/mcm/applications/managing_placement_rules.html"
      iconDescription={msgs.get(
        'actions.add.subscription.iconDescription',
        locale
      )}
      sampleContent={[getPlacementRuleSample(locale)]}
    />
  )
}

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
    closeModal: () => dispatch(closeModals())
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
    displaySubscriptionModal: AppDeployments.displaySubscriptionModal,
    subscriptionModalHeaderInfo: AppDeployments.subscriptionModalHeaderInfo,
    subscriptionModalSubscriptionInfo:
      AppDeployments.subscriptionModalSubscriptionInfo,
    userRole: role && role.role,
    appDropDownList: AppDeployments.appDropDownList || [],
    HCMChannelList,
    HCMSubscriptionList,
    AppDeployments,
    QueryApplicationList,
    GlobalApplicationDataList,
    currentApplicationInfo: AppDeployments.currentApplicationInfo || {},
    currentChannelInfo: AppDeployments.currentChannelInfo || {},
    currentSubscriptionInfo: AppDeployments.currentSubscriptionInfo || {},
    currentPlacementRuleInfo: AppDeployments.currentPlacementRuleInfo || {},
    openEditChannelModal: AppDeployments.openEditChannelModal,
    openEditApplicationModal: AppDeployments.openEditApplicationModal,
    openEditSubscriptionModal: AppDeployments.openEditSubscriptionModal,
    openEditPlacementRuleModal: AppDeployments.openEditPlacementRuleModal,
    loading: AppDeployments.loading,
    breadcrumbItems: secondaryHeader.breadcrumbItems || [],
    namespaceAccountId: getNamespaceAccountId(HCMNamespaceList)
  }
}

class ApplicationDeploymentPipeline extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      xhrPoll: false
    }
  }

  componentWillMount() {
    const {
      fetchChannels,
      fetchSubscriptions,
      fetchApplications,
      fetchApplicationsGlobalData,
      QueryApplicationList,
      HCMChannelList,
      HCMSubscriptionList,
      GlobalApplicationDataList
    } = this.props

    if (QueryApplicationList.status !== Actions.REQUEST_STATUS.DONE) {
      fetchApplications()
    }
    if (HCMChannelList.status !== Actions.REQUEST_STATUS.DONE) {
      fetchChannels()
    }
    if (HCMSubscriptionList.status !== Actions.REQUEST_STATUS.DONE) {
      fetchSubscriptions()
    }
    if (GlobalApplicationDataList.status !== Actions.REQUEST_STATUS.DONE) {
      fetchApplicationsGlobalData()
    }
    if (parseInt(config['featureFlags:liveUpdates']) === 2) {
      var intervalId = setInterval(
        this.reload.bind(this),
        config['featureFlags:liveUpdatesPollInterval']
      )
      this.setState({ intervalId: intervalId })
    }
  }

  componentDidMount() {}

  componentWillUnmount() {
    clearInterval(this.state.intervalId)
  }

  reload() {
    const {
      HCMSubscriptionList,
      QueryApplicationList,
      HCMChannelList,
      breadcrumbItems,
      fetchApplications,
      fetchApplicationsGlobalData,
      fetchSubscriptions,
      fetchChannels,
      openEditChannelModal,
      openEditApplicationModal,
      openEditSubscriptionModal,
      openEditPlacementRuleModal
    } = this.props

    // only reload data if there are nothing being fetched and no modals are open
    if (
      QueryApplicationList.status === Actions.REQUEST_STATUS.DONE &&
      HCMSubscriptionList.status === Actions.REQUEST_STATUS.DONE &&
      HCMChannelList.status === Actions.REQUEST_STATUS.DONE &&
      !openEditChannelModal &&
      !openEditApplicationModal &&
      !openEditSubscriptionModal &&
      !openEditPlacementRuleModal
    ) {
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
  }

  render() {
    // wait for it
    const {
      HCMSubscriptionList,
      HCMChannelList,
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
      displaySubscriptionModal,
      subscriptionModalHeaderInfo,
      subscriptionModalSubscriptionInfo,
      currentApplicationInfo,
      currentChannelInfo,
      currentSubscriptionInfo,
      currentPlacementRuleInfo,
      openEditChannelModal,
      openEditApplicationModal,
      openEditSubscriptionModal,
      openEditPlacementRuleModal,
      loading,
      appDropDownList,
      userRole,
      breadcrumbItems,
      namespaceAccountId,
      fetchSubscriptions,
      fetchChannels,
      fetchPlacementRules,
      closeModal
    } = this.props
    const { locale } = this.context

    let selectedAppName = ''
    let selectedAppNS = ''
    const isSingleApplicationView = breadcrumbItems.length === 2

    let filteredApplications = ''
    if (isSingleApplicationView) {
      const urlArray = R.split('/', breadcrumbItems[1].url)
      selectedAppName = urlArray[urlArray.length - 1]
      selectedAppNS = urlArray[urlArray.length - 2]

      // if there is only a single application, filter the list with the selectedAppName
      filteredApplications = filterApps(QueryApplicationList, selectedAppName)
    } else {
      // multi app view
      filteredApplications = filterApps(
        QueryApplicationList,
        AppDeployments.deploymentPipelineSearch
      )
    }

    const applications = getApplicationsList(filteredApplications)
    const appSubscriptions = HCMSubscriptionList.items

    const bulkSubscriptionList =
      (HCMSubscriptionList && HCMSubscriptionList.items) || []

    const channels = getChannelsList(HCMChannelList)

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
    const modalPlacementRule = React.cloneElement(
      CreatePlacementRuleModal(fetchPlacementRules, locale),
      {
        resourceType: RESOURCE_TYPES.HCM_PLACEMENT_RULES
      }
    )

    //show perfmon actions only when one app is selected
    const showHeaderLinks =
      breadcrumbItems &&
      breadcrumbItems instanceof Array &&
      breadcrumbItems.length > 0

    let app = null
    if (
      applications &&
      applications instanceof Array &&
      applications.length === 1
    ) {
      app = applications[0]
    }

    const subscriptionModalHeader =
      subscriptionModalHeaderInfo && subscriptionModalHeaderInfo.deployable
    const subscriptionModalLabel =
      subscriptionModalHeaderInfo && subscriptionModalHeaderInfo.application

    // This will trigger the edit Channel Modal because openEditChannelModal
    // is true AFTER the fetch of the channel data has been completed
    if (openEditChannelModal) {
      showEditModalByType(
        closeModal,
        editResource,
        RESOURCE_TYPES.HCM_CHANNELS,
        currentChannelInfo,
        'https://www.ibm.com/support/knowledgecenter/SSFC4F_1.2.0/mcm/applications/managing_channels.html'
      )
    } else if (openEditApplicationModal) {
      showEditModalByType(
        closeModal,
        editResource,
        RESOURCE_TYPES.HCM_APPLICATIONS,
        currentApplicationInfo,
        'https://www.ibm.com/support/knowledgecenter/SSFC4F_1.2.0/mcm/applications/managing_apps.html'
      )
    } else if (openEditSubscriptionModal) {
      showEditModalByType(
        closeModal,
        editResource,
        RESOURCE_TYPES.HCM_SUBSCRIPTIONS,
        currentSubscriptionInfo,
        'https://www.ibm.com/support/knowledgecenter/SSFC4F_1.2.0/mcm/applications/managing_subscriptions.html'
      )
    } else if (openEditPlacementRuleModal) {
      showEditModalByType(
        closeModal,
        editResource,
        RESOURCE_TYPES.HCM_PLACEMENT_RULES,
        currentPlacementRuleInfo,
        'https://www.ibm.com/support/knowledgecenter/SSFC4F_1.2.0/mcm/applications/managing_placement_rules.html'
      )
    }
    return (
      <div id="DeploymentPipeline">
        {loading && <Loading withOverlay={true} />}
        {showHeaderLinks && (
          <HeaderActions
            serverProps={serverProps}
            getApplicationResource={getApplicationResource}
            app={app}
            namespaceAccountId={namespaceAccountId}
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
          <div className="resource-cards-create-container">
            {showCreate(userRole) && (
              <React.Fragment>
                <div className="AddResourceButton">{[modalSubscription]}</div>
                <div className="AddResourceButton">{[modalPlacementRule]}</div>
                <div className="AddResourceButton">{[modalChannel]}</div>
              </React.Fragment>
            )}
          </div>
        </div>
        {!showHeaderLinks && (
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
        <PipelineGrid
          applications={applications}
          channels={channels}
          appSubscriptions={appSubscriptions}
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
          applications={QueryApplicationList}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ApplicationDeploymentPipeline
)
