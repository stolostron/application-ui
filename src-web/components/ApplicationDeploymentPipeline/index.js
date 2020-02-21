/*******************************************************************************
 * Licensed Materials - Property of IBM
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
  fetchGlobalAppsData,
  fetchUserInfo,
  updateModal,
  fetchResource
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
  Icon,
  Link
} from 'carbon-components-react'
import {
  getApplicationsList,
  getChannelsList,
  filterApps,
  getSubscriptionListGivenApplicationList
} from './utils'
import channelNamespaceSample from 'js-yaml-loader!../../shared/yamlSamples/channelNamespaceSample.yml' // eslint-disable-line import/no-unresolved
import channelHelmRepoSample from 'js-yaml-loader!../../shared/yamlSamples/channelHelmRepoSample.yml' // eslint-disable-line import/no-unresolved
import channelObjectBucketSample from 'js-yaml-loader!../../shared/yamlSamples/channelObjectBucketSample.yml' // eslint-disable-line import/no-unresolved
import channelGitRepoSample from 'js-yaml-loader!../../shared/yamlSamples/channelGitRepoSample.yml' // eslint-disable-line import/no-unresolved
import subscriptionSample from 'js-yaml-loader!../../shared/yamlSamples/subscriptionSample.yml' // eslint-disable-line import/no-unresolved
import placementRuleSample from 'js-yaml-loader!../../shared/yamlSamples/placementRuleSample.yml' // eslint-disable-line import/no-unresolved
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
import {
  getICAMLinkForApp,
  getNamespaceAccountId
} from '../common/ResourceDetails/utils'
import { editResourceClick } from './components/PipelineGrid/utils'
import config from '../../../lib/shared/config'
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
      helpLink="https://www.ibm.com/support/knowledgecenter/SSFC4F_1.2.0/mcm/applications/managing_channels.html"
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
      helpLink="https://www.ibm.com/support/knowledgecenter/SSFC4F_1.2.0/mcm/applications/managing_subscriptions.html"
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
      data: (data && data.data) || '',
      resourceDescriptionKey: (data && data.resourceDescriptionKey) || ''
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
      helpLink="https://www.ibm.com/support/knowledgecenter/SSFC4F_1.2.0/mcm/applications/managing_placement_rules.html"
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
    fetchHCMApplications: () =>
      //this should be removed once we move to using  only QUERY_APPLICATIONS
      dispatch(fetchResources(RESOURCE_TYPES.HCM_APPLICATIONS)),
    fetchApplications: () =>
      dispatch(fetchResources(RESOURCE_TYPES.QUERY_APPLICATIONS)),
    fetchApplicationsGlobalData: () =>
      dispatch(fetchGlobalAppsData(RESOURCE_TYPES.GLOBAL_APPLICATIONS_DATA)),
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
    fetchSingleApplication: (resourceType, namespace, name) =>
      dispatch(fetchResource(resourceType, namespace, name))
  }
}

const mapStateToProps = state => {
  const {
    HCMApplicationList,
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
    HCMApplicationList,
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
      fetchUserInfo,
      fetchApplications,
      fetchApplicationsGlobalData,
      fetchHCMApplications
    } = this.props

    fetchApplications()
    fetchChannels()
    fetchSubscriptions()
    fetchUserInfo()
    fetchApplicationsGlobalData()
    fetchHCMApplications()

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
      HCMApplicationList,
      HCMSubscriptionList,
      QueryApplicationList,
      HCMChannelList,
      breadcrumbItems,
      fetchApplications,
      fetchApplicationsGlobalData,
      fetchHCMApplications,
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
      HCMApplicationList.status === Actions.REQUEST_STATUS.DONE &&
      HCMSubscriptionList.status === Actions.REQUEST_STATUS.DONE &&
      HCMChannelList.status === Actions.REQUEST_STATUS.DONE &&
      !openEditChannelModal &&
      !openEditApplicationModal &&
      !openEditSubscriptionModal &&
      !openEditPlacementRuleModal
    ) {
      this.setState({ xhrPoll: true })
      const isSingleApplicationView = breadcrumbItems.length == 2
      if (!isSingleApplicationView) {
        // reload all the applications
        fetchApplications()
        fetchApplicationsGlobalData()
        fetchHCMApplications()
        fetchSubscriptions()
      }
      fetchChannels()
    }
  }

  render() {
    // wait for it
    const {
      HCMApplicationList,
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
      closeModal,
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
      fetchPlacementRules
    } = this.props
    const { locale } = this.context

    let selectedAppName = ''
    let selectedAppNS = ''
    const isSingleApplicationView = breadcrumbItems.length == 2
    if (isSingleApplicationView) {
      const urlArray = R.split('/', breadcrumbItems[1].url)
      selectedAppName = urlArray[urlArray.length - 1]
      selectedAppNS = urlArray[urlArray.length - 2]
    }
    const filteredApplications = filterApps(
      HCMApplicationList,
      AppDeployments.deploymentPipelineSearch
    )
    const applications = getApplicationsList(filteredApplications)
    const appSubscriptions = getSubscriptionListGivenApplicationList(
      applications
    )

    const bulkSubscriptionList =
      (HCMSubscriptionList && HCMSubscriptionList.items) || []

    const channels = getChannelsList(HCMChannelList)

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

      if (app && app._uid && namespaceAccountId)
        icamLink = getICAMLinkForApp(
          app._uid,
          app.name,
          app.cluster,
          namespaceAccountId
        )
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
          'https://www.ibm.com/support/knowledgecenter/SSFC4F_1.2.0/mcm/applications/managing_channels.html'
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
          'https://www.ibm.com/support/knowledgecenter/SSFC4F_1.2.0/mcm/applications/managing_apps.html'
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
          'https://www.ibm.com/support/knowledgecenter/SSFC4F_1.2.0/mcm/applications/managing_subscriptions.html'
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
        resourceDescriptionKey: 'modal.editresource.placementrule',
        data: data,
        helpLink:
          'https://www.ibm.com/support/knowledgecenter/SSFC4F_1.2.0/mcm/applications/managing_placement_rules.html'
      })
    }
    return (
      <div id="DeploymentPipeline">
        {loading && <Loading withOverlay={true} />}
        {showHeaderLinks && (
          <div className="app-info-and-dashboard-links">
            {serverProps &&
              serverProps.isICAMRunning && (
              <span>
                <Link
                  href={icamLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon
                    className="app-dashboard-icon"
                    name="icon--launch"
                    fill="#3D70B2"
                  />
                  {msgs.get('application.launch.icam', locale)}
                </Link>
                <span className="app-info-and-dashboard-links-separator" />
              </span>
            )}
            {serverProps &&
              serverProps.isGrafanaRunning && (
              <span>
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
              </span>
            )}
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
          </div>
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
