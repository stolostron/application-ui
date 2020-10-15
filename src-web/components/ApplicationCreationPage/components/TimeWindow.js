/*******************************************************************************
 * Licensed Materials - Property of IBM
 * Copyright (c) 2020 Red Hat, Inc. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import resources from '../../../../lib/shared/resources'
import {
  Accordion,
  AccordionItem,
  Checkbox,
  ComboBox,
  Icon,
  RadioButton,
  RadioButtonGroup,
  TimePicker
} from 'carbon-components-react'
import { getSourcePath, removeVs } from '../../TemplateEditor/utils/utils'
import Tooltip from '../../TemplateEditor/components/Tooltip'
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
    this.state = {
      timezoneCache: { isSelected: false, tz: '' }
    }
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
    this.props.control.validation = this.validation.bind(this)
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
    }
  }

  render() {
    if (!this.props.control.active) {
      this.props.control.active = {
        mode: '',
        days: [],
        timezone: '',
        showTimeSection: false,
        timeList: [{ id: 0, start: '', end: '', validTime: true }],
        timeListID: 1
      }
    }
    const { controlId, locale, control } = this.props
    const { name, active, validation = {} } = control
    const modeSelected = active && active.mode ? true : false
    const daysSelectorID = 'days-selector'
    const timezoneDropdownID = 'timezone-dropdown'
    const { mode, days = [], timezone } = this.props.control.active

    const timezoneList = moment.tz.names()
    const localTimezone = moment.tz.guess(true)

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
            <RadioButtonGroup
              className="timeWindow-mode-container"
              name={`timeWindow-mode-container-${controlId}`}
              defaultSelected={mode ? `"${mode}"` : ''}
              id={controlId}
            >
              <RadioButton
                className="mode-btn"
                id={`default-mode-${controlId}`}
                labelText={msgs.get(
                  'creation.app.settings.timeWindow.defaultMode',
                  locale
                )}
                value=""
                onClick={this.handleChange.bind(this)}
              />
              <RadioButton
                className="mode-btn"
                id={`active-mode-${controlId}`}
                labelText={msgs.get(
                  'creation.app.settings.timeWindow.activeMode',
                  locale
                )}
                value="&quot;active&quot;"
                onClick={this.handleChange.bind(this)}
              />
              <RadioButton
                className="mode-btn"
                id={`blocked-mode-${controlId}`}
                labelText={msgs.get(
                  'creation.app.settings.timeWindow.blockedMode',
                  locale
                )}
                value="&quot;blocked&quot;"
                onClick={this.handleChange.bind(this)}
              />
            </RadioButtonGroup>

            <Accordion>
              <AccordionItem
                open={modeSelected}
                title={msgs.get(
                  'creation.app.settings.timeWindow.config',
                  locale
                )}
              >
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
                      *
                    </div>
                    <div className="config-descr">
                      {msgs.get(
                        'creation.app.settings.timeWindow.config.days.descr',
                        locale
                      )}
                    </div>
                    <div className="config-days-selector">
                      <div className="first-col">
                        <Checkbox
                          checked={days.includes('"Monday"')}
                          labelText="Monday"
                          name={daysSelectorID}
                          id={`mon-${controlId}`}
                          value="&quot;Monday&quot;"
                          disabled={!modeSelected}
                          onClick={this.handleChange.bind(this)}
                        />
                        <Checkbox
                          checked={days.includes('"Tuesday"')}
                          labelText="Tuesday"
                          name={daysSelectorID}
                          id={`tue-${controlId}`}
                          value="&quot;Tuesday&quot;"
                          disabled={!modeSelected}
                          onClick={this.handleChange.bind(this)}
                        />
                        <Checkbox
                          checked={days.includes('"Wednesday"')}
                          labelText="Wednesday"
                          name={daysSelectorID}
                          id={`wed-${controlId}`}
                          value="&quot;Wednesday&quot;"
                          disabled={!modeSelected}
                          onClick={this.handleChange.bind(this)}
                        />
                        <Checkbox
                          checked={days.includes('"Thursday"')}
                          labelText="Thursday"
                          name={daysSelectorID}
                          id={`thu-${controlId}`}
                          value="&quot;Thursday&quot;"
                          disabled={!modeSelected}
                          onClick={this.handleChange.bind(this)}
                        />
                        <Checkbox
                          checked={days.includes('"Friday"')}
                          labelText="Friday"
                          name={daysSelectorID}
                          id={`fri-${controlId}`}
                          value="&quot;Friday&quot;"
                          disabled={!modeSelected}
                          onClick={this.handleChange.bind(this)}
                        />
                      </div>
                      <div className="second-col">
                        <Checkbox
                          checked={days.includes('"Saturday"')}
                          labelText="Saturday"
                          name={daysSelectorID}
                          id={`sat-${controlId}`}
                          value="&quot;Saturday&quot;"
                          disabled={!modeSelected}
                          onClick={this.handleChange.bind(this)}
                        />
                        <Checkbox
                          checked={days.includes('"Sunday"')}
                          labelText="Sunday"
                          name={daysSelectorID}
                          id={`sun-${controlId}`}
                          value="&quot;Sunday&quot;"
                          disabled={!modeSelected}
                          onClick={this.handleChange.bind(this)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="config-timezone-section">
                    <div className="config-title">
                      {msgs.get(
                        'creation.app.settings.timeWindow.config.timezone.title',
                        locale
                      )}{' '}
                      *
                    </div>
                    <ComboBox
                      ariaLabel="timezoneComboBox"
                      label={msgs.get(
                        'timeWindow.label.timezone.label',
                        locale
                      )}
                      className="config-timezone-combo-box"
                      placeholder={msgs.get(
                        'timeWindow.label.timezone.placeholder',
                        locale
                      )}
                      initialSelectedItem={timezone || ''}
                      items={this.renderTimezones(
                        timezoneList,
                        localTimezone,
                        timezoneDropdownID
                      )}
                      disabled={!modeSelected}
                      shouldFilterItem={({ inputValue, item }) => {
                        return (
                          inputValue.length === 0 ||
                          item.label
                            .toLowerCase()
                            .indexOf(inputValue.toLowerCase()) !== -1
                        )
                      }}
                      onChange={this.handleChange.bind(this)}
                    />
                  </div>

                  <div className="config-time-section">
                    {this.renderTimes(control, modeSelected)}
                    <div
                      className={`add-time-btn ${
                        !modeSelected ? 'btn-disabled' : ''
                      }`}
                      tabIndex="0"
                      role={'button'}
                      onClick={() => this.addTimeToList(control, modeSelected)}
                      onKeyPress={this.addTimeKeyPress.bind(this)}
                    >
                      <Icon
                        name="icon--add--glyph"
                        fill="#3d70b2"
                        description=""
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
        name: id,
        value: `"${localTimezone}"`
      }
    ]

    timezoneList = timezoneList.filter(e => e !== localTimezone)

    timezoneList.forEach(tz => {
      timezoneObjList.push({
        label: tz,
        name: id,
        value: `"${tz}"`
      })
    })

    return timezoneObjList
  };

  renderTimes = (control, modeSelected) => {
    return (
      control.active &&
      control.active.timeList.map(item => {
        const { id, start, end, validTime } = item
        // Don't show deleted time invertals
        if (validTime) {
          return (
            <React.Fragment key={id}>
              <div className="config-time-container">
                <div className="config-start-time">
                  <TimePicker
                    id={`start-time-${id}`}
                    name="start-time"
                    labelText={id === 0 ? 'Start Time' : ''}
                    type="time"
                    value={this.state.startTime || to24(start) || ''}
                    disabled={!modeSelected}
                    onChange={this.handleChange.bind(this)}
                  />
                </div>
                <div className="config-end-time">
                  <TimePicker
                    id={`end-time-${id}`}
                    name="end-time"
                    labelText={id === 0 ? 'End Time' : ''}
                    type="time"
                    value={this.state.endTime || to24(end) || ''}
                    disabled={!modeSelected}
                    onChange={this.handleChange.bind(this)}
                  />
                </div>
                {id !== 0 ? ( // Option to remove added times
                  <div
                    id={id}
                    className="remove-time-btn"
                    tabIndex="0"
                    role={'button'}
                    onClick={() => this.removeTimeFromList(control, item)}
                    onKeyPress={this.removeTimeKeyPress.bind(this)}
                  >
                    <Icon
                      name="icon--close--glyph"
                      fill="#3d70b2"
                      className="remove-time-btn-icon"
                    />
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

  // Convert 24-hour format to 12-hour format
  convertTimeFormat = time => {
    if (time !== '') {
      const hour24 = +time.substring(0, 2)
      let hour12 = hour24 % 12 || 12
      hour12 = hour12 < 10 ? '0' + hour12 : hour12
      const period = hour24 < 12 ? 'AM' : 'PM'
      return hour12 + time.substring(2) + period
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

  removeTimeFromList = (control, item) => {
    // Removed times are no longer valid
    control.active.timeList[item.id].validTime = false

    // Update UI and yaml editor
    this.forceUpdate()
    this.handleChange({})
  };

  removeTimeKeyPress = e => {
    if (e.type === 'click' || e.key === 'Enter') {
      this.removeTimeFromList(this.props.control, { id: e.target.id })
    }
  };

  handleChange(event) {
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
        control.active.mode = event.target.value
      } else {
        switch (targetName) {
        case 'days-selector':
          if (event.target.checked === true) {
            control.active.days.push(event.target.value)
          } else {
            const index = control.active.days.indexOf(event.target.value)
            control.active.days.splice(index, 1)
          }
          break
        case 'start-time':
          {
            const startTimeID = parseInt(event.target.id.split('-')[2], 10)
            const convertedTime = this.convertTimeFormat(event.target.value)
            // As long as first start-time is entered, all times will show
            if (startTimeID === 0) {
              control.active.showTimeSection = convertedTime ? true : false
            }
            control.active.timeList[startTimeID].start = convertedTime
          }
          break
        case 'end-time':
          {
            const endTimeID = parseInt(event.target.id.split('-')[2], 10)
            control.active.timeList[endTimeID].end = this.convertTimeFormat(
              event.target.value
            )
          }
          break
        }
      }
    } else if (
      event.selectedItem &&
      event.selectedItem.name === 'timezone-dropdown'
    ) {
      // Set timezone on select and set cached tz for repopulating yaml
      control.active.timezone = event.selectedItem.value
      this.setState({
        timezoneCache: { isSelected: true, tz: event.selectedItem.value }
      })
    } else if (event.selectedItem === null) {
      // Reset timezone and reset cached tz
      control.active.timezone = ''
      this.setState({ timezoneCache: { isSelected: false, tz: '' } })
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

// Convert 12-hour format to 24-hour format
const to24 = time => {
  const match = /((1[0-2]|0?[1-9]):([0-5][0-9])([AP][M]))/.exec(time)
  if (match) {
    const [, , hour12, minute, period] = match
    let hour = parseInt(hour12, 10)
    if (hour < 12 && period === 'PM') {
      hour += 12
    }
    if (hour < 10) {
      hour = `0${hour}`
    }
    return `${hour}:${minute}`
  }
  return time
}
