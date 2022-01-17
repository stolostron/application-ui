/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

import React from 'react'
import { connect } from 'react-redux'
import { withLocale } from '../../../providers/LocaleProvider'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  ExternalLinkAltIcon,
  OutlinedQuestionCircleIcon,
  SyncAltIcon
} from '@patternfly/react-icons'
import {
  Button,
  ButtonVariant,
  Card,
  CardBody,
  Label,
  Skeleton,
  Spinner,
  Tooltip
} from '@patternfly/react-core'
import {
  AcmActionGroup,
  AcmAlert,
  AcmButton,
  AcmDescriptionList
} from '@stolostron/ui-components'
import resources from '../../../../lib/shared/resources'
import msgs from '../../../../nls/platform.properties'
import config from '../../../../lib/shared/config'
import { RESOURCE_TYPES } from '../../../../lib/shared/constants'
import apolloClient from '../../../../lib/client/apollo-client'
import { UPDATE_ACTION_MODAL } from '../../../apollo-client/queries/StateQueries'
import {
  getSearchLinkForOneApplication,
  getAppOverviewCardsData,
  getRepoTypeForArgoApplication,
  getSearchLinkForArgoApplications
} from '../ResourceOverview/utils'
import ChannelLabels from '../ChannelLabels'
import TimeWindowLabels from '../TimeWindowLabels'
import { getClusterCount } from '../../../../lib/client/resource-helper'
import {
  isSearchAvailable,
  isYAMLEditAvailable
} from '../../../../lib/client/search-helper'
import { canCreateActionAllNamespaces } from '../../../../lib/client/access-helper'
import { REQUEST_STATUS } from '../../../actions'
import { openArgoCDEditor } from '../../../actions/topology'
import _ from 'lodash'

/* eslint-disable react/prop-types */

resources(() => {
  require('./style.scss')
})

const mapStateToProps = state => {
  const { HCMApplicationList, topology } = state
  const { list: typeListName } = RESOURCE_TYPES.QUERY_APPLICATIONS
  return {
    HCMApplicationList,
    topology,
    mutateStatus: state[typeListName].mutateStatus
  }
}

class OverviewCards extends React.Component {
  constructor(props) {
    super(props)
    // update cards every 1s to pick up side-effect in
    // redux state (calculation of node statuses) created by
    // topology code
    const intervalId = setInterval(this.reload.bind(this), 1000)
    this.toggleArgoLinkLoading = this.toggleArgoLinkLoading.bind(this)

    this.state = {
      argoLinkLoading: false,
      intervalId,
      showSubCards: false,
      hasSyncPermissions: false
    }
  }

  componentDidMount() {
    canCreateActionAllNamespaces('applications', 'create', 'app.k8s.io').then(
      response => {
        const hasSyncPermissions = _.get(
          response,
          'data.userAccessAnyNamespaces'
        )
        this.setState({ hasSyncPermissions })
      }
    )
  }

  reload() {
    this.setState(prevState => ({ pollToggle: !prevState.pollToggle }))
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(
      (nextState.pollToggle === this.state.pollToggle &&
        nextState.showSubCards === this.state.showSubCards) ||
      _.get(nextProps, 'topology.status', '') === REQUEST_STATUS.IN_PROGRESS ||
      _.get(nextProps, 'HCMApplicationList.status', '') ===
        REQUEST_STATUS.IN_PROGRESS
    )
  }

  render() {
    const {
      handleErrorMsg,
      HCMApplicationList,
      topology,
      selectedAppName,
      selectedAppNS,
      locale
    } = this.props
    const { argoLinkLoading, showSubCards, hasSyncPermissions } = this.state
    const cluster = _.get(topology, 'activeFilters.application.cluster')
    const apiVersion = _.split(
      _.get(topology, 'activeFilters.application.apiVersion', ''),
      '/'
    )

    if (topology.status === REQUEST_STATUS.CLUSTER_OFFLINE) {
      const infoMessage = _.get(
        topology,
        'err.err',
        msgs.get('load.app.cluster.offline', [])
      )
      return <AcmAlert variant="info" title={infoMessage} noClose isInline />
    } else if (HCMApplicationList.status === REQUEST_STATUS.NOT_FOUND) {
      const infoMessage = _.get(
        HCMApplicationList,
        'err.err',
        msgs.get('load.app.info.notfound', [selectedAppName])
      )
      return <AcmAlert variant="info" title={infoMessage} noClose isInline />
    }

    let getUrl = window.location.href
    getUrl = getUrl.substring(0, getUrl.indexOf('/multicloud/applications/'))

    const targetLink = getSearchLinkForOneApplication({
      name: encodeURIComponent(selectedAppName),
      namespace: encodeURIComponent(selectedAppNS),
      cluster: encodeURIComponent(cluster),
      apiGroup: encodeURIComponent(apiVersion[0]),
      apiVersion: encodeURIComponent(apiVersion[1])
    })

    const appOverviewCardsData = getAppOverviewCardsData(
      HCMApplicationList,
      topology,
      selectedAppName,
      selectedAppNS,
      locale
    )

    const clusterCount = getClusterCount({
      locale,
      remoteCount: appOverviewCardsData.remoteClusterCount,
      localPlacement: appOverviewCardsData.localClusterDeploy,
      name: selectedAppName,
      namespace: selectedAppNS,
      kind: 'application',
      apigroup: appOverviewCardsData.apiGroup,
      clusterNames: appOverviewCardsData.clusterNames
    })

    const disableBtn =
      appOverviewCardsData.subsList &&
      appOverviewCardsData.subsList !== -1 &&
      appOverviewCardsData.subsList.length > 0
        ? false
        : true

    const leftCardItems = [
      {
        key: msgs.get('dashboard.card.overview.cards.name', locale),
        value: (
          <React.Fragment>
            <div className="app-name-container">
              <div className="app-name">{selectedAppName}</div>
              {this.renderData(
                appOverviewCardsData.argoSource,
                this.createArgoAppIcon(appOverviewCardsData.isArgoApp, locale),
                '30%'
              )}
            </div>
          </React.Fragment>
        )
      },
      {
        key: msgs.get('dashboard.card.overview.cards.namespace', locale),
        keyAction: appOverviewCardsData.isArgoApp && (
          <Tooltip
            content={
              <div>
                {msgs.get(
                  'dashboard.card.overview.cards.namespace.argo.tooltip',
                  locale
                )}
              </div>
            }
          >
            <OutlinedQuestionCircleIcon className="help-icon" />
          </Tooltip>
        ),
        value: (
          <React.Fragment>
            {this.renderData(
              appOverviewCardsData.destinationNs,
              appOverviewCardsData.isArgoApp &&
              appOverviewCardsData.destinationNs
                ? appOverviewCardsData.destinationNs
                : selectedAppNS,
              '30%'
            )}
          </React.Fragment>
        )
      },
      {
        key: msgs.get('dashboard.card.overview.cards.created', locale),
        value: (
          <React.Fragment>
            {this.renderData(
              appOverviewCardsData.creationTimestamp,
              appOverviewCardsData.creationTimestamp,
              '30%'
            )}
          </React.Fragment>
        )
      },
      {
        key: (
          <React.Fragment>
            {this.renderData(
              appOverviewCardsData.lastSyncedTimestamp,
              appOverviewCardsData.isArgoApp
                ? msgs.get('dashboard.card.overview.cards.argo.synced', locale)
                : msgs.get('dashboard.card.overview.cards.synced', locale),
              '30%'
            )}
          </React.Fragment>
        ),
        keyAction: this.renderData(
          appOverviewCardsData.lastSyncedTimestamp,
          <Tooltip
            content={
              <div>
                {appOverviewCardsData.isArgoApp
                  ? msgs.get(
                    'dashboard.card.overview.cards.argo.lastSynced.tooltip',
                    locale
                  )
                  : msgs.get(
                    'dashboard.card.overview.cards.lastSynced.tooltip',
                    locale
                  )}
              </div>
            }
          >
            <OutlinedQuestionCircleIcon className="help-icon" />
          </Tooltip>,
          '10%'
        ),
        value: (
          <React.Fragment>
            {this.renderData(
              appOverviewCardsData.lastSyncedTimestamp,
              appOverviewCardsData.lastSyncedTimestamp,
              '30%'
            )}
            {this.renderData(
              appOverviewCardsData.lastSyncedTimestamp,
              hasSyncPermissions ? (
                this.createSyncButton(
                  appOverviewCardsData.isArgoApp,
                  selectedAppNS,
                  selectedAppName,
                  locale
                )
              ) : (
                <Tooltip
                  content={msgs.get(
                    'actions.sync.application.access.denied',
                    locale
                  )}
                  isContentLeftAligned
                  position="right"
                >
                  {this.createSyncButton(
                    appOverviewCardsData.isArgoApp,
                    selectedAppNS,
                    selectedAppName,
                    locale
                  )}
                </Tooltip>
              )
            )}
          </React.Fragment>
        )
      }
    ]

    if (
      appOverviewCardsData.isArgoApp &&
      appOverviewCardsData.destinationCluster
    ) {
      leftCardItems.splice(2, 0, {
        key: msgs.get('dashboard.card.overview.cards.server', locale),
        keyAction: (
          <Tooltip
            content={
              <div>
                {msgs.get(
                  'dashboard.card.overview.cards.server.tooltip',
                  locale
                )}
              </div>
            }
          >
            <OutlinedQuestionCircleIcon className="help-icon" />
          </Tooltip>
        ),
        value: appOverviewCardsData.destinationCluster
      })
    }

    return (
      <div className="overview-cards-container">
        <AcmDescriptionList
          title={msgs.get('dashboard.card.overview.cards.title', locale)}
          leftItems={leftCardItems}
          rightItems={[
            {
              key: msgs.get('dashboard.card.overview.cards.clusters', locale),
              keyAction: appOverviewCardsData.isArgoApp && (
                <Tooltip
                  content={
                    <div>
                      {msgs.get(
                        'dashboard.card.overview.cards.clusters.argo.tooltip',
                        locale
                      )}
                    </div>
                  }
                >
                  <OutlinedQuestionCircleIcon className="help-icon" />
                </Tooltip>
              ),
              value: (
                <React.Fragment>
                  {this.renderData(
                    appOverviewCardsData.remoteClusterCount !== -1 ||
                    appOverviewCardsData.localClusterDeploy
                      ? 0
                      : -1,
                    clusterCount,
                    '30%'
                  )}
                </React.Fragment>
              )
            },
            {
              key: msgs.get(
                'dashboard.card.overview.cards.cluster.resource.status',
                locale
              ),
              keyAction: (
                <Tooltip
                  content={
                    <div>
                      {appOverviewCardsData.isArgoApp
                        ? msgs.get(
                          'dashboard.card.overview.cards.cluster.resource.status.argo.tooltip',
                          locale
                        )
                        : msgs.get(
                          'dashboard.card.overview.cards.cluster.resource.status.tooltip',
                          locale
                        )}
                    </div>
                  }
                >
                  <OutlinedQuestionCircleIcon className="help-icon" />
                </Tooltip>
              ),
              value: (
                <React.Fragment>
                  {this.renderData(
                    appOverviewCardsData.nodeStatuses,
                    this.createStatusIcons(appOverviewCardsData.nodeStatuses),
                    '30%'
                  )}
                </React.Fragment>
              )
            },
            {
              key: (
                <React.Fragment>
                  {this.renderData(
                    appOverviewCardsData.argoSource,
                    appOverviewCardsData.isArgoApp
                      ? msgs.get(
                        'dashboard.card.overview.cards.repoResource.label',
                        locale
                      )
                      : this.createTargetLink(getUrl + targetLink, locale),
                    '30%'
                  )}
                </React.Fragment>
              ),
              value: (
                <React.Fragment>
                  {this.renderData(
                    appOverviewCardsData.argoSource,
                    appOverviewCardsData.isArgoApp &&
                    appOverviewCardsData.argoSource ? (
                      <ChannelLabels
                        channels={[
                          {
                            type: getRepoTypeForArgoApplication(
                              appOverviewCardsData.argoSource
                            ),
                            pathname: appOverviewCardsData.argoSource.repoURL,
                            gitPath: appOverviewCardsData.argoSource.path,
                            chart: appOverviewCardsData.argoSource.chart,
                            targetRevision: appOverviewCardsData.argoSource
                              .targetRevision
                              ? appOverviewCardsData.argoSource.targetRevision
                              : 'HEAD'
                          }
                        ]}
                        locale={locale}
                        isArgoApp={true}
                      />
                      ) : (
                        ''
                      ),
                    '30%'
                  )}
                </React.Fragment>
              )
            }
          ]}
        />
        {appOverviewCardsData.isArgoApp ? (
          <Card className="argo-links-container">
            <CardBody>
              <AcmActionGroup>
                <AcmButton
                  variant={ButtonVariant.link}
                  className={`${argoLinkLoading ? 'argoLinkLoading' : ''}`}
                  id="launch-argocd-editor"
                  component="a"
                  rel="noreferrer"
                  icon={<ExternalLinkAltIcon />}
                  iconPosition="right"
                  onClick={() =>
                    // launch a new tab to argocd route
                    openArgoCDEditor(
                      cluster,
                      selectedAppNS,
                      selectedAppName,
                      this.toggleArgoLinkLoading,
                      handleErrorMsg
                    )
                  }
                >
                  {argoLinkLoading && <Spinner size="sm" />}
                  {msgs.get(
                    'dashboard.card.overview.cards.search.argocd.launch',
                    locale
                  )}
                </AcmButton>
                {isYAMLEditAvailable() &&
                appOverviewCardsData.editArgoSetLink ? (
                  <AcmButton
                    href={getUrl + appOverviewCardsData.editArgoSetLink}
                    variant={ButtonVariant.link}
                    id="app-search-set-link"
                    component="a"
                    target="_blank"
                    rel="noreferrer"
                    icon={
                      <img
                        className="new-tab-icon argo-app-link"
                        alt="open-new-tab"
                        src={`${config.contextPath}/graphics/open-new-tab.svg`}
                      />
                    }
                    iconPosition="right"
                  >
                    {msgs.get('props.show.yaml.argoset.maincard', locale)}
                  </AcmButton>
                  ) : null}
                {isSearchAvailable() && (
                  <React.Fragment>
                    <AcmActionGroup>
                      <AcmButton
                        href={
                          getUrl +
                          this.getArgoSearchLink(
                            selectedAppName,
                            selectedAppNS,
                            cluster,
                            apiVersion[0],
                            apiVersion[1]
                          )
                        }
                        variant={ButtonVariant.link}
                        id="app-search-link"
                        component="a"
                        target="_blank"
                        rel="noreferrer"
                        icon={
                          <img
                            className="new-tab-icon argo-app-link"
                            alt="open-new-tab"
                            src={`${
                              config.contextPath
                            }/graphics/open-new-tab.svg`}
                          />
                        }
                        iconPosition="right"
                      >
                        {msgs.get(
                          'dashboard.card.overview.cards.search.resource',
                          locale
                        )}
                      </AcmButton>
                      <AcmButton
                        href={
                          getUrl +
                          getSearchLinkForArgoApplications(
                            appOverviewCardsData.argoSource
                          )
                        }
                        variant={ButtonVariant.link}
                        id="app-search-argo-apps-link"
                        component="a"
                        target="_blank"
                        rel="noreferrer"
                        icon={
                          <img
                            className="new-tab-icon argo-app-link"
                            alt="open-new-tab"
                            src={`${
                              config.contextPath
                            }/graphics/open-new-tab.svg`}
                          />
                        }
                        iconPosition="right"
                      >
                        {msgs.get(
                          'dashboard.card.overview.cards.search.argocd.apps',
                          locale
                        )}
                      </AcmButton>
                    </AcmActionGroup>
                  </React.Fragment>
                )}
              </AcmActionGroup>
            </CardBody>
          </Card>
        ) : (
          <div className="overview-cards-subs-section">
            {showSubCards && !disableBtn
              ? this.createSubsCards(appOverviewCardsData.subsList, locale)
              : ''}
            <Button
              className="toggle-subs-btn"
              variant="secondary"
              isDisabled={disableBtn}
              data-test-subscription-details={!disableBtn}
              onClick={() => this.toggleSubsBtn(showSubCards)}
            >
              {this.renderData(
                appOverviewCardsData.subsList,
                (showSubCards
                  ? msgs.get(
                    'dashboard.card.overview.cards.subs.btn.hide',
                    locale
                  )
                  : msgs.get(
                    'dashboard.card.overview.cards.subs.btn.show',
                    locale
                  )) + ` (${appOverviewCardsData.subsList.length})`,
                '70%'
              )}
            </Button>
          </div>
        )}
      </div>
    )
  }

  openSyncModal = (namespace, name) => {
    const client = apolloClient.getClient()

    client.mutate({
      mutation: UPDATE_ACTION_MODAL,
      variables: {
        __typename: 'actionModal',
        open: true,
        type: 'actions.sync.application',
        resourceType: {
          __typename: 'resourceType',
          name: RESOURCE_TYPES.QUERY_APPLICATIONS.name,
          list: RESOURCE_TYPES.QUERY_APPLICATIONS.list
        },
        data: {
          __typename: 'ModalData',
          name,
          namespace,
          clusterName: '',
          selfLink: '',
          _uid: '',
          kind: '',
          apiVersion: '',
          itemGroup: []
        }
      }
    })
  };

  createSyncButton = (isArgoApp, selectedAppNS, selectedAppName, locale) => {
    const { hasSyncPermissions } = this.state
    const { mutateStatus } = this.props
    const syncInProgress = mutateStatus === REQUEST_STATUS.IN_PROGRESS
    return (
      <React.Fragment>
        {!isArgoApp ? (
          <AcmButton
            variant={ButtonVariant.link}
            className={`${syncInProgress ? 'syncInProgress' : ''}`}
            id="sync-app"
            component="a"
            rel="noreferrer"
            icon={<SyncAltIcon />}
            iconPosition="left"
            isDisabled={!hasSyncPermissions}
            onClick={() => this.openSyncModal(selectedAppNS, selectedAppName)}
          >
            {msgs.get('dashboard.card.overview.cards.sync', locale)}
            {syncInProgress && <Spinner size="sm" />}
          </AcmButton>
        ) : (
          ''
        )}
      </React.Fragment>
    )
  };

  getArgoSearchLink = (
    selectedAppName,
    selectedAppNS,
    cluster,
    apiGroup,
    apiVersion
  ) => {
    return getSearchLinkForOneApplication({
      name: encodeURIComponent(selectedAppName),
      namespace: encodeURIComponent(selectedAppNS),
      cluster: encodeURIComponent(cluster),
      apiGroup: encodeURIComponent(apiGroup),
      apiVersion: encodeURIComponent(apiVersion)
    })
  };

  renderData = (checkData, showData, width) => {
    return checkData !== -1 ? (
      showData
    ) : (
      <Skeleton width={width} className="loading-skeleton-text" />
    )
  };

  toggleArgoLinkLoading() {
    this.setState(prevState => ({
      argoLinkLoading: !prevState.argoLinkLoading
    }))
  }

  createTargetLink = (link, locale) => {
    return (
      isSearchAvailable() && (
        <a
          className="details-item-link"
          id="app-search-link"
          href={link}
          target="_blank"
          rel="noreferrer"
        >
          <div>
            {msgs.get('dashboard.card.overview.cards.search.resource', locale)}
            <img
              className="new-tab-icon"
              alt="open-new-tab"
              src={`${config.contextPath}/graphics/open-new-tab.svg`}
            />
          </div>
        </a>
      )
    )
  };

  createArgoAppIcon = (isArgoApp, locale) => {
    return (
      <React.Fragment>
        {isArgoApp ? (
          <Label color="blue">
            {msgs.get('dashboard.card.overview.cards.argo.app', locale)}
          </Label>
        ) : (
          ''
        )}
      </React.Fragment>
    )
  };

  createStatusIcons = nodeStatuses => {
    return (
      <React.Fragment>
        <div
          className="status-icon-container green-status"
          id="green-resources"
        >
          <img
            className="status-icon"
            alt="node-status-success"
            src={`${config.contextPath}/graphics/nodeStatusSuccess.svg`}
          />
          <div className="status-count">{nodeStatuses.green}</div>
        </div>
        <div
          className="status-icon-container orange-status"
          id="orange-resources"
        >
          <img
            className="status-icon"
            alt="node-status-pending"
            src={`${config.contextPath}/graphics/nodeStatusPending.svg`}
          />
          <div className="status-count">{nodeStatuses.orange}</div>
        </div>
        <div
          className="status-icon-container yellow-status"
          id="yellow-resources"
        >
          <img
            className="status-icon"
            alt="node-status-warning"
            src={`${config.contextPath}/graphics/nodeStatusWarning.svg`}
          />
          <div className="status-count">{nodeStatuses.yellow}</div>
        </div>
        <div className="status-icon-container red-status" id="red-resources">
          <img
            className="status-icon"
            alt="node-status-failure"
            src={`${config.contextPath}/graphics/nodeStatusFailure.svg`}
          />
          <div className="status-count">{nodeStatuses.red}</div>
        </div>
      </React.Fragment>
    )
  };

  createSubsCards = (subsList, locale) => {
    return subsList.map(sub => {
      if (sub.name) {
        return (
          <React.Fragment key={sub.name}>
            <div className="sub-card-container">
              <div className="sub-card-column add-right-border">
                <img
                  className="subs-icon"
                  alt="subscription-card-sub-name"
                  src={`${config.contextPath}/graphics/subCardSubName.svg`}
                />
                <div className="sub-card-content">
                  <div className="sub-card-title">
                    {msgs.get(
                      'dashboard.card.overview.cards.subs.label',
                      locale
                    )}
                  </div>
                  <span>{sub.name}</span>
                </div>
              </div>

              <div className="sub-card-column add-right-border">
                <img
                  className="subs-icon"
                  alt="subscription-card-repo-folder"
                  src={`${config.contextPath}/graphics/subCardRepoFolder.svg`}
                />
                <div className="sub-card-content">
                  <div className="sub-card-title">
                    {msgs.get(
                      'dashboard.card.overview.cards.repoResource.label',
                      locale
                    )}
                  </div>
                  <ChannelLabels
                    channels={[
                      {
                        type: sub.resourceType,
                        pathname: sub.resourcePath,
                        gitBranch: sub.gitBranch,
                        gitPath: sub.gitPath,
                        package: sub.package,
                        packageFilterVersion: sub.packageFilterVersion,
                        bucketPath: sub.bucketPath
                      }
                    ]}
                    locale={locale}
                    isArgoApp={false}
                  />
                </div>
              </div>

              <div className="sub-card-column">
                <img
                  className="subs-icon"
                  alt="subscription-card-time-window"
                  src={`${config.contextPath}/graphics/subCardTimeWindow.svg`}
                />
                <div className="sub-card-content">
                  <div className="sub-card-title">
                    {msgs.get(
                      'dashboard.card.overview.cards.timeWindow.label',
                      locale
                    )}
                  </div>
                  {sub.timeWindowType === 'none' ? (
                    <div
                      className="set-time-window-link"
                      tabIndex="0"
                      role={'button'}
                      onClick={this.toggleEditorTab.bind(this)}
                      onKeyPress={this.toggleEditorTab.bind(this)}
                    >
                      {msgs.get(
                        'dashboard.card.overview.cards.timeWindow.set.label',
                        locale
                      )}
                    </div>
                  ) : (
                    <TimeWindowLabels
                      timeWindow={{
                        subName: sub.name,
                        type: sub.timeWindowType,
                        days: sub.timeWindowDays,
                        timezone: sub.timeWindowTimezone,
                        ranges: sub.timeWindowRanges,
                        missingData: sub.timeWindowMissingData
                      }}
                      locale={locale}
                    />
                  )}
                </div>
              </div>
            </div>
          </React.Fragment>
        )
      }
      return ''
    })
  };

  toggleEditorTab() {
    const { location, history } = this.props
    const editPath =
      location.pathname +
      (location.pathname.slice(-1) === '/' ? 'edit' : '/edit')

    history.push(editPath)
  }

  toggleSubsBtn = showSubCards => {
    this.setState({ showSubCards: !showSubCards })
  };
}

OverviewCards.propTypes = {
  mutateStatus: PropTypes.string
}

export default withLocale(withRouter(connect(mapStateToProps)(OverviewCards)))
