/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.

 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

import {
  APPLICATION_CREATE_IN_PROGRESS,
  APPLICATION_CREATE_FAILURE,
  APPLICATION_CREATE_SUCCESS,
  APPLICATION_CREATE_CLEAR_STATUS,
  REQUEST_STATUS
} from '../actions'

export const applicationPageResources = (state = null, action) => {
  switch (action.type) {
  case APPLICATION_CREATE_CLEAR_STATUS:
    return {
      mutateStatus: null,
      mutateErrorMsg: null
    }
  case APPLICATION_CREATE_IN_PROGRESS:
    return {
      mutateStatus: REQUEST_STATUS.IN_PROGRESS,
      mutateErrorMsg: null
    }
  case APPLICATION_CREATE_FAILURE:
    return Object.assign({}, state, {
      mutateStatus: REQUEST_STATUS.ERROR,
      mutateErrorMsgs: action.errors
    })
  case APPLICATION_CREATE_SUCCESS:
    return Object.assign({}, state, {
      mutateStatus: REQUEST_STATUS.DONE
    })

  default:
    return state
  }
}
