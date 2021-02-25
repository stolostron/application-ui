/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

// @flow
import { createAction } from '../../shared/utils/state'

const SET_SELECTED_APP_TAB = 'SET_SELECTED_APP_TAB'
const SET_SHOW_APP_DETAILS = 'SET_SHOW_APP_DETAILS'
const SET_SHOW_EXANDED_TOPOLOGY = 'SET_SHOW_EXANDED_TOPOLOGY'

export const initialStateOverview = {
  selectedAppTab: 0,
  showAppDetails: false,
  showExpandedTopology: false
}

export const AppOverview = (state = initialStateOverview, action) => {
  switch (action.type) {
  case SET_SELECTED_APP_TAB: {
    return { ...state, selectedAppTab: action.payload }
  }
  case SET_SHOW_APP_DETAILS: {
    return { ...state, showAppDetails: action.payload }
  }
  case SET_SHOW_EXANDED_TOPOLOGY: {
    const { showExpandedTopology, selectedNodeId } = action.payload
    return { ...state, showExpandedTopology, selectedNodeId }
  }
  default:
    return state
  }
}
export default AppOverview

export const setSelectedAppTab = createAction(SET_SELECTED_APP_TAB)
export const setShowAppDetails = createAction(SET_SHOW_APP_DETAILS)
export const setShowExpandedTopology = createAction(SET_SHOW_EXANDED_TOPOLOGY)
