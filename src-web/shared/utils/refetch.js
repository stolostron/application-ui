/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

import R from 'ramda'
import msgs from '../../../nls/platform.properties'
import React from 'react'
import { Loading } from 'carbon-components-react'
import RefreshTimeSelect from '../../components/common/RefreshTimeSelect'
import { REFRESH_TIMES } from '../../../lib/shared/constants'

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
