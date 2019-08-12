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
  getNumPendingDeployments,
  getNumInProgressDeployments,
  getNumFailedDeployments
} from './utils'
import { withLocale } from '../../../providers/LocaleProvider'
import resources from '../../../../lib/shared/resources'
import InstancesTable from '../../InstancesTable'

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
    getVisibleResources,
    incidentCount
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
    const countsCardData = [
      {
        msgKey: 'dashboard.card.deployables',
        textKey: 'dashboard.card.perInstance',
        count: getNumDeployables(item),
        border: 'right'
      },
      {
        msgKey: 'dashboard.card.deployments',
        textKey: 'dashboard.card.total',
        count: getNumDeployments(item)
      },
      {
        msgKey: 'dashboard.card.pending',
        textKey: 'dashboard.card.deployments',
        count: getNumPendingDeployments(item)
      },
      {
        msgKey: 'dashboard.card.inProgress',
        textKey: 'dashboard.card.deployments',
        count: getNumInProgressDeployments(item)
      },
      {
        msgKey: 'dashboard.card.failed',
        textKey: 'dashboard.card.deployments',
        count: getNumFailedDeployments(item),
        alert: true
      },
      {
        msgKey: 'dashboard.card.incidents',
        textKey: 'dashboard.card.total',
        count: incidentCount,
        border: 'left',
        alert: true
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
              <CountsCardModule data={countsCardData} />
            </div>
            {/* <div className="overview-content-bottom overview-content-with-padding">
              <ApplicationTopologyModule
                showExpandedTopology={showExpandedTopology}
                params={params}
                actions={actions}
              />
            </div> */}
            <div className="overview-content-bottom overview-content-with-padding-except-left">
              <ChannelsCardCarousel data={channelList} />
            </div>
            <div className="overview-content-bottom overview-content-with-padding">
              <InstancesTable
                staticResourceData={staticResourceData}
                resourceType={resourceType}
                getVisibleResources={getVisibleResources}
              />
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
  const { HCMChannelList } = state
  const name = decodeURIComponent(params.name)
  const item = getSingleResourceItem(state, {
    storeRoot: resourceType.list,
    resourceType,
    name,
    predicate: resourceItemByName,
    namespace: params.namespace ? decodeURIComponent(params.namespace) : null
  })
  return { item, channelList: getChannelsList(HCMChannelList) }
}

export default withRouter(
  connect(mapStateToProps)(withLocale(ResourceOverview))
)
