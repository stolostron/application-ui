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
import resources from '../../../lib/shared/resources'
import { Select, SelectItem } from 'carbon-components-react'
import '../../../graphics/diagramIcons.svg'
import config from '../../../lib/shared/config'
import msgs from '../../../nls/platform.properties'
import moment from 'moment'

resources(() => {
  require('../../../scss/refresh-select.scss')
})

// choices in seconds
const refreshValues = [0, 5, 10, 15, 30, 60, 2*60, 15*60, 30*60]

export default class RefreshSelect extends React.Component {

  static propTypes = {
    pollInterval: PropTypes.number,
    refetch: PropTypes.func,
    refreshCookie: PropTypes.string,
    startPolling: PropTypes.func,
    stopPolling: PropTypes.func,
    timestamp: PropTypes.string,
  }

  constructor (props) {
    super(props)
    this.state = {
      pollInterval: props.pollInterval,
      timestamp: props.timestamp,
      currentTime: new Date().toString(),
    }
  }

  handleChange = ({target}) => {
    const {refreshCookie, startPolling, stopPolling} = this.props
    const pollInterval = refreshValues[target.selectedIndex]*1000
    if (pollInterval===0) {
      stopPolling()
    } else {
      startPolling(pollInterval)
    }
    savePollInterval(refreshCookie, pollInterval)
    this.setState({ pollInterval })
  }

  handleClick = () => {
    this.props.refetch()
  }

  componentWillMount() {
    const { locale } = this.context
    this.refreshChoices = refreshValues.map(value=>{
      let text
      if (value>=60) {
        text = msgs.get('refresh.interval.minutes', [value/60], locale)
      } else if (value!==0) {
        text = msgs.get('refresh.interval.seconds', [value], locale)
      } else {
        text = msgs.get('refresh.interval.never', locale)
      }
      value*=1000
      return {text, value}
    })

    this.interval = setInterval(() => {
      this.setState({
        currentTime: new Date().toString(),
      })
    }, 1000)

  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      pollInterval: nextProps.pollInterval,
      timestamp: nextProps.timestamp,
    })
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.state.pollInterval !== nextState.pollInterval ||
      this.state.timestamp !== nextState.timestamp ||
      this.state.currentTime !== nextState.currentTime
  }

  render() {
    const {pollInterval, timestamp, currentTime} = this.state
    const refresh = msgs.get('refresh', this.context.locale)
    const tooltip = getTimeAgoMsg('refresh.interval.refreshed', timestamp, currentTime, this.context.locale)
    return (
      <div className='refresh-select'>
        <Select
          hideLabel
          title={tooltip}
          onChange={this.handleChange}
          value={pollInterval}>
          {this.refreshChoices.map(({text, value}) => {
            return (
              <SelectItem key={text} text={text} value={value} />
            )})}
        </Select>
        <div className='refresh-button' tabIndex='0' role={'button'}
          title={tooltip} aria-label={refresh}
          onClick={this.handleClick} onKeyPress={this.handleKeyPress} >
          <svg width="16px" height="16px">
            <use href={'#diagramIcons_refresh'} className={'refresh-button-icon'}></use>
          </svg>
        </div>
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
      if (saved.pollInterval) {
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
  const seconds = Math.abs(moment(startTime).diff(endTime)) / 1000
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

