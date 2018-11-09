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
import { Notification, Loading } from 'carbon-components-react'
import { REQUEST_STATUS } from '../../actions/index'
import { getTabs } from '../../../lib/client/resource-helper'
import { updateSecondaryHeader, fetchResource } from '../../actions/common'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import lodash from 'lodash'
import msgs from '../../../nls/platform.properties'
import ResourceOverview from './ResourceOverview'
import ResourceDesign from './ResourceDesign'
import ResourceTopology from './ResourceTopology'
import CompliancePolicyDetail from './CompliancePolicyDetail'
import config from '../../../lib/shared/config'

const withResource = (Component) => {
  const mapDispatchToProps = (dispatch, ownProps) => {
    const { resourceType, params } = ownProps
    return {
      fetchResource: () => dispatch(fetchResource(resourceType, params.namespace, params.name))
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

  return connect(mapStateToProps, mapDispatchToProps)(class extends React.PureComponent {
    static displayName = 'ResourceDetailsWithResouce'
    static propTypes = {
      fetchResource: PropTypes.func,
      status: PropTypes.string,
      statusCode: PropTypes.object,
    }

    constructor(props) {
      super(props)
      this.state = {
        xhrPoll: false,
      }
    }

    componentWillMount() {
      if (parseInt(config['featureFlags:liveUpdates']) === 2) {
        var intervalId = setInterval(this.reload.bind(this), config['featureFlags:liveUpdatesPollInterval'])
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
        return <Notification
          title=''
          className='persistent'
          subtitle={msgs.get(`error.${(statusCode === 401 || statusCode === 403) ? 'unauthorized' : 'default'}.description`, this.context.locale)}
          kind='error' />
      } else if (status !== REQUEST_STATUS.DONE && !this.state.xhrPoll) {
        return <Loading className='resource-detail-content-spinner' />
      }
      return <Component  {...this.props} />
    }
  })
}

const OverviewTab = withResource(ResourceOverview)

const components = {
  '/design': ResourceDesign,
  '/topology': ResourceTopology,
  '/policies': ResourceOverview,
  '/compliancePolicy/:policyName/:policyNamespace': CompliancePolicyDetail,
}

class ResourceDetails extends React.PureComponent {

  constructor(props) {
    super(props)
    this.getBreadcrumb = this.getBreadcrumb.bind(this)

    this.otherBinding = {}
    const { routes } = this.props
    this.renderOverview = this.renderOverview.bind(this)
    routes.forEach(route=>{
      this.otherBinding[route] = this.renderOther.bind(this, route)
    })
  }

  componentWillMount() {
    const { updateSecondaryHeader, tabs, launch_links, match } = this.props, params = match && match.params
    updateSecondaryHeader(params.name, getTabs(tabs, (tab, index) => index === 0 ? match.url : `${match.url}/${tab}`), this.getBreadcrumb(), launch_links)
  }

  render() {
    const { match, routes } = this.props
    return (
      <Switch>
        <Route exact path={match.url} render={this.renderOverview} />
        {routes && routes.map((route) =>
          <Route key={route} path={`${match.url}${route}`} render={this.otherBinding[route]} />
        )}
        <Redirect to={match.url} />
      </Switch>
    )
  }

  renderOverview() {
    const { match, resourceType, staticResourceData, children } = this.props
    return (
      <div>
        <OverviewTab
          resourceType={resourceType}
          params={match.params}
          staticResourceData={staticResourceData}
          modules={children}
        />
      </div>
    )
  }

  renderOther(route) {
    const { match, resourceType, staticResourceData, children, tabs } = this.props
    const Component = components[route]
    return (
      <Component
        resourceType={resourceType}
        params={match.params}
        tabs={tabs}
        staticResourceData={staticResourceData}
        modules={children} />
    )
  }

  getBreadcrumb() {
    const breadcrumbItems = []
    const { tabs, match, location, resourceType } = this.props,
          { locale } = this.context,
          urlSegments = location.pathname.split('/'),
          lastSegment = urlSegments[urlSegments.length - 1],
          currentTab = tabs.find(tab => tab === lastSegment)

    // The base path, calculated by the current location minus params
    let paramsLength = 0
    lodash.forOwn(match.params, (value) => {
      if (value) {
        paramsLength++
      }
    })

    breadcrumbItems.push({
      label: msgs.get(`tabs.${resourceType.name.toLowerCase()}`, locale),
      url: urlSegments.slice(0, (urlSegments.length - (paramsLength + (currentTab ? 1 : 0)))).join('/')
    })
    breadcrumbItems.push({
      label: match.params.name,
      url: currentTab ? location.pathname.replace(`/${currentTab}`, '') : location.pathname
    })
    return breadcrumbItems
  }
}

ResourceDetails.contextTypes = {
  locale: PropTypes.string
}

ResourceDetails.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  launch_links: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object,
  resourceType: PropTypes.object,
  routes: PropTypes.array,
  staticResourceData: PropTypes.object,
  tabs: PropTypes.array,
  updateSecondaryHeader: PropTypes.func,
}

const mapDispatchToProps = dispatch => {
  return {
    updateSecondaryHeader: (title, tabs, breadcrumbItems, links) => dispatch(updateSecondaryHeader(title, tabs, breadcrumbItems, links))
  }
}

export default withRouter(connect(() => ({}), mapDispatchToProps)(ResourceDetails))
