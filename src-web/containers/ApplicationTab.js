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
import { Route, Switch, withRouter } from 'react-router-dom'
import config from '../../lib/shared/config'
import Page from '../components/common/Page'
import PropTypes from 'prop-types'
import ApplicationDashboardTab from './ApplicationDashboardTab'
import ApplicationResourcesTab from './ApplicationResourcesTab'
import ApplicationTopologyTab from './ApplicationTopologyTab'

const BASE_PAGE_PATH = `${config.contextPath}/application`

class ApplicationTab extends React.Component {

  componentWillMount() {
    const secondProps = this.getSecondaryHeaderProps()
    this.getOverviewTab = this.getTabComponent.bind(this, 'overview', secondProps)
    this.getResourcesTab = this.getTabComponent.bind(this, 'resources', secondProps)
    this.getTopologyTab = this.getTabComponent.bind(this, 'topology', secondProps)
  }

  render() {
    const { location: {pathname} } = this.props
    const name = pathname.split('/').pop()
    return (
      <Page>
        <Switch>
          <Route path={`${BASE_PAGE_PATH}/overview/${name}`} render={this.getOverviewTab} />
          <Route path={`${BASE_PAGE_PATH}/resources/${name}`} render={this.getResourcesTab} />
          <Route path={`${BASE_PAGE_PATH}/topology/${name}`} render={this.getTopologyTab} />
        </Switch>
      </Page>
    )
  }

  getTabComponent(tabId, secondProps) {
    switch (tabId) {
    case 'overview':
      return (<ApplicationDashboardTab secondaryHeaderProps={secondProps} />)
    case 'resources':
      return (<ApplicationResourcesTab secondaryHeaderProps={secondProps} />)
    case 'topology':
      return (<ApplicationTopologyTab secondaryHeaderProps={secondProps} />)
    }
  }

  getSecondaryHeaderProps() {
    const { location: {pathname} } = this.props
    const name = pathname.split('/').pop()
    return {
      tabs: [
        {
          id: 'topology',
          label: 'tabs.application.topology',
          url: `${BASE_PAGE_PATH}/topology/${name}`
        },
        {
          id: 'resources',
          label: 'tabs.application.resources',
          url: `${BASE_PAGE_PATH}/resources/${name}`
        },
        {
          id: 'dashboard',
          label: 'tabs.application.overview',
          url: `${BASE_PAGE_PATH}/overview/${name}`
        },
      ]
    }
  }
}

ApplicationTab.propTypes = {
  location: PropTypes.object,
}

export default withRouter(ApplicationTab)
