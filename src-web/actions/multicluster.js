/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import hcmClient from '../../lib/client/hcm-client'
import { receiveResourceSuccess, receiveResourceError, requestResource } from './common'

export const fetchClusters = (resourceType) => {
  return (dispatch) => {
    dispatch(requestResource(resourceType))
    hcmClient.getClusters(
      response => dispatch(receiveResourceSuccess(response, resourceType)),
      err => dispatch(receiveResourceError(err, resourceType)),
    )
  }
}
