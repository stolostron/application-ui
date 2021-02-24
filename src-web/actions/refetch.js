// Copyright (c) 2020 Red Hat, Inc.

import { REFETCH_INTERVAL_UPDATE } from './index'

// pass the refetch flag and also the interval value
export const refetchIntervalUpdate = refetch => ({
  type: REFETCH_INTERVAL_UPDATE,
  data: refetch
})
