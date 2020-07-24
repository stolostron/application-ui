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
  TextArea
} from 'carbon-components-react'
import Tooltip from '../../TemplateEditor/components/Tooltip'
import msgs from '../../../../nls/platform.properties'

class TimeWindow extends React.Component {

  static propTypes = {
    control: PropTypes.object,
    handleChange: PropTypes.func,
    locale: PropTypes.string,
  }

  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render() {
    const {locale, control} = this.props
    const {id, name, exception, validation={}} = control
    const label = msgs.get(name, locale)
    return (
      <React.Fragment>
        <div className='creation-view-controls-labels'>
          <div className="creation-view-controls-textarea-title">
            {label}
            {validation.required ? <div className='creation-view-controls-required'>*</div> : null}
            <Tooltip control={control} locale={locale} />
          </div>
          <TextArea
            id={id}
            invalid={!!exception}
            invalidText={exception}
            hideLabel
            spellCheck={false}
            autoComplete={'no'}
            labelText=''
            onChange={this.handleChange.bind(this)} />
        </div>
      </React.Fragment>
    )
  }

  handleChange(event) {
    const {control, handleChange} = this.props
    control.active = event.target.value
    handleChange(control)
  }
}

export default TimeWindow
