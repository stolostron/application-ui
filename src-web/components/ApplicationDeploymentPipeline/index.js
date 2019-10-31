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
  fetchPlacementRuleResource,
  fetchApplicationResource,
  closeModals
} from '../../reducers/reducerAppDeployments'
import PipelineGrid from './components/PipelineGrid'
import SubscriptionModal from './components/SubscriptionModal'
import { Search, Loading, Icon, Link } from 'carbon-components-react'
import {
  getApplicationsList,
  getChannelsList,
  filterApps,
  getSubscriptionListGivenApplicationList
} from './utils'
import channelNamespaceSample from 'js-yaml-loader!../../shared/yamlSamples/channelNamespaceSample.yml'
import channelHelmRepoSample from 'js-yaml-loader!../../shared/yamlSamples/channelHelmRepoSample.yml'
import channelObjectBucketSample from 'js-yaml-loader!../../shared/yamlSamples/channelObjectBucketSample.yml'
import channelGitRepoSample from 'js-yaml-loader!../../shared/yamlSamples/channelGitRepoSample.yml'
import subscriptionSample from 'js-yaml-loader!../../shared/yamlSamples/subscriptionSample.yml'
import placementRuleSample from 'js-yaml-loader!../../shared/yamlSamples/placementRuleSample.yml'
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
import ResourceCardsInformation from './components/ResourceCardsInformation'
import { getICAMLinkForApp } from '../common/ResourceDetails/utils'
import { editResourceClick } from './components/PipelineGrid/utils'

/* eslint-disable react/prop-types */

resources(() => {
  require('./style.scss')
})

const handleCreateChannelResource = (dispatch, yaml) =>
  dispatch(createResources(RESOURCE_TYPES.HCM_CHANNELS, yaml))

// Create Resource for Channel
const CreateChannelModal = (fetchChannels, channelTabs, locale) => {
  return (
    <CreateResourceModal
      key="createChannel"
      headingTextKey="actions.add.channel"
      resourceTypeName="description.channel"
      onCreateResource={handleCreateChannelResource}
      onSubmitFunction={fetchChannels}
      resourceDescriptionKey="modal.createresource.channel"
      helpLink="https://www.ibm.com/support/knowledgecenter/SSFC4F_1.1.0/mcm/applications/managing_channels.html"
      iconDescription={msgs.get('actions.add.channel.iconDescription', locale)}
      sampleTabs={channelTabs}
      sampleContent={[
        getChannelSample(channelNamespaceSample, locale),
        getChannelSample(channelHelmRepoSample, locale),
        getChannelSample(channelObjectBucketSample, locale),
        getChannelSample(channelGitRepoSample, locale)
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
      helpLink="https://www.ibm.com/support/knowledgecenter/SSFC4F_1.1.0/mcm/applications/managing_subscriptions.html"
      iconDescription={msgs.get(
        'actions.add.subscription.iconDescription',
        locale
      )}
      sampleContent={[getSubscriptionSample(subscriptionSample, locale)]}
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

const handleCreatePlacementRuleResource = (dispatch, yaml) =>
  dispatch(createResources(RESOURCE_TYPES.HCM_PLACEMENT_RULES, yaml))

// Create Resource for Subscription
const CreatePlacementRuleModal = (fetchPlacementRules, locale) => {
  return (
    <CreateResourceModal
      key="createPlacementRule"
      headingTextKey="actions.add.placementRule"
      resourceTypeName="description.placementRule"
      onCreateResource={handleCreatePlacementRuleResource}
      onSubmitFunction={fetchPlacementRuleResource}
      resourceDescriptionKey="modal.createresource.placementrule"
      helpLink="https://www.ibm.com/support/knowledgecenter/SSFC4F_1.1.0/mcm/applications/managing_placement_rules.html"
      iconDescription={msgs.get(
        'actions.add.subscription.iconDescription',
        locale
      )}
      sampleContent={[getPlacementRuleSample(placementRuleSample, locale)]}
    />
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
    fetchPlacementRules: () =>
      dispatch(fetchResources(RESOURCE_TYPES.HCM_PLACEMENT_RULES)),
    editSubscription: (resourceType, data) =>
      handleEditResource(dispatch, resourceType, data),
    //apolloClient requires CONTEXT .. so I have to pass it in here
    getChannelResource: (selfLink, namespace, name, cluster) =>
      dispatch(
        fetchChannelResource(apolloClient, selfLink, namespace, name, cluster)
      ),
    getApplicationResource: (selfLink, namespace, name, cluster) =>
      dispatch(
        fetchApplicationResource(apolloClient, selfLink, namespace, name, cluster)
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
      fetchPlacementRules,
      fetchUserInfo,
      fetchApplications,
      bulkSubscriptionList
    } = this.props
    fetchChannels()
    fetchSubscriptions()
    fetchPlacementRules()
    fetchUserInfo()

    if (!bulkSubscriptionList || bulkSubscriptionList.length == 0) {
      //fetch applications if this call was not yet made
      fetchApplications()
    }
  }

  componentDidMount() { }

  componentWillUnmount() { }

  render() {
    const {
      serverProps,
      applications,
      channels,
      appSubscriptions,
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
      closeModal,
      openEditChannelModal,
      openEditApplicationModal,
      openEditSubscriptionModal,
      openEditPlacementRuleModal,
      loading,
      appDropDownList,
      bulkSubscriptionList,
      userRole,
      breadcrumbItems,
      activeAccountId,
      fetchSubscriptions,
      fetchChannels,
      fetchPlacementRules
    } = this.props
    const { locale } = this.context
    const channelTabs = {
      tab1: msgs.get('modal.title.namespace', locale),
      tab2: msgs.get('modal.title.helmRepo', locale),
      tab3: msgs.get('modal.title.objectBucket', locale),
      tab4: msgs.get('modal.title.gitRepo', locale)
    }
    const modalChannel = React.cloneElement(
      CreateChannelModal(fetchChannels, channelTabs, locale),
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

    let dashboard = ''
    let icamLink = ''
    let app = undefined
    if (
      applications &&
      applications instanceof Array &&
      applications.length == 1
    ) {
      app = applications[0]
      dashboard = app.dashboard

      if (app && app._uid) icamLink = getICAMLinkForApp(app._uid, app.cluster)
    }

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

    if (openEditApplicationModal) {
      const data = R.pathOr([], ['data', 'items'], currentApplicationInfo)[0]
      const name = R.pathOr('', ['metadata', 'name'], data)
      const namespace = R.pathOr('', ['metadata', 'namespace'], data)
      closeModal()
      editResource(RESOURCE_TYPES.HCM_APPLICATIONS, {
        name: name,
        namespace: namespace,
        data: data,
        helpLink:
          'https://www.ibm.com/support/knowledgecenter/SSFC4F_1.1.0/mcm/applications/managing_apps.html'
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

    // This will trigger the edit Placement Rule Modal because openEditPlacementRuleModal
    // is true AFTER the fetch of the placement rule data has been completed
    if (openEditPlacementRuleModal) {
      const data = R.pathOr([], ['data', 'items'], currentPlacementRuleInfo)[0]
      const name = R.pathOr('', ['metadata', 'name'], data)
      const namespace = R.pathOr('', ['metadata', 'namespace'], data)
      closeModal()
      editResource(RESOURCE_TYPES.HCM_PLACEMENT_RULES, {
        name: name,
        namespace: namespace,
        data: data,
        helpLink:
          'https://www.ibm.com/support/knowledgecenter/SSFC4F_1.1.0/mcm/applications/managing_placement_rules.html'
      })
    }
    return (
      <div id="DeploymentPipeline">
        {loading && <Loading withOverlay={true} />}
        {showHeaderLinks && (
          <div className="app-info-and-dashboard-links">
            <Link
              href={dashboard}
              aria-disabled={!dashboard}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon
                className="app-dashboard-icon"
                name="icon--launch"
                fill="#3D70B2"
              />
              {msgs.get('application.launch.grafana', locale)}
            </Link>
            <span className="app-info-and-dashboard-links-separator" />
            <Link
              href="#"
              aria-disabled={!app}
              onClick={() => {
                //call edit app here
                editResourceClick(app, getApplicationResource)

              }}
            >
              <Icon
                className="app-dashboard-icon"
                name="icon--edit"
                fill="#3D70B2"
              />
              {msgs.get('application.edit.app', locale)}
            </Link>
            <span className="app-info-and-dashboard-links-separator" />
            <Link
              href="#"
              aria-disabled={!app}
              onClick={() => {
                //call delete app here
              }}
            >
              <Icon
                className="app-dashboard-icon"
                name="icon--delete"
                fill="#3D70B2"
              />
              {msgs.get('application.delete.app', locale)}
            </Link>
            <div className="perfmonAction">
              <Link
                href={icamLink}
                aria-disabled={!(serverProps && serverProps.isICAMRunning)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {msgs.get('application.launch.icam', locale)}
                <Icon
                  className="app-dashboard-icon-icam"
                  name="icon--launch"
                  fill="#3D70B2"
                />
              </Link>
            </div>
          </div>
        )}
        <div className="pipelineHeader">
          {msgs.get('description.title.deploymentPipeline', locale)}{' '}
          {channels && <span>({channels.length})</span>}
        </div>
        <ApplicationDeploymentHighlights />
        <div className="resource-cards-container">
          <div className="resource-cards-info-container">
            <ResourceCardsInformation />
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
