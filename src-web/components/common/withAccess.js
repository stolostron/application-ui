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
import PropTypes from 'prop-types'
import lodash from 'lodash'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { ROLES } from '../../../lib/shared/constants'
import config from '../../../lib/shared/config'

const withAccess = (ChildComponent, lowestRole) => {
  class checkAccess extends React.PureComponent {
    static propTypes = {
      role: PropTypes.string.isRequired,
    }

    render() {
      const { role } = this.props
      const roleKey = lodash.findKey(ROLES, value => value.toLowerCase() === role.toLowerCase())
      const lowestRoleKey = lodash.findKey(ROLES, value => value.toLowerCase() === lowestRole.toLowerCase())
      return Object.keys(ROLES).indexOf(roleKey) >= Object.keys(ROLES).indexOf(lowestRoleKey) ? <ChildComponent {...this.props} /> : <Redirect to={`${config.contextPath}/welcome`} />
    }
  }


  const mapStateToProps = (state) => {
    const role = state.role && state.role.role
    return { role }
  }

  return connect(mapStateToProps)(checkAccess)
}


export default withAccess
