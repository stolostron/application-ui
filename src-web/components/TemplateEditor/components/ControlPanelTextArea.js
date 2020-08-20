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
import { TextArea } from 'carbon-components-react'
import Tooltip from './Tooltip'

class ControlPanelTextArea extends React.Component {
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
    const { id, name, active: value, exception, validation } = control
    return (
      <React.Fragment>
        <div
          className="creation-view-controls-textarea"
          ref={this.setControlRef.bind(this, control)}
        >
          <div className="creation-view-controls-textarea-title">
            {name}
            {validation.required ? (
              <div className="creation-view-controls-required">*</div>
            ) : null}
            <Tooltip control={control} locale={locale} />
          </div>
          <TextArea
            id={id}
            invalid={!!exception}
            invalidText={exception}
            hideLabel
            spellCheck={false}
            autoComplete={'new-password'}
            labelText=""
            value={value}
            onChange={this.handleChange.bind(this, control)}
          />
        </div>
      </React.Fragment>
    )
  }

  handleChange(id, evt) {
    const { control, handleChange } = this.props
    control.active = evt.target.value
    handleChange(evt)
  }
}

export default ControlPanelTextArea
