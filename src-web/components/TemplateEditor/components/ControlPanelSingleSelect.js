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
import { DropdownV2, DropdownSkeleton, InlineLoading } from 'carbon-components-react'
import Tooltip from './Tooltip'
import msgs from '../../../../nls/platform.properties'
import _ from 'lodash'

class ControlPanelSingleSelect extends React.Component {
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
    const {
      id,
      name,
      placeholder = '',
      available = [],
      validation,
      isLoading,
      isFailed
    } = control
    let { active } = control
    if (!active) {
      if (isLoading) {
        active = msgs.get(
          _.get(control, 'fetchAvailable.loadingDesc', 'resource.loading'),
          locale
        )
      } else if (isFailed) {
        active = msgs.get('resource.error', locale)
      } else if (available.length === 0) {
        active = msgs.get(
          _.get(control, 'fetchAvailable.emptyDesc', 'resource.none'),
          locale
        )
      }
    }
    const key = `${id}-${name}-${available.join('-')}`
    return (
      <React.Fragment>
        <div
          className="creation-view-controls-singleselect"
          ref={this.setControlRef.bind(this, control)}
        >
          <div className="creation-view-controls-multiselect-title">
            {name}
            {validation.required ? (
              <div className="creation-view-controls-required">*</div>
            ) : null}
            <Tooltip control={control} locale={locale} />
          </div>
          {isLoading ? (
            <div className="creation-view-controls-singleselect-loading">
              <DropdownSkeleton />
              <InlineLoading description={active} />
            </div>
          ) : (
            <div id={id}>
              <DropdownV2
                key={key}
                items={available}
                label={active || placeholder}
                onChange={this.handleChange.bind(this, control)}
              />
            </div>
          )}
        </div>
      </React.Fragment>
    )
  }

  handleChange(id, evt) {
    const { control, handleChange } = this.props
    control.active = evt.selectedItem
    handleChange(evt)
  }
}

export default ControlPanelSingleSelect
