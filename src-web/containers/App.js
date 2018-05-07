/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import SecondaryHeader from '../components/SecondaryHeader'
import { Route, Switch, Redirect } from 'react-router-dom'
import resources from '../../lib/shared/resources'
import client from '../../lib/shared/client'
import loadable from 'loadable-components'
import config from '../../lib/shared/config'
import HeaderContainer from '../containers/HeaderContainer'

export const Clusters = loadable(() => import(/* webpackChunkName: "clusters" */ './Clusters'))

resources(() => {
  require('../../scss/common.scss')
})

class App extends React.Component {
  /* FIXME: Please fix disabled eslint rules when making changes to this file. */
  /* eslint-disable react/prop-types */

  constructor(props) {
    super(props)

    if (client)
      this.serverProps = JSON.parse(document.getElementById('props').textContent)
  }

  getServerProps() {
    if (client)
      return this.serverProps
    return this.props.staticContext
  }

  render() {
    const serverProps = this.getServerProps()
    const { match } = this.props

    return (
      <div>
        <HeaderContainer />
        <SecondaryHeader />
        <Switch>
          <Route path={`${match.url}/clusters`} render={() => <Clusters serverProps={serverProps} />} />
          <Redirect to={`${config.contextPath}/clusters/overview`} />
        </Switch>
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
  <div>
    <Route path={config.contextPath} serverProps={props} component={App} />
  </div>
)
