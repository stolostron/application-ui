/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { NumberInput } from 'carbon-components-react'
import Tooltip from './Tooltip'

class ControlPanelNumber extends React.Component {
  static propTypes = {
    control: PropTypes.object,
    handleChange: PropTypes.func,
    locale: PropTypes.string
  };

  constructor(props) {
    super(props)
    this.state = {}
  }

  setControlRef = (control, ref) => {
    control.ref = ref
  };

  render() {
    const { locale, control } = this.props
    const { id, name, initial, exception, validation } = control

    return (
      <React.Fragment>
        <div
          className="creation-view-controls-number"
          ref={this.setControlRef.bind(this, control)}
        >
          <label className="creation-view-controls-multiselect-title" htmlFor={id}>
            {name}
            {validation.required ? (
              <div className="creation-view-controls-required">*</div>
            ) : null}
            <Tooltip control={control} locale={locale} />
          </label>
          <NumberInput
            allowEmpty
            id={id}
            value={typeof initial === 'string' ? Number(initial) : initial}
            invalid={!!exception}
            invalidText={exception}
            min={1}
            max={100}
            step={1}
            onChange={this.handleChange.bind(this, control)}
          />
        </div>
      </React.Fragment>
    )
  }

  handleChange(id, evt) {
    const { control, handleChange } = this.props
    control.active = evt.imaginaryTarget.valueAsNumber
    handleChange(evt)
  }
}

export default ControlPanelNumber
