/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import * as Actions from './index'

export const uiConfigReceiveSucess = uiConfig => ({
  type: Actions.UICONFIG_RECEIVE_SUCCESS,
  data: uiConfig
})
