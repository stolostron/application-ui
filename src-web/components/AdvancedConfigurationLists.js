/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import ResourceList from './common/ResourceList'
import ResourceTableModule from './common/ResourceTableModuleFromProps'
import { RESOURCE_TYPES } from '../../lib/shared/constants'
import getResourceDefinitions from '../definitions'
import { makeGetVisibleTableItemsSelector } from '../reducers/common'
import QuerySwitcher from './common/QuerySwitcher'

const AdvancedConfigurationLists = (props) => {

  const resourceType = RESOURCE_TYPES.QUERY_APPLICATIONS
  const staticResourceData = getResourceDefinitions(resourceType)
  const getVisibleResources = makeGetVisibleTableItemsSelector(resourceType)

  return (
    <ResourceList
      {...props}
      resourceType={resourceType}
      staticResourceData={staticResourceData}
      getVisibleResources={getVisibleResources}
      modules={[<ResourceTableModule key="deployments" definitionsKey="deploymentKeys" />]}
    >
      <QuerySwitcher
        key='switcher'
        queryParam="resource"
        options={
              [{ id: 'subscription', contents: 'Subscriptions' },
                { id: 'placementrule', contents: 'Placement rules'},
                {id: 'channel', contents: 'Channels'}]}
        defaultOption="subscription"
      />
    </ResourceList>
  )}

export default AdvancedConfigurationLists
