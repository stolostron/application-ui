/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
/*
 *
 * Things you should never do inside a reducer:
 *
 * - Mutate its arguments
 * - Perform side effects like API calls and routing transitions
 * - Call non-pure functions, e.g. Date.now() or Math.random()
 *
 * Reducers must be deterministic pure functions.  Given the same arguments, it should calculate the next state and return it.
 * No surprises. No side effects. No API calls. No mutations. Just a calculation.
 *
 * Selectors should sit along side reducers.
 */

import { createResourceReducer, resourceReducerFunction } from './common'
import { RESOURCE_TYPES } from '../../lib/shared/constants'
import _ from 'lodash'

export { user, loggedIn } from './user'
export { secondaryHeader } from './common'

export { uiconfig } from './uiconfig'
export { role } from './role'

export { modal } from './modal'

export { applicationPageResources } from './application'
export { AppDeployments } from './reducerAppDeployments'
export { AppOverview } from './reducerAppOverview'

const keyFields = ['name', 'list']

function predicate(resourceType, action) {
  if (
    _.isEqual(
      _.pick(resourceType, keyFields),
      _.pick(action.resourceType, keyFields)
    )
  ) {
    return true
  }
  return _.find(_.values(resourceType), type => {
    if (typeof type === 'string') {
      return type.indexOf(action.resourceType) > -1
    }
    return false
  })
}

// the exported function name must match the resourceType value
export const HCMApplicationList = createResourceReducer(
  resourceReducerFunction,
  predicate.bind(null, RESOURCE_TYPES.HCM_APPLICATIONS)
)

// the exported function name must match the resourceType value
export const QueryApplicationList = createResourceReducer(
  resourceReducerFunction,
  predicate.bind(null, RESOURCE_TYPES.QUERY_APPLICATIONS)
)

export const QueryApplicationsetList = createResourceReducer(
  resourceReducerFunction,
  predicate.bind(null, RESOURCE_TYPES.QUERY_APPLICATIONSET)
)

export const QuerySubscriptionList = createResourceReducer(
  resourceReducerFunction,
  predicate.bind(null, RESOURCE_TYPES.QUERY_SUBSCRIPTIONS)
)

export const QueryPlacementRuleList = createResourceReducer(
  resourceReducerFunction,
  predicate.bind(null, RESOURCE_TYPES.QUERY_PLACEMENTRULES)
)

export const QueryChannelList = createResourceReducer(
  resourceReducerFunction,
  predicate.bind(null, RESOURCE_TYPES.QUERY_CHANNELS)
)

export const HCMChannelList = createResourceReducer(
  resourceReducerFunction,
  predicate.bind(null, RESOURCE_TYPES.HCM_CHANNELS)
)

export const HCMSubscriptionList = createResourceReducer(
  resourceReducerFunction,
  predicate.bind(null, RESOURCE_TYPES.HCM_SUBSCRIPTIONS)
)
export const HCMPlacementRuleList = createResourceReducer(
  resourceReducerFunction,
  predicate.bind(null, RESOURCE_TYPES.HCM_PLACEMENT_RULES)
)
export const userInfoList = createResourceReducer(
  resourceReducerFunction,
  predicate.bind(null, RESOURCE_TYPES.USER_INFO)
)

export { topology } from './topology'
export { resourceFilters } from './filter'
