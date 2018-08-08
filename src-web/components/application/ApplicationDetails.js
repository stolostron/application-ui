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
import getResourceDefinitions from '../../definitions'
import { RESOURCE_TYPES } from '../../../lib/shared/constants'
import StructuredListModule from '../common/StructuredListModule'

class ApplicationDetails extends React.Component {
  static propTypes = {
    application: PropTypes.object,
  }

  render() {
    const { application } = this.props
    const staticResourceData = getResourceDefinitions(RESOURCE_TYPES.HCM_APPLICATION)

    return <StructuredListModule
      title={staticResourceData.detailKeys.title}
      headerRows={staticResourceData.detailKeys.headerRows}
      rows={staticResourceData.detailKeys.rows}
      data={application||{}} />
  }
}

ApplicationDetails.contextTypes = {
  locale: PropTypes.string
}

export default ApplicationDetails
