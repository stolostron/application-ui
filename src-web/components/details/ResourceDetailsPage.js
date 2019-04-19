/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'
import { GET_RESOURCE } from '../../apollo-client/queries/SearchQueries'
import { updateSecondaryHeader } from '../../actions/common'
import { getTabs } from '../../../lib/client/resource-helper'
import Page from '../common/Page'
import _ from 'lodash'

// import OverviewTab from './OverviewTab'
import YAMLTab from './YAMLTab'
// import EventsTab from './EventsTab'
import LogsTab from './LogsTab'


resources(() => {
  require('../../../scss/resource-details-page.scss')
})

const ResourceDetailsPage = props =>
  <Page>
    <div className='resource-details-page'>
      <Switch>
        <Route exact path={props.basePath} render={() => <YAMLTab {...props} />} />
        {/* <Route exact path={props.basePath} render={() => <OverviewTab {...this.props} />} />
        <Route path={`${props.basePath}/yaml`} render={() => <YAMLTab {...this.props} />} />
        <Route path={`${props.basePath}/events`} render={() => <EventsTab {...this.props} />} /> */}
        <Route path={`${props.basePath}/logs`} render={() => <LogsTab {...props} /> } />
      </Switch>
    </div>
  </Page>

ResourceDetailsPage.propTypes = {
  basePath: PropTypes.string
}

const withResourceDetails = Component => {

  const mapDispatchToProps = dispatch => {
    return {
      updateSecondaryHeader: (title, tabs, breadcrumbItems) => dispatch(updateSecondaryHeader(title, tabs, breadcrumbItems))
    }
  }

  // eslint-disable-next-line react/display-name
  return withRouter(connect(null, mapDispatchToProps)(class extends React.Component {

    static propTypes = {
      cluster: PropTypes.string,
      location: PropTypes.object,
      match: PropTypes.object,
      updateSecondaryHeader: PropTypes.func
    }

    constructor(props) {
      super(props)
      this.resourceTabs = ['overview'] // Remove when resources with pod info is supported
      this.podTabs = ['overview', 'logs'] // Remove when resources with pod info is supported
      this.tabs = ['overview', 'yaml', 'events', 'logs']
      // this.tabsWithoutPods = ['overview', 'yaml']
      this.podResources = ['daemonsets', 'deployments', 'jobs', 'nodes', 'replicasets', 'statefulsets']
    }

    componentDidMount() {
      this.handleSecondaryHeaderUpdate()
    }

    handleSecondaryHeaderUpdate() {
      const { updateSecondaryHeader, location } = this.props
      const segments = location.pathname.split('/')
      const title = this.tabs.includes(segments[segments.length - 1]) ? segments[segments.length - 2] : segments[segments.length - 1]
      const basePath = this.createBasePath()
      const baseSegments = basePath.split('/')
      const kind = baseSegments[baseSegments.length - 2]
      // const hasPods = podResources.includes(kind)
      // const tabs = getTabs(hasPods ? this.tabs : this.tabsWithoutPods, (tab, index) => index === 0 ? basePath : `${basePath}/${tab}`)
      const tabs = getTabs(kind === 'pods' ? this.podTabs : this.resourceTabs, (tab, index) => index === 0 ? basePath : `${basePath}/${tab}`)
      const breadcrumb = [{ label: msgs.get('search.label', this.context.locale), url: `/multicloud/search${_.get(location, 'state.search', '')}` }]
      updateSecondaryHeader(title, tabs, breadcrumb)
    }

    getResourceData() {
      const { cluster } = this.props.match.params
      const basePath = this.createBasePath()
      const baseSegments = basePath.split('/')
      const selfLink = '/' + baseSegments.slice(baseSegments.indexOf(cluster) + 1).join('/')
      const linkSegments = selfLink.split('/')
      const name = baseSegments[baseSegments.length - 1]
      const kind = baseSegments[baseSegments.length - 2]
      const isNamespaced = baseSegments[baseSegments.length - 4] === 'namespaces'
      const namespace = isNamespaced ? baseSegments[baseSegments.length - 3] : undefined
      const api = isNamespaced ? linkSegments.slice(0, linkSegments.indexOf('namespaces')).join('/') : linkSegments.slice(0, linkSegments.indexOf(kind)).join('/')
      const hasPods = this.podResources.includes(kind)
      return { cluster, selfLink, api, isNamespaced, namespace, kind, name, hasPods }
    }

    createBasePath() {
      const { location } = this.props
      const segments = location.pathname.split('/')
      this.tabs.find(tab => tab === segments[segments.length - 1]) && segments.pop() // remove the tab path if present
      const basePath = segments.join('/')
      return basePath
    }

    render() {
      const basePath = this.createBasePath()
      const resourceData = this.getResourceData()
      const { selfLink, namespace, kind, name, cluster } = resourceData

      return (
        <Query query={GET_RESOURCE} variables={{ selfLink, namespace, kind, name, cluster }}>
          {({ data, loading }) => <Component {...this.props} {...resourceData} resourceJson={data.getResource || {}} resourceLoading={loading} basePath={basePath} />}
        </Query>
      )
    }
  }))
}

export default withResourceDetails(ResourceDetailsPage)
