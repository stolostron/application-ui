/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

import * as Actions from './index'

// pass the refetch flag and also the interval value
export const refetchIntervalUpdate = refetch => ({
  type: Actions.REFETCH_INTERVAL_UPDATE,
  data: refetch
})
