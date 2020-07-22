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
import { MultiSelect } from 'carbon-components-react'
import Tooltip from './Tooltip'
import msgs from '../../../../nls/platform.properties'

class ControlPanelMultiSelect extends React.Component {
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
    this.multiSelect = control.ref = ref
  };

  render() {
    const { locale, control } = this.props
    const { id, name, placeholder: ph = '' } = control

    // see if we need to add user additions to available (from editing the yaml file)
    const { userData, userMap, hasCapturedUserSource } = control
    let { active = [], available, availableMap } = control
    if (userData) {
      if (!hasCapturedUserSource) {
        available = [...userData, ...available]
        availableMap = { ...userMap, ...availableMap }
      } else {
        // if user edited the source, we can't automatically update it
        active = available = [msgs.get('creation.view.policy.custom', locale)]
        availableMap = undefined
      }
    }

    // place holder
    let placeholder = ph
    if (active.length > 0) {
      const activeKeys = []
      active.forEach(k => {
        if (typeof availableMap === 'object' && availableMap[k]) {
          const { name: n } = availableMap[k]
          activeKeys.push(n || k)
        } else {
          activeKeys.push(k)
        }
      })
      placeholder = activeKeys.join(', ')
    }

    // change key if active changes so that carbon component is re-created with new initial values
    const key = `${id}-${active.join('-')}`
    return (
      <React.Fragment>
        <div
          className="creation-view-controls-multiselect"
          ref={this.setControlRef.bind(this, control)}
        >
          <div className="creation-view-controls-multiselect-title">
            {name}
            <Tooltip control={control} locale={locale} />
          </div>
          <MultiSelect.Filterable
            key={key}
            items={available}
            initialSelectedItems={active}
            placeholder={placeholder}
            itemToString={item => item}
            sortItems={items => items}
            onChange={this.handleChange.bind(this, id)}
          />
        </div>
      </React.Fragment>
    )
  }

  handleChange(id, evt) {
    const { control, handleChange } = this.props
    const { isOneSelection } = control
    if (isOneSelection) {
      // close on one selection
      handleChange(evt)
    } else {
      // close when user clicks outside of menu
      // unfortunately MultiSelect.Filterable doesn't have an onClose
      this.multiSelect.selectedItems = evt.selectedItems
      const menu = this.multiSelect.getElementsByClassName(
        'bx--list-box__menu'
      )
      if (menu && menu.length > 0) {
        if (!this.multiSelect.observer) {
          this.multiSelect.observer = new MutationObserver(() => {
            handleChange({ selectedItems: this.multiSelect.selectedItems })
            this.multiSelect.observer.disconnect()
            delete this.multiSelect.observer
          })
          this.multiSelect.observer.observe(menu[0].parentNode, {
            childList: true
          })
        }
      } else if (!this.multiSelect.observer) {
        handleChange({ selectedItems: this.multiSelect.selectedItems })
      }
    }
  }
}

export default ControlPanelMultiSelect
