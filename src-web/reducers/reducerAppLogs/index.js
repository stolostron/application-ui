/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

// @flow
import { createAction } from '../../shared/utils/state'
import {
  SEARCH_QUERY,
  GET_RESOURCE
} from '../../apollo-client/queries/SearchQueries'
import { convertStringToQuery } from '../../../lib/client/search-helper'

const SET_LOG_DATA = 'SET_LOG_DATA'
const SET_POD_DATA = 'SET_POD_DATA'
const SET_CURRENT_SELECTED_POD = 'SET_CURRENT_SELECTED_POD'
const SET_CONTAINER_DATA = 'SET_CONTAINER_DATA'
const FETCH_LOG_ERROR = 'FETCH_LOG_ERROR'
const FETCH_POD_ERROR = 'FETCH_POD_ERROR'
const FETCH_CONTAINER_ERROR = 'FETCH_CONTAINER_ERROR'

export const initialStateLogs = {
  logData: {},
  podData: {},
  currentSelectedPod: 'Select Pod',
  containerData: {},
  fetchPodDataError: '',
  fetchLogDataError: '',
  fetchContainerDataError: '',
  loading: false
}

export const AppLogs = (state = initialStateLogs, action) => {
  switch (action.type) {
  case SET_LOG_DATA: {
    return { ...state, logData: action.payload }
  }
  case SET_POD_DATA: {
    return { ...state, podData: action.payload }
  }
  case SET_CURRENT_SELECTED_POD: {
    return { ...state, currentSelectedPod: action.payload }
  }
  case SET_CONTAINER_DATA: {
    return { ...state, containerData: action.payload }
  }
  case FETCH_LOG_ERROR: {
    return { ...state, fetchLogDataError: action.payload }
  }
  case FETCH_POD_ERROR: {
    return { ...state, fetchPodDataError: action.payload }
  }
  case FETCH_CONTAINER_ERROR: {
    return { ...state, fetchContainerDataError: action.payload }
  }
  default:
    return state
  }
}
export default AppLogs

export const setLogData = createAction(SET_LOG_DATA)
export const setPodData = createAction(SET_POD_DATA)
export const setCurrentPod = createAction(SET_CURRENT_SELECTED_POD)
export const setContainerData = createAction(SET_CONTAINER_DATA)
export const setFetchLogError = createAction(FETCH_LOG_ERROR)
export const setFetchPodError = createAction(FETCH_POD_ERROR)
export const setFetchContainerError = createAction(FETCH_CONTAINER_ERROR)

// Fetch pods for application
export const fetchPodsForApplication = (apolloClient, namespace, name) => {
  const queryString = convertStringToQuery(
    `kind:pods label:app:${name} namespace:${namespace}`
  )
  return dispatch => {
    return apolloClient
      .search(SEARCH_QUERY, {
        input: [queryString]
      })
      .then(response => {
        if (response.errors) {
          return dispatch(setFetchPodError(response.errors))
        }
        return dispatch(setPodData(response))
      })
      .catch(err => {
        dispatch(setFetchPodError(err))
      })
  }
}

//fetch containers for selected pod
export const fetchContainersForPod = (
  apolloClient,
  selfLink,
  namespace,
  name,
  cluster
) => {
  const queryString = convertStringToQuery(
    `selfLink:${selfLink}, namespace:${namespace}, kind:'PODS', name:${name}, cluster:${cluster}`
  )
  return dispatch => {
    return apolloClient
      .search(GET_RESOURCE, { input: [queryString] })
      .then(response => {
        if (response.errors) {
          return dispatch(setFetchContainerError(response.errors))
        }
        return dispatch(setContainerData(response))
      })
      .catch(err => {
        dispatch(setFetchContainerError(err))
      })
  }
}
