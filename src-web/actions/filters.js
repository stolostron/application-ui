/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import lodash from 'lodash'

import * as Actions from './index'
import apolloClient from '../../lib/client/apollo-client'
import { receiveResourceError, requestResource}  from './common'
import { RESOURCE_TYPES } from '../../lib/shared/constants'

export const STRING_SPLITTER = '='

export  const combineFilters = (selectedFilters) => {
  const tempObject = []
  if (selectedFilters && selectedFilters.length > 0) {
    selectedFilters.forEach(item => {
      if (item && item.type) {
        const { key, value, type } = item
        tempObject.push({key, value, type})
      } else {
        //TODO support customize tags
      }
    })
  }
  return {filter: {resourceFilter: tempObject}}
}

export const fetchFilters = (inputType) => {
  const resourceType = RESOURCE_TYPES.HCM_FILTER_LIST
  return (dispatch) => {
    if (inputType && inputType.filter) {
      dispatch(requestResource(resourceType))
      return apolloClient.get(resourceType)
        .then(response => {
          if (response.errors) {
            return dispatch(receiveResourceError(response.errors[0], resourceType))
          }
          return dispatch(receiveFiltersSuccess({
            clusterLabels: lodash.get(response, 'data.filters.clusterLabels'),
            clusterNames: lodash.get(response, 'data.filters.clusterNames'),
          }, resourceType))
        })
        .catch(err => dispatch(receiveResourceError(err, resourceType)))
    }
  }
}

export const receiveFiltersSuccess = (response, resourceType) => ({
  type: Actions.RESOURCE_FILTERS_RECEIVE_SUCCESS,
  status: Actions.REQUEST_STATUS.DONE,
  filters: {
    clusterLabels: response.clusterLabels || [],
    clusterNames: response.clusterNames || [],
  },
  resourceType
})

export const updateResourceFilters = (resourceType, selectedFilters) => ({
  type: Actions.RESOURCE_FILTERS_UPDATE,
  resourceName: resourceType.name,
  selectedFilters,
})
