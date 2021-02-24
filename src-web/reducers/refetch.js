// Copyright (c) 2020 Red Hat, Inc.

import { REFETCH_INTERVAL_UPDATE } from '../actions'

export const refetch = (state, action) => {
  switch (action.type) {
  case REFETCH_INTERVAL_UPDATE:
    return action.data
  default:
    // get the poll interval from RefreshTimeSelect component
    return Object.assign({}, state, {})
  }
}
