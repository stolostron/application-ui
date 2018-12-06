/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
import * as Actions from './index'
import apolloClient from '../../lib/client/apollo-client'

export const resetLogs= () => ({
  type: Actions.LOGS_RESET
})

export const searchLogs = (search, resourceType) => ({
  type: Actions.LOGS_SEARCH,
  search,
  resourceType
})

export const receiveLogsSuccess = (response) => ({
  type: Actions.LOGS_RECEIVE_SUCCESS,
  status: Actions.REQUEST_STATUS.DONE,
  data: response,
})

export const receiveLogsFailure = (response) => ({
  type: Actions.LOGS_RECEIVE_FAILURE,
  status: Actions.REQUEST_STATUS.DONE,
  data: response,
})

export const receiveLogsInProgress = () => ({
  type: Actions.LOGS_RECEIVE_IN_PROGRESS,
  status: Actions.REQUEST_STATUS.IN_PROGRESS,
})

export const fetchLogs = (containerName, podName, podNamespace, clusterName) => (dispatch => {
  dispatch(receiveLogsInProgress())
  return apolloClient.getLogs(containerName, podName, podNamespace, clusterName).then(result => {
    if (result.data.logs.errors && result.data.logs.errors.length > 0){
      dispatch(receiveLogsFailure(result.data.logs.errors[0]))
    } else {
      dispatch(receiveLogsSuccess(result.data.logs))
    }
  })
})
