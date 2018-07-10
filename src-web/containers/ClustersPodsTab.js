/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import { RESOURCE_TYPES } from '../../lib/shared/constants'
import { typedResourcePageWithList } from '../components/common/ResourcePage'
import {withRouter} from 'react-router-dom'
import pageWithUrlQuery from '../components/common/withUrlQuery'

const resourceType = RESOURCE_TYPES.HCM_PODS
export default withRouter(pageWithUrlQuery(typedResourcePageWithList(resourceType), resourceType))
