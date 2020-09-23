/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import { Notification } from 'carbon-components-react'
import { updateSecondaryHeader } from '../../../actions/common'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../../actions'
import resources from '../../../../lib/shared/resources'
import msgs from '../../../../nls/platform.properties'
import ResourceOverview from '../ResourceOverview'
import {
  startPolling,
  stopPolling,
  handleRefreshPropertiesChanged,
  handleVisibilityChanged
} from '../../../shared/utils/refetch'
import { loadingComponent } from '../ResourceOverview/utils'
import { canCallAction } from '../../../../lib/client/access-helper'
import _ from 'lodash'

resources(() => {
  require('./style.scss')
})

const withResource = Component => {
  const mapDispatchToProps = dispatch => {
    return {
      actions: bindActionCreators(Actions, dispatch)
    }
  }

  const mapStateToProps = (state, ownProps) => {
    const { list: typeListName } = ownProps.resourceType,
          error = state[typeListName].err
    const { refetch } = state
    return {
      status: state[typeListName].status,
      statusCode: error && error.response && error.response.status,
      refetch
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(
    class extends React.PureComponent {
      static displayName = 'ResourceDetailsWithResouce';
      static propTypes = {
        actions: PropTypes.object,
        params: PropTypes.object,
        refetch: PropTypes.object,
        status: PropTypes.string,
        statusCode: PropTypes.object
      };

      constructor(props) {
        super(props)
        this.state = {
          xhrPoll: false,
          errors: undefined
        }
      }

      componentDidMount() {
        // Clear the list of dropDowns
        const { params, actions } = this.props
        actions.clearAppDropDownList()
        // Then add it back so only one will be displaying
        actions.updateAppDropDownList(params.name)
        this.reload()

        document.addEventListener('visibilitychange', this.onVisibilityChange)
        startPolling(this, setInterval)
      }

      componentWillUnmount() {
        stopPolling(this.state, clearInterval)
        document.removeEventListener(
          'visibilitychange',
          this.onVisibilityChange
        )
      }

      onVisibilityChange = () => {
        handleVisibilityChanged(this, clearInterval, setInterval)
      };

      componentDidUpdate(prevProps) {
        handleRefreshPropertiesChanged(
          prevProps,
          this,
          clearInterval,
          setInterval
        )
      }

      componentWillMount() {
        const { params } = this.props
        canCallAction('view', params.namespace).then(response => {
          const allowed = _.get(response, 'data.userAccess.allowed')
          this.setState({
            errors: allowed,
            showError: allowed == false ? true : false
          })
        })
      }

      reload() {
        const { status } = this.props
        let { retry = 0, showError = false } = this.state
        // if there's an error give it 3 more times before we show it
        if (status === Actions.REQUEST_STATUS.ERROR) {
          if (!showError) {
            retry++
            if (retry > 3) {
              showError = true
            }
          }
        } else {
          retry = null
          showError = null
        }
        this.setState({ xhrPoll: true, retry, showError })
      }

      render() {
        const { status } = this.props
        const { showError = false, retry = 0 } = this.state
        if (
          status !== Actions.REQUEST_STATUS.DONE &&
          !this.state.xhrPoll &&
          retry === 0
        ) {
          return loadingComponent()
        }

        return (
          <React.Fragment>
            {showError && (
              <Notification
                title=""
                className="persistent"
                subtitle={msgs.get(
                  `error.${
                    this.state.errors == false ? 'unauthorized' : 'default'
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
    const {
            updateSecondaryHeaderFn,
            tabs,
            launch_links,
            mainButton,
            match
          } = this.props,
          params = match && match.params
    updateSecondaryHeaderFn(
      params.name,
      tabs,
      this.getBreadcrumb(),
      launch_links,
      mainButton
    )
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      const { updateSecondaryHeaderFn, tabs, launch_links, match } = this.props,
            params = match && match.params

      updateSecondaryHeaderFn(
        params.name,
        tabs,
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
      children
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
    location = location || this.props.location
    const { resourceType } = this.props,
          { locale } = this.context,
          urlSegments = location.pathname.replace(/\/$/, '').split('/')

    return [
      {
        label: msgs.get(`tabs.${resourceType.name.toLowerCase()}`, locale),
        url: urlSegments.slice(0, Math.min(3, urlSegments.length)).join('/')
      }
    ]
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
  mainButton: PropTypes.object,
  match: PropTypes.object,
  resourceType: PropTypes.object,
  routes: PropTypes.array,
  selectedNodeId: PropTypes.string,
  showExpandedTopology: PropTypes.bool,
  staticResourceData: PropTypes.object,
  tabs: PropTypes.array,
  updateSecondaryHeaderFn: PropTypes.func
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(Actions, dispatch),
    updateSecondaryHeaderFn: (
      title,
      tabs,
      breadcrumbItems,
      links,
      mainButton
    ) =>
      dispatch(
        updateSecondaryHeader(
          title,
          tabs,
          breadcrumbItems,
          links,
          null,
          null,
          mainButton
        )
      )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { AppOverview } = state
  const { list: typeListName } = ownProps.resourceType,
        visibleResources = ownProps.getVisibleResources(state, {
          storeRoot: typeListName
        })

  const items = visibleResources.normalizedItems
  let params = {}
  if (ownProps.params) {
    params = ownProps.params
  } else {
    params = (ownProps.match && ownProps.match.params) || {}
  }
  const itemKey =
    (params &&
      params.name &&
      params.namespace &&
      decodeURIComponent(params.name) +
        '-' +
        decodeURIComponent(params.namespace)) ||
    undefined
  const item = (items && itemKey && items[itemKey]) || undefined
  const _uid = (item && item['_uid']) || ''
  const clusterName = (item && item['cluster']) || ''
  return {
    _uid,
    clusterName,
    selectedNodeId: AppOverview.selectedNodeId,
    showExpandedTopology: AppOverview.showExpandedTopology,
    params: params
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ResourceDetails)
)
