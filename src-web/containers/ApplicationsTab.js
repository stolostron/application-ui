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
import RegisterApplicationModal from '../components/modals/RegisterApplicationModal'

const registerApplication = <RegisterApplicationModal key='registerApplicationModal' />


export default withRouter(typedResourcePageWithListAndDetails(
  RESOURCE_TYPES.HCM_APPLICATIONS,
  ['overview', 'topology'],
  [registerApplication],
  ['/topology']
))

