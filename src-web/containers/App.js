/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import { compose, setDisplayName } from 'recompose'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import SecondaryHeader from '../components/SecondaryHeader'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { withLocale } from '../providers/LocaleProvider'
import resources from '../../lib/shared/resources'
import client from '../../lib/shared/client'
import loadable from 'loadable-components'
import config from '../../lib/shared/config'
import Modal from '../components/common/Modal'

export const ActionModalApollo = loadable(() =>
  import(/* webpackChunkName: "actionModalApollo" */ '../components/common-apollo/ActionModalApollo')
)

export const ApplicationsTab = loadable(() =>
  import(/* webpackChunkName: "applications" */ './ApplicationsTab')
)

export const ApplicationCreationPage = loadable(() =>
  import(/* webpackChunkName: "applicationcreatepage" */ '../components/ApplicationCreationPage/ApplicationCreationPage')
)

export const ApplicationDeploymentPipeline = loadable(() =>
  import(/* webpackChunkName: "applicationdeploymentpipeline" */ '../components/ApplicationDeploymentPipeline')
)

resources(() => {
  require('../../scss/common.scss')
})

class App extends React.Component {
  constructor(props) {
    super(props)
    if (client) {
      try {
        this.serverProps = JSON.parse(
          document.getElementById('propshcm').textContent
        )
      } catch (e) {
        this.serverProps = null
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

  render() {
    const serverProps = this.getServerProps()
    const { locale, match } = this.props

    const BASE_PAGE_PATH = match.url.replace(/\/$/, '')
    const tabs = [
      {
        id: 'overview',
        label: 'description.title.overview',
        url: BASE_PAGE_PATH
      },
      {
        id: 'advanced',
        label: 'description.title.advancedConfiguration',
        url: `${BASE_PAGE_PATH}/advanced`
      }
    ]

    return (
      <div className="expand-vertically">
        <SecondaryHeader />
        <Switch>
          <Route
            path={`${match.url}/advanced`}
            exact
            render={params => (
              <div className="page-content-container">
                <ApplicationDeploymentPipeline
                  params={params}
                  serverProps={serverProps}
                  secondaryHeaderProps={{ title: 'routes.applications', tabs }}
                  locale={locale}
                />
              </div>
            )}
          />
          <Route
            path={`${match.url}/create`}
            exact
            render={params => (
              <ApplicationCreationPage
                params={params}
                serverProps={this.getServerProps()}
                secondaryHeaderProps={{ title: 'application.create.title' }}
              />
            )}
          />
          <Route
            path={`${match.url}/:namespace/:name/yaml`}
            exact
            render={params => (
              <ApplicationCreationPage
                params={params}
                serverProps={this.getServerProps()}
                secondaryHeaderProps={{ title: 'application.create.title' }}
              />
            )}
          />
          <Route
            path={`${match.url}`}
            render={params => (
              <ApplicationsTab
                params={params}
                serverProps={this.getServerProps()}
                secondaryHeaderProps={{ title: 'routes.applications', tabs }}
              />
            )}
          />
          <Redirect to={`${config.contextPath}/welcome`} />
        </Switch>
        <Modal locale={serverProps.context.locale} />
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

App.propTypes = {
  locale: PropTypes.object,
  match: PropTypes.object,
  serverProps: PropTypes.object,
  staticContext: PropTypes.object
}

App.childContextTypes = {
  locale: PropTypes.string
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

const Container = Component =>
  withRouter(withLocale(connect(mapStateToProps)(Component)))
const AppContainer = Container(App)

export default compose(setDisplayName('AppComponent'))(props => (
  <div className="expand-vertically">
    <Route
      path={config.contextPath}
      serverProps={props}
      render={() => <AppContainer {...props} />}
    />
  </div>
))
