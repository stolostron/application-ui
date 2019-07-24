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
const SET_SHOW_EXANDED_TOPOLOGY = 'SET_SHOW_EXANDED_TOPOLOGY'

export const initialStateOverview = {
  showAppDetails: false,
  showExpandedTopology: false,
}

export const AppOverview = (state = initialStateOverview, action) => {
  switch (action.type) {
  case SET_SHOW_APP_DETAILS: {
    return { ...state, showAppDetails: action.payload }
  }
  case SET_SHOW_EXANDED_TOPOLOGY: {
    return { ...state, showExpandedTopology: action.payload }
  }
  default:
    return state
  }
}
export default AppOverview

export const setShowAppDetails = createAction(SET_SHOW_APP_DETAILS)
export const setShowExpandedTopology = createAction(SET_SHOW_EXANDED_TOPOLOGY)
