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

import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import ResourceList from './common/ResourceList'
import { RESOURCE_TYPES } from '../../lib/shared/constants'
import getResourceDefinitions from '../definitions'
import { makeGetVisibleTableItemsSelector } from '../reducers/common'
import {
  getSelectedId,
  default as QuerySwitcher
} from './common/QuerySwitcher'
import msgs from '../../nls/platform.properties'
import { withLocale } from '../providers/LocaleProvider'
import { AcmTablePaginationContextProvider } from '@stolostron/ui-components'

const AdvancedConfigurationLists = ({
  secondaryHeaderProps,
  location,
  locale
}) => {
  const defaultOption = 'subscriptions'
  const options = [
    { id: 'subscriptions', resourceType: RESOURCE_TYPES.QUERY_SUBSCRIPTIONS },
    { id: 'placementrules', resourceType: RESOURCE_TYPES.QUERY_PLACEMENTRULES },
    { id: 'channels', resourceType: RESOURCE_TYPES.QUERY_CHANNELS }
  ]

  const selectedId = getSelectedId({ location, options, defaultOption })

  const resourceType = options.find(o => o.id === selectedId).resourceType
  const staticResourceData = getResourceDefinitions(resourceType)
  const getVisibleResources = makeGetVisibleTableItemsSelector(resourceType)

  return (
    <AcmTablePaginationContextProvider localStorageKey="advanced-tables-pagination">
      <ResourceList
        key={selectedId}
        tabs={secondaryHeaderProps.tabs}
        title={secondaryHeaderProps.title}
        resourceType={resourceType}
        staticResourceData={staticResourceData}
        getVisibleResources={getVisibleResources}
      >
        {[
          <QuerySwitcher
            key="switcher"
            options={options.map(({ id }) => ({
              id,
              contents: msgs.get(`resource.${id}`, locale)
            }))}
            defaultOption={defaultOption}
          />
        ]}
      </ResourceList>
    </AcmTablePaginationContextProvider>
  )
}

AdvancedConfigurationLists.propTypes = {
  locale: PropTypes.string,
  location: PropTypes.object,
  secondaryHeaderProps: PropTypes.object
}

export default withLocale(withRouter(AdvancedConfigurationLists))
