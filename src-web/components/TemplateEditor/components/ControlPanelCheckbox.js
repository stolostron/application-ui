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
import { Checkbox } from 'carbon-components-react'
import Tooltip from './Tooltip'

class ControlPanelCheckbox extends React.Component {
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
    const { id, name, active } = control
    return (
      <React.Fragment>
        <div
          className="creation-view-controls-checkbox"
          ref={this.setControlRef.bind(this, control)}
        >
          <Checkbox
            id={id}
            className="checkbox"
            hideLabel
            labelText=""
            checked={active}
            onChange={this.handleChange.bind(this, control)}
          />
          <div style={{ height: '20px' }}>{name}</div>
          <Tooltip control={control} locale={locale} />
        </div>
      </React.Fragment>
    )
  }

  handleChange(id, evt) {
    const { control, handleChange } = this.props
    control.active = evt
    handleChange(evt)
  }
}

export default ControlPanelCheckbox
