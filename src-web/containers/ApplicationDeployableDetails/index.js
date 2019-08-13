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
import {
  updateSecondaryHeader,
  updateModal /* , fetchResource */
} from '../../actions/common'
import { fetchDeployableResource } from '../../reducers/reducerDeployables'
import {
  getBreadCrumbs,
  getDeployableDetails,
  getSubscriptions,
  getChannels,
  sampleData
} from './utils'
import ApplicationDeployableHighlights from '../../components/ApplicationDeployableHighlights'
import ApplicationDeployableSubscription from '../../components/ApplicationDeployableSubscription'
import ApplicationDeployableVersionStatus from '../../components/ApplicationDeployableVersionStatus'
import apolloClient from '../../../lib/client/apollo-client'
/* eslint-disable react/prop-types */

resources(() => {
  require('./style.scss')
})

//handleEditResource(dispatch, resourceType, data)
const handleEditResource = (dispatch, resourceType, data) => {
  return dispatch(
    updateModal({
      open: true,
      type: 'resource-edit',
      action: 'put',
      resourceType,
      editorMode: 'yaml',
      label: {
        primaryBtn: 'modal.button.submit',
        label: `modal.edit-${resourceType.name.toLowerCase()}.label`,
        heading: `modal.edit-${resourceType.name.toLowerCase()}.heading`
      },
      name: (data && data.name) || '',
      namespace: (data && data.namespace) || '',
      data: (data && data.data) || ''
    })
  )
}

const mapDispatchToProps = dispatch => {
  return {
    updateSecondaryHeaderInfo: (title, breadCrumbs) =>
      dispatch(updateSecondaryHeader(title, [], breadCrumbs, [])),
    editSubscription: (resourceType, data) =>
      handleEditResource(dispatch, resourceType, data),
    fetchDeployableResource: name =>
      dispatch(fetchDeployableResource(apolloClient, name))
  }
}

const mapStateToProps = state => {
  const { DeployablesReducer } = state
  const deployableDetails = getDeployableDetails(sampleData)
  const subscriptions = getSubscriptions(sampleData)
  const channels = getChannels(sampleData)

  return {
    deployableData: DeployablesReducer.deployableData,
    loading: DeployablesReducer.loading,
    deployableDetails,
    subscriptions,
    channels
  }
}

class ApplicationDeployableDetails extends React.Component {
  componentWillMount() {
    const {
      updateSecondaryHeaderInfo,
      params,
      fetchDeployableResource
    } = this.props
    const { locale } = this.context
    const deployableParams =
      (params && params.match && params.match.params) || {}
    const breadCrumbs = getBreadCrumbs(deployableParams, locale)
    updateSecondaryHeaderInfo(deployableParams.name || '', breadCrumbs)
    fetchDeployableResource(deployableParams.name)
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const { editSubscription, deployableData, loading } = this.props

    return (
      <div id="ApplicationDeployableDetails">
        <ApplicationDeployableHighlights />
        <ApplicationDeployableSubscription
          subscription={this.props.subscriptions}
          editSubscription={editSubscription}
        />
        <ApplicationDeployableVersionStatus
          deployableDetails={this.props.deployableDetails}
          channels={this.props.channels}
          subscriptions={this.props.subscriptions}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ApplicationDeployableDetails
)
