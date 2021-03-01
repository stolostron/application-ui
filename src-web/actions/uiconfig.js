/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright Contributors to the Open Cluster Management project
import * as Actions from './index'

export const uiConfigReceiveSucess = uiConfig => ({
  type: Actions.UICONFIG_RECEIVE_SUCCESS,
  data: uiConfig
})
