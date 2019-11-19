/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import { Notification, Loading } from 'carbon-components-react'
import { REQUEST_STATUS } from '../../../actions/index'
import { getTabs } from '../../../../lib/client/resource-helper'
import { getIncidentCount } from './utils'
import {
  updateSecondaryHeader,
  fetchResource,
  fetchIncidents,
  clearIncidents
} from '../../../actions/common'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../../actions'
import lodash from 'lodash'
import resources from '../../../../lib/shared/resources'
import { RESOURCE_TYPES } from '../../../../lib/shared/constants'
import msgs from '../../../../nls/platform.properties'
import ResourceOverview from '../ResourceOverview'
import config from '../../../../lib/shared/config'

resources(() => {
  require('./style.scss')
})

const withResource = Component => {
  const mapDispatchToProps = (dispatch, ownProps) => {
    const { resourceType, params } = ownProps
    return {
      actions: bindActionCreators(Actions, dispatch),
      fetchResource: () =>
        dispatch(fetchResource(resourceType, params.namespace, params.name)),
      fetchIncidents: () =>
        dispatch(
          fetchIncidents(
            RESOURCE_TYPES.CEM_INCIDENTS,
            params.namespace,
            params.name
          )
        ),
      clearIncidents: () =>
        dispatch(clearIncidents(RESOURCE_TYPES.CEM_INCIDENTS))
    }
  }

  const mapStateToProps = (state, ownProps) => {
    const { list: typeListName } = ownProps.resourceType,
          error = state[typeListName].err
    const { CEMIncidentList } = state
    return {
      status: state[typeListName].status,
      statusCode: error && error.response && error.response.status,
      incidentCount: getIncidentCount(CEMIncidentList)
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(
    class extends React.PureComponent {
      static displayName = 'ResourceDetailsWithResouce';
      static propTypes = {
        actions: PropTypes.object,
        clearIncidents: PropTypes.func,
        fetchIncidents: PropTypes.func,
        fetchResource: PropTypes.func,
        incidentCount: PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.string
        ]),
        params: PropTypes.object,
        status: PropTypes.string,
        statusCode: PropTypes.object
      };

      constructor(props) {
        super(props)
        this.state = {
          xhrPoll: false
        }
      }

      componentWillMount() {
        this.props.clearIncidents()
        if (parseInt(config['featureFlags:liveUpdates']) === 2) {
          var intervalId = setInterval(
            this.reload.bind(this),
            config['featureFlags:liveUpdatesPollInterval']
          )
          this.setState({ intervalId: intervalId })
        }
        // Clear the list of dropDowns
        const { params, actions } = this.props
        actions.clearAppDropDownList()
        // Then add it back so only one will be displaying
        actions.updateAppDropDownList(params.name)
      }

      componentWillUnmount() {
        clearInterval(this.state.intervalId)
      }

      reload() {
        const { status } = this.props
        let { retry = 0, showError = false } = this.state
        // if there's an error give it 3 more times before we show it
        if (status === REQUEST_STATUS.ERROR) {
          if (!showError) {
            retry++
            if (retry > 3) {
              showError = true
            }
          }
        } else {
          retry = undefined
          showError = undefined
        }
        this.setState({ xhrPoll: true, retry, showError })
        this.props.fetchResource()
        const { params } = this.props
        if (params && params.namespace && params.name) {
          this.props.fetchIncidents()
        }
      }

      render() {
        const { status, statusCode } = this.props
        const { showError = false, retry = 0 } = this.state
        if (
          status !== REQUEST_STATUS.DONE &&
          !this.state.xhrPoll &&
          retry === 0
        ) {
          return <Loading withOverlay={false} className="content-spinner" />
        }
        return (
          <React.Fragment>
            {showError && (
              <Notification
                title=""
                className="persistent"
                subtitle={msgs.get(
                  `error.${
                    statusCode === 401 || statusCode === 403
                      ? 'unauthorized'
                      : 'default'
                  }.description`,
                  this.context.locale
                )}
                kind="error"
              />
            )}
            <Component {...this.props} />
          </React.Fragment>
        )
      }
    }
  )
}

const OverviewTab = withResource(ResourceOverview)

const components = {}

class ResourceDetails extends React.Component {
  constructor(props) {
    super(props)
    this.getBreadcrumb = this.getBreadcrumb.bind(this)

    this.otherBinding = {}
    const { routes } = this.props
    this.renderOverview = this.renderOverview.bind(this)
    routes.forEach(route => {
      this.otherBinding[route] = this.renderOther.bind(this, route)
    })
  }

  componentWillMount() {
    const { updateSecondaryHeader, tabs, launch_links, match } = this.props,
          params = match && match.params
    updateSecondaryHeader(
      params.name,
      getTabs(
        tabs,
        (tab, index) => (index === 0 ? match.url : `${match.url}/${tab}`)
      ),
      this.getBreadcrumb(),
      launch_links
    )
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      const { updateSecondaryHeader, tabs, launch_links, match } = this.props,
            params = match && match.params
      updateSecondaryHeader(
        params.name,
        getTabs(
          tabs,
          (tab, index) => (index === 0 ? match.url : `${match.url}/${tab}`)
        ),
        this.getBreadcrumb(nextProps.location),
        launch_links
      )
    }
  }

  render() {
    const { match, routes } = this.props
    return (
      <Switch>
        <Route exact path={match.url} render={this.renderOverview} />
        {routes &&
          routes.map(route => (
            <Route
              key={route}
              path={`${match.url}${route}`}
              render={this.otherBinding[route]}
            />
          ))}
        <Redirect to={match.url} />
      </Switch>
    )
  }

  renderOverview() {
    const {
      match,
      resourceType,
      staticResourceData,
      selectedNodeId,
      showExpandedTopology,
      actions,
      children,
      showICAMAction
    } = this.props

    return (
      <div id="ResourceDetails">
        <OverviewTab
          resourceType={resourceType}
          params={match.params}
          staticResourceData={staticResourceData}
          actions={actions}
          modules={children}
          selectedNodeId={selectedNodeId}
          showExpandedTopology={showExpandedTopology}
          showICAMAction={showICAMAction}
        />
      </div>
    )
  }

  renderOther(route) {
    const {
      match,
      resourceType,
      staticResourceData,
      children,
      tabs
    } = this.props
    const Component = components[route]
    return (
      <Component
        resourceType={resourceType}
        params={match.params}
        tabs={tabs}
        staticResourceData={staticResourceData}
        modules={children}
      />
    )
  }

  getBreadcrumb(location) {
    const breadcrumbItems = []
    location = location || this.props.location
    const { tabs, match, resourceType } = this.props,
          { locale } = this.context,
          urlSegments = location.pathname.replace(/\/$/, '').split('/'),
          lastSegment = urlSegments[urlSegments.length - 1],
          currentTab = tabs.find(tab => tab === lastSegment)

    // The base path, calculated by the current location minus params
    let paramsLength = 0
    lodash.forOwn(match.params, value => {
      if (value) {
        paramsLength++
      }
    })

    breadcrumbItems.push({
      label: msgs.get(`tabs.${resourceType.name.toLowerCase()}`, locale),
      url: urlSegments
        .slice(0, urlSegments.length - (paramsLength + (currentTab ? 1 : 0)))
        .join('/')
    })
    breadcrumbItems.push({
      label: match.params.name,
      url: currentTab
        ? location.pathname.replace(`/${currentTab}`, '')
        : location.pathname
    })
    return breadcrumbItems
  }
}

ResourceDetails.contextTypes = {
  locale: PropTypes.string
}

ResourceDetails.propTypes = {
  actions: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  launch_links: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object,
  resourceType: PropTypes.object,
  routes: PropTypes.array,
  selectedNodeId: PropTypes.string,
  showExpandedTopology: PropTypes.bool,
  showICAMAction: PropTypes.bool,
  staticResourceData: PropTypes.object,
  tabs: PropTypes.array,
  updateSecondaryHeader: PropTypes.func
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(Actions, dispatch),
    updateSecondaryHeader: (title, tabs, breadcrumbItems, links) =>
      dispatch(updateSecondaryHeader(title, tabs, breadcrumbItems, links))
  }
}

const mapStateToProps = (state, ownProps) => {
  const { AppOverview } = state
  const { list: typeListName } = ownProps.resourceType,
        visibleResources = ownProps.getVisibleResources(state, {
          storeRoot: typeListName
        })

  const items = visibleResources.normalizedItems
  const params = (ownProps.match && ownProps.match.params) || ''

  const item_key =
    (params &&
      params.name &&
      params.namespace &&
      decodeURIComponent(params.name) +
        '-' +
        decodeURIComponent(params.namespace)) ||
    undefined

  const item = (items && item_key && items[item_key]) || undefined

  const _uid = (items && item['_uid']) || ''
  const clusterName = (items && item['cluster']) || ''
  return {
    _uid,
    clusterName,
    selectedNodeId: AppOverview.selectedNodeId,
    showExpandedTopology: AppOverview.showExpandedTopology,
    showICAMAction: AppOverview.showICAMAction
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ResourceDetails)
)
