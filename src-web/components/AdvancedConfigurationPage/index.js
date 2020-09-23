/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import msgs from '../../../nls/platform.properties'
import { connect } from 'react-redux'
import { REQUEST_STATUS } from '../../actions'
import resources from '../../../lib/shared/resources'
import {
  updateSecondaryHeader,
  clearSuccessFinished
} from '../../actions/common'
import { Notification } from 'carbon-components-react'

import ApplicationDeploymentHighlights from '../ApplicationDeploymentHighlights'
import { withRouter } from 'react-router-dom'
import AdvancedConfigurationLists from '../AdvancedConfigurationLists'

/* eslint-disable react/prop-types */

resources(() => {
  require('./style.scss')
})

const mapDispatchToProps = dispatch => {
  return {
    clearSuccessFinished: () => clearSuccessFinished(dispatch),
    updateSecondaryHeaderFn: (title, tabs, mainButton) =>
      dispatch(
        updateSecondaryHeader(title, tabs, null, null, null, null, mainButton)
      )
  }
}

const mapStateToProps = state => {
  const {
    HCMChannelList,
    HCMSubscriptionList,
    AppDeployments,
    QueryApplicationList,
    GlobalApplicationDataList
  } = state

  return {
    HCMChannelList,
    HCMSubscriptionList,
    AppDeployments,
    QueryApplicationList,
    GlobalApplicationDataList,
    loading: AppDeployments.loading,
    mutateStatus:
      state['HCMChannelList'].mutateStatus ||
      state['HCMSubscriptionList'].mutateStatus ||
      state['HCMPlacementRuleList'].mutateStatus,
    deleteStatus:
      state['HCMChannelList'].deleteStatus ||
      state['HCMSubscriptionList'].deleteStatus ||
      state['HCMPlacementRuleList'].deleteStatus,
    deleteMsg:
      state['HCMChannelList'].deleteMsg ||
      state['HCMSubscriptionList'].deleteMsg ||
      state['HCMPlacementRuleList'].deleteMsg
  }
}

class AdvancedConfigurationPage extends React.Component {
  componentDidMount() {
    const {
      secondaryHeaderProps,
      updateSecondaryHeaderFn,
      locale
    } = this.props

    updateSecondaryHeaderFn(
      msgs.get(secondaryHeaderProps.title, locale),
      secondaryHeaderProps.tabs,
      secondaryHeaderProps.mainButton
    )
  }

  componentWillUnmount() {
    this.mutateFinished()
  }

  mutateFinished() {
    this.props.clearSuccessFinished()
  }

  render() {
    const {
      mutateStatus,
      deleteStatus,
      deleteMsg,
      locale,
      secondaryHeaderProps
    } = this.props

    return (
      <React.Fragment>
        {deleteStatus === REQUEST_STATUS.DONE && (
          <Notification
            title={msgs.get('success.update.resource', locale)}
            subtitle={msgs.get(
              'success.delete.description',
              [deleteMsg],
              locale
            )}
            kind="success"
          />
        )}
        {mutateStatus === REQUEST_STATUS.DONE && (
          <Notification
            title=""
            subtitle={msgs.get('success.create.description', locale)}
            kind="success"
          />
        )}
        <ApplicationDeploymentHighlights />
        <AdvancedConfigurationLists
          secondaryHeaderProps={secondaryHeaderProps}
        />
      </React.Fragment>
    )
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AdvancedConfigurationPage)
)
