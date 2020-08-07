/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'

import { connect } from 'react-redux'
import resources from '../../../lib/shared/resources'
import ApplicationDeploymentHighlightsTerminology from './ApplicationDeploymentHighlightsTerminology'

/* eslint-disable react/prop-types */

resources(() => {
  require('./style.scss')
})

const mapStateToProps = state => {
  const { QueryApplicationList, secondaryHeader } = state
  return {
    QueryApplicationList,
    secondaryHeader
  }
}

class ApplicationDeploymentHighlights extends React.Component {
  render() {
    return (
      <div id="DeploymentHighlights">
        <ApplicationDeploymentHighlightsTerminology open={true} />
      </div>
    )
  }
}

export default connect(mapStateToProps)(ApplicationDeploymentHighlights)
