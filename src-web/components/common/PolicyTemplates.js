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
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import StructuredListModule from '../../components/common/StructuredListModule'
import lodash from 'lodash'

class PolicyTemplates extends React.Component {

  render() {
    const { resourceData, staticResourceData } = this.props
    const templates = lodash.get(resourceData, 'templates', [])
    return templates ?
      <StructuredListModule
        title={staticResourceData.policyTemplatesKeys.title}
        // url={`${config.contextPath}/workloads/PolicyTemplates/${replicaSet.metadata.namespace}/${replicaSet.metadata.name}`}
        headerRows={staticResourceData.policyTemplatesKeys.headerRows}
        rows={staticResourceData.policyTemplatesKeys.rows}
        id='policy-templates-module'
        data={templates}
      /> : null
  }
}

PolicyTemplates.contextTypes = {
  locale: PropTypes.string
}

PolicyTemplates.propTypes = {
  resourceData: PropTypes.object,
  staticResourceData: PropTypes.object,
}

export default withRouter(PolicyTemplates)
