/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

// @flow
import { createAction } from '../../shared/utils/state'

const SET_SELECTED_APP_TAB = 'SET_SELECTED_APP_TAB'
const SET_SHOW_APP_DETAILS = 'SET_SHOW_APP_DETAILS'
const SET_SHOW_EXANDED_TOPOLOGY = 'SET_SHOW_EXANDED_TOPOLOGY'
const SET_ENABLE_GRAFANA_ACTION = 'SET_ENABLE_GRAFANA_ACTION'
const SET_ENABLE_CEM_ACTION = 'SET_ENABLE_CEM_ACTION'

export const initialStateOverview = {
  selectedAppTab: 0,
  showAppDetails: false,
  showExpandedTopology: false,
  showGrafanaAction: false,
  showCEMAction: false
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
  case SET_ENABLE_GRAFANA_ACTION: {
    return { ...state, showGrafanaAction: action.payload }
  }
  case SET_ENABLE_CEM_ACTION: {
    return { ...state, showCEMAction: action.payload }
  }
  default:
    return state
  }
}
export default AppOverview

export const setSelectedAppTab = createAction(SET_SELECTED_APP_TAB)
export const setShowAppDetails = createAction(SET_SHOW_APP_DETAILS)
export const setShowExpandedTopology = createAction(SET_SHOW_EXANDED_TOPOLOGY)
export const setEnableGrafanaAction = createAction(SET_ENABLE_GRAFANA_ACTION)
export const setEnableCEMAction = createAction(SET_ENABLE_CEM_ACTION)
