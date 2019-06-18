/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

// seems to be an issue with this rule and redux
/* eslint-disable import/no-named-as-default */

import React from 'react'
import PropTypes from 'prop-types'
import SecondaryHeader from '../components/SecondaryHeader'
import { Route, Switch, Redirect } from 'react-router-dom'
import resources from '../../lib/shared/resources'
import client from '../../lib/shared/client'
import loadable from 'loadable-components'
import config from '../../lib/shared/config'
import Modal from '../components/common/Modal'

export const ApplicationsTab = loadable(() => import(/* webpackChunkName: "applications" */ './ApplicationsTab'))
export const ModalApollo = loadable(() => import(/* webpackChunkName: "modalApollo" */ '../components/common-apollo/ModalApollo'))
export const ActionModalApollo = loadable(() => import(/* webpackChunkName: "actionModalApollo" */ '../components/common-apollo/ActionModalApollo'))

resources(() => {
  require('../../scss/common.scss')
})

class App extends React.Component {
  /* FIXME: Please fix disabled eslint rules when making changes to this file. */
  /* eslint-disable react/prop-types, react/jsx-no-bind */

  constructor(props) {
    super(props)

    if (client)
      this.serverProps = JSON.parse(document.getElementById('propshcm').textContent)
  }

  getServerProps() {
    if (client)
      return this.serverProps
    return this.props.staticContext
  }

  render() {
    const serverProps = this.getServerProps()
    const { match, location } = this.props
    const showSecondaryHeader = location.pathname &&
      !location.pathname.startsWith('/multicloud/welcome') &&
      !location.pathname.startsWith('/multicloud/overview') &&
      !location.pathname.startsWith('/multicloud/search')
    return (
      <div className='expand-vertically'>
        {showSecondaryHeader && <SecondaryHeader />}
        <Switch>
          <Route path={`${match.url}/applications`} render={() => <ApplicationsTab secondaryHeaderProps={{title: 'routes.applications'}} />} />
          <Redirect to={`${config.contextPath}/welcome`} />
        </Switch>
        <Modal locale={serverProps.context.locale} />
        <ModalApollo locale={serverProps.context.locale} />
        <ActionModalApollo locale={serverProps.context.locale} />
        <input type='hidden' id='app-access' style={{display: 'none'}} value={serverProps.xsrfToken.toString('base64')} />
      </div>
    )
  }

  getChildContext() {
    return {
      locale: this.getServerProps().context.locale
    }
  }
}

App.childContextTypes = {
  locale: PropTypes.string
}

export default props => ( // eslint-disable-line react/display-name
  <div className='expand-vertically'>
    <Route path={config.contextPath} serverProps={props} component={App} />
  </div>
)
