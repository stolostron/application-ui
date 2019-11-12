/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import {
  LOGS_RECEIVE_SUCCESS,
  LOGS_RECEIVE_FAILURE,
  LOGS_RECEIVE_IN_PROGRESS,
  LOGS_RESET,
  REQUEST_STATUS
} from '../actions'

export const logs = (state = null, action) => {
  switch (action.type) {
  case LOGS_RESET:
    return { logs: null, status: REQUEST_STATUS.DONE }
  case LOGS_RECEIVE_IN_PROGRESS:
    return { ...state, status: LOGS_RECEIVE_IN_PROGRESS }
  case LOGS_RECEIVE_SUCCESS:
    return { ...action, status: REQUEST_STATUS.DONE }
  case LOGS_RECEIVE_FAILURE:
    return {
      ...state,
      status: REQUEST_STATUS.ERROR,
      errorMessage: action.err && action.err.details,
      statusCode: action.err && action.err.statusCode
    }
  default:
    return state
  }
}
