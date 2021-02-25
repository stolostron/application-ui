/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
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
