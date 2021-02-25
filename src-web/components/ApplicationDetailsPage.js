/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
'use strict'

import { withRouter } from 'react-router-dom'
import { RESOURCE_TYPES } from '../../lib/shared/constants'
import { typedResourcePageDetails } from './common/ResourcePage'

export default withRouter(
  typedResourcePageDetails(RESOURCE_TYPES.QUERY_APPLICATIONS, [], [], [])
)
