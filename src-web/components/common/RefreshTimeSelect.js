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
import '../../../scss/refresh-time-select.scss'
import msgs from '../../../nls/platform.properties'
import config from '../../../lib/shared/config'

export default class RefreshTimeSelect extends React.Component {
  static propTypes = {
    isReloading: PropTypes.bool,
    locale: PropTypes.string,
    refetchIntervalUpdate: PropTypes.func,
    refreshCookie: PropTypes.string,
    refreshValues: PropTypes.array
  };

  constructor(props) {
    super(props)
    const { refreshCookie, refetchIntervalUpdate } = props

    const pollInterval = getPollInterval(refreshCookie)

    this.state = {
      pollInterval,
      refetchIntervalUpdate
    }
    this.handleChange = this.handleChange.bind(this)

    refetchIntervalUpdate({ doRefetch: false, interval: pollInterval })
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
    const { refreshCookie } = this.props
    const { refetchIntervalUpdate } = this.state
    const pollInterval = getPollInterval(refreshCookie)

    this.doRefetchAction(refetchIntervalUpdate, pollInterval)
  };

  handleKeyPress = e => {
    const { refreshCookie } = this.props
    const { refetchIntervalUpdate } = this.state
    const pollInterval = getPollInterval(refreshCookie)

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
    const { refreshCookie } = this.props
    const { refetchIntervalUpdate } = this.state
    // save interval to cookie
    savePollInterval(refreshCookie, pollInterval)
    // update state with the new poll interval and trigger refetch
    refetchIntervalUpdate({ doRefetch: false, interval: pollInterval })
  };

  componentWillReceiveProps() {
    this.setState((prevState, props) => {
      const { refreshCookie } = props
      return { doRefetch: false, interval: getPollInterval(refreshCookie) }
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

export const getPollInterval = cookieKey => {
  let pollInterval = config['featureFlags:liveUpdatesPollInterval']
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
