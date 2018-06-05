/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
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

class SystemOverview extends React.Component {
  render() {
    const { locale } = this.context
    return (
      <div id='health-overview'>
        <DashboardSection name={msgs.get('dashboard.section.health-overview', locale)}>
        </DashboardSection>
      </div>
    )
  }
}

SystemOverview.contextTypes = {
  locale: PropTypes.string
}

export default SystemOverview
