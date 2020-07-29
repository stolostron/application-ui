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
                className="timeWindow-mode"
                id="active-mode"
                labelText={msgs.get(
                  'creation.app.settings.timeWindow.activeMode',
                  locale
                )}
                value="&quot;active&quot;"
                onClick={this.handleChange.bind(this)}
              />
              <RadioButton
                className="timeWindow-mode"
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
                open={control.active.mode ? true : false}
                title={msgs.get(
                  'creation.app.settings.timeWindow.configuration',
                  locale
                )}
              >
                <div className="timeWindow-config-container">
                  <div className="timeWindow-config-days-section">
                    <span>Days of the week *</span>
                    <br />
                    <span>
                      Please select at least one day below to create a time
                      window.
                    </span>
                    <div className="timeWindow-config-days-selector">
                      <div className="first-col">
                        <Checkbox
                          labelText="Monday"
                          name="days-selector"
                          id="mon"
                          value="&quot;Monday&quot;"
                          onClick={this.handleChange.bind(this)}
                        />
                        <Checkbox
                          labelText="Tuesday"
                          name="days-selector"
                          id="tues"
                          value="&quot;Tuesday&quot;"
                          onClick={this.handleChange.bind(this)}
                        />
                        <Checkbox
                          labelText="Wednesday"
                          name="days-selector"
                          id="wed"
                          value="&quot;Wednesday&quot;"
                          onClick={this.handleChange.bind(this)}
                        />
                        <Checkbox
                          labelText="Thursday"
                          name="days-selector"
                          id="thurs"
                          value="&quot;Thursday&quot;"
                          onClick={this.handleChange.bind(this)}
                        />
                        <Checkbox
                          labelText="Friday"
                          name="days-selector"
                          id="fri"
                          value="&quot;Friday&quot;"
                          onClick={this.handleChange.bind(this)}
                        />
                      </div>
                      <div className="second-col">
                        <Checkbox
                          labelText="Saturday"
                          name="days-selector"
                          id="sat"
                          value="&quot;Saturday&quot;"
                          onClick={this.handleChange.bind(this)}
                        />
                        <Checkbox
                          labelText="Sunday"
                          name="days-selector"
                          id="sun"
                          value="&quot;Sunday&quot;"
                          onClick={this.handleChange.bind(this)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="timeWindow-config-timezone-section">
                    <span>Timezone *</span>
                    <br />
                    <DropdownV2
                      className="timeWindow-config-timezone-dropdown"
                      label="Choose a location"
                      items={[
                        {
                          label: 'America/Edmonton',
                          name: 'timezone-dropdown',
                          value: '"America/Edmonton"'
                        },
                        {
                          label: 'America/Halifax',
                          name: 'timezone-dropdown',
                          value: '"America/Halifax"'
                        },
                        {
                          label: 'America/Toronto',
                          name: 'timezone-dropdown',
                          value: '"America/Toronto"'
                        },
                        {
                          label: 'America/Vancouver',
                          name: 'timezone-dropdown',
                          value: '"America/Vancouver"'
                        },
                        {
                          label: 'America/Winnipeg',
                          name: 'timezone-dropdown',
                          value: '"America/Winnipeg"'
                        }
                      ]}
                      onChange={this.handleChange.bind(this)}
                    />
                  </div>

                  <div className="timeWindow-config-times-section">
                    <div className="timeWindow-config-time-start">
                      <TimePicker
                        id="time-picker-start"
                        labelText="Start Time"
                        maxLength={5}
                        placeholder="hh:mm"
                        type="text"
                      >
                        <TimePickerSelect
                          id="time-picker-start-selector"
                          labelText="AM/PM"
                          placeholder="hh:mm"
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
                    <div className="timeWindow-config-time-end">
                      <TimePicker
                        id="time-picker-end"
                        labelText="End Time"
                        maxLength={5}
                        placeholder="hh:mm"
                        type="text"
                      >
                        <TimePickerSelect
                          id="time-picker-end-selector"
                          labelText="AM/PM"
                          placeholder="hh:mm"
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
                    <div className="time-picker-add-time">
                      <Icon
                        name="icon--add--glyph"
                        fill="#3d70b2"
                        description=""
                        className="time-picker-add-time-icon"
                      />
                      <span>Add another time range</span>
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
