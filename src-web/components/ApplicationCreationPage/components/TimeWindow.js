// Copyright (c) 2020 Red Hat, Inc. All Rights Reserved.
// Copyright Contributors to the Open Cluster Management project
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import resources from '../../../../lib/shared/resources'
import { AcmSelect } from '@open-cluster-management/ui-components'
import {
  Radio,
  Checkbox,
  Accordion,
  AccordionItem,
  AccordionToggle,
  AccordionContent,
  SelectOption,
  SelectVariant,
  TimePicker
} from '@patternfly/react-core'
import PlusCircleIcon from '@patternfly/react-icons/dist/js/icons/plus-circle-icon'
import TimesCircleIcon from '@patternfly/react-icons/dist/js/icons/times-circle-icon'
import { Tooltip, getSourcePath, removeVs } from 'temptifly'
import msgs from '../../../../nls/platform.properties'
import _ from 'lodash'

const moment = require('moment-timezone')
resources(() => {
  require('./style.scss')
})

export class TimeWindow extends React.Component {
  static propTypes = {
    control: PropTypes.object,
    controlId: PropTypes.string,
    handleChange: PropTypes.func,
    locale: PropTypes.string
  };

  constructor(props) {
    super(props)
    if (_.isEmpty(this.props.control.active)) {
      this.props.control.active = {
        mode: '',
        days: [],
        timezone: '',
        showTimeSection: false,
        timeList: [{ id: 0, start: '', end: '', validTime: true }],
        timeListID: 1
      }
    }
    this.state = {
      timezoneCache: { isSelected: false, tz: '' },
      isExpanded: this.props.control.active.mode
    }
    this.props.control.validation = this.validation.bind(this)

    this.timezoneList = this.renderTimezones(
      moment.tz.names(),
      moment.tz.guess(true),
      'timezone-dropdown'
    ).map(tz => (
      <SelectOption key={tz.key} value={tz.value}>
        {tz.label}
      </SelectOption>
    ))

    this.daysMap = new Map([
      ['mon', 'Monday'],
      ['tue', 'Tuesday'],
      ['wed', 'Wednesday'],
      ['thu', 'Thursday'],
      ['fri', 'Friday'],
      ['sat', 'Saturday'],
      ['sun', 'Sunday']
    ])
  }

  validation(exceptions) {
    const { control, locale } = this.props
    // Mode is active/blocked
    if (control.active.mode) {
      // Add exception if no days selected
      if (control.active.days.length === 0) {
        exceptions.push({
          row: 1,
          text: msgs.get('creation.missing.timeWindow.days', locale),
          type: 'error',
          controlId: 'timeWindow-config'
        })
      }
      // Add exception if no timezone selected
      if (!control.active.timezone) {
        exceptions.push({
          row: 1,
          text: msgs.get('creation.missing.timeWindow.timezone', locale),
          type: 'error',
          controlId: 'timeWindow-config'
        })
      }
      // Add exception if no timelist selected
      if (control.active.timeList && control.active.timeList.length > 0) {
        const invalidTimeRange = timeRange =>
          timeRange.validTime &&
          (timeRange.start === '' || timeRange.end === '')
        if (control.active.timeList.some(invalidTimeRange)) {
          exceptions.push({
            row: 1,
            text: msgs.get('creation.missing.timeWindow.timelist', locale),
            type: 'error',
            controlId: 'timeWindow-config'
          })
        }
      } else {
        exceptions.push({
          row: 1,
          text: msgs.get('creation.missing.timeWindow.timelist', locale),
          type: 'error',
          controlId: 'timeWindow-config'
        })
      }
    }
  }

  render() {
    const { isExpanded } = this.state
    const onToggle = toggleStatus => {
      this.setState({ isExpanded: !toggleStatus })
    }
    const { controlId, locale, control } = this.props
    const { name, active, validation = {} } = control
    const modeSelected = active && active.mode ? true : false
    const { mode, days = [], timezone } = this.props.control.active

    return (
      <React.Fragment>
        <div className="creation-view-controls-labels">
          <div className="creation-view-controls-textarea-title">
            {name}
            {validation.required ? (
              <div className="creation-view-controls-required">*</div>
            ) : null}
            <Tooltip control={control} locale={locale} />
          </div>

          <div className="timeWindow-container">
            <Radio
              className="mode-btn"
              name={`timeWindow-mode-container-${controlId}`}
              id={`default-mode-${controlId}`}
              label={msgs.get(
                'creation.app.settings.timeWindow.defaultMode',
                locale
              )}
              value=""
              onChange={this.handleChange.bind(this)}
              defaultChecked={!mode}
            />
            <Radio
              className="mode-btn"
              name={`timeWindow-mode-container-${controlId}`}
              id={`active-mode-${controlId}`}
              label={msgs.get(
                'creation.app.settings.timeWindow.activeMode',
                locale
              )}
              value="&quot;active&quot;"
              onChange={this.handleChange.bind(this)}
              defaultChecked={mode === 'active'}
            />
            <Radio
              className="mode-btn"
              name={`timeWindow-mode-container-${controlId}`}
              id={`blocked-mode-${controlId}`}
              label={msgs.get(
                'creation.app.settings.timeWindow.blockedMode',
                locale
              )}
              value="&quot;blocked&quot;"
              onChange={this.handleChange.bind(this)}
              defaultChecked={mode === 'blocked'}
            />

            <Accordion>
              <AccordionItem>
                <AccordionToggle
                  onClick={() => {
                    onToggle(isExpanded)
                  }}
                  isExpanded={isExpanded}
                  id="time-window-header"
                >
                  {msgs.get('creation.app.settings.timeWindow.config', locale)}
                </AccordionToggle>
                <AccordionContent isHidden={!isExpanded}>
                  <div
                    className="timeWindow-config-container"
                    id="timeWindow-config"
                  >
                    <div className="config-days-section">
                      <div className="config-title">
                        {msgs.get(
                          'creation.app.settings.timeWindow.config.days.title',
                          locale
                        )}{' '}
                        <div className="config-title-required">*</div>
                      </div>
                      <div className="config-descr">
                        {msgs.get(
                          'creation.app.settings.timeWindow.config.days.descr',
                          locale
                        )}
                      </div>
                      <div className="config-days-selector">
                        <div className="first-col">
                          {Array.from(this.daysMap, ([key, value]) => {
                            return (
                              <Checkbox
                                isChecked={days.includes(`"${value}"`)}
                                label={value}
                                name={`days-selector-${key}`}
                                id={`${key}-${controlId}`}
                                key={`${key}-${controlId}`}
                                value={`"${value}"`}
                                isDisabled={!modeSelected}
                                onChange={this.handleChange.bind(this)}
                              />
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="config-timezone-section">
                      <div className="config-title">
                        {msgs.get(
                          'creation.app.settings.timeWindow.config.timezone.title',
                          locale
                        )}{' '}
                        <div className="config-title-required">*</div>
                      </div>
                      <AcmSelect
                        id="timeZoneSelect"
                        variant={SelectVariant.typeahead}
                        inlineFilterPlaceholderText="Select a state"
                        aria-label="timezoneComboBox"
                        className="config-timezone-combo-box"
                        placeholder={msgs.get(
                          'timeWindow.label.timezone.placeholder',
                          locale
                        )}
                        value={timezone || ''}
                        isDisabled={!modeSelected}
                        maxHeight={180}
                        onFilter={e => {
                          let input
                          try {
                            input = new RegExp(e.target.value, 'i')
                          } catch (err) {
                            // Nothing to do
                          }
                          return e.target.value !== ''
                            ? this.timezoneList.filter(child =>
                              input.test(child.props.value)
                            )
                            : this.timezoneList
                        }}
                        onChange={this.handleTimeZone}
                      >
                        {this.timezoneList}
                      </AcmSelect>
                    </div>

                    <div className="config-time-section">
                      {this.renderTimes(control, modeSelected)}
                      <div
                        className={`add-time-btn ${
                          !modeSelected ? 'btn-disabled' : ''
                        }`}
                        tabIndex="0"
                        role={'button'}
                        onClick={() =>
                          this.addTimeToList(control, modeSelected)
                        }
                        onKeyPress={this.addTimeKeyPress.bind(this)}
                      >
                        <PlusCircleIcon
                          color="#06c"
                          key="add-time"
                          className="add-time-btn-icon"
                        />
                        <div className="add-time-btn-text">
                          {msgs.get(
                            'creation.app.settings.timeWindow.config.time.add',
                            locale
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </React.Fragment>
    )
  }

  renderTimezones = (timezoneList, localTimezone, id) => {
    const timezoneObjList = [
      {
        label: localTimezone,
        key: `${localTimezone}-${id}`,
        value: `"${localTimezone}"`
      }
    ]

    timezoneList = timezoneList.filter(e => e !== localTimezone)

    timezoneList.forEach(tz => {
      timezoneObjList.push({
        label: tz,
        key: `${tz}-${id}`,
        value: `"${tz}"`
      })
    })

    return timezoneObjList
  };

  renderTimes = (control, modeSelected) => {
    const { locale, controlId } = this.props
    return (
      control.active &&
      control.active.timeList.map(item => {
        const { id, existingStart, existingEnd, validTime } = item
        // Don't show deleted time invertals
        if (validTime) {
          return (
            <React.Fragment key={id}>
              {id === 0 ? (
                <div className="time-picker-title">
                  <div className="config-title">
                    {msgs.get(
                      'creation.app.settings.timeWindow.config.timezone.startTime',
                      locale
                    )}{' '}
                    <div className="config-title-required">*</div>
                  </div>
                  <div className="config-title">
                    {msgs.get(
                      'creation.app.settings.timeWindow.config.timezone.endTime',
                      locale
                    )}{' '}
                    <div className="config-title-required">*</div>
                  </div>
                </div>
              ) : (
                ''
              )}
              <div className="config-time-container">
                <div className="config-input-time">
                  <TimePicker
                    id={`start-time-${id}-${controlId}`}
                    defaultTime={existingStart ? existingStart : ''}
                    isDisabled={!modeSelected}
                    onChange={this.handleTimeRange.bind(this)}
                    width={'140px'}
                  />
                </div>
                <div className="config-input-time">
                  <TimePicker
                    id={`end-time-${id}-${controlId}`}
                    defaultTime={existingEnd ? existingEnd : ''}
                    isDisabled={!modeSelected}
                    onChange={this.handleTimeRange.bind(this)}
                    width={'140px'}
                  />
                </div>
                {id !== 0 ? ( // Option to remove added times
                  <div
                    id={id}
                    className={`remove-time-btn ${
                      !modeSelected ? 'btn-disabled' : ''
                    }`}
                    tabIndex="0"
                    role={'button'}
                    onClick={() =>
                      this.removeTimeFromList(control, item, modeSelected)
                    }
                    onKeyPress={this.removeTimeKeyPress.bind(this)}
                  >
                    <TimesCircleIcon color="#06c" key="remove-time" />
                  </div>
                ) : (
                  ''
                )}
              </div>
            </React.Fragment>
          )
        }
        return ''
      })
    )
  };

  getRegExp = () => new RegExp('^\\s*\\d\\d?:[0-5]\\d\\s*([AaPp][Mm])?\\s*$');

  validateTime = time => {
    // hours only valid if they are [0-12]
    const hours = parseInt(time.split(':')[0], 10)
    const validHours = hours >= 0 && hours <= 12
    return this.getRegExp().test(time) && validHours
  };

  parseTime = time => {
    const amSuffix = 'AM'
    const pmSuffix = 'PM'
    time = time.trim()
    if (time !== '' && this.validateTime(time)) {
      // Format AM/PM according to design
      let ampm = ''
      if (time.toLowerCase().includes(amSuffix.toLowerCase().trim())) {
        time = time
          .toLowerCase()
          .replace(amSuffix.toLowerCase().trim(), '')
          .trim()
        ampm = amSuffix
      } else if (time.toLowerCase().includes(pmSuffix.toLowerCase().trim())) {
        time = time
          .toLowerCase()
          .replace(pmSuffix.toLowerCase().trim(), '')
          .trim()
        ampm = pmSuffix
      } else {
        // if this 12 hour time is missing am/pm but otherwise valid,
        // append am/pm depending on time of day
        ampm = new Date().getHours() > 11 ? pmSuffix : amSuffix
      }
      return `${time}${ampm}`
    } else {
      return ''
    }
  };

  addTimeToList = (control, modeSelected) => {
    if (modeSelected) {
      // Create new "time" item
      control.active.timeList.push({
        id: control.active.timeListID,
        start: '',
        end: '',
        validTime: true
      })
      control.active.timeListID++

      // Update UI
      this.forceUpdate()
    }
  };

  addTimeKeyPress = e => {
    if (e.type === 'click' || e.key === 'Enter') {
      this.addTimeToList(this.props.control)
    }
  };

  removeTimeFromList = (control, item, modeSelected) => {
    if (modeSelected) {
      // Removed times are no longer valid
      control.active.timeList[item.id].validTime = false

      // Update UI and yaml editor
      this.forceUpdate()
      this.handleChange({})
    }
  };

  removeTimeKeyPress = e => {
    if (e.type === 'click' || e.key === 'Enter') {
      this.removeTimeFromList(this.props.control, { id: e.target.id })
    }
  };

  handleTimeZone = value => {
    const { control, handleChange } = this.props

    if (value) {
      // Set timezone on select and set cached tz for repopulating yaml
      control.active.timezone = value
      this.setState({
        timezoneCache: { isSelected: true, tz: value }
      })
    } else {
      // Reset timezone and reset cached tz
      control.active.timezone = ''
      this.setState({ timezoneCache: { isSelected: false, tz: '' } })
    }

    handleChange(control)
  };

  handleTimeRange(value, event) {
    const { control, handleChange } = this.props

    let targetID = ''
    try {
      targetID = event.target.id
    } catch (e) {
      targetID = ''
    }

    const timeID = parseInt(targetID.split('-')[2], 10)
    const parsedTime = this.parseTime(value)
    if (targetID.includes('start-time')) {
      // As long as first start-time is entered, all times will show
      if (timeID === 0) {
        control.active.showTimeSection = parsedTime ? true : false
      }
      control.active.timeList[timeID].start = parsedTime
    } else if (targetID.includes('end-time')) {
      control.active.timeList[timeID].end = parsedTime
    }

    handleChange(control)
  }

  handleChange(checked, event) {
    const { control, handleChange } = this.props
    const { timezoneCache } = this.state

    let targetName = ''
    try {
      targetName = event.target.name
    } catch (e) {
      targetName = ''
    }

    if (targetName) {
      if (targetName.startsWith('timeWindow-mode-container')) {
        // When switching from "default" to "active/blocked" repopulate yaml if timezone was previously selected
        if (
          !control.active.mode &&
          event.target.value &&
          timezoneCache.isSelected
        ) {
          control.active.timezone = timezoneCache.tz
        }
        control.active.mode = (event.target.value || '').replace(/"/g, '')
        this.setState({ isExpanded: control.active.mode })
      } else if (targetName.startsWith('days-selector')) {
        if (checked) {
          control.active.days.push(event.target.value)
        } else {
          const index = control.active.days.indexOf(event.target.value)
          control.active.days.splice(index, 1)
        }
      }
    }

    handleChange(control)
  }
}

export default TimeWindow

export const reverse = (control, templateObject) => {
  if (!control.active) {
    let showTimeSection = false
    const timezone = _.get(
      templateObject,
      getSourcePath('Subscription[0].spec.timewindow.location')
    )
    const mode = _.get(
      templateObject,
      getSourcePath('Subscription[0].spec.timewindow.windowtype')
    )
    let weekdays = _.get(
      templateObject,
      getSourcePath('Subscription[0].spec.timewindow.daysofweek')
    )
    weekdays = (removeVs(weekdays && weekdays.$v) || []).map(day => {
      return `"${day}"`
    })
    let timeList = _.get(
      templateObject,
      getSourcePath('Subscription[0].spec.timewindow.hours')
    )
    if (timeList) {
      timeList = removeVs(timeList)
    }
    if (timeList) {
      timeList = timeList.map(({ start, end }, id) => {
        return {
          id,
          existingStart: start,
          existingEnd: end,
          start,
          end,
          validTime: true
        }
      })
      showTimeSection = true
    } else {
      timeList = [{ id: 0, start: '', end: '', validTime: true }]
    }
    control.active = {
      mode: mode && mode.$v,
      days: weekdays,
      timezone: timezone && timezone.$v,
      showTimeSection,
      timeList,
      timeListID: timeList.length
    }
  }
}

export const summarize = (control, controlData, summary) => {
  const { mode, timezone, timeList, days } = control.active || {}
  if (mode) {
    summary.push(mode)
    timeList.forEach(({ start, end }) => {
      if (start) {
        summary.push(`${start}-${end}`)
      }
    })
    summary.push(timezone)
    summary.push(days.join(','))
  } else {
    summary.push('No time window')
  }
}
