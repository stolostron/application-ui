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
    const rules = lodash.get(resourceData, 'rules', [])
    return <Module id='policy-rules' >
      <ModuleHeader>{msgs.get('description.title.rules', locale)}</ModuleHeader>
      <ModuleBody>
        {rules ? <ResourceTable
          staticResourceData={staticResourceData.policyRules}
          status={status}
          items={rules}
          itemIds={Object.keys(rules)}
          resourceType={resourceType}
          // TODO: add table action
          // handleSort={TableHelper.handleSort.bind(this, sortDirection, sortColumn, sortTable)}
          // handleSearch={TableHelper.handleInputValue.bind(this, searchTable)}
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
