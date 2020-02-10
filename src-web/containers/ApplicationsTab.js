/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import ResourceTableModule from '../components/common/ResourceTableModuleFromProps'
import { withRouter } from 'react-router-dom'
import { RESOURCE_TYPES, ROLES } from '../../lib/shared/constants'
import { typedResourcePageWithListAndDetails } from '../components/common/ResourcePage'
import { createResources } from '../actions/common'
import CreateResourceModal from '../components/modals/CreateResourceModal'
import withAccess from '../components/common/withAccess'
import msgs from '../../nls/platform.properties'
import context from '../../lib/shared/context'
import applicationSample from 'js-yaml-loader!../shared/yamlSamples/applicationSample.yml' // eslint-disable-line import/no-unresolved
import { getApplicationSample } from '../shared/yamlSamples/index'

const handleCreateResource = (dispatch, yaml) =>
  dispatch(createResources(RESOURCE_TYPES.HCM_APPLICATIONS, yaml))

const { locale } = context()
const tableTitle = msgs.get('table.title.allApplications', locale)

const registerApplicationModal = (
  <CreateResourceModal
    key="registerApplication"
    headingTextKey="actions.create.application"
    resourceTypeName="description.application"
    onCreateResource={handleCreateResource}
    resourceDescriptionKey="modal.createresource.application"
    helpLink="https://www.ibm.com/support/knowledgecenter/SSFC4F_1.2.0/mcm/applications/managing_apps.html"
    sampleContent={[getApplicationSample(applicationSample, locale)]}
  />
)

export default withRouter(
  withAccess(
    typedResourcePageWithListAndDetails(
      RESOURCE_TYPES.QUERY_APPLICATIONS,
      //RESOURCE_TYPES.HCM_APPLICATIONS,
      [],
      [registerApplicationModal],
      [],
      [
        <ResourceTableModule
          key="deployments"
          definitionsKey="deploymentKeys"
        />
      ],
      tableTitle,
      'All applications'
    ),
    ROLES.VIEWER
  )
)
