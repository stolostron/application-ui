/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import { UICONFIG_RECEIVE_SUCCESS } from '../actions'

export const uiconfig = (state = null, action) => {
  switch (action.type) {
  case UICONFIG_RECEIVE_SUCCESS:
    return action.data
  default:
    return state
  }
}
