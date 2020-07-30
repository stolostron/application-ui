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
  SelectItem,
  TimePicker,
  TimePickerSelect
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
    this.props.control.active = { mode: '', days: [], timezone: '' }
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
            >
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
                    <div className="config-start-time">
                      <TimePicker
                        id="start-time"
                        labelText="Start Time"
                        maxLength={5}
                        placeholder="hh:mm"
                        type="text"
                        disabled={!modeSelected}
                      >
                        <TimePickerSelect
                          id="start-time-selector"
                          labelText="AM/PM"
                          placeholder="hh:mm"
                          disabled={!modeSelected}
                        >
                          <SelectItem
                            disabled={false}
                            hidden={false}
                            text="AM"
                            value="AM"
                          />
                          <SelectItem
                            disabled={false}
                            hidden={false}
                            text="PM"
                            value="PM"
                          />
                        </TimePickerSelect>
                      </TimePicker>
                    </div>
                    <div className="config-end-time">
                      <TimePicker
                        id="end-time"
                        labelText="End Time"
                        maxLength={5}
                        placeholder="hh:mm"
                        type="text"
                        disabled={!modeSelected}
                      >
                        <TimePickerSelect
                          id="end-time-selector"
                          labelText="AM/PM"
                          placeholder="hh:mm"
                          disabled={!modeSelected}
                        >
                          <SelectItem
                            disabled={false}
                            hidden={false}
                            text="AM"
                            value="AM"
                          />
                          <SelectItem
                            disabled={false}
                            hidden={false}
                            text="PM"
                            value="PM"
                          />
                        </TimePickerSelect>
                      </TimePicker>
                    </div>
                    <div className="add-time-btn">
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

            {/* <TextArea
              id={id}
              name="timeWindow-text"
              invalid={!!exception}
              invalidText={exception}
              hideLabel
              spellCheck={false}
              autoComplete={'no'}
              labelText=""
              onChange={this.handleChange.bind(this)}
            /> */}
          </div>
        </div>
      </React.Fragment>
    )
  }

  handleChange(event) {
    const { control, handleChange } = this.props
    let targetName = ''
    try {
      targetName = event.target.name
    } catch (e) {
      targetName = ''
    }

    if (targetName && targetName === 'timeWindow-mode-container') {
      control.active.mode = event.target.value
    } else if (targetName && targetName === 'days-selector') {
      if (event.target.checked === true) {
        control.active.days.push(event.target.value)
      } else {
        const index = control.active.days.indexOf(event.target.value)
        control.active.days.splice(index, 1)
      }
    } else if (
      event.selectedItem &&
      event.selectedItem.name === 'timezone-dropdown'
    ) {
      control.active.timezone = event.selectedItem.value
    }

    // else if (event.target.name === 'timeWindow-text') {
    //   control.active.text = '"' + event.target.value + '"'
    // }
    handleChange(control)
  }
}

export default TimeWindow
