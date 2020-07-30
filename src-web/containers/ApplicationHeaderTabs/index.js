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
import { updateSecondaryHeader ,
  delResourceSuccessFinished,
  mutateResourceSuccessFinished
} from '../../actions/common'
import { Tabs, Tab } from 'carbon-components-react'
import msgs from '../../../nls/platform.properties'
import { withLocale } from '../../providers/LocaleProvider'
import resources from '../../../lib/shared/resources'
import _ from 'lodash'

import { RESOURCE_TYPES } from '../../../lib/shared/constants'

resources(() => {
  require('./style.scss')
})

export const ApplicationsTab = loadable(() =>
  import(/* webpackChunkName: "applications" */ '../ApplicationsTab')
)

export const ApplicationDeploymentPipeline = loadable(() =>
  import(/* webpackChunkName: "applicationdeploymentpipeline" */ '../../components/ApplicationDeploymentPipeline')
)

const routes = ['', 'pipeline', 'yaml']
// This will render the two tabs
// Overview, Resources
const ApplicationHeaderTabs = withLocale(
  ({
    params,
    locale,
    serverProps,
    mutateSuccessFinished,
    deleteSuccessFinished,
    updateBreadcrumbs
  }) => {

    // process restful api into which tab to show
    const {history, location} = params
    const pathname = _.get(location, 'pathname', '')
    const segments = pathname.split('/')
    const isSingleApplicationView = segments.length>=5
    let route = ''
    if (segments.length===4 || segments.length===6) {
      route = segments.pop()
    }
    const basePath = segments.join('/')
    const selectedTab = routes.indexOf(route)
    const selectedAppName = isSingleApplicationView ? segments.pop() : null
    const selectedAppNamespace = isSingleApplicationView ? segments.pop() : null
    const selectedApp = {
      isSingleApplicationView,
      selectedAppName,
      selectedAppNamespace
    }

    // update breadcrumbs
    const breadcrumbItems = []
    breadcrumbItems.push({
      label: 'Applications',
      url: segments.join('/')
    })
    if (isSingleApplicationView) {
      breadcrumbItems.push({
        label: selectedAppName,
        url: [...segments, selectedAppNamespace, selectedAppName].join('/')
      })
    }
    updateBreadcrumbs(breadcrumbItems)

    const noop = () => {
      // no op function for optional properties
    }

    const renderTab = thisTab => {
      if (selectedTab === thisTab) {
        switch (thisTab) {
        default:
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
              <ApplicationDeploymentPipeline serverProps={serverProps} selectedApp={selectedApp} />
            </div>
          )
        case 2:
          return (
            <div className="page-content-container">
              <ApplicationDeploymentPipeline serverProps={serverProps} selectedApp={selectedApp} />
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
            onClick={noop}
            onKeyDown={noop}
            selected={selectedTab}
            onSelectionChange={id => {
              // Remove previous success message if any
              mutateSuccessFinished(RESOURCE_TYPES.HCM_CHANNELS)
              mutateSuccessFinished(RESOURCE_TYPES.HCM_SUBSCRIPTIONS)
              mutateSuccessFinished(RESOURCE_TYPES.HCM_PLACEMENT_RULES)
              mutateSuccessFinished(RESOURCE_TYPES.QUERY_APPLICATIONS)
              deleteSuccessFinished(RESOURCE_TYPES.HCM_CHANNELS)
              deleteSuccessFinished(RESOURCE_TYPES.HCM_SUBSCRIPTIONS)
              deleteSuccessFinished(RESOURCE_TYPES.HCM_PLACEMENT_RULES)
              deleteSuccessFinished(RESOURCE_TYPES.QUERY_APPLICATIONS)
              // open the tab
              const route = id>0 ? `${routes[id]}`:''
              history.push(`${basePath}/${route}`)
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
            {isSingleApplicationView&&<Tab
              disabled={false}
              onClick={noop}
              onKeyDown={noop}
              label={msgs.get('description.title.yaml', locale)}
          >
              {renderTab(2)}
            </Tab>}
          </Tabs>
        </div>
      </div>
    )
  }
)

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(Actions, dispatch),
    mutateSuccessFinished: resourceType =>
      dispatch(mutateResourceSuccessFinished(resourceType)),
    deleteSuccessFinished: resourceType =>
      dispatch(delResourceSuccessFinished(resourceType)),
    updateBreadcrumbs: (breadcrumbItems) =>
      dispatch(updateSecondaryHeader('', [], breadcrumbItems))
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
