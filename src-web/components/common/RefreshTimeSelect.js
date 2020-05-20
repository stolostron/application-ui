/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { DropdownV2, Loading } from 'carbon-components-react'
import '../../../graphics/diagramIcons.svg'
import { DEFAULT_REFRESH_TIME } from '../Topology/viewer/constants'
import '../../../scss/refresh-time-select.scss'
import msgs from '../../../nls/platform.properties'
import moment from 'moment'

export default class RefreshTimeSelect extends React.Component {
  static propTypes = {
    isReloading: PropTypes.bool,
    locale: PropTypes.string,
    refetch: PropTypes.func,
    refreshCookie: PropTypes.string,
    refreshValues: PropTypes.array,
    startPolling: PropTypes.func,
    stopPolling: PropTypes.func
  };

  constructor(props) {
    super(props)
    const { refreshCookie } = props
    this.state = {
      pollInterval: getPollInterval(refreshCookie)
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillMount() {
    const { refreshValues = [], locale } = this.props
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

  handleClick = () => {
    const { refetch } = this.props
    refetch()
  };

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      const { refetch } = this.props
      refetch()
    }
  }

  handleChange = e => {
    const { selectedItem: { pollInterval } } = e
    const { refreshCookie, startPolling, stopPolling } = this.props
    if (pollInterval === 0) {
      stopPolling()
    } else {
      startPolling(pollInterval, true)
    }
    savePollInterval(refreshCookie, pollInterval)
    this.setState({ pollInterval })
  };

  componentWillReceiveProps() {
    this.setState((prevState, props) => {
      const { refreshCookie } = props
      return { pollInterval: getPollInterval(refreshCookie) }
    })
  }

  render() {
    const { locale } = this.props
    const { pollInterval } = this.state
    if (pollInterval !== undefined) {
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
        <div className="refresh-time-selection">
          {isReloading ? (
            <div className="reloading-container">
              <Loading withOverlay={false} small />
            </div>
          ) : (
            <div
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

export const getPollInterval = cookieKey => {
  let pollInterval = DEFAULT_REFRESH_TIME * 1000
  if (cookieKey) {
    const savedInterval = localStorage.getItem(cookieKey)
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
      savePollInterval(cookieKey, pollInterval)
    }
  }
  return pollInterval
}

export const savePollInterval = (cookieKey, pollInterval) => {
  localStorage.setItem(cookieKey, JSON.stringify({ pollInterval }))
}

export const getTimeAgoMsg = (msgKey, startTime, endTime, locale) => {
  let ago = ''
  const seconds =
    Math.abs(moment(new Date(startTime)).diff(new Date(endTime))) / 1000
  let interval = Math.floor(seconds / 86400)
  if (interval >= 1) {
    ago = msgs.get('time.days.ago', [interval], locale)
  } else {
    interval = Math.floor(seconds / 3600)
    if (interval >= 1) {
      ago = msgs.get('time.hours.ago', [interval], locale)
    } else {
      interval = Math.floor(seconds / 60)
      if (interval >= 1) {
        ago = msgs.get('time.minutes.ago', [interval], locale)
      } else if (seconds > 1) {
        ago = msgs.get('time.seconds.ago', [seconds], locale)
      } else {
        ago = msgs.get('time.just.now', locale)
      }
    }
  }
  return msgs.get(msgKey, [ago], locale)
}
