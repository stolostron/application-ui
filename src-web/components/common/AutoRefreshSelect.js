/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { Select, SelectItem } from 'carbon-components-react'
import '../../../graphics/diagramIcons.svg'
import config from '../../../lib/shared/config'
import msgs from '../../../nls/platform.properties'
import moment from 'moment'

export default class AutoRefreshSelect extends React.Component {

  static propTypes = {
    pollInterval: PropTypes.number,
    refetch: PropTypes.func.isRequired,
    refreshCookie: PropTypes.string,
    refreshValues: PropTypes.array,
    startPolling: PropTypes.func,
    stopPolling: PropTypes.func,
  }

  constructor (props) {
    super(props)
    this.state = {
      pollInterval: props.pollInterval,
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillMount() {
    const { locale } = this.context
    const { refreshValues=[] } = this.props
    this.autoRefreshChoices = refreshValues.map(pollInterval=>{
      let text
      if (pollInterval>=60) {
        text = msgs.get('refresh.interval.minutes', [pollInterval/60], locale)
      } else if (pollInterval!==0) {
        text = msgs.get('refresh.interval.seconds', [pollInterval], locale)
      } else {
        text = msgs.get('refresh.interval.never', locale)
      }
      pollInterval*=1000
      return {text, pollInterval}
    })
  }

  handleClick = () => {
    this.props.refetch()
  }

  handleKeyPress(e) {
    if ( e.key === 'Enter') {
      this.props.refetch()
    }
  }


  handleChange = (e) => {
    const {pollInterval} = this.autoRefreshChoices[e.currentTarget.selectedIndex]
    const {refreshCookie, startPolling, stopPolling} = this.props
    if (pollInterval===0) {
      stopPolling()
    } else {
      startPolling(pollInterval)
    }
    savePollInterval(refreshCookie, pollInterval)
    this.setState({ pollInterval })
  }

  render() {
    const { pollInterval } = this.state
    const refresh = msgs.get('refresh', this.context.locale)
    return (
      <div className='auto-refresh-selection'>
        <div className='button' tabIndex='0' role={'button'}
          title={refresh} aria-label={refresh}
          onClick={this.handleClick} onKeyPress={this.handleKeyPress}>
          <svg className='button-icon'>
            <use href={'#diagramIcons_autoRefresh'} ></use>
          </svg>
        </div>
        <Select id='refresh-select' className='selection'
          value={pollInterval}
          hideLabel={true}
          onChange={this.handleChange}>
          {this.autoRefreshChoices.map(({text, pollInterval:value})=> {
            return (
              <SelectItem key={value} text={text} value={value} />
            )
          })}
        </Select>
      </div>
    )
  }
}

export const getPollInterval = (cookieKey) => {
  let pollInterval = pollInterval = parseInt(config['featureFlags:liveUpdates']) === 2 ?
    config['featureFlags:liveUpdatesPollInterval'] : 0
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
  }
  return pollInterval
}

export const savePollInterval = (cookieKey, pollInterval) => {
  localStorage.setItem(cookieKey, JSON.stringify({pollInterval}))
}

export const getTimeAgoMsg = (msgKey, startTime, endTime, locale) => {
  let ago = ''
  const seconds = Math.abs(moment(new Date(startTime)).diff(new Date(endTime))) / 1000
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
      } else if (seconds>1) {
        ago = msgs.get('time.seconds.ago', [seconds], locale)
      } else {
        ago = msgs.get('time.just.now', locale)
      }
    }
  }
  return msgs.get(msgKey, [ago], locale)
}

