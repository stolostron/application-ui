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

class PolicyRef extends React.Component {

  render() {
    const { resourceData, staticResourceData } = this.props
    const ref = lodash.get(resourceData, 'roleRef', [])
    return ref && ref.length > 0 ?
      <StructuredListModule
        title={staticResourceData.roleRef.title}
        // url={`${config.contextPath}/workloads/PolicyTemplates/${replicaSet.metadata.namespace}/${replicaSet.metadata.name}`}
        headerRows={staticResourceData.roleRef.headerRows}
        rows={staticResourceData.roleRef.rows}
        id='policy-templates-module'
        data={ref}
      /> : null
  }
}

PolicyRef.contextTypes = {
  locale: PropTypes.string
}

PolicyRef.propTypes = {
  resourceData: PropTypes.object,
  staticResourceData: PropTypes.object,
}

export default withRouter(PolicyRef)
