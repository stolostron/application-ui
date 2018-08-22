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
import { withRouter } from 'react-router-dom'
import { RESOURCE_TYPES } from '../../lib/shared/constants'
import { typedResourcePageWithListAndDetails } from '../components/common/ResourcePage'
import CreateResourceModal from '../components/modals/CreateResourceModal'
import { createCompliance } from '../actions/common'
import ComplianceStatus from '../components/common/ComplianceStatus'

// TODO: create new type call HCM_COMPLIANCE to hand create
const handleCreateResource = (dispatch, yaml) => dispatch(createCompliance(RESOURCE_TYPES.HCM_COMPLIANCES, yaml))

const createComplianceModal = <CreateResourceModal
  key='createCompliance'
  headingTextKey='actions.create.compliance'
  submitBtnTextKey='actions.create.compliance'
  onCreateResource={ handleCreateResource }
/>

export default withRouter(typedResourcePageWithListAndDetails(
  RESOURCE_TYPES.HCM_COMPLIANCES,
  ['overview'],
  [createComplianceModal],
  ['/compliancePolicy/:policyName/:policyNamespace'],
  [<ComplianceStatus key='Rules' />]
))
