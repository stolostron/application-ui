/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

import R from 'ramda'

export const refetchIntervalChanged = (prevProps, nextProps) => {
  return (
    R.path(['refetch', 'interval'], prevProps) !==
    R.path(['refetch', 'interval'], nextProps)
  )
}

export const manualRefetchTriggered = (prevProps, nextProps) => {
  return (
    R.path(['refetch', 'doRefetch'], prevProps) === false &&
    R.path(['refetch', 'doRefetch'], nextProps) === true
  )
}
