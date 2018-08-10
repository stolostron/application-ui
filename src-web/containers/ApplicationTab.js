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
import loadable from 'loadable-components'
import config from '../../lib/shared/config'
import Page from '../components/common/Page'
import PropTypes from 'prop-types'

// need to restart node after changes here
const BASE_PAGE_PATH = `${config.contextPath}/application`
const TABS = ['dashboard','topology']
export const ApplicationDashboardTab = loadable(() => import(/* webpackChunkName: "appDashboad" */ './ApplicationDashboardTab'))
export const ApplicationTopologyTab = loadable(() => import(/* webpackChunkName: "appTopology" */ './ApplicationTopologyTab'))

class ApplicationTab extends React.Component {

  getTabComponent(tabId, secondProps) {
    switch (tabId) {
    case 'dashboard':
      return (<ApplicationDashboardTab secondaryHeaderProps={secondProps} />)
    case 'topology':
      return (<ApplicationTopologyTab secondaryHeaderProps={secondProps} />)
    }
  }

  componentWillMount() {
    // create tabs for all other tabs
    const { location: {pathname} } = this.props
    const name = pathname.split('/').pop()
    this.secondProps= {tabs: TABS.map(tab=>{
      return {
        id: tab,
        label: 'tabs.application.'+tab,
        url: `${BASE_PAGE_PATH}/${tab}/${name}`
      }
    })}

    this.binding = {}
    TABS.forEach(tab=>{
      this.binding[tab] = this.getTabComponent.bind(this, tab, this.secondProps)
    })
  }

  render() {
    return (
      <Page>
        <Switch>
          {this.secondProps.tabs.map(({ id, url}) => (
            <Route key={id} path={url} render={this.binding[id]} />
          ))}
        </Switch>
      </Page>
    )
  }
}

ApplicationTab.propTypes = {
  location: PropTypes.object,
}

export default withRouter(ApplicationTab)
