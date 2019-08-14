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

const SET_LOG_DATA = 'SET_LOG_DATA'
const SET_POD_DATA = 'SET_POD_DATA'
const SET_CURRENT_SELECTED_POD = 'SET_CURRENT_SELECTED_POD'
const SET_CONTAINER_DATA = 'SET_CONTAINER_DATA'
const SET_CURRENT_SELECTED_CONTAINER = 'SET_CURRENT_SELECTED_CONTAINER'
const FETCH_LOG_ERROR = 'FETCH_LOG_ERROR'
const FETCH_POD_ERROR = 'FETCH_POD_ERROR'
const FETCH_CONTAINER_ERROR = 'FETCH_CONTAINER_ERROR'

export const initialStateLogs = {
  logData: '',
  podData: {},
  currentSelectedPod: '',
  containerData: {},
  currentSelectedContainer: '',
  fetchPodDataError: '',
  fetchLogDataError: '',
  fetchContainerDataError: '',
  logLoading: true
}

export const AppLogs = (state = initialStateLogs, action) => {
  switch (action.type) {
  case SET_LOG_DATA: {
    // probably would need a null check here for setting the logs
    return { ...state, logData: action.payload.data.logs, logLoading: false }
  }
  case SET_POD_DATA: {
    return { ...state, podData: action.payload }
  }
  case SET_CURRENT_SELECTED_POD: {
    return {
      ...state,
      currentSelectedPod: action.payload,
      containerData: [],
      currentSelectedContainer: '',
      logData: '',
      logLoading: true
    }
  }
  case SET_CONTAINER_DATA: {
    return { ...state, containerData: action.payload }
  }
  case SET_CURRENT_SELECTED_CONTAINER: {
    return {
      ...state,
      currentSelectedContainer: action.payload,
      logLoading: true
    }
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
export const setCurrentContainer = createAction(SET_CURRENT_SELECTED_CONTAINER)
export const setFetchLogError = createAction(FETCH_LOG_ERROR)
export const setFetchPodError = createAction(FETCH_POD_ERROR)
export const setFetchContainerError = createAction(FETCH_CONTAINER_ERROR)

export const setCurrentPodActions = podName => {
  return dispatch => {
    dispatch(setCurrentPod(podName))
    fetchContainersForPod()
  }
}

// Fetch containers for selected pod
export const fetchContainersForPod = (
  apolloClient,
  selfLink,
  namespace,
  name,
  cluster
) => {
  return dispatch => {
    return apolloClient
      .getResource(
        { name: 'HCMContainer' },
        {
          selfLink: `${selfLink}`,
          namespace: `${namespace}`,
          kind: 'pod',
          name: `${name}`,
          cluster: `${cluster}`
        }
      )
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

// fetch the logs for a given container
export const fetchLogsForContainer = (
  apolloClient,
  containerName,
  podName,
  podNamespace,
  clusterName
) => {
  return dispatch => {
    return apolloClient
      .getLogs(containerName, podName, podNamespace, clusterName)
      .then(response => {
        if (response.errors) return dispatch(setFetchLogError(response.errors))

        return dispatch(setLogData(response))
      })
      .catch(err => {
        dispatch(setFetchLogError(err))
      })
  }
}
