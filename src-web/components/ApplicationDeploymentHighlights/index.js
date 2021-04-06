/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

import React from 'react'

import { connect } from 'react-redux'
import ApplicationDeploymentHighlightsTerminology from './ApplicationDeploymentHighlightsTerminology'

/* eslint-disable react/prop-types */

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
        <ApplicationDeploymentHighlightsTerminology />
      </div>
    )
  }
}

export default connect(mapStateToProps)(ApplicationDeploymentHighlights)
