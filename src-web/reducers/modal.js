/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import * as Actions from '../actions'

export const modal = (state = {}, action) => {
  switch (action.type) {
  case Actions.MODAL_UPDATE:
    return Object.assign({}, state, action.data)
  case Actions.CLEAR_REQUEST_STATUS:
    return Object.assign({}, state, {
      reqStatus: undefined,
      reqErrorMsg: undefined,
      reqCount: undefined,
      reqErrCount: undefined
    })
  case Actions.POST_REQUEST:
  case Actions.PUT_REQUEST:
  case Actions.DEL_REQUEST: {
    let reqCount = (state.reqCount || 0)
    return Object.assign({}, state, {
      reqStatus: Actions.REQUEST_STATUS.IN_PROGRESS,
      reqCount: reqCount + 1
    })
  }
  case Actions.POST_RECEIVE_SUCCESS:
  case Actions.PUT_RECEIVE_SUCCESS:
  case Actions.DEL_RECEIVE_SUCCESS: {
    return Object.assign({}, state, {
      reqStatus: Actions.REQUEST_STATUS.DONE,
      reqCount: state.reqCount - 1
    })
  }
  case Actions.POST_RECEIVE_FAILURE:
  case Actions.PUT_RECEIVE_FAILURE:
  case Actions.DEL_RECEIVE_FAILURE: {
    return Object.assign({}, state, {
      reqCount: state.reqCount > 0 ? state.reqCount - 1 : 0,
      reqErrCount: state.reqErrCount ? state.reqErrCount + 1 : 1,
      reqStatus: Actions.REQUEST_STATUS.ERROR,
      reqErrorMsg: action.err && action.err.error && action.err.error.message
    })
  }
  default:
    return state
  }
}
