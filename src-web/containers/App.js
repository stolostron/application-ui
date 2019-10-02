/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

// seems to be an issue with this rule and redux
/* eslint-disable import/no-named-as-default, react/display-name */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import SecondaryHeader from '../components/SecondaryHeader'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import resources from '../../lib/shared/resources'
import client from '../../lib/shared/client'
import loadable from 'loadable-components'
import config from '../../lib/shared/config'
import Modal from '../components/common/Modal'
// import ApplicationHeaderTabs from './ApplicationHeaderTabs';
// import ApplicationDeployableDetails from './ApplicationDeployableDetails';

export const ModalApollo = loadable(() =>
  import(/* webpackChunkName: "modalApollo" */ '../components/common-apollo/ModalApollo')
)
export const ActionModalApollo = loadable(() =>
  import(/* webpackChunkName: "actionModalApollo" */ '../components/common-apollo/ActionModalApollo')
)
export const ApplicationHeaderTabs = loadable(() =>
  import(/* webpackChunkName: "applicationHeaderTabs" */ './ApplicationHeaderTabs')
)
export const ApplicationDeployableDetails = loadable(() =>
  import(/* webpackChunkName: "applicationDeployableDetails" */ './ApplicationDeployableDetails')
)

resources(() => {
  require('../../scss/common.scss')
})

/* global analytics: true */
class App extends React.Component {
  /* FIXME: Please fix disabled eslint rules when making changes to this file. */
  /* eslint-disable react/prop-types, react/jsx-no-bind */

  constructor(props) {
    super(props)

    if (client) {
      this.serverProps = JSON.parse(
        document.getElementById('propshcm').textContent
      )
    }
  }

  getChildContext() {
    return {
      locale: this.getServerProps().context.locale
    }
  }

  getServerProps() {
    if (client) return this.serverProps
    return this.props.staticContext
  }

  componentDidUpdate(prevProps) {
    const hashedUserId = `IBMid-${this.props.user}`
    const clusterUrl =
      typeof window !== 'undefined' ? window.location.host : null

    if (config['featureFlags:enableSegment']) {
      // segment data collection on every page load
      if (
        this.props.history.location.pathname !== prevProps.location.pathname
      ) {
        this.segmentTrackEvent(
          hashedUserId,
          this.props.history.location.pathname,
          clusterUrl
        )
      }
    }
  }

  componentDidMount() {
    // If segment is enabled then send data to segment
    // Hash userName, get current page url and cluster url
    const hashedUserId = `IBMid-${this.props.user}`
    const currentPage = this.props.location.pathname
    const clusterUrl =
      typeof window !== 'undefined' ? window.location.host : null

    if (config['featureFlags:enableSegment']) {
      // segment data collection on every page load
      this.segmentDataCollection(hashedUserId, currentPage, clusterUrl)
      this.segmentTrackEvent(hashedUserId, currentPage, clusterUrl)
    }

    if (config['featureFlags:enableAppcues']) {
      this.appcuesDataCollection(this.props.user)
    }
  }

  segmentTrackEvent(hashedUserId, currentPage, clusterUrl) {
    analytics.track('ICP Unicorn Page Load', {
      userId: hashedUserId,
      clusterUrl: clusterUrl,
      pageUrl: currentPage
    })
  }

  segmentDataCollection(hashedUserId, currentPage, clusterUrl) {
    if (
      typeof hashedUserId != 'undefined' &&
      typeof currentPage != 'undefined' &&
      typeof clusterUrl != 'undefined'
    ) {
      analytics.identify(hashedUserId, {
        clusterUrl: clusterUrl,
        pageUrl: currentPage
      })
    }
  }

  appcuesDataCollection(userId, currentPage, clusterUrl) {
    if (userId) {
      window.Appcues.identify(`IBMid-${userId}`, {
        clusterUrl: clusterUrl,
        pageUrl: currentPage
      })
    }
  }

  render() {
    const serverProps = this.getServerProps()
    const { match, location } = this.props
    const showSecondaryHeader =
      location.pathname &&
      !location.pathname.startsWith('/multicloud/welcome') &&
      !location.pathname.startsWith('/multicloud/overview') &&
      !location.pathname.startsWith('/multicloud/search')
    const showExtraTabs =
      location.pathname &&
      location.pathname.startsWith('/multicloud/applications/') &&
      location.pathname.split('/').length === 5

    return (
      <div className="expand-vertically">
        {showSecondaryHeader && <SecondaryHeader />}
        <Switch>
          <Route
            path={`${match.url}`}
            render={params => (
              <ApplicationHeaderTabs
                params={params}
                showExtraTabs={showExtraTabs}
              />
            )}
          />
          <Redirect to={`${config.contextPath}/welcome`} />
        </Switch>
        <Modal locale={serverProps.context.locale} />
        <ModalApollo locale={serverProps.context.locale} />
        <ActionModalApollo locale={serverProps.context.locale} />
        <input
          type="hidden"
          id="app-access"
          style={{ display: 'none' }}
          value={serverProps.xsrfToken.toString('base64')}
        />
      </div>
    )
  }
}

App.childContextTypes = {
  locale: PropTypes.string
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

const Container = Component => withRouter(connect(mapStateToProps)(Component))
const AppContainer = Container(App)

export default props => (
  <div className="expand-vertically">
    <Route
      path={config.contextPath}
      serverProps={props}
      render={() => <AppContainer {...props} />}
    />
  </div>
)
