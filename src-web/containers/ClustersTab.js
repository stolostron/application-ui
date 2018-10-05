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
import { typedResourcePageWithList } from '../components/common/ResourcePage'
import pageWithUrlQuery from '../components/common/withUrlQuery'
import withAccess from '../components/common/withAccess'

const resourceType = RESOURCE_TYPES.HCM_CLUSTERS
export default withRouter(withAccess(pageWithUrlQuery(typedResourcePageWithList(resourceType), resourceType), ROLES.OPERATOR))
