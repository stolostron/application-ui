/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { DropdownV2, Loading } from 'carbon-components-react'
import '../../../graphics/diagramIcons.svg'
import '../../../scss/refresh-time-select.scss'
import msgs from '../../../nls/platform.properties'
import config from '../../../lib/shared/config'

// get the cookie name from constants

import { ACM_REFRESH_INTERVAL_COOKIE } from '../../../lib/shared/constants'

export default class RefreshTimeSelect extends React.Component {
  static propTypes = {
    isReloading: PropTypes.bool,
    locale: PropTypes.string,
    refetchIntervalUpdate: PropTypes.func,
    refreshValues: PropTypes.array
  };

  constructor(props) {
    super(props)
    const { refetchIntervalUpdate } = props
    const pollInterval = getPollInterval()

    this.state = {
      pollInterval,
      refetchIntervalUpdate
    }
    this.handleChange = this.handleChange.bind(this)

    refetchIntervalUpdate({ doRefetch: false, interval: pollInterval })
  }

  UNSAFE_componentWillMount() {
    const { refreshValues, locale } = this.props
    if (refreshValues && refreshValues.length > 0) {
      this.autoRefreshChoices = refreshValues.map(pollInterval => {
        let label
        if (pollInterval >= 60) {
          label = msgs.get(
            'refresh.interval.minutes',
            [pollInterval / 60],
            locale
          )
        } else if (pollInterval !== 0) {
          label = msgs.get('refresh.interval.seconds', [pollInterval], locale)
        } else {
          label = msgs.get('refresh.interval.never', locale)
        }
        pollInterval *= 1000
        return { label, pollInterval }
      })
    }
  }

  handleClick = () => {
    const { refetchIntervalUpdate } = this.state
    const pollInterval = getPollInterval()

    this.doRefetchAction(refetchIntervalUpdate, pollInterval)
  };

  handleKeyPress = e => {
    const { refetchIntervalUpdate } = this.state
    const pollInterval = getPollInterval()

    if (e.key === 'Enter') {
      this.doRefetchAction(refetchIntervalUpdate, pollInterval)
    }
  };

  // this call does the actual refetch logic
  doRefetchAction = (refetchIntervalUpdate, pollInterval) => {
    refetchIntervalUpdate({
      doRefetch: true,
      interval: pollInterval
    })

    // resets the "doRefetch" flag after 1 second
    setTimeout(() => {
      refetchIntervalUpdate({
        doRefetch: false,
        interval: pollInterval
      })
    }, 1000)
  };

  handleChange = e => {
    const { selectedItem: { pollInterval } } = e
    const { refetchIntervalUpdate } = this.state
    // save interval to cookie
    savePollInterval(pollInterval)
    // update state with the new poll interval and trigger refetch
    refetchIntervalUpdate({ doRefetch: false, interval: pollInterval })
  };

  UNSAFE_componentWillReceiveProps() {
    this.setState(() => {
      return { doRefetch: false, interval: getPollInterval() }
    })
  }

  render() {
    const { locale } = this.props
    const { pollInterval } = this.state
    if (
      pollInterval !== undefined &&
      this.autoRefreshChoices &&
      this.autoRefreshChoices.length > 0
    ) {
      const refresh = msgs.get('refresh', locale)
      const { isReloading } = this.props
      const label = msgs.get('refresh.choose', locale)
      const idx = Math.max(
        0,
        this.autoRefreshChoices.findIndex(({ pollInterval: pi }) => {
          return pollInterval === pi
        })
      )

      return (
        // conditional style to adjust position if there is a breadcrumb header
        <div className="refresh-time-selection">
          {isReloading ? (
            <div className="reloading-container">
              <Loading withOverlay={false} small />
            </div>
          ) : (
            <div
              id="refreshButton"
              className="button"
              tabIndex="0"
              role={'button'}
              title={refresh}
              aria-label={refresh}
              onClick={this.handleClick}
              onKeyPress={this.handleKeyPress}
            >
              <svg className="button-icon">
                <use href={'#diagramIcons_autoRefresh'} />
              </svg>
            </div>
          )}
          <DropdownV2
            id="refreshDropdown"
            className="selection"
            label={label}
            ariaLabel={label}
            onChange={this.handleChange}
            inline={true}
            initialSelectedItem={this.autoRefreshChoices[idx].label}
            items={this.autoRefreshChoices}
          />
        </div>
      )
    }
    return null
  }
}

export const getPollInterval = () => {
  let pollInterval = config['featureFlags:liveUpdatesPollInterval'] || 0
  const savedInterval = localStorage.getItem(ACM_REFRESH_INTERVAL_COOKIE)
  if (savedInterval) {
    try {
      const saved = JSON.parse(savedInterval)
      if (saved.pollInterval !== undefined) {
        pollInterval = saved.pollInterval
      }
    } catch (e) {
      //
    }
  } else {
    savePollInterval(pollInterval)
  }
  return pollInterval
}

export const savePollInterval = pollInterval => {
  localStorage.setItem(
    ACM_REFRESH_INTERVAL_COOKIE,
    JSON.stringify({ pollInterval })
  )
}
