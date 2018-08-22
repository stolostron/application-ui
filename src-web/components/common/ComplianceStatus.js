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
import ResourceTable from '../../components/common/ResourceTable'
import { Module, ModuleHeader, ModuleBody } from 'carbon-components-react'
import msgs from '../../../nls/platform.properties'
import lodash from 'lodash'

class PolicyRules extends React.Component {

  render() {
    const { locale } = this.context
    const { resourceData, staticResourceData, resourceType } = this.props
    const complianceStatus = lodash.get(resourceData, 'complianceStatus', [])
    return <Module id='compliance-status' >
      <ModuleHeader>{msgs.get('description.title.compliant', locale)}</ModuleHeader>
      <ModuleBody>
        {complianceStatus ? <ResourceTable
          staticResourceData={staticResourceData.compliancePolicies}
          status={status}
          items={complianceStatus}
          itemIds={Object.keys(complianceStatus)}
          resourceType={resourceType}
          // TODO: add table action
          // handleSort={TableHelper.handleSort.bind(this, sortDirection, sortColumn, sortTable)}
          // handleSearch={TableHelper.handleInputValue.bind(this, searchTable)}
          totalFilteredItems={Object.keys(complianceStatus).length}
        /> : null}
      </ModuleBody>
    </Module>

  }
}

PolicyRules.contextTypes = {
  locale: PropTypes.string
}

PolicyRules.propTypes = {
  resourceData: PropTypes.object,
  resourceType: PropTypes.object,
  staticResourceData: PropTypes.object,
}

export default withRouter(PolicyRules)
