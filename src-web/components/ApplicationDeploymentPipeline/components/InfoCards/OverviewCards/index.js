/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import R from 'ramda'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { SkeletonText } from 'carbon-components-react'
import resources from '../../../../../../lib/shared/resources'
import { RESOURCE_TYPES } from '../../../../../../lib/shared/constants'
import { fetchResources } from '../../../../../actions/common'
import { bindActionCreators } from 'redux'
import * as Actions from '../../../../../actions'
import msgs from '../../../../../../nls/platform.properties'
import {
  getSubscriptionDataOnHub,
  getSubscriptionDataOnManagedClustersSingle,
  getPodData,
  concatDataForSubTextKey
} from '../utils'
import {
  getSearchLinkForOneApplication,
  getCardsCommonDetails
} from '../../../../common/ResourceOverview/utils'
import {
  startPolling,
  stopPolling,
  handleRefreshPropertiesChanged,
  handleVisibilityChanged
} from '../../../../../shared/utils/refetch'

/* eslint-disable react/prop-types */

resources(() => {
  require('../style.scss')
})

const mapDispatchToProps = dispatch => {
  return {
    fetchApplications: () =>
      dispatch(fetchResources(RESOURCE_TYPES.QUERY_APPLICATIONS)),
    actions: bindActionCreators(Actions, dispatch)
  }
}

const mapStateToProps = state => {
  const { QueryApplicationList, secondaryHeader, refetch } = state
  const isSingleApplicationView =
    R.pathOr([], ['breadcrumbItems'])(secondaryHeader).length === 2
  return {
    QueryApplicationList,
    isSingleApplicationView,
    refetch
  }
}

const getOverviewCardsData = (
  QueryApplicationList,
  isSingleApplicationView,
  applicationName,
  applicationNamespace,
  targetLinkForPods,
  locale
) => {
  // All functions will return -1 if data or data.items is undefined... this will be used for skeleton text load bar
  const subscriptionDataOnHub = getSubscriptionDataOnHub(
    QueryApplicationList,
    isSingleApplicationView,
    applicationName,
    applicationNamespace
  )
  const subscriptionDataOnManagedClusters = getSubscriptionDataOnManagedClustersSingle(
    QueryApplicationList,
    applicationName,
    applicationNamespace
  )
  const podData = getPodData(
    QueryApplicationList,
    applicationName,
    applicationNamespace
  )

  const result = getCardsCommonDetails(
    subscriptionDataOnHub,
    subscriptionDataOnManagedClusters,
    isSingleApplicationView,
    applicationName,
    applicationNamespace,
    locale
  )
  result.push({
    msgKey:
      podData.total === 1
        ? msgs.get('dashboard.card.deployment.pod', locale)
        : msgs.get('dashboard.card.deployment.pods', locale),
    count: podData.total,
    targetLink: podData.total === 0 ? '' : targetLinkForPods,
    subtextKeyFirst: concatDataForSubTextKey(
      podData.total,
      podData.total,
      podData.running,
      msgs.get('dashboard.card.deployment.running', locale)
    ),
    subtextKeySecond: concatDataForSubTextKey(
      podData.total,
      podData.total,
      podData.failed,
      msgs.get('dashboard.card.deployment.failed.lowercase', locale)
    )
  })

  return result
}

class OverviewCards extends React.Component {
  componentDidMount() {
    const { fetchApplications } = this.props

    fetchApplications()

    document.addEventListener('visibilitychange', this.onVisibilityChange)
    startPolling(this, setInterval)
  }

  componentWillUnmount() {
    stopPolling(this.state, clearInterval)
    document.removeEventListener('visibilitychange', this.onVisibilityChange)
  }

  onVisibilityChange = () => {
    handleVisibilityChanged(this, clearInterval, setInterval)
  };

  componentDidUpdate(prevProps) {
    handleRefreshPropertiesChanged(prevProps, this, clearInterval, setInterval)
  }

  reload() {
    const { fetchApplications } = this.props
    fetchApplications()
  }

  render() {
    const {
      QueryApplicationList,
      isSingleApplicationView,
      actions,
      selectedAppName,
      selectedAppNS
    } = this.props
    const { locale } = this.context
    const singleAppStyle = isSingleApplicationView ? ' single-app' : ''
    const applicationName = selectedAppName
    const applicationNamespace = selectedAppNS

    const targetLinkForPods = getSearchLinkForOneApplication({
      name: encodeURIComponent(applicationName),
      namespace: encodeURIComponent(applicationNamespace),
      showRelated: 'pod'
    })

    const overviewCardsData = getOverviewCardsData(
      QueryApplicationList,
      isSingleApplicationView,
      applicationName,
      applicationNamespace,
      targetLinkForPods,
      locale
    )

    return (
      <div className={'overview-cards-info' + singleAppStyle}>
        <InfoCards overviewCardsData={overviewCardsData} actions={actions} />
      </div>
    )
  }
}

const showCardData = (cardCount, width, className) => {
  return cardCount !== -1 ? (
    cardCount
  ) : (
    <SkeletonText width={width} className={className} />
  )
}

const InfoCards = ({ overviewCardsData, actions }) => {
  return (
    <React.Fragment>
      {Object.keys(overviewCardsData).map(key => {
        const card = overviewCardsData[key]
        const id = `${key}_overviewCardsData`
        const cardMarginClass = 'card-margin'
        const handleClick = (e, resource) => {
          if (resource.targetTab != null) {
            actions.setSelectedAppTab(resource.targetTab)
          } else if (resource.targetLink) {
            window.open(resource.targetLink, '_blank')
          }
        }
        const handleKeyPress = (e, resource) => {
          if (e.key === 'Enter') {
            handleClick(e, resource)
          }
        }

        return (
          <React.Fragment key={key}>
            <div
              id={id}
              key={card}
              className={
                card.targetLink || card.targetTab
                  ? `single-card clickable ${cardMarginClass}`
                  : `single-card ${cardMarginClass}`
              }
              role="button"
              tabIndex="0"
              onClick={e => handleClick(e, card)}
              onKeyPress={e => handleKeyPress(e, card)}
            >
              <div className={card.alert ? 'card-count alert' : 'card-count'}>
                {showCardData(
                  card.count,
                  '60%',
                  'loading-skeleton-text-header'
                )}
              </div>
              <div className="card-type">{card.msgKey}</div>
              <div className="card-text">
                {showCardData(card.textKey, '80%', 'loading-skeleton-text-lrg')}
              </div>
              {(card.subtextKeyFirst || card.subtextKeySecond) && (
                <div className="row-divider" />
              )}
              {card.subtextKeyFirst && (
                <div className="card-subtext">
                  {showCardData(
                    card.subtextKeyFirst,
                    '40%',
                    'loading-skeleton-text-sm'
                  )}
                </div>
              )}
              {card.subtextKeySecond && (
                <div className="card-subtext">
                  {showCardData(
                    card.subtextKeySecond,
                    '60%',
                    'loading-skeleton-text-med'
                  )}
                </div>
              )}
            </div>
            {key < Object.keys(overviewCardsData).length - 1 && (
              <div className="column-divider" />
            )}
          </React.Fragment>
        )
      })}
    </React.Fragment>
  )
}

InfoCards.propTypes = {
  actions: PropTypes.object,
  overviewCardsData: PropTypes.array
}

OverviewCards.propTypes = {}

export default connect(mapStateToProps, mapDispatchToProps)(OverviewCards)
