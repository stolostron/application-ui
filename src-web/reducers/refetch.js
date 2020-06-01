/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import { REFETCH_INTERVAL_UPDATE } from '../actions'

// get the refetch default from the config file
import config from '../../lib/shared/config'

export const refetch = (
  state = {
    interval: config['featureFlags:liveUpdatesPollInterval'],
    doRefetch: false
  },
  action
) => {
  switch (action.type) {
  case REFETCH_INTERVAL_UPDATE:
    return action.data
  default:
    return state
  }
}
