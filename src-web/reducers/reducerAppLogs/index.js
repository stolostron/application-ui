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
import { SEARCH_QUERY } from '../../apollo-client/queries/SearchQueries'

const SET_LOG_DATA = 'SET_LOG_DATA'
const SET_LOG_ERROR = 'SET_LOG_ERROR'

export const initialStateLogs = {
  logData: {},
  fetchLogDataError: '',
  loading: false,
}

export const LogOverview = (state = initialStateLogs, action) => {
  switch (action.type) {
  case SET_LOG_DATA: {
    return { ...state, logData: action.payload }
  }
  case SET_LOG_ERROR: {
    return { ...state, fetchLogDataError: action.payload }
  }
  default:
    return state
  }
}
export default LogOverview

export const setLogData = createAction(SET_LOG_DATA)
export const setLogError = createAction(SET_LOG_ERROR)

//fetch pods for application - TODO change this this is dummy data
export const fetchPodsForApplication = (apolloClient, namespace, name) => {
  console.log('fetchPodsForApplication')
  return dispatch => {
    return apolloClient
      .search(SEARCH_QUERY, {
        input: [`kind:pods label:app:gbchn namespace:${namespace}`]
      })
      .then(response => {
        console.log('response', response)
        if (response.errors) {
          return dispatch(setLogError(response.errors))
        }
        return dispatch(setLogData(response))
      })
      .catch(err => {
        dispatch(setLogError(err))
      })
  }
}
