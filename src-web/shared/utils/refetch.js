/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

import R from 'ramda'
import React from 'react'
import { Loading } from 'carbon-components-react'
import { REFRESH_TIMES } from '../../../lib/shared/constants'
import {
  AcmActionGroup,
  AcmAutoRefreshSelect,
  AcmRefreshTime
} from '@open-cluster-management/ui-components'

export const startPolling = (component, setInterval) => {
  if (R.pathOr(-1, ['refetch', 'interval'], component.props) > 0) {
    const intervalId = setInterval(
      component.reload.bind(component),
      component.props.refetch.interval
    )
    component.setState({ intervalId: intervalId })
  }
}

export const stopPolling = (state, clearInterval) => {
  if (state && state.intervalId) {
    clearInterval(state.intervalId)
  }
}

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

export const handleRefreshPropertiesChanged = (
  prevProps,
  component,
  clearInterval,
  setInterval
) => {
  // manual refetch
  if (manualRefetchTriggered(prevProps, component.props)) {
    component.reload()
  } else if (refetchIntervalChanged(prevProps, component.props)) {
    // if old and new interval are different, restart polling
    stopPolling(component.state, clearInterval)
    startPolling(component, setInterval)
  }
}

export const handleVisibilityChanged = (
  component,
  clearInterval,
  setInterval
) => {
  if (document.visibilityState === 'visible') {
    startPolling(component, setInterval)
  } else {
    if (component.mutateFinished) {
      component.mutateFinished()
    }
    stopPolling(component.state, clearInterval)
  }
}

export const renderRefreshTime = (
  refetchIntervalUpdateDispatch,
  isLoaded,
  isReloading,
  timestamp,
  locale,
  refetch
) => {


  if (isLoaded) {
    return (
      <div className="refresh-time-div">
        <div className="refresh-time-container">
          {isReloading && (
            <div className="reloading-container">
              <Loading withOverlay={false} small />
            </div>
          )}
          {/* <RefreshTimeSelect
            refreshValues={REFRESH_TIMES}
            refetchIntervalUpdate={refetchIntervalUpdateDispatch}
          /> */}
          <AcmActionGroup>
            <AcmAutoRefreshSelect
              refetch={refetch}
              refreshIntervals={REFRESH_TIMES}
            />
          </AcmActionGroup>
          <AcmRefreshTime timestamp={timestamp} reloading={isReloading} />
        </div>
      </div>
    )
  }
  return null
}
