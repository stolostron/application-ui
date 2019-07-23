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

const SET_SHOW_APP_DETAILS = 'SET_SHOW_APP_DETAILS'

export const initialStateOverview = {
  showAppDetails: false
}

export const AppOverview = (state = initialStateOverview, action) => {
  switch (action.type) {
  case SET_SHOW_APP_DETAILS: {
    return { ...state, showAppDetails: action.payload }
  }
  default:
    return state
  }
}
export default AppOverview

export const setShowAppDetails = createAction(SET_SHOW_APP_DETAILS)
