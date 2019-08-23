/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Loading } from 'carbon-components-react'
import { connect } from 'react-redux'
import CountsCardModule from '../../CountsCardModule'
import ChannelsCardCarousel from '../../ChannelsCardCarousel'
import ApplicationTopologyModule from '../../ApplicationTopologyModule'
import StructuredListModule from '../../../components/common/StructuredListModule'
import {
  getSingleResourceItem,
  resourceItemByName
} from '../../../reducers/common'
import {
  getChannelsList,
  getNumDeployables,
  getNumDeployments,
  getIcamLink,
  getCurrentApplication,
  formatToChannel
} from './utils'
import { pullOutKindPerApplication } from '../../ApplicationDeploymentPipeline/utils'
import { getResourcesStatusPerChannel } from '../../ApplicationDeploymentPipeline/components/PipelineGrid/utils'
import { withLocale } from '../../../providers/LocaleProvider'
import resources from '../../../../lib/shared/resources'
import R from 'ramda'

resources(() => {
  require('./style.scss')
})

const ResourceOverview = withLocale(
  ({
    staticResourceData,
    item,
    channelList,
    params,
    modules,
    resourceType,
    actions,
    showAppDetails,
    showExpandedTopology,
    incidentCount,
    activeAccountId,
    applicationUid
  }) => {
    if (!item) {
      return <Loading withOverlay={false} className="content-spinner" />
    }
    const modulesRight = []
    const modulesBottom = []
    React.Children.map(modules, module => {
      if (module.props.right) {
        modulesRight.push(
          React.cloneElement(module, {
            staticResourceData,
            resourceType,
            resourceData: item,
            params
          })
        )
      } else {
        modulesBottom.push(
          React.cloneElement(module, {
            staticResourceData,
            resourceType,
            resourceData: item,
            params
          })
        )
      }
    })
    const deployables = getNumDeployables(item)
    const deployments = getNumDeployments(item)
    const status = getResourcesStatusPerChannel(item, false)
    const completedDeployments = status[0] + status[4]
    const inProgressDeployments = status[2] + status[3]
    const failedDeployments = status[1]
    const countsCardData = [
      {
        msgKey:
          deployables > 1
            ? 'dashboard.card.deployables'
            : 'dashboard.card.deployable',
        textKey: 'dashboard.card.perInstance',
        count: deployables,
        border: 'right'
      },
      {
        msgKey:
          deployments > 1
            ? 'dashboard.card.deployments'
            : 'dashboard.card.deployment',
        textKey: 'dashboard.card.total',
        count: deployments,
        targetTab: 1
      },
      {
        msgKey: 'dashboard.card.deployment.completed',
        textKey:
          completedDeployments > 1
            ? 'dashboard.card.deployments'
            : 'dashboard.card.deployment',
        count: completedDeployments,
        targetTab: 1
      },
      {
        msgKey: 'dashboard.card.deployment.inProgress',
        textKey:
          inProgressDeployments > 1
            ? 'dashboard.card.deployments'
            : 'dashboard.card.deployment',
        count: inProgressDeployments,
        targetTab: 1
      },
      {
        msgKey: 'dashboard.card.deployment.failed',
        textKey:
          failedDeployments > 1
            ? 'dashboard.card.deployments'
            : 'dashboard.card.deployment',
        count: failedDeployments,
        alert: failedDeployments > 0 ? true : false,
        targetTab: 1
      },
      {
        msgKey:
          incidentCount > 1
            ? 'dashboard.card.incidents'
            : 'dashboard.card.incident',
        textKey: 'dashboard.card.total',
        count: incidentCount,
        alert: incidentCount > 0 ? true : false,
        targetTab: 2,
        border: 'left'
      }
    ]

    return (
      <div id="resource-overview" className="overview-content">
        {showAppDetails ? (
          <React.Fragment>
            <StructuredListModule
              title={staticResourceData.detailKeys.title}
              headerRows={staticResourceData.detailKeys.headerRows}
              rows={staticResourceData.detailKeys.rows}
              data={item}
            />
            {modulesRight.length > 0 && (
              <div className="overview-content-right">{modulesRight}</div>
            )}
            <div className="overview-content-bottom">{modulesBottom}</div>
          </React.Fragment>
        ) : !showExpandedTopology ? (
          <React.Fragment>
            <div className="overview-content-bottom overview-content-with-padding">
              <CountsCardModule
                data={countsCardData}
                title="dashboard.card.deployment.summary.title"
                link={getIcamLink(activeAccountId, applicationUid)}
              />
            </div>
            <div className="overview-content-bottom overview-content-with-padding">
              <ApplicationTopologyModule
                showExpandedTopology={showExpandedTopology}
                params={params}
                actions={actions}
              />
            </div>
            <div className="overview-content-bottom overview-content-with-padding-except-left">
              <ChannelsCardCarousel data={channelList} />
            </div>
          </React.Fragment>
        ) : (
          <div className="overview-content-bottom overview-content-with-padding">
            <ApplicationTopologyModule
              showExpandedTopology={showExpandedTopology}
              params={params}
              actions={actions}
            />
          </div>
        )}
      </div>
    )
  }
)

ResourceOverview.contextTypes = {
  locale: PropTypes.string
}

ResourceOverview.propTypes = {
  item: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  modules: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  params: PropTypes.object,
  resourceType: PropTypes.object,
  staticResourceData: PropTypes.object
}

const mapStateToProps = (state, ownProps) => {
  const { resourceType, params } = ownProps
  const { HCMApplicationList, secondaryHeader, HCMSubscriptionList } = state
  // Determine if single view
  const singleAppView =
    R.pathOr([], ['breadcrumbItems'])(secondaryHeader).length == 2
  // Get the current application given it being a single view
  const currentApp = getCurrentApplication(HCMApplicationList, singleAppView)
  // Get all the subscriptions for the current Appliction if its single view
  const subscriptionForApplication = pullOutKindPerApplication(
    currentApp,
    'subscription'
  )
  // Now generate a list of objects that has all the resources of each subscription
  // per channel
  const channelsWithSubscriptionTiedRelatedData = formatToChannel(
    subscriptionForApplication,
    HCMSubscriptionList
  )

  const name = decodeURIComponent(params.name)
  const item = getSingleResourceItem(state, {
    storeRoot: resourceType.list,
    resourceType,
    name,
    predicate: resourceItemByName,
    namespace: params.namespace ? decodeURIComponent(params.namespace) : null
  })
  return {
    item,
    channelList: getChannelsList(channelsWithSubscriptionTiedRelatedData)
  }
}

export default withRouter(
  connect(mapStateToProps)(withLocale(ResourceOverview))
)
