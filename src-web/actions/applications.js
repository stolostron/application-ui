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


export const createApplication = (resourceType, resourceJson) => {
  return (dispatch) => {
    dispatch(mutateResource(resourceType))
    return apolloClient.createApplication(resourceJson)
      .then(result => {
        if (result.data.createApplication.errors && result.data.createApplication.errors.length > 0){
          dispatch(mutateResourceFailure(resourceType, result.data.createApplication.errors[0]))
        } else {
          dispatch(mutateResourceSuccess(resourceType))
        }
        return result
      })
  }
}

