/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'

import { withRouter } from 'react-router-dom'
import { ROLES } from '../../lib/shared/constants'
import withAccess from '../components/common/withAccess'

class IncidentsTab extends React.Component {
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return null
  }
}

export default withRouter(withAccess(IncidentsTab, ROLES.VIEWER))
