/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
import {
  NAV_RECEIVE_SUCCESS,
  REQUEST_STATUS,
  NAV_MODIFY
} from '../actions'
import lodash from 'lodash'

export const nav = (state = null, action) => {
  var navItems, index
  switch (action.type) {
  case NAV_RECEIVE_SUCCESS:
    return { ...action, status: REQUEST_STATUS.DONE }
  /* eslint-disable no-case-declarations */
  case NAV_MODIFY:
    let route = state.navItems && state.navItems.find(item => item.id === action.route)
    if (!route)
      return state
    const allowedRoles = action.roles && action.roles.split(',')
    index = lodash.findIndex(route.subItems, item => item.id === action.id)
    action.enabled ?
      index === -1 && route.subItems.push({
        id: action.id,
        label: action.displayName,
        url: action.url,
        serviceId: action.chart,
        external: true,
        disabled: !(allowedRoles && allowedRoles.find(role => role.toLowerCase() === (action.currentRole && action.currentRole.toLowerCase())) && action.namespaces && action.namespaces.find(namespace => namespace.Name === action.namespace))
      }) : index > -1 && route.subItems.splice(index, 1)
    navItems = state.navItems.splice(0)
    navItems = navItems.map(navItem => {
      if (navItem.id === action.id)
        navItem = route
      return navItem
    })
    return { navItems }
  default:
    return state
  }
}
