/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
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
import { createApplication } from '../actions/applications'
import CreateResourceModal from '../components/modals/CreateResourceModal'
import withAccess from '../components/common/withAccess'
import msgs from '../../nls/platform.properties'
import context from '../../lib/shared/context'

const handleCreateResource = (dispatch, yaml) =>
  dispatch(createApplication(RESOURCE_TYPES.HCM_APPLICATIONS, yaml))

const { locale } = context()
const tableTitle = msgs.get('table.title.allApplications', locale)

const createApplicationSample =
  '# This is a sample template for creating subscriptions.\n' +
  '# For more information, click the "Need help writing this?" link above.\n\n' +
  'apiVersion: app.k8s.io/v1beta1\n' +
  'kind: Application\n' +
  'metadata:\n' +
  '  name:' +
  '\t#The name of the application resource\n' +
  '  namespace:' +
  '\t#The namespace for the application\n' +
  '  resourceVersion:' +
  '\t#The version of the application resource\n' +
  '  annotations:' +
  '\t#The annotations for the application\n' +
  '  labels:' +
  '\t#The labels for the deployable\n' +
  '    app:\n' +
  '    chart:\n' +
  '    heritage:\n' +
  '    name:\n' +
  '    release:\n' +
  'spec:\n' +
  '  componentKinds:' +
  '\t#The list of the kinds of resources to be associated with the application\n' +
  '  - group:\n' +
  '    kind:\n' +
  '  descriptor:\n' +
  '  selector:\n' +
  '    matchExpressions:' +
  '\t#Contains the selectors to use to associate other Kubernetes resources with the application\n' +
  '    - key:\n' +
  '      operator:\n' +
  '      values:'

const registerApplicationModal = (
  <CreateResourceModal
    key="registerApplication"
    headingTextKey="actions.create.application"
    submitBtnTextKey="actions.create.application"
    onCreateResource={handleCreateResource}
    resourceDescriptionKey="modal.createresource.application"
    helpLink="https://www.ibm.com/support/knowledgecenter/SSFC4F_1.1.0/mcm/applications/managing_apps.html"
    sampleContent={createApplicationSample}
  />
)

export default withRouter(
  withAccess(
    typedResourcePageWithListAndDetails(
      RESOURCE_TYPES.HCM_APPLICATIONS,
      [],
      [registerApplicationModal],
      [],
      [
        <ResourceTableModule
          key="deployments"
          definitionsKey="deploymentKeys"
        />,
        <ResourceTableModule
          key="deployables"
          definitionsKey="deployableKeys"
        />,
        <ResourceTableModule
          key="subscriptions"
          definitionsKey="subscriptionKeys"
        />,
        <ResourceTableModule
          key="placementRules"
          definitionsKey="placementRuleKeys"
        />,
        <ResourceTableModule
          key="placementPolicies"
          definitionsKey="placementPolicyKeys"
          subResourceType={RESOURCE_TYPES.HCM_PLACEMENT_POLICIES}
        />,
        <ResourceTableModule
          key="placementBindings"
          definitionsKey="placementBindingKeys"
        />,
        <ResourceTableModule
          key="applicationRelationships"
          definitionsKey="applicationRelationshipKeys"
        />
      ],
      tableTitle,
      'All applications'
    ),
    ROLES.VIEWER
  )
)
