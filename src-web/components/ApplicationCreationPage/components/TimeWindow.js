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
  TextArea,
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
    this.props.control.active = { status: '', text: '' }
  }

  render() {
    const { locale, control } = this.props
    const { id, name, exception, validation = {} } = control
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
              className="timeWindow-btn-group"
              name="timeWindow-btn-group"
            >
              <RadioButton
                className="timeWindow-btn"
                name="timeWindow-btn"
                id="timeWindow-active-btn"
                labelText={msgs.get(
                  'creation.app.settings.timeWindow.activeMode',
                  locale
                )}
                value="active"
                onClick={this.handleChange.bind(this)}
              />
              <RadioButton
                className="timeWindow-btn"
                name="timeWindow-btn"
                id="timeWindow-block-btn"
                labelText={msgs.get(
                  'creation.app.settings.timeWindow.blockMode',
                  locale
                )}
                value="block"
                onClick={this.handleChange.bind(this)}
              />
            </RadioButtonGroup>

            <Accordion>
              <AccordionItem
                open={control.active.status ? true : false}
                title={msgs.get(
                  'creation.app.settings.timeWindow.configuration',
                  locale
                )}
              >
                <div className="timeWindow-config-container">
                  <div className="timeWindow-config-days">
                    <span>Days of the week *</span>
                    <br />
                    <span>
                      Please select at least one day below to create a time
                      window.
                    </span>
                    <div className="timeWindow-config-days-checkboxes">
                      <div className="first-col">
                        <Checkbox labelText="Monday" id="mon-checkbox" />
                        <Checkbox labelText="Tuesday" id="tues-checkbox" />
                        <Checkbox labelText="Wednesday" id="wed-checkbox" />
                        <Checkbox labelText="Thursday" id="thurs-checkbox" />
                        <Checkbox labelText="Friday" id="fri-checkbox" />
                      </div>
                      <div className="second-col">
                        <Checkbox labelText="Saturday" id="sat-checkbox" />
                        <Checkbox labelText="Sunday" id="sun-checkbox" />
                      </div>
                    </div>
                  </div>

                  <div className="timeWindow-config-timezone">
                    <span>Timezone *</span>
                    <br />
                    <DropdownV2
                      className="timeWindow-config-timezone-dropdown"
                      label="Choose a location"
                      items={[
                        { id: 'option-1', label: 'Option 1' },
                        { id: 'option-2', label: 'Option 2' }
                      ]}
                    />
                  </div>

                  <div className="timeWindow-config-start-end-times">
                    <div className="timeWindow-config-start">
                      <TimePicker
                        id="time-picker-start"
                        labelText="Start Time"
                        maxLength={5}
                        placeholder="hh:mm"
                        type="text"
                      >
                        <TimePickerSelect
                          id="time-picker-start-selector"
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
                    <div className="timeWindow-config-end">
                      <TimePicker
                        id="time-picker-end"
                        labelText="End Time"
                        maxLength={5}
                        placeholder="hh:mm"
                        type="text"
                      >
                        <TimePickerSelect
                          id="time-picker-end-selector"
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
                    <div clasName="time-picker-add-time">
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
    if (event.target.name === 'timeWindow-btn-group') {
      control.active.status = '"' + event.target.value + '"'
    } else if (event.target.name === 'timeWindow-text') {
      control.active.text = '"' + event.target.value + '"'
    }
    handleChange(control)
  }
}

export default TimeWindow
