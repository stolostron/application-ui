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

export const ApplicationsListPage = loadable(() =>
  import(/* webpackChunkName: "applicationsListPage" */ '../components/ApplicationsListPage')
)

export const ApplicationDetailsPage = loadable(() =>
  import(/* webpackChunkName: "applicationDetailsPage" */ '../components/ApplicationDetailsPage')
)

export const ApplicationCreationPage = loadable(() =>
  import(/* webpackChunkName: "applicationCreatePage" */ '../components/ApplicationCreationPage/ApplicationCreationPage')
)

export const AdvancedConfigurationPage = loadable(() =>
  import(/* webpackChunkName: "advancedConfigurationPage" */ '../components/AdvancedConfigurationPage')
)

export const CreateApplicationButton = loadable(() =>
  import(/* webpackChunkName: "createApplicationButton" */ '../components/common/CreateApplicationButton')
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
    const allApplicationsTabs = [
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

    const createApplicationButton = <CreateApplicationButton key="create" />

    const getSingleApplicationBasePath = params => {
      return `${BASE_PAGE_PATH}/${params.namespace}/${params.name}`
    }

    const getSingleApplicationTabs = params => {
      const SINGLE_APP_BASE_PAGE_PATH = getSingleApplicationBasePath(params)
      return [
        {
          id: 'overview',
          label: 'description.title.overview',
          url: SINGLE_APP_BASE_PAGE_PATH
        },
        {
          id: 'editor',
          label: 'description.title.editor',
          url: `${SINGLE_APP_BASE_PAGE_PATH}/edit`
        }
      ]
    }

    const applicationsTitle = 'routes.applications'

    return (
      <div className="expand-vertically">
        <SecondaryHeader />
        <Switch>
          <Route
            exact
            path={`${BASE_PAGE_PATH}`}
            render={params => (
              <ApplicationsListPage
                params={params}
                serverProps={this.getServerProps()}
                secondaryHeaderProps={{
                  title: applicationsTitle,
                  tabs: allApplicationsTabs,
                  mainButton: createApplicationButton
                }}
              />
            )}
          />
          <Route
            exact
            path={`${BASE_PAGE_PATH}/advanced`}
            render={params => (
              <div className="page-content-container">
                <AdvancedConfigurationPage
                  params={params}
                  serverProps={serverProps}
                  secondaryHeaderProps={{
                    title: applicationsTitle,
                    tabs: allApplicationsTabs,
                    mainButton: createApplicationButton
                  }}
                  locale={locale}
                />
              </div>
            )}
          />
          <Route
            exact
            path={`${BASE_PAGE_PATH}/create`}
            render={params => (
              <ApplicationCreationPage
                params={params}
                serverProps={this.getServerProps()}
                secondaryHeaderProps={{ title: 'application.create.title' }}
              />
            )}
          />
          <Route
            exact
            path={`${BASE_PAGE_PATH}/:namespace/:name`}
            render={params => (
              <ApplicationDetailsPage
                params={params}
                serverProps={this.getServerProps()}
                secondaryHeaderProps={{
                  title: applicationsTitle,
                  tabs: getSingleApplicationTabs(params.match.params)
                }}
              />
            )}
          />
          <Route
            exact
            path={`${BASE_PAGE_PATH}/:namespace/:name/edit`}
            render={params => (
              <ApplicationCreationPage
                params={params}
                serverProps={this.getServerProps()}
                secondaryHeaderProps={{
                  title: 'application.create.title',
                  tabs: getSingleApplicationTabs(params.match.params)
                }}
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

const AppComponent = props => (
  <div className="expand-vertically">
    <Route
      path={config.contextPath}
      serverProps={props}
      render={() => <AppContainer {...props} />}
    />
  </div>
)
AppComponent.displayName = 'AppComponent'
export default AppComponent
