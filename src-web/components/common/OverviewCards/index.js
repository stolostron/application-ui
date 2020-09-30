/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import { connect } from 'react-redux'
import { withLocale } from '../../../providers/LocaleProvider'
import {
  Accordion,
  AccordionItem,
  Button,
  Icon,
  SkeletonText,
  Notification
} from 'carbon-components-react'
import resources from '../../../../lib/shared/resources'
import msgs from '../../../../nls/platform.properties'
import config from '../../../../lib/shared/config'
import {
  getSearchLinkForOneApplication,
  getAppOverviewCardsData
} from '../ResourceOverview/utils'
import ChannelLabels from '../ChannelLabels'
import TimeWindowLabels from '../TimeWindowLabels'
import { getClusterCount } from '../../../../lib/client/resource-helper'
import { REQUEST_STATUS } from '../../../actions'
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
    this.state = {
      showSubCards: false
    }
  }

  componentWillMount() {
    //update cards every 3s
    const intervalId = setInterval(this.reload.bind(this), 3000)
    this.setState({ intervalId: intervalId })
  }

  reload() {
    this.setState({})
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId)
  }

  render() {
    const {
      HCMApplicationList,
      topology,
      selectedAppName,
      selectedAppNS,
      locale
    } = this.props
    const { showSubCards } = this.state

    if (HCMApplicationList.status === REQUEST_STATUS.ERROR) {
      const errMessage = _.get(
        HCMApplicationList,
        'err.message',
        msgs.get('resource.error')
      )
      return (
        <Notification
          title=""
          className="overview-notification"
          kind="error"
          subtitle={errMessage}
        />
      )
    }
    if (HCMApplicationList.status === REQUEST_STATUS.NOT_FOUND) {
      const infoMessage = _.get(
        HCMApplicationList,
        'err.err',
        msgs.get('load.app.info.notfound', [selectedAppName])
      )
      return (
        <Notification
          title=""
          className="overview-notification"
          kind="info"
          subtitle={infoMessage}
        />
      )
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
      apigroup: 'app.k8s.io'
    })

    const disableBtn =
      appOverviewCardsData.subsList &&
      appOverviewCardsData.subsList !== -1 &&
      appOverviewCardsData.subsList.length > 0
        ? false
        : true

    return (
      <div className="overview-cards-container">
        <Accordion>
          <AccordionItem
            open={true}
            title={msgs.get('dashboard.card.overview.cards.title', locale)}
            className="overview-cards-details-section"
          >
            <div className="details-col" id="left-col">
              <div className="details-item">
                <div className="details-item-title left-item">
                  {msgs.get('dashboard.card.overview.cards.name', locale)}
                </div>
                <div className="details-item-content">
                  {appOverviewCardsData.appName}
                </div>
              </div>

              <div className="details-item">
                <div className="details-item-title left-item">
                  {msgs.get('dashboard.card.overview.cards.namespace', locale)}
                </div>
                <div className="details-item-content">
                  {appOverviewCardsData.appNamespace}
                </div>
              </div>

              <div className="details-item">
                <div className="details-item-title left-item">
                  {msgs.get('dashboard.card.overview.cards.created', locale)}
                </div>
                <div className="details-item-content">
                  {this.renderData(
                    appOverviewCardsData.creationTimestamp,
                    appOverviewCardsData.creationTimestamp,
                    '30%'
                  )}
                </div>
              </div>
            </div>

            <div className="details-col" id="right-col">
              <div className="details-item">
                <div className="details-item-title right-item">
                  {msgs.get('dashboard.card.overview.cards.clusters', locale)}
                </div>
                <div className="details-item-content">
                  {this.renderData(
                    appOverviewCardsData.remoteClusterCount !== -1 ||
                    appOverviewCardsData.localClusterDeploy
                      ? 0
                      : -1,
                    clusterCount,
                    '30%'
                  )}
                </div>
              </div>

              <div className="details-item">
                <div className="details-item-title right-item">
                  {msgs.get(
                    'dashboard.card.overview.cards.cluster.resource.status',
                    locale
                  )}
                </div>
                <div className="details-item-content">
                  {this.renderData(
                    appOverviewCardsData.nodeStatuses,
                    this.createStatusIcons(appOverviewCardsData.nodeStatuses),
                    '30%'
                  )}
                </div>
              </div>

              <div className="details-item">
                <a
                  className="details-item-link"
                  id="app-search-link"
                  href={getUrl + appOverviewCardsData.targetLink}
                  target="_blank"
                >
                  <div>
                    {msgs.get(
                      'dashboard.card.overview.cards.search.resource',
                      locale
                    )}
                    <Icon
                      name="icon--arrow--right"
                      fill="#0066CC"
                      description=""
                      className="details-item-link-icon"
                    />
                  </div>
                </a>
              </div>
            </div>
          </AccordionItem>
        </Accordion>

        <div className="overview-cards-subs-section">
          {showSubCards && !disableBtn
            ? this.createSubsCards(appOverviewCardsData.subsList, locale)
            : ''}
          <Button
            className="toggle-subs-btn"
            disabled={disableBtn}
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
      </div>
    )
  }

  renderData = (checkData, showData, width) => {
    return checkData !== -1 ? (
      showData
    ) : (
      <SkeletonText width={width} className="loading-skeleton-text" />
    )
  };

  createStatusIcons = nodeStatuses => {
    return (
      <React.Fragment>
        <div className="status-icon-container green-status">
          <img
            className="status-icon"
            alt="node-status-success"
            src={`${config.contextPath}/graphics/nodeStatusSuccess.svg`}
          />
          <div className="status-count">{nodeStatuses.green}</div>
        </div>
        <div className="status-icon-container yellow-status">
          <img
            className="status-icon"
            alt="node-status-warning"
            src={`${config.contextPath}/graphics/nodeStatusWarning.svg`}
          />
          <div className="status-count">{nodeStatuses.yellow}</div>
        </div>
        <div className="status-icon-container red-status">
          <img
            className="status-icon"
            alt="node-status-failure"
            src={`${config.contextPath}/graphics/nodeStatusFailure.svg`}
          />
          <div className="status-count">{nodeStatuses.red}</div>
        </div>
        <div className="status-icon-container orange-status">
          <img
            className="status-icon"
            alt="node-status-pending"
            src={`${config.contextPath}/graphics/nodeStatusPending.svg`}
          />
          <div className="status-count">{nodeStatuses.orange}</div>
        </div>
      </React.Fragment>
    )
  };

  createSubsCards = (subsList, locale) => {
    return subsList.map(sub => {
      if (sub.name) {
        return (
          <React.Fragment key={sub.id}>
            <div className="sub-card-container">
              <div className="sub-card-column">
                <Icon
                  name="icon--filter--glyph"
                  fill="#5c5c5c"
                  description=""
                  className="subs-icon"
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

              <div className="sub-card-column">
                <Icon
                  name="icon--folder"
                  fill="#5c5c5c"
                  description=""
                  className="subs-icon"
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
                        gitPath: sub.gitPath
                      }
                    ]}
                    locale={locale}
                  />
                </div>
              </div>

              <div className="sub-card-column">
                <Icon
                  name="icon--terminal"
                  fill="#5c5c5c"
                  description=""
                  className="subs-icon"
                />
                <div className="sub-card-content">
                  <div className="sub-card-title">
                    {msgs.get(
                      'dashboard.card.overview.cards.timeWindow.label',
                      locale
                    )}
                  </div>
                  {!sub.timeWindowType ? (
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
                        ranges: sub.timeWindowRanges
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

  toggleEditorTab = () => {
    document.getElementById('advanced').click()
  };

  toggleSubsBtn = showSubCards => {
    this.setState({ showSubCards: !showSubCards })
    this.forceUpdate()
  };
}

OverviewCards.propTypes = {}

export default withLocale(connect(mapStateToProps)(OverviewCards))
