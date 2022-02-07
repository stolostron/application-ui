/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

// seems to be an issue with this rule and redux
/* eslint-disable import/no-named-as-default */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { AcmHeader, AcmPage, AcmRoute } from '@stolostron/ui-components'
import queryString from 'query-string'
import SecondaryHeader from '../components/SecondaryHeader'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { withLocale } from '../providers/LocaleProvider'
import resources from '../../lib/shared/resources'
import client from '../../lib/shared/client'
import loadable from '@loadable/component'
import config from '../../lib/shared/config'
import _ from 'lodash'

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

export const ArgoCreationPage = loadable(() =>
  import(/* webpackChunkName: "ArgoCreationPage" */ '../components/ArgoCreationPage/ArgoCreationPage')
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
    const { locale, location, match } = this.props

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

    const getSingleApplicationBasePath = params => {
      return `${BASE_PAGE_PATH}/${params.namespace}/${params.name}`
    }

    const getSingleApplicationTabs = params => {
      const searchParams = queryString.parse(_.get(location, 'search'))
      const { apiVersion, applicationset, cluster } = searchParams
      const SINGLE_APP_BASE_PAGE_PATH = getSingleApplicationBasePath(params)
      const overviewTab = [
        {
          id: 'overview',
          label: 'description.title.overview',
          url: SINGLE_APP_BASE_PAGE_PATH
        }
      ]
      if (apiVersion === 'argoproj.io/v1alpha1') {
        if (!applicationset || cluster) {
          return overviewTab
        }
      }
      return _.concat(overviewTab, {
        id: 'editor',
        label: 'description.title.editor',
        url: `${SINGLE_APP_BASE_PAGE_PATH}/edit`
      })
    }

    const applicationsTitle = 'routes.applications'

    return (
      <AcmPage header={<SecondaryHeader />}>
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
                  tabs: allApplicationsTabs
                }}
              />
            )}
          />
          <Route
            exact
            path={`${BASE_PAGE_PATH}/advanced`}
            render={params => (
              <AdvancedConfigurationPage
                params={params}
                serverProps={serverProps}
                secondaryHeaderProps={{
                  title: applicationsTitle,
                  tabs: allApplicationsTabs
                }}
                locale={locale}
              />
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
            path={`${BASE_PAGE_PATH}/argoappset`}
            render={params => (
              <ArgoCreationPage
                params={params}
                serverProps={this.getServerProps()}
                secondaryHeaderProps={{
                  title: 'argo.create.title',
                  label: 'creation.app.section.techPreview',
                  labelColor: 'creation.app.section.techPreview.color'
                }}
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
            render={routeProps => {
              const params = queryString.parse(routeProps.location.search)
              return params.apiVersion === 'argoproj.io/v1alpha1' ? (
                <ArgoCreationPage
                  params={params}
                  serverProps={this.getServerProps()}
                  secondaryHeaderProps={{
                    title: 'argo.create.title',
                    tabs: getSingleApplicationTabs(routeProps.match.params)
                  }}
                />
              ) : (
                <ApplicationCreationPage
                  params={routeProps}
                  serverProps={this.getServerProps()}
                  secondaryHeaderProps={{
                    title: 'application.create.title',
                    tabs: getSingleApplicationTabs(routeProps.match.params)
                  }}
                />
              )
            }}
          />
          <Redirect to={`${config.contextPath}/welcome`} />
        </Switch>
        <ActionModalApollo locale={serverProps.context.locale} />
      </AcmPage>
    )
  }
}

App.propTypes = {
  locale: PropTypes.object,
  location: PropTypes.object,
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

const getAcmRoute = props => {
  let path = ''
  if (client) {
    path = window.location.pathname
  } else {
    path = props.url
  }
  if (path.includes(config.contextPath)) {
    return AcmRoute.Applications
  }
  return AcmRoute.Welcome
}

const Container = Component =>
  withRouter(withLocale(connect(mapStateToProps)(Component)))
const AppContainer = Container(App)

const AppComponent = props => (
  <AcmHeader route={getAcmRoute(props)}>
    <Route
      path={config.contextPath}
      serverProps={props}
      component={AppContainer}
    />
  </AcmHeader>
)
AppComponent.displayName = 'AppComponent'
export default AppComponent
