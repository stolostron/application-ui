/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import R from 'ramda'
import React from 'react'

import { connect } from 'react-redux'
import resources from '../../../../../lib/shared/resources'
import { RESOURCE_TYPES } from '../../../../../lib/shared/constants'
import { fetchResources } from '../../../../actions/common'
import msgs from '../../../../../nls/platform.properties'
import { getSingleApplicationObject } from '../../../ApplicationDeploymentHighlights/ApplicationDeploymentHighlightsDashboard/utils'
import { pullOutKindPerApplication } from '../../../ApplicationDeploymentPipeline/utils'

/* eslint-disable react/prop-types */

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

class ResourceCardsInformation extends React.Component {
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
    const singleAppStyle = isSingleApplicationView ? ' single-app' : ''

    // return (
    //   <div id="DeploymentHighlights">
    //     <ApplicationDeploymentHighlightsDashboard
    //       HCMApplicationList={HCMApplicationList}
    //       HCMChannelList={HCMChannelList}
    //       HCMSubscriptionList={HCMSubscriptionList}
    //       isSingleApplicationView={isSingleApplicationView}
    //     />
    //   </div>
    // )

    return (
      <div className={'resource-cards-info' + singleAppStyle}>
        <div
          key="1"
          className="first-item"
          role="button"
          tabIndex="0"
          // onClick={onClick}
          // onKeyPress={onKeyPress}
        >
          <div className="card-count">20</div>
          <div className="card-type">Subscriptions</div>
          <div className="card-text">Hub</div>
          <div className="row-divider" />
          <div className="card-text">Failed</div>
          <div className="card-text">No Status</div>
        </div>
        <div className="column-divider" />
        <div
          key="2"
          className="second-item"
          role="button"
          tabIndex="0"
          // onClick={onClick}
          // onKeyPress={onKeyPress}
        >
          <div className="card-count">30</div>
          <div className="card-type">Managed Clusters</div>
          <div className="card-text">Total Subscriptions</div>
          <div className="row-divider" />
          <div className="card-text">Failed</div>
          <div className="card-text">No Status</div>
        </div>
        <div className="column-divider" />
        <div
          key="3"
          className="third-item"
          role="button"
          tabIndex="0"
          // onClick={onClick}
          // onKeyPress={onKeyPress}
        >
          <div className="card-count">5</div>
          <div className="card-type">Channels</div>
          <div className="card-text">Total</div>
        </div>
        <div className="column-divider" />
        <div
          key="4"
          className="fourth-item"
          role="button"
          tabIndex="0"
          // onClick={onClick}
          // onKeyPress={onKeyPress}
        >
          <div className="card-count">5</div>
          <div className="card-type">Placement Rules</div>
          <div className="card-text">Total</div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ResourceCardsInformation
)
