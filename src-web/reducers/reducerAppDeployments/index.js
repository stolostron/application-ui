/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

// @flow
import { createAction } from '../../shared/utils/state'

import R from 'ramda'

const UPDATE_APP_DROPDOWN_LIST = 'UPDATE_APP_DROPDOWN_LIST'
const CLEAR_APP_DROPDOWN_LIST = 'CLEAR_APP_DROPDOWN_LIST'

export const initialStateDeployments = {
  appDropDownList: [],
  loading: false
}
export const AppDeployments = (state = initialStateDeployments, action) => {
  switch (action.type) {
  case UPDATE_APP_DROPDOWN_LIST: {
    const containsApp = state.appDropDownList.includes(action.payload)
    // if it contains the application, remove it
    if (containsApp) {
      // Gather all names that are not in the payload to form the new list
      // This basically removes the payload from the appDeployables
      const filterRemoveName = name => name !== action.payload
      const newList = R.filter(filterRemoveName, state.appDropDownList)
      return { ...state, appDropDownList: newList }
    } else {
      // if its not there add it
      const newList = state.appDropDownList.concat([action.payload])
      return { ...state, appDropDownList: newList }
    }
  }
  case CLEAR_APP_DROPDOWN_LIST: {
    return { ...state, appDropDownList: [] }
  }
  default:
    return state
  }
}
export default AppDeployments

export const updateAppDropDownList = createAction(UPDATE_APP_DROPDOWN_LIST)
export const clearAppDropDownList = createAction(CLEAR_APP_DROPDOWN_LIST)
