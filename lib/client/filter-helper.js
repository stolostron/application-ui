/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright Contributors to the Open Cluster Management project
'use strict'

import { MCM_DIAGRAM_FILTER_COOKIE } from '../shared/constants'

/*
* UI helpers to help with data transformations
* */

export const saveFilterState = (namespace, name, filterState) => {
  const cookieKey = namespace
    ? `${MCM_DIAGRAM_FILTER_COOKIE}--${namespace}--${name}`
    : `${MCM_DIAGRAM_FILTER_COOKIE}`
  localStorage.setItem(cookieKey, JSON.stringify({ filterState }))
}
export const getFilterState = (initialFilters, namespace, name) => {
  const cookieKey = namespace
    ? `${MCM_DIAGRAM_FILTER_COOKIE}--${namespace}--${name}`
    : `${MCM_DIAGRAM_FILTER_COOKIE}`
  let filters = initialFilters
  let otherTypeFilters = []
  const savedFilters = localStorage.getItem(cookieKey)
  if (savedFilters) {
    try {
      const savedState = JSON.parse(savedFilters)
      if (savedState.filterState) {
        ({
          filters = initialFilters,
          otherTypeFilters = []
        } = savedState.filterState)
      } else {
        // legacy
        filters = savedState
      }
    } catch (e) {
      //
    }
  }
  return { filters, otherTypeFilters }
}
