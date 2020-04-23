/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

// seems to be an issue with this rule and redux
/* eslint-disable import/no-named-as-default */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../actions'
import loadable from 'loadable-components'
import { Tabs, Tab } from 'carbon-components-react'
import msgs from '../../../nls/platform.properties'
import { withLocale } from '../../providers/LocaleProvider'
import resources from '../../../lib/shared/resources'
import { isAdminRole } from '../../../lib/client/access-helper'

resources(() => {
  require('./style.scss')
})

export const ApplicationsTab = loadable(() =>
  import(/* webpackChunkName: "applications" */ '../ApplicationsTab')
)

export const ApplicationDeploymentPipeline = loadable(() =>
  import(/* webpackChunkName: "applicationdeploymentpipeline" */ '../../components/ApplicationDeploymentPipeline')
)

export const IncidentsTab = loadable(() =>
  import(/* webpackChunkName: "incidents" */ '../IncidentsTab')
)

// This will render the four tabs
// Overview, Deployments, Incidents, Logs
const ApplicationHeaderTabs = withLocale(
  ({
    selectedAppTab,
    showExtraTabs,
    userRole,
    params,
    actions,
    locale,
    serverProps
  }) => {
    if (!showExtraTabs && selectedAppTab > 1) {
      actions.setSelectedAppTab(0)
    }

    const noop = () => {
      // no op function for optional properties
    }

    const showIncidentsTab = serverProps && serverProps.isCEMRunning

    const renderTab = thisTab => {
      if (selectedAppTab === thisTab) {
        switch (thisTab) {
        case 0:
          return (
            <div className="some-content">
              <ApplicationsTab
                secondaryHeaderProps={{ title: 'routes.applications' }}
                />
            </div>
          )
        case 1:
          return (
            <div className="page-content-container">
              <ApplicationDeploymentPipeline serverProps={serverProps} />
            </div>
          )
        case 2:
          return (
            <div className="some-content">
              <IncidentsTab params={params} />
            </div>
          )
        }
      }
      return null
    }

    return (
      <div id="applicationheadertabs">
        <div className="whiteSpacer">
          <Tabs
            className="some-class"
            selected={selectedAppTab}
            onClick={noop}
            onKeyDown={noop}
            onSelectionChange={id => {
              actions.setSelectedAppTab(id)
              // Show app overview (instead of app information)
              // if the user clicks on another tab and then
              // goes back to the Overview tab
              actions.setShowAppDetails(false)
            }}
            tabcontentclassname="tab-content"
          >
            <Tab
              disabled={false}
              onClick={noop}
              onKeyDown={noop}
              label={msgs.get('description.title.overview', locale)}
            >
              {renderTab(0)}
            </Tab>
            <Tab
              disabled={false}
              onClick={noop}
              onKeyDown={noop}
              label={msgs.get('description.title.deployments', locale)}
            >
              {renderTab(1)}
            </Tab>
            {showExtraTabs &&
              showIncidentsTab &&
              isAdminRole(userRole) && (
                <Tab
                  disabled={false}
                  onClick={noop}
                  onKeyDown={noop}
                  label={msgs.get('description.title.incidents', locale)}
                >
                  {renderTab(2)}
                </Tab>
            )}
          </Tabs>
        </div>
      </div>
    )
  }
)

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}
const mapStateToProps = state => {
  const { role, AppOverview } = state
  return {
    userRole: role && role.role,
    selectedAppTab: AppOverview.selectedAppTab
  }
}

export default withLocale(
  connect(mapStateToProps, mapDispatchToProps)(ApplicationHeaderTabs)
)
