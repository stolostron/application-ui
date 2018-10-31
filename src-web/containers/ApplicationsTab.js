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
import ResourceTableModule from '../components/common/ResourceTableModuleFromProps'
import { withRouter } from 'react-router-dom'
import { RESOURCE_TYPES, ROLES } from '../../lib/shared/constants'
import { typedResourcePageWithListAndDetails } from '../components/common/ResourcePage'
import { createApplication } from '../actions/applications'
import CreateResourceModal from '../components/modals/CreateResourceModal'
import withAccess from '../components/common/withAccess'

const handleCreateResource = (dispatch, yaml) => dispatch(createApplication(RESOURCE_TYPES.HCM_APPLICATIONS, yaml))

const registerApplicationModal = <CreateResourceModal
  key='registerApplication'
  headingTextKey='actions.create.application'
  submitBtnTextKey='actions.create.application'
  onCreateResource={ handleCreateResource }
  resourceDescriptionKey='modal.createresource.application'
/>


export default withRouter(withAccess(typedResourcePageWithListAndDetails(
  RESOURCE_TYPES.HCM_APPLICATIONS,
  ['overview', 'design', 'topology'],
  [registerApplicationModal],
  ['/design', '/topology'],
  [<ResourceTableModule key='placementPolicies' definitionsKey='placementPolicyKeys' />,
    <ResourceTableModule key='deployables' definitionsKey='deployablesKeys' />]
), ROLES.OPERATOR))
