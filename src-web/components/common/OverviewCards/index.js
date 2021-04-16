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
import {
  ArrowRightIcon,
  ExternalLinkAltIcon,
  OutlinedQuestionCircleIcon
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
} from '@open-cluster-management/ui-components'
import resources from '../../../../lib/shared/resources'
import msgs from '../../../../nls/platform.properties'
import config from '../../../../lib/shared/config'
import {
  getSearchLinkForOneApplication,
  getAppOverviewCardsData,
  getRepoTypeForArgoApplication,
  getSearchLinkForArgoApplications
} from '../ResourceOverview/utils'
import ChannelLabels from '../ChannelLabels'
import TimeWindowLabels from '../TimeWindowLabels'
import { getClusterCount } from '../../../../lib/client/resource-helper'
import { REQUEST_STATUS } from '../../../actions'
import { openArgoCDEditor } from '../../../actions/topology'
import _ from 'lodash'

/* eslint-disable react/prop-types */

resources(() => {
  require('./style.scss')
})

const mapStateToProps = state => {
  const { HCMApplicationList, topology } = state
  return {
    HCMApplicationList,
    topology
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
      showSubCards: false
    }
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
    const { argoLinkLoading, showSubCards } = this.state
    const cluster = _.get(topology, 'activeFilters.application.cluster')
    if (HCMApplicationList.status === REQUEST_STATUS.NOT_FOUND) {
      const infoMessage = _.get(
        HCMApplicationList,
        'err.err',
        msgs.get('load.app.info.notfound', [selectedAppName])
      )
      return <AcmAlert variant="info" title={infoMessage} noClose />
    }

    let getUrl = window.location.href
    getUrl = getUrl.substring(0, getUrl.indexOf('/multicloud/applications/'))

    const targetLink = getSearchLinkForOneApplication({
      name: encodeURIComponent(selectedAppName),
      namespace: encodeURIComponent(selectedAppNS)
    })

    const appOverviewCardsData = getAppOverviewCardsData(
      HCMApplicationList,
      topology,
      selectedAppName,
      selectedAppNS,
      targetLink,
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

    return (
      <div className="overview-cards-container">
        <AcmDescriptionList
          title={msgs.get('dashboard.card.overview.cards.title', locale)}
          leftItems={[
            {
              key: msgs.get('dashboard.card.overview.cards.name', locale),
              value: (
                <React.Fragment>
                  <div className="app-name-container">
                    <div className="app-name">
                      {appOverviewCardsData.appName}
                    </div>
                    {this.renderData(
                      appOverviewCardsData.argoSource,
                      this.createArgoAppIcon(
                        appOverviewCardsData.isArgoApp,
                        locale
                      ),
                      '30%'
                    )}
                  </div>
                </React.Fragment>
              )
            },
            {
              key: msgs.get('dashboard.card.overview.cards.namespace', locale),
              value: appOverviewCardsData.appNamespace
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
            }
          ]}
          rightItems={[
            {
              key: msgs.get('dashboard.card.overview.cards.clusters', locale),
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
                  isContentLeftAligned
                  content={
                    <div>
                      {msgs.get(
                        'dashboard.card.overview.cards.cluster.resource.status.tooltip',
                        locale
                      )}
                    </div>
                  }
                >
                  <OutlinedQuestionCircleIcon className="resource-status-help-icon" />
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
                      : this.createTargetLink(
                        getUrl + appOverviewCardsData.targetLink,
                        locale
                      ),
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
        {appOverviewCardsData.isArgoApp && (
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
                <AcmButton
                  href={
                    getUrl +
                    this.getArgoSearchLink(
                      selectedAppName,
                      selectedAppNS,
                      cluster
                    )
                  }
                  variant={ButtonVariant.link}
                  id="app-search-link"
                  component="a"
                  target="_blank"
                  rel="noreferrer"
                  icon={<ArrowRightIcon />}
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
                  icon={<ArrowRightIcon />}
                  iconPosition="right"
                >
                  {msgs.get(
                    'dashboard.card.overview.cards.search.argocd.apps',
                    locale
                  )}
                </AcmButton>
              </AcmActionGroup>
            </CardBody>
          </Card>
        )}

        {!appOverviewCardsData.isArgoApp && (
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

  getArgoSearchLink = (selectedAppName, selectedAppNS, cluster) => {
    return getSearchLinkForOneApplication({
      name: encodeURIComponent(selectedAppName),
      namespace: encodeURIComponent(selectedAppNS),
      cluster: encodeURIComponent(cluster)
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
      <a
        className="details-item-link"
        id="app-search-link"
        href={link}
        target="_blank"
        rel="noreferrer"
      >
        <div>
          {msgs.get('dashboard.card.overview.cards.search.resource', locale)}
          <ArrowRightIcon className="details-item-link-icon" />
        </div>
      </a>
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
                        packageFilterVersion: sub.packageFilterVersion
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

OverviewCards.propTypes = {}

export default withLocale(withRouter(connect(mapStateToProps)(OverviewCards)))
