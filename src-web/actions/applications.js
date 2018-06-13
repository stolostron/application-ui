/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import apolloClient from '../../lib/client/apollo-client'
import * as Actions from './index'

export const createDashboard = (appName) => {
  return (dispatch) => {
    dispatch({
      type: Actions.CREATE_GRAFANA_DASHBOARD,
    })
    return apolloClient.createDashboard(appName)
  }
}
