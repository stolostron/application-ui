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
  DropdownV2,
  Icon,
  RadioButton,
  RadioButtonGroup,
  TimePicker
} from 'carbon-components-react'
import Tooltip from '../../TemplateEditor/components/Tooltip'
import msgs from '../../../../nls/platform.properties'

resources(() => {
  require('./style.scss')
})

class TimeWindow extends React.Component {
  static propTypes = {
    control: PropTypes.object,
    handleChange: PropTypes.func,
    locale: PropTypes.string
  };

  constructor(props) {
    super(props)
    this.state = {}
    this.props.control.active = {
      mode: '',
      days: [],
      timezone: '',
      showTimeSection: false,
      timeList: [{ id: 0, start: '', end: '', validTime: true }],
      timeListID: 1
    }
  }

  render() {
    const { locale, control } = this.props
    const { name, validation = {} } = control
    const modeSelected = control.active.mode ? true : false
    const daysSelectorID = 'days-selector'
    const timezoneDropdownID = 'timezone-dropdown'

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
              name="timeWindow-mode-container"
              defaultSelected=""
            >
              <RadioButton
                className="mode-btn"
                id="disabled-mode"
                labelText={msgs.get(
                  'creation.app.settings.timeWindow.disabledMode',
                  locale
                )}
                value=""
                onClick={this.handleChange.bind(this)}
              />
              <RadioButton
                className="mode-btn"
                id="active-mode"
                labelText={msgs.get(
                  'creation.app.settings.timeWindow.activeMode',
                  locale
                )}
                value="&quot;active&quot;"
                onClick={this.handleChange.bind(this)}
              />
              <RadioButton
                className="mode-btn"
                id="block-mode"
                labelText={msgs.get(
                  'creation.app.settings.timeWindow.blockMode',
                  locale
                )}
                value="&quot;block&quot;"
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
                <div className="timeWindow-config-container">
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
                          labelText="Monday"
                          name={daysSelectorID}
                          id="mon"
                          value="&quot;Monday&quot;"
                          disabled={!modeSelected}
                          onClick={this.handleChange.bind(this)}
                        />
                        <Checkbox
                          labelText="Tuesday"
                          name={daysSelectorID}
                          id="tues"
                          value="&quot;Tuesday&quot;"
                          disabled={!modeSelected}
                          onClick={this.handleChange.bind(this)}
                        />
                        <Checkbox
                          labelText="Wednesday"
                          name={daysSelectorID}
                          id="wed"
                          value="&quot;Wednesday&quot;"
                          disabled={!modeSelected}
                          onClick={this.handleChange.bind(this)}
                        />
                        <Checkbox
                          labelText="Thursday"
                          name={daysSelectorID}
                          id="thurs"
                          value="&quot;Thursday&quot;"
                          disabled={!modeSelected}
                          onClick={this.handleChange.bind(this)}
                        />
                        <Checkbox
                          labelText="Friday"
                          name={daysSelectorID}
                          id="fri"
                          value="&quot;Friday&quot;"
                          disabled={!modeSelected}
                          onClick={this.handleChange.bind(this)}
                        />
                      </div>
                      <div className="second-col">
                        <Checkbox
                          labelText="Saturday"
                          name={daysSelectorID}
                          id="sat"
                          value="&quot;Saturday&quot;"
                          disabled={!modeSelected}
                          onClick={this.handleChange.bind(this)}
                        />
                        <Checkbox
                          labelText="Sunday"
                          name={daysSelectorID}
                          id="sun"
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
                    <DropdownV2
                      className="config-timezone-dropdown"
                      label="Choose a location"
                      items={[
                        {
                          label: 'America/Edmonton',
                          name: timezoneDropdownID,
                          value: '"America/Edmonton"'
                        },
                        {
                          label: 'America/Halifax',
                          name: timezoneDropdownID,
                          value: '"America/Halifax"'
                        },
                        {
                          label: 'America/Toronto',
                          name: timezoneDropdownID,
                          value: '"America/Toronto"'
                        },
                        {
                          label: 'America/Vancouver',
                          name: timezoneDropdownID,
                          value: '"America/Vancouver"'
                        },
                        {
                          label: 'America/Winnipeg',
                          name: timezoneDropdownID,
                          value: '"America/Winnipeg"'
                        }
                      ]}
                      disabled={!modeSelected}
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

  renderTimes = (control, modeSelected) => {
    return control.active.timeList.map(item => {
      // Don't show deleted time invertals
      if (item.validTime) {
        return (
          <React.Fragment key={item.id}>
            <div className="config-time-container">
              <div className="config-start-time">
                <TimePicker
                  id={`start-time-${item.id}`}
                  name="start-time"
                  labelText={item.id === 0 ? 'Start Time' : ''}
                  type="time"
                  value={this.state.startTime || ''}
                  disabled={!modeSelected}
                  onChange={this.handleChange.bind(this)}
                />
              </div>
              <div className="config-end-time">
                <TimePicker
                  id={`end-time-${item.id}`}
                  name="end-time"
                  labelText={item.id === 0 ? 'End Time' : ''}
                  type="time"
                  value={this.state.endTime || ''}
                  disabled={!modeSelected}
                  onChange={this.handleChange.bind(this)}
                />
              </div>
              {item.id !== 0 ? ( // Option to remove added times
                <div
                  id={item.id}
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
    let targetName = ''
    try {
      targetName = event.target.name
    } catch (e) {
      targetName = ''
    }

    if (targetName) {
      switch (targetName) {
      case 'timeWindow-mode-container':
        control.active.mode = event.target.value
        break
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
    } else if (
      event.selectedItem &&
      event.selectedItem.name === 'timezone-dropdown'
    ) {
      control.active.timezone = event.selectedItem.value
    }

    handleChange(control)
  }
}

export default TimeWindow
