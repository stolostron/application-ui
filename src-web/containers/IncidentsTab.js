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
import { withRouter } from 'react-router-dom'
import { RESOURCE_TYPES, ROLES } from '../../lib/shared/constants'
import { typedResourcePageWithListForIncidents } from '../components/common/ResourcePage'
import withAccess from '../components/common/withAccess'
import msgs from '../../nls/platform.properties'
import context from '../../lib/shared/context'


const { locale } = context()
const tableTitle = msgs.get('table.title.allIncidents', locale)

export default withRouter(withAccess(typedResourcePageWithListForIncidents(
  RESOURCE_TYPES.CEM_INCIDENTS,
  [],
  [],
  [],
  [],
  tableTitle,
  'All Incidents',
), ROLES.VIEWER))