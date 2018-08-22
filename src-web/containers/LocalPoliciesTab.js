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
import { createPolicy } from '../actions/common'
import PolicyTemplates from '../components/common/PolicyTemplates'
import ResourceTableModule from '../components/common/ResourceTableModuleFromProps'

const handleCreateResource = (dispatch, yaml) => dispatch(createPolicy(RESOURCE_TYPES.HCM_POLICIES, yaml))

const createPolicyModal = <CreateResourceModal
  key='createPolicy'
  headingTextKey='actions.create.policy'
  submitBtnTextKey='actions.create.policy'
  onCreateResource={ handleCreateResource }
/>

export default withRouter(typedResourcePageWithListAndDetails(
  RESOURCE_TYPES.HCM_POLICIES,
  ['overview'],
  [createPolicyModal],
  [''],
  [<PolicyTemplates key='Policy Templates' right />, <ResourceTableModule key='rules' definitionsKey='policyRules' />,  <ResourceTableModule key='violations' definitionsKey='policyViolations' />]
))
