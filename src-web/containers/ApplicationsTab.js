/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
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
import msgs from '../../nls/platform.properties'
import context from '../../lib/shared/context'

const handleCreateResource = (dispatch, yaml) => dispatch(createApplication(RESOURCE_TYPES.HCM_APPLICATIONS, yaml))

const { locale } = context()
const tableTitle = msgs.get('table.title.allApplications', locale)

const registerApplicationModal = <CreateResourceModal
  key='registerApplication'
  headingTextKey='actions.create.application'
  submitBtnTextKey='actions.create.application'
  onCreateResource={ handleCreateResource }
  resourceDescriptionKey='modal.createresource.application'
/>

export default withRouter(withAccess(typedResourcePageWithListAndDetails(
  RESOURCE_TYPES.HCM_APPLICATIONS,
  [],
  [registerApplicationModal],
  ['/diagram'],
  [
    <ResourceTableModule
      key='applicationWorks'
      definitionsKey='applicationWorkKeys'
    />,
    <ResourceTableModule
      key='placementPolicies'
      definitionsKey='placementPolicyKeys'
      subResourceType={RESOURCE_TYPES.HCM_PLACEMENT_POLICIES}
    />,
    <ResourceTableModule
      key='placementBindings'
      definitionsKey='placementBindingKeys'
    />,
    <ResourceTableModule
      key='deployables'
      definitionsKey='deployablesKeys'
    />,
    <ResourceTableModule
      key='applicationRelationships'
      definitionsKey='applicationRelationshipKeys'
    />
  ],
  tableTitle,
  'All Applications',
), ROLES.VIEWER))
