/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
'use strict'
import { RESOURCE_TYPES } from '../../../../lib/shared/constants'
import _ from 'lodash'

export function getUpdates(previousParsed, currentParsed, originalMap) {
  let cantUpdate = false
  const updates = []
  Object.keys(currentParsed).some(key => {
    switch (key) {
    case 'PlacementRule':
      cantUpdate = getPlacementRuleUpdates(
        previousParsed[key],
        currentParsed[key],
        originalMap[key],
        updates
      )
      break
    }
    return cantUpdate
  })
  return { cantUpdate, updates }
}

function getPlacementRuleUpdates(
  previousParsed,
  currentParsed,
  originalRaw,
  updates
) {
  return currentParsed.some(({ $raw: currentRaw }, idx) => {
    // assumes current and previous are in same order
    if (idx < previousParsed.length) {
      const { $raw: previousRaw } = previousParsed[idx]
      if (!_.isEqual(currentRaw, previousRaw)) {
        const name = _.get(currentRaw, 'metadata.name')
        const namespace = _.get(currentRaw, 'metadata.namespace')
        const selfLink = _.get(originalRaw, 'metadata.selfLink')
        currentRaw.metadata.resourceVersion = _.get(
          originalRaw,
          'metadata.resourceVersion'
        )
        updates.push({
          resourceType: RESOURCE_TYPES.HCM_PLACEMENT_RULES,
          namespace,
          name,
          selfLink,
          resource: currentRaw
        })
      }
      return false
    }
    return true
  })
}
