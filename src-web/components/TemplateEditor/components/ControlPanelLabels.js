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
import {
  Icon, Tag, TextInput
} from 'carbon-components-react'
import Tooltip from './Tooltip'
import msgs from '../../../../nls/platform.properties'
import _ from 'lodash'

const regex = /([a-zA-Z0-9]+)\s*=\s*([a-zA-Z0-9-]*)/

class ControlPanelLabels extends React.Component {

  static propTypes = {
    control: PropTypes.object,
    handleChange: PropTypes.func,
    locale: PropTypes.string,
  }

  constructor (props) {
    super(props)
    this.state = {
      value:'',
      invalid: false,
      invalidText: '',
    }
  }

  render() {
    const {locale, control} = this.props
    const {id, name, active=[]} = control
    const formatted = active.map(({key, value})=>(`${key}=${value}`))
    const {value, invalid, invalidText} = this.state
    return (
      <React.Fragment>
        <div className='creation-view-controls-labels'>
          <div className="creation-view-controls-labels-title">
            {name}
            <Tooltip control={control} locale={locale} />
          </div>
          <div className="creation-view-controls-labels-container">
            {formatted.map((label, inx) => {
              return <Tag key={label} type='custom'>
                {label}
                <Icon
                  className='closeIcon'
                  description={msgs.get('delete.label', locale)}
                  name="icon--close"
                  onClick={this.handleDelete.bind(this, inx)}
                />
              </Tag>
            })}
            <div className="creation-view-controls-labels-edit-container">
              <TextInput
                id={id}
                hideLabel
                labelText=''
                invalid={invalid}
                invalidText={invalidText}
                placeholder={msgs.get('enter.add.label', locale)}
                value={value}
                onBlur={this.handleBlur.bind(this)}
                onKeyDown={this.handleKeyDown.bind(this)}
                onChange={this.handleChange.bind(this)} />
              {value && <Icon
                className='closeIcon'
                description={msgs.get('cancel.label.create', locale)}
                name="icon--close"
                onClick={this.cancelLabel.bind(this)}
              />}
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }

  handleDelete(inx) {
    const {control, handleChange} = this.props
    const {active=[]} = control
    active.splice(inx,1)
    handleChange(control)
  }

  handleChange(event) {
    const {control, locale} = this.props
    const {active=[]} = control
    let value = event.target.value
    if (value===',') value=''
    let invalid = !regex.test(value)
    let invalidText = ''
    if (invalid) {
      invalidText = msgs.get('enter.add.label', locale)
    } else {
      const match = regex.exec(value)
      const map = _.keyBy(active, 'key')
      if (map[match[1]]) {
        invalid = true
        invalidText =  msgs.get('enter.duplicate.key', [match[1]], locale)
      }
    }
    this.setState({value, invalid, invalidText})
  }

  handleKeyDown(event) {
    switch (event.key) {
    case 'Enter':
    case ',':
      this.createLabel()
      break

    case 'Backspace':
      this.deleteLastLabel()
      break

    case 'Escape':
      this.cancelLabel()
      break
    }
  }

  handleBlur() {
    setTimeout(() => {
      this.createLabel()
    }, 250)
  }

  deleteLastLabel() {
    const {value} = this.state
    if (!value) {
      const {control, handleChange} = this.props
      const {active=[]} = control
      const inx = active.length-1
      if (inx>=0) {
        active.splice(inx,1)
        handleChange(control)
      }
    }
  }

  createLabel() {
    const {control, handleChange} = this.props
    const {active=[]} = control
    const {value, invalid} = this.state
    if (value && !invalid) {
      const match = regex.exec(value)
      active.push({key:match[1], value:match[2]})
      handleChange(control)
    }
    this.cancelLabel()
  }

  cancelLabel() {
    this.setState({value:'', invalid:false, invalidText:''})
  }
}

export default ControlPanelLabels
