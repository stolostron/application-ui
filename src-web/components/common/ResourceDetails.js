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
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import { Notification, Loading, Link } from 'carbon-components-react'
import { REQUEST_STATUS } from '../../actions/index'
import { getTabs } from '../../../lib/client/resource-helper'
import { updateSecondaryHeader, fetchResource } from '../../actions/common'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../actions'
import lodash from 'lodash'
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'
import ResourceOverview from './ResourceOverview'
import config from '../../../lib/shared/config'

resources(() => {
  require('../../../scss/resource-details.scss')
})

const withResource = Component => {
  const mapDispatchToProps = (dispatch, ownProps) => {
    const { resourceType, params } = ownProps
    return {
      fetchResource: () =>
        dispatch(fetchResource(resourceType, params.namespace, params.name))
    }
  }

  const mapStateToProps = (state, ownProps) => {
    const { list: typeListName } = ownProps.resourceType,
          error = state[typeListName].err
    return {
      status: state[typeListName].status,
      statusCode: error && error.response && error.response.status
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(
    class extends React.PureComponent {
      static displayName = 'ResourceDetailsWithResouce';
      static propTypes = {
        fetchResource: PropTypes.func,
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
        if (parseInt(config['featureFlags:liveUpdates']) === 2) {
          var intervalId = setInterval(
            this.reload.bind(this),
            config['featureFlags:liveUpdatesPollInterval']
          )
          this.setState({ intervalId: intervalId })
        }
        this.props.fetchResource()
      }

      componentWillUnmount() {
        clearInterval(this.state.intervalId)
      }

      reload() {
        if (this.props.status === REQUEST_STATUS.DONE) {
          this.setState({ xhrPoll: true })
          this.props.fetchResource()
        }
      }

      render() {
        const { status, statusCode } = this.props
        if (status === REQUEST_STATUS.ERROR) {
          return (
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
          )
        } else if (status !== REQUEST_STATUS.DONE && !this.state.xhrPoll) {
          return <Loading withOverlay={false} className="content-spinner" />
        }
        return <Component {...this.props} />
      }
    }
  )
}

const OverviewTab = withResource(ResourceOverview)

const components = {
}

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
      showAppDetails,
      actions,
      children
    } = this.props
    return (
      <div id="ResourceDetails">
        <div className="app-information-link">
          <Link
            href="#"
            onClick={() => {
              actions.setShowAppDetails(!showAppDetails)
            }}
          >
            {!showAppDetails
              ? msgs.get('application.show.information', this.context.locale)
              : msgs.get('application.show.overview', this.context.locale)}
          </Link>
        </div>
        <OverviewTab
          resourceType={resourceType}
          params={match.params}
          staticResourceData={staticResourceData}
          modules={children}
          showAppDetails={showAppDetails}
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
  showAppDetails: PropTypes.bool,
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

const mapStateToProps = state => {
  const { AppOverview } = state
  return {
    showAppDetails: AppOverview.showAppDetails
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ResourceDetails)
)
