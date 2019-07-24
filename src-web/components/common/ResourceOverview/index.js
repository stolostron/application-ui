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
import ChannelsCardModule from '../../ChannelsCardModule'
import ApplicationTopologyModule from '../../ApplicationTopologyModule'
import StructuredListModule from '../../../components/common/StructuredListModule'
import {
  getSingleResourceItem,
  resourceItemByName
} from '../../../reducers/common'
import {
  getNumDeployables,
  getNumDeployments,
  getNumFailedDeployments
} from '../../../../lib/client/resource-helper'
import { withLocale } from '../../../providers/LocaleProvider'
import resources from '../../../../lib/shared/resources'
import msgs from '../../../../nls/platform.properties'
import { getChannelsList } from './utils'

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
    locale
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
        msgKey: 'table.header.deployables',
        count: getNumDeployables(item)
      },
      {
        msgKey: 'table.header.deployments',
        count: getNumDeployments(item)
      },
      {
        msgKey: 'table.header.failedDeployments',
        count: getNumFailedDeployments(item)
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
        ) :  !showExpandedTopology ? (
          <React.Fragment>
            <div className="overview-content-bottom overview-content-with-padding">
              <CountsCardModule data={countsCardData} />
            </div>
            <div className="overview-content-bottom overview-content-with-padding">
              <ApplicationTopologyModule showExpandedTopology={showExpandedTopology} params={params} actions={actions} />
            </div>
            <div className="deployment-channels-title">
              {msgs.get('application.deployments.channels', locale)}
              {Array.isArray(channelList) && (
                <span>&nbsp;({channelList.length})</span>
              )}
            </div>
            <div className="overview-content-bottom">
              <ChannelsCardModule data={channelList} />
            </div>
          </React.Fragment>
        ) : (
          <div className="overview-content-bottom overview-content-with-padding">
            <ApplicationTopologyModule showExpandedTopology={showExpandedTopology} params={params} actions={actions} />
          </div>
        )
        }
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
