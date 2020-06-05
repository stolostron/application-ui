/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

import { REFETCH_INTERVAL_UPDATE } from '../actions'

// get the refetch default from the config file
import config from '../../lib/shared/config'

export const refetch = action => {
  switch (action.type) {
  case REFETCH_INTERVAL_UPDATE:
    return action.data
  default:
    return {
      interval: config['featureFlags:liveUpdatesPollInterval'],
      doRefetch: false
    }
  }
}
