/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

/* eslint-disable react/jsx-no-bind */
import React from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import config from '../../lib/shared/config'
import PVsTab from './PVsTab'
import PVsClaimsTab from './PVsClaimsTab'

const BASE_PAGE_PATH = `${config.contextPath}/storage`
const SECONDARY_HEADER_PROPS = {
  title: 'routes.storage',
  tabs: [
    {
      id: 'persistent-volumes',
      label: 'tabs.pvs',
      url: BASE_PAGE_PATH
    },
    {
      id: 'persitent-volumes-claims',
      label: 'tabs.pvsClaims',
      url: `${BASE_PAGE_PATH}/claims`
    }
  ]
}

const pvs = ({ match }) =>
  <Switch>
    <Route path={`${match.url}/claims`} render={() => <PVsClaimsTab secondaryHeaderProps={SECONDARY_HEADER_PROPS} />} />
    <Route path={match.url} render={() => <PVsTab secondaryHeaderProps={SECONDARY_HEADER_PROPS} />} />
  </Switch>


pvs.propTypes = {
  match: PropTypes.object,
}

export default withRouter(pvs)
