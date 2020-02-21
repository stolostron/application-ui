/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import R from 'ramda'
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
  componentWillMount() {}
  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const { QueryApplicationList, secondaryHeader } = this.props

    const applications = R.pathOr([], ['items'])(QueryApplicationList)
    let open = applications.length == 0
    if (applications.length > 0) {
      const isSingleApplicationView =
        R.pathOr([], ['breadcrumbItems'])(secondaryHeader).length == 2
      let selectedAppName = ''
      let selectedAppNS = ''

      if (isSingleApplicationView) {
        const urlArray = R.split('/', secondaryHeader.breadcrumbItems[1].url)
        selectedAppName = urlArray[urlArray.length - 1]
        selectedAppNS = urlArray[urlArray.length - 2]

        const apps = R.find(
          R.propEq('name', selectedAppName) &&
            R.propEq('namespace', selectedAppNS)
        )(applications) //filter by name, ns
        open = !(
          apps &&
          apps.hubSubscriptions &&
          apps.hubSubscriptions.length > 0
        )
      }
    }

    return (
      <div id="DeploymentHighlights">
        <ApplicationDeploymentHighlightsTerminology open={open} />
      </div>
    )
  }
}

export default connect(mapStateToProps)(ApplicationDeploymentHighlights)
