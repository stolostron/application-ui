/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import { withRouter } from 'react-router-dom'
import { RESOURCE_TYPES, ROLES } from '../../lib/shared/constants'
import { typedResourcePageWithTopology } from '../components/common/ResourcePage'
import withAccess from '../components/common/withAccess'

export default withRouter(withAccess(typedResourcePageWithTopology(
  RESOURCE_TYPES.HCM_TOPOLOGY
), ROLES.EDITOR))
