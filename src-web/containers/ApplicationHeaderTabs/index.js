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
import {
  delResourceSuccessFinished,
  mutateResourceSuccessFinished
} from '../../actions/common'
import { refetchIntervalUpdate } from '../../actions/refetch'
import {
  RESOURCE_TYPES,
  REFRESH_TIMES,
  TOPOLOGY_REFRESH_INTERVAL_COOKIE
} from '../../../lib/shared/constants'

import RefreshTimeSelect from '../../components/common/RefreshTimeSelect'

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

// This will render the two tabs
// Overview, Resources
const ApplicationHeaderTabs = withLocale(
  ({
    selectedAppTab,
    showExtraTabs,
    userRole,
    params,
    actions,
    locale,
    serverProps,
    mutateSuccessFinished,
    deleteSuccessFinished,
    refetchIntervalUpdate
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
          mutateSuccessFinished()
          deleteSuccessFinished()

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
        {/* <div className="whiteSpacer">
          <RefreshTimeSelect
            refreshValues={REFRESH_TIMES}
            refreshCookie={TOPOLOGY_REFRESH_INTERVAL_COOKIE}
            // isReloading={isReloading}
            // startPolling={startPolling}
            // stopPolling={stopPolling}
            // refetch={refetch} //
            params={params}
            refetchIntervalUpdate={refetchIntervalUpdate}
            // refetch={refetch} // value is set by RefreshTimeSelect if a change is made to trigger refresh
          />
          </div> */}
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

            <RefreshTimeSelect
              refreshValues={REFRESH_TIMES}
              refreshCookie={TOPOLOGY_REFRESH_INTERVAL_COOKIE}
              // isReloading={isReloading}
              // startPolling={startPolling}
              // stopPolling={stopPolling}
              // refetch={refetch} //
              params={params}
              refetchIntervalUpdate={refetchIntervalUpdate}
              // refetch={refetch} // value is set by RefreshTimeSelect if a change is made to trigger refresh
            />
          </Tabs>
        </div>
      </div>
    )
  }
)

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(Actions, dispatch),
    mutateSuccessFinished: () =>
      dispatch(
        mutateResourceSuccessFinished(RESOURCE_TYPES.QUERY_APPLICATIONS)
      ),
    deleteSuccessFinished: () =>
      dispatch(delResourceSuccessFinished(RESOURCE_TYPES.QUERY_APPLICATIONS)),
    refetchIntervalUpdate: data => dispatch(refetchIntervalUpdate(data))
  }
}
const mapStateToProps = state => {
  const { role, AppOverview } = state
  return {
    userRole: role && role.role,
    selectedAppTab: AppOverview.selectedAppTab,
    deleteSuccessFinished: state.deleteSuccessFinished,
    mutateSuccessFinished: state.mutateSuccessFinished
  }
}

export default withLocale(
  connect(mapStateToProps, mapDispatchToProps)(ApplicationHeaderTabs)
)
