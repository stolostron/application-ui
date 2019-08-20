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
import loadable from 'loadable-components'
import { connect } from 'react-redux'
import resources from '../../../lib/shared/resources'
import { RESOURCE_TYPES } from '../../../lib/shared/constants'
import { fetchResources } from '../../actions/common'
import ApplicationDeploymentHighlightsTerminology from './ApplicationDeploymentHighlightsTerminology'
import ApplicationDeploymentHighlightsDashboard from './ApplicationDeploymentHighlightsDashboard'

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
  const { HCMChannelList, HCMApplicationList, HCMSubscriptionList } = state
  return {
    HCMChannelList,
    HCMSubscriptionList,
    HCMApplicationList
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
      HCMApplicationList
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
        />
        <ApplicationDeploymentSummary
          HCMChannelList={HCMChannelList}
          HCMApplicationList={HCMApplicationList}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ApplicationDeploymentHighlights
)
