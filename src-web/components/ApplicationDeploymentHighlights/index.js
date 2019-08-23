/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'

import msgs from '../../../nls/platform.properties'
import loadable from 'loadable-components'
import { connect } from 'react-redux'
import resources from '../../../lib/shared/resources'
import { RESOURCE_TYPES } from '../../../lib/shared/constants'
import { fetchResources } from '../../actions/common'
import ApplicationDeploymentHighlightsTerminology from './ApplicationDeploymentHighlightsTerminology'
import ApplicationDeploymentHighlightsDashboard from './ApplicationDeploymentHighlightsDashboard'
import R from 'ramda'

/* eslint-disable react/prop-types */

export const ApplicationDeploymentSummary = loadable(() =>
  import(/* webpackChunkName: "applicationdeploymentsummary" */ './ApplicationDeploymentSummary')
)

resources(() => {
  require('./style.scss')
})

const mapDispatchToProps = dispatch => {
  return {
    fetchChannels: () => dispatch(fetchResources(RESOURCE_TYPES.HCM_CHANNELS))
  }
}

const mapStateToProps = state => {
  const {
    HCMChannelList,
    HCMApplicationList,
    HCMSubscriptionList,
    secondaryHeader
  } = state
  const isSingleApplicationView =
    R.pathOr([], ['breadcrumbItems'])(secondaryHeader).length == 2
  return {
    HCMChannelList,
    HCMSubscriptionList,
    HCMApplicationList,
    isSingleApplicationView
  }
}

class ApplicationDeploymentHighlights extends React.Component {
  componentWillMount() {}
  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const {
      HCMChannelList,
      HCMSubscriptionList,
      HCMApplicationList,
      isSingleApplicationView
    } = this.props
    const { locale } = this.context

    return (
      <div id="DeploymentHighlights">
        <div className="deployment-highlights-header">
          {msgs.get('description.title.deploymentHighlights', locale)}
        </div>
        <ApplicationDeploymentHighlightsTerminology />
        <ApplicationDeploymentHighlightsDashboard
          HCMApplicationList={HCMApplicationList}
          HCMChannelList={HCMChannelList}
          HCMSubscriptionList={HCMSubscriptionList}
          isSingleApplicationView={isSingleApplicationView}
        />
        <ApplicationDeploymentSummary
          HCMChannelList={HCMChannelList}
          HCMApplicationList={HCMApplicationList}
          HCMSubscriptionList={HCMSubscriptionList}
          isSingleAppView={isSingleApplicationView}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ApplicationDeploymentHighlights
)
