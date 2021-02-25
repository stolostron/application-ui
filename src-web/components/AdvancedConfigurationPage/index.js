/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.

import React from 'react'
import msgs from '../../../nls/platform.properties'
import { connect } from 'react-redux'
import resources from '../../../lib/shared/resources'
import {
  updateSecondaryHeader,
  clearSuccessFinished
} from '../../actions/common'

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
    const { secondaryHeaderProps } = this.props

    return (
      <React.Fragment>
        <ApplicationDeploymentHighlights />
        <AdvancedConfigurationLists
          secondaryHeaderProps={secondaryHeaderProps}
        />
      </React.Fragment>
    )
  }
}

export default withRouter(
  connect(null, mapDispatchToProps)(AdvancedConfigurationPage)
)
