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
import {
  ComboBox,
  DropdownSkeleton,
  InlineLoading
} from 'carbon-components-react'
import Tooltip from './Tooltip'
import msgs from '../../../../nls/platform.properties'
import _ from 'lodash'

class ControlPanelComboBox extends React.Component {
  static propTypes = {
    control: PropTypes.object,
    controlData: PropTypes.array,
    controlId: PropTypes.string,
    handleControlChange: PropTypes.func,
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
    const { controlId, locale, control } = this.props
    const {
      name,
      userData = [],
      availableMap,
      exception,
      validation,
      hasReplacements,
      isFailed,
      disabled,
      fetchAvailable
    } = control
    let {
      isLoading
    } = control
    const { controlData } = this.props
    let { active, available, placeholder = '' } = control
    let loadingMsg
    if (fetchAvailable) {
      if (isLoading) {
        loadingMsg = msgs.get(
          _.get(control, 'fetchAvailable.loadingDesc', 'resource.loading'),
          locale
        )
      } else if (isFailed) {
        placeholder = msgs.get('resource.error', locale)
      } else if (available.length === 0) {
        placeholder =
          placeholder ||
          msgs.get(
            _.get(control, 'fetchAvailable.emptyDesc', 'resource.empty'),
            locale
          )
      }
    } else if (isLoading) {
      loadingMsg = msgs.get(
        'creation.loading.values',
        [name.toLowerCase()],
        locale
      )
    }
    if (!placeholder) {
      placeholder = msgs.get(
        'creation.enter.value',
        [name.toLowerCase()],
        locale
      )
    }
    available = _.uniq([...userData, ...available])

    // when available map has descriptions of choices
    // ex: instance types have # cpu's etc
    if (availableMap && !hasReplacements) {
      const map = _.invert(availableMap)
      active = map[active] || active
    }

    // if active was preset by loading an existing resource
    // initialize combobox to that value
    if (active && available.length===0) {
      available.push(active)
      if (isLoading) {
        available.push(loadingMsg)
      } else if (isFailed) {
        available.push(placeholder)
      }
      isLoading=false
    }

    // comboboxes need an array of {label, id}
    const items = available.map((label, inx) => {
      return { label, id: inx }
    })
    const initialSelectedItem = items.find(item => item.label === active)

    const key = `${controlId}-${name}-${active}`
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
          {isLoading && !active ? (
            <div className="creation-view-controls-singleselect-loading">
              <DropdownSkeleton />
              <InlineLoading description={loadingMsg} />
            </div>
          ) : (
            <ComboBox
              id={controlId}
              key={key}
              items={items}
              itemToString={item => (item ? item.label : '')}
              initialSelectedItem={initialSelectedItem}
              selecteditem={active}
              spellCheck={false}
              disabled={disabled}
              ref={ref => {
                if (ref) {
                  const input = _.get(ref, 'textInput.current')
                  if (input) {
                    input.autocomplete = 'new-password'
                    input.addEventListener('keyup', e => {
                      if (e.key === 'Enter' && control.typing) {
                        this.handleComboboxChange(
                          control,
                          userData,
                          controlData
                        )
                      }
                    })
                  }
                }
              }}
              invalid={!!exception}
              invalidText={exception}
              placeholder={placeholder}
              onChange={() => {}}
              onFocus={e => {
                e.target.select()
              }}
              onInputChange={this.handleComboboxTyping.bind(
                this,
                control,
                userData,
                available
              )}
            />
          )}
        </div>
      </React.Fragment>
    )
  }

  handleComboboxTyping(control, userData, available, evt) {
    const { controlData } = this.props

    // if menu is still open, user is typing
    const menu = control.ref.getElementsByClassName('bx--list-box__menu')
    if (menu && menu.length > 0) {
      // user clicked selection, kill any typing
      menu[0].addEventListener(
        'click',
        () => {
          delete control.typing
        },
        true
      )

      // user is typing something--filter the list
      Array.from(
        menu[0].getElementsByClassName('bx--list-box__menu-item')
      ).forEach((item, inx) => {
        if (available[inx].indexOf(evt) === -1) {
          item.innerHTML = available[inx]
          item.style.display = 'none'
        } else {
          item.innerHTML = available[inx].replace(
            new RegExp(evt, 'gi'),
            found => {
              return '<b>' + found + '</b>'
            }
          )
          item.style.display = ''
        }
      })
      control.typing = evt
    } else {
      control.active = evt
      this.handleComboboxChange(control, userData, controlData)
    }
  }

  handleComboboxChange(control, userData, controlData) {
    // if user typed something
    if (control.typing) {
      userData.push(control.typing)
      control.userData = userData
      control.active = control.typing

      // if this combobox is fetched from server, make sure whatever user types in has an availableMap entry
      const setAvailableMap = _.get(control, 'fetchAvailable.setAvailableMap')
      if (setAvailableMap) {
        setAvailableMap(control)
      }
    }

    this.props.handleControlChange(control, controlData)
    delete control.typing
  }
}

export default ControlPanelComboBox
