/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import apolloClient from '../../lib/client/apollo-client'
import { mutateResource, mutateResourceFailure, mutateResourceSuccess } from './common'
import { RESOURCE_TYPES } from '../../lib/shared/constants'

export const createDashboard = (appName) => {
  return (dispatch) => {
    dispatch(mutateResource(RESOURCE_TYPES.HCM_APPLICATIONS, appName))
    return apolloClient.createDashboard(appName)
      .then(result => {
        if (result.errors && result.errors.length > 0){
          dispatch(mutateResourceFailure(RESOURCE_TYPES.HCM_APPLICATIONS, result.errors[0]))
        } else {
          dispatch(mutateResourceSuccess(RESOURCE_TYPES.HCM_APPLICATIONS, appName))
        }
        return result
      })
  }
}


export const deployApplication = (appName) => {
  return (dispatch) => {
    dispatch(mutateResource(RESOURCE_TYPES.HCM_APPLICATIONS, appName))
    return apolloClient.deployApplication(appName)
      .then(result => {
        if (result.errors && result.errors.length > 0){
          dispatch(mutateResourceFailure(RESOURCE_TYPES.HCM_APPLICATIONS, result.errors[0]))
        } else {
          dispatch(mutateResourceSuccess(RESOURCE_TYPES.HCM_APPLICATIONS, appName))
        }
        return result
      })
  }
}


export const undeployApplication = (appName) => {
  return (dispatch) => {
    dispatch(mutateResource(RESOURCE_TYPES.HCM_APPLICATIONS, appName))
    return apolloClient.undeployApplication(appName)
      .then(result => {
        if (result.errors && result.errors.length > 0){
          dispatch(mutateResourceFailure(RESOURCE_TYPES.HCM_APPLICATIONS, result.errors[0]))
        } else {
          dispatch(mutateResourceSuccess(RESOURCE_TYPES.HCM_APPLICATIONS, appName))
        }
        return result
      })
  }
}
