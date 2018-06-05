/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import DashboardSection from '../common/DashboardSection'
import msgs from '../../../nls/platform.properties'

class ResourceOverview extends React.Component {
  render() {
    const { locale } = this.context
    return (
      <div id='resource-overview'>
        <DashboardSection name={msgs.get('dashboard.section.resource-overview', locale)}>
        </DashboardSection>
      </div>
    )
  }
}

DashboardSection.contextTypes = {
  locale: PropTypes.string
}

export default ResourceOverview
