/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

// seems to be an issue with this rule and redux
/* eslint-disable import/no-named-as-default, react/display-name */
import R from 'ramda'

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import SecondaryHeader from '../components/SecondaryHeader'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import resources from '../../lib/shared/resources'
import client from '../../lib/shared/client'
import loadable from 'loadable-components'
import config from '../../lib/shared/config'
import Modal from '../components/common/Modal'
import * as Actions from '../actions'

export const ActionModalApollo = loadable(() =>
  import(/* webpackChunkName: "actionModalApollo" */ '../components/common-apollo/ActionModalApollo')
)
export const ApplicationHeaderTabs = loadable(() =>
  import(/* webpackChunkName: "applicationHeaderTabs" */ './ApplicationHeaderTabs')
)

resources(() => {
  require('../../scss/common.scss')
})

class App extends React.Component {
  /* FIXME: Please fix disabled eslint rules when making changes to this file. */
  /* eslint-disable react/prop-types, react/jsx-no-bind */

  constructor(props) {
    super(props)
    if (client) {
      try {
        this.serverProps = JSON.parse(
          document.getElementById('propshcm').textContent
        )
      } catch (e) {
        this.serverProps = undefined
      }
    }
  }

  getChildContext() {
    return {
      locale: this.getServerProps().context.locale
    }
  }

  getServerProps() {
    if (client && this.serverProps) {
      return this.serverProps
    }
    if (this.props.serverProps) {
      return this.props.serverProps
    }
    return this.props.staticContext
  }

  componentDidMount() {
    const { actions } = this.props
    const serverProps = this.getServerProps()

    actions.setEnableICAMAction(serverProps && serverProps.isICAMRunning)
    actions.setEnableGrafanaAction(serverProps && serverProps.isGrafanaRunning)
    actions.setEnableCEMAction(serverProps && serverProps.isCEMRunning)
  }

  render() {
    const serverProps = this.getServerProps()
    const { match, location, activeAccountId } = this.props
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
                serverProps={this.getServerProps()}
              />
            )}
          />
          <Redirect to={`${config.contextPath}/welcome`} />
        </Switch>
        <Modal locale={serverProps.context.locale} />
        <ActionModalApollo
          locale={serverProps.context.locale}
          activeAccountId={activeAccountId}
        />
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

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

const mapStateToProps = state => {
  const userInfoList = state.userInfoList

  const activeAccountId = R.pathOr(
    '',
    ['items', 'activeAccountId'],
    userInfoList
  )
  return {
    user: state.user,
    activeAccountId: activeAccountId
  }
}

const Container = Component =>
  withRouter(connect(mapStateToProps, mapDispatchToProps)(Component))
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
