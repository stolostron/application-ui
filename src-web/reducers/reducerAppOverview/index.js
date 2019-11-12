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
const SET_ENABLE_ICAM_ACTION = 'SET_ENABLE_ICAM_ACTION'
const SET_CAROUSEL_ITERATOR = 'SET_CAROUSEL_ITERATOR'

export const initialStateOverview = {
  selectedAppTab: 0,
  showAppDetails: false,
  showExpandedTopology: false,
  showICAMAction: false,
  carouselIterator: 0
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
    const {showExpandedTopology, selectedNodeId} = action.payload
    return { ...state, showExpandedTopology, selectedNodeId }
  }
  case SET_ENABLE_ICAM_ACTION: {
    return { ...state, showICAMAction: action.payload }
  }
  case SET_CAROUSEL_ITERATOR: {
    // We want to protect from going below 0
    if (action.payload < 0) {
      return { ...state, carouselIterator: 0 }
    }
    return { ...state, carouselIterator: action.payload }
  }
  default:
    return state
  }
}
export default AppOverview

export const setSelectedAppTab = createAction(SET_SELECTED_APP_TAB)
export const setShowAppDetails = createAction(SET_SHOW_APP_DETAILS)
export const setShowExpandedTopology = createAction(SET_SHOW_EXANDED_TOPOLOGY)
export const setEnableICAMAction = createAction(SET_ENABLE_ICAM_ACTION)
export const setCarouselIterator = createAction(SET_CAROUSEL_ITERATOR)
