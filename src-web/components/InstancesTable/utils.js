/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

export const updatePendingActions = (items, pendingActions) => {
  if (items && pendingActions) {
    Object.keys(items).map(key => {
      if (pendingActions.find(pending => pending.name === items[key].Name))
        items[key].hasPendingActions = true
    })
  }
  return items
}
