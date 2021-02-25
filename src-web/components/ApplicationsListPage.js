/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
'use strict'

import React from 'react'
import { RESOURCE_TYPES } from '../../lib/shared/constants'
import { typedResourcePageList } from './common/ResourcePage'
import { AcmTablePaginationContextProvider } from '@open-cluster-management/ui-components'

const TypedResourcePageList = typedResourcePageList(
  RESOURCE_TYPES.QUERY_APPLICATIONS,
  [],
  [],
  []
)

const ApplicationsListPage = props => (
  <AcmTablePaginationContextProvider localStorageKey="application-table-pagination">
    <TypedResourcePageList {...props} />
  </AcmTablePaginationContextProvider>
)

export default ApplicationsListPage
