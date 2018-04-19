/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import * as Actions from './index'

export const navReceiveSuccess = navItems => {
  return {
    type: Actions.NAV_RECEIVE_SUCCESS,
    navItems
  }
}

export const updateNav = (navItem, role, namespaces) => (dispatch) => dispatch({
  type: Actions.NAV_MODIFY,
  ...navItem,
  ...role,
  ...namespaces
})
