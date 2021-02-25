/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

import * as Actions from '../actions'

export const resourceFilters = (state = {}, action) => {
  switch (action.type) {
  case Actions.RESOURCE_FILTERS_RECEIVE_SUCCESS:
    return Object.assign({}, state, {
      status: Actions.REQUEST_STATUS.DONE,
      filters: {
        // disable cluster name filtering until server side fixes the issue
        // https://github.ibm.com/IBMPrivateCloud/roadmap/issues/10981
        // clusterNames: action.filters.clusterNames,
        clusterSelector: action.filters.clusterSelector
      }
    })
  case Actions.RESOURCE_FILTERS_UPDATE: {
    const selectedFilters = state.selectedFilters
      ? { ...state.selectedFilters }
      : {}
    selectedFilters[action.resourceName] = action.selectedFilters
    return { ...state, selectedFilters }
  }
  default:
    return state
  }
}
