/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'
/* eslint-disable react/prop-types, react/jsx-no-bind */

import React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import config from '../../lib/shared/config'
import DashboardApplicationTab from './dashboard/DashboardApplicationTab'

const fullDashboard = (config['featureFlags:fullDashboard'])

const BASE_PAGE_PATH = `${config.contextPath}/dashboard`

var SECONDARY_HEADER_PROPS = {
  title: 'routes.dashboard',
  tabs: [
    {
      id: 'dashboard-application',
      label: 'tabs.dashboard.application',
      url: BASE_PAGE_PATH
    }
  ],
  extra: [
  ]
}

if (fullDashboard) {
  SECONDARY_HEADER_PROPS = {
    title: 'routes.dashboard',
    tabs: [
      {
        id: 'dashboard-application',
        label: 'tabs.dashboard.application',
        url: BASE_PAGE_PATH
      },
      {
        id: 'dashboard-infrastructure',
        label: 'tabs.dashboard.infrastructure',
        url: `${BASE_PAGE_PATH}/infrastructure`
      },
      {
        id: 'dashboard-governance',
        label: 'tabs.dashboard.governance',
        url: `${BASE_PAGE_PATH}/governance`
      }
    ],
    extra: [
      {
        id: 'dashboard-addNewSuumary',
        label: 'tabs.dashboard.addNewSummary',
        url: `${BASE_PAGE_PATH}`
      }
    ]
  }
}


const DashboardTab = ({ match }) =>
  <Switch>
    <Route path={`${match.url}/infrastructure`} render={() => <DashboardApplicationTab secondaryHeaderProps={SECONDARY_HEADER_PROPS} />} />
    <Route path={`${match.url}/governance`} render={() => <DashboardApplicationTab secondaryHeaderProps={SECONDARY_HEADER_PROPS} />} />
    <Route path={match.url} render={() => <DashboardApplicationTab secondaryHeaderProps={SECONDARY_HEADER_PROPS} />} />
  </Switch>

export default withRouter(DashboardTab)
