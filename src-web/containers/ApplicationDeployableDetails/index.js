/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import { connect } from 'react-redux'
import resources from '../../../lib/shared/resources'
import { updateSecondaryHeader, fetchResources } from '../../actions/common'
import { fetchDeployableResource } from '../../reducers/reducerDeployables'
import { RESOURCE_TYPES } from '../../../lib/shared/constants'
import {
  getBreadCrumbs,
  getDeployableDetails,
  getSubscriptions,
  getChannels
} from './utils'
import ApplicationDeployableHighlights from '../../components/ApplicationDeployableHighlights'
import ApplicationDeployableVersionStatus from '../../components/ApplicationDeployableVersionStatus'
import apolloClient from '../../../lib/client/apollo-client'
/* eslint-disable react/prop-types */

resources(() => {
  require('./style.scss')
})

const mapDispatchToProps = dispatch => {
  return {
    fetchChannels: () => dispatch(fetchResources(RESOURCE_TYPES.HCM_CHANNELS)),
    updateSecondaryHeaderInfo: (title, breadCrumbs) =>
      dispatch(updateSecondaryHeader(title, [], breadCrumbs, [])),
    fetchDeployableResource: name =>
      dispatch(fetchDeployableResource(apolloClient, name))
  }
}

const mapStateToProps = state => {
  const { DeployablesReducer, HCMChannelList } = state

  return {
    deployableData: DeployablesReducer.deployableData,
    HCMChannelList
  }
}

class ApplicationDeployableDetails extends React.Component {
  componentWillMount() {
    const {
      fetchChannels,
      updateSecondaryHeaderInfo,
      params,
      fetchDeployableResource
    } = this.props
    const { locale } = this.context
    const deployableParams =
      (params && params.match && params.match.params) || {}
    const breadCrumbs = getBreadCrumbs(deployableParams, locale)
    updateSecondaryHeaderInfo(deployableParams.name || '', breadCrumbs)
    fetchDeployableResource(deployableParams.name, deployableParams.namespace)
    fetchChannels()
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const { HCMChannelList, deployableData } = this.props
    const subscriptions = getSubscriptions(deployableData)
    const channels = getChannels(HCMChannelList, subscriptions)
    const deployableDetails = getDeployableDetails(deployableData)

    return (
      <div id="ApplicationDeployableDetails">
        <ApplicationDeployableHighlights
          deployableDetails={deployableDetails}
        />
        <ApplicationDeployableVersionStatus
          deployableDetails={deployableDetails}
          channels={channels}
          subscriptions={subscriptions}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ApplicationDeployableDetails
)
