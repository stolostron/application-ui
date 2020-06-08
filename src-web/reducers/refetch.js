/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

import { REFETCH_INTERVAL_UPDATE } from '../actions'
import { getPollInterval } from '../components/common/RefreshTimeSelect'

export const refetch = (state, action) => {
  switch (action.type) {
  case REFETCH_INTERVAL_UPDATE:
    return action.data
  default:
    // get the poll interval from RefreshTimeSelect component
    return Object.assign({}, state, {
      interval: getPollInterval(),
      doRefetch: false
    })
  }
}
