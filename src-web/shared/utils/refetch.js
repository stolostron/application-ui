// Copyright (c) 2020 Red Hat, Inc.

import R from 'ramda'
import msgs from '../../../nls/platform.properties'
import React from 'react'
import { Loading } from 'carbon-components-react'
import RefreshTimeSelect from '../../components/common/RefreshTimeSelect'
import { REFRESH_TIMES } from '../../../lib/shared/constants'

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
  locale
) => {
  if (isLoaded) {
    const time = msgs.get(
      'overview.menu.last.update',
      [new Date(timestamp).toLocaleTimeString(locale)],
      locale
    )
    return (
      <div className="refresh-time-div">
        <div className="refresh-time-container">
          {isReloading && (
            <div className="reloading-container">
              <Loading withOverlay={false} small />
            </div>
          )}
          <RefreshTimeSelect
            refreshValues={REFRESH_TIMES}
            refetchIntervalUpdate={refetchIntervalUpdateDispatch}
          />
          <div>{time}</div>
        </div>
      </div>
    )
  }
  return null
}
