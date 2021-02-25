/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import * as Actions from './index'

export const roleReceiveSuccess = role => ({
  type: Actions.ROLE_RECEIVE_SUCCESS,
  role
})

export const roleReceiveFailure = err => ({
  type: Actions.ROLE_RECEIVE_FAILURE,
  err
})
