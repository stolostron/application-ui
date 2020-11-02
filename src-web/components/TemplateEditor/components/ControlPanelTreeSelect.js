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

/* eslint-disable react/no-unused-state, react/no-unused-prop-types, jsx-a11y/autocomplete-valid */

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Tooltip from './Tooltip'
import _ from 'lodash'

class ControlPanelTreeSelect extends React.Component {
  static propTypes = {
    control: PropTypes.object,
    controlId: PropTypes.string,
    handleChange: PropTypes.func,
    locale: PropTypes.string
  };

  static getDerivedStateFromProps(props, state) {
    const { control, handleChange } = props
    const handleTreeChange = evt => {
      control.active = evt.selectedItem
      handleChange(evt)
    }

    const { available = [] } = control
    const { branches = 0 } = state
    let { active } = control
    let {
      currentSelection,
      searchList,
      indexes = [],
      isOpen,
      searchText
    } = state
    const branchLabels = []
    let currentAvailable = []

    // clicked on a branch in search mode, search for that branch
    if (currentSelection !== undefined && searchText) {
      const { value, branch } = searchList[currentSelection]
      if (!value) {
        searchText = branch
        currentSelection = undefined
      }
    }

    /////////////////////////////////////////////////////////////
    // search mode
    if (searchText && searchText.length) {
      // nothing selected, filter list
      if (currentSelection === undefined) {
        searchList = []
        const findText = searchText.toLowerCase()
        const fillArray = (arry, branchMatch, indent) => {
          arry.forEach(({ label, children, value, description }) => {
            if (value) {
              const instance = `${value} - ${description}`
              if (
                branchMatch ||
                instance.toLowerCase().indexOf(findText) !== -1
              ) {
                currentAvailable.push({ instance, indent })
                searchList.push({ value, description })
              }
            } else if (children) {
              const beg = currentAvailable.length
              const bm =
                branchMatch || label.toLowerCase().indexOf(findText) !== -1
              fillArray(children, bm, indent + 20)
              if (currentAvailable.length > beg) {
                currentAvailable.splice(beg, 0, { branch: label, indent })
                searchList.splice(beg, 0, { branch: label })
              }
            }
          })
        }
        fillArray(available, false, 0)
        isOpen = true
      } else {
        // handle change
        const { value, description } = searchList[currentSelection]
        active = `${value}  # ${description}`
        handleTreeChange({ selectedItem: active })
        currentAvailable = []
        indexes = []
        isOpen = false
        searchText = null
      }
    } else {
      /////////////////////////////////////////////////////////////
      // tree mode
      // get current list using indexes
      if (currentSelection !== undefined) {
        currentSelection -= branches
        if (currentSelection >= 0) {
          indexes = _.cloneDeep(indexes)
          indexes.push(currentSelection)
        } else {
          // clicked a branch label
          indexes = indexes.slice(0, currentSelection)
        }
      }

      let path = indexes.map(index => `[${index}]`).join('.children')
      currentAvailable = path ? _.get(available, path) : available
      currentAvailable = currentAvailable.children || currentAvailable
      let indent = 0
      if (Array.isArray(currentAvailable)) {
        path = ''
        indexes.forEach(index => {
          path += `[${index}]`
          let label = _.get(available, `${path}.label`)
          if (label) {
            label = `${label}`
            branchLabels.push({ branch: label, indent })
            path += '.children'
            indent += 20
          }
        })
        currentAvailable = [
          ...branchLabels,
          ...currentAvailable.map(item => {
            if (item.label) {
              return { branch: item.label, indent }
            } else {
              return {
                instance: `${item.value} - ${item.description}`,
                indent
              }
            }
          })
        ]
      } else {
        // handle change
        active = `${currentAvailable.value}  # ${currentAvailable.description}`
        handleTreeChange({ selectedItem: active })
        currentAvailable = []
        indexes = []
        searchText=null
        isOpen = false
      }
    }
    return {
      active,
      currentAvailable,
      currentSelection: undefined,
      indexes,
      branches: branchLabels.length,
      isOpen,
      searchText,
      searchList
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
      searchText: null
    }
    // create active map
    this.addAvailableMap(props)
  }

  addAvailableMap(props) {
    const { control } = props
    control.availableMap = {}
    const { available, availableMap } = control
    this.addAvailableMapHelper(available, availableMap)
  }

  addAvailableMapHelper(available, availableMap) {
    available.forEach(({ children, value, description }) => {
      if (children) {
        this.addAvailableMapHelper(children, availableMap)
      } else {
        availableMap[value] = description
      }
    })
  }

  render() {
    const { controlId, control, locale } = this.props
    const { name, availableMap = {}, validation } = control
    const {
      isOpen,
      active,
      currentAvailable,
      indexes,
      searchText
    } = this.state
    const currentActive = availableMap[active]
      ? `${active} - ${availableMap[active]}`
      : active

    const toggleClasses = classNames({
      'bx--list-box__menu-icon': true,
      'bx--list-box__menu-icon--open': isOpen
    })

    const aria = isOpen ? 'Close menu' : 'Open menu'
    const key = `${controlId}-${name}-${currentAvailable
      .map(({ branch, instance }) => {
        return branch || instance
      })
      .join('-')}`
    return (
      <React.Fragment>
        <div className="creation-view-controls-treeselect">
          <div className="creation-view-controls-treeselect-title">
            {name}
            {validation.required ? (
              <div className="creation-view-controls-required">*</div>
            ) : null}
            <Tooltip control={control} locale={locale} />
          </div>
          <div id={controlId}>
            <div
              role="listbox"
              aria-label="Choose an item"
              tabIndex="0"
              className="bx--dropdown bx--list-box"
            >
              <div
                role="button"
                className=""
                tabIndex="0"
                type="button"
                aria-label={aria}
                aria-expanded={isOpen}
                aria-haspopup="true"
                data-toggle="true"
                onClick={this.clickToggle.bind(this)}
                onKeyPress={this.pressToggle.bind(this)}
              >
                <input
                  className="bx--text-input"
                  aria-label="ListBox input field"
                  spellCheck="false"
                  role="combobox"
                  aria-controls={key}
                  aria-autocomplete="list"
                  aria-expanded="true"
                  autoComplete="new-password"
                  id="downshift-0-input"
                  placeholder=""
                  value={searchText !== null ? searchText : currentActive}
                  onFocus={e => {
                    e.target.select()
                  }}
                  onKeyDown={this.pressPress.bind(this)}
                  onChange={evt =>
                    this.setState({ searchText: evt.currentTarget.value })
                  }
                />
                <div
                  role="button"
                  className="bx--list-box__selection"
                  tabIndex="0"
                  title="Clear selected item"
                  onClick={this.clickClear.bind(this)}
                  onKeyPress={this.pressClear.bind(this)}
                >
                  <svg
                    height="10"
                    role="img"
                    viewBox="0 0 10 10"
                    width="10"
                    focusable="false"
                    aria-label="Clear selected item"
                    alt="Clear selected item"
                  >
                    <title>Clear selected item</title>
                    <path d="M6.32 5L10 8.68 8.68 10 5 6.32 1.32 10 0 8.68 3.68 5 0 1.32 1.32 0 5 3.68 8.68 0 10 1.32 6.32 5z" />
                  </svg>
                </div>
                <div
                  role="button"
                  tabIndex="0"
                  className={toggleClasses}
                  onClick={this.clickToggle.bind(this)}
                  onKeyPress={this.pressToggle.bind(this)}
                >
                  <svg
                    fillRule="evenodd"
                    height="5"
                    role="img"
                    viewBox="0 0 10 5"
                    width="10"
                    alt={aria}
                    aria-label={aria}
                  >
                    <title>Close menu</title>
                    <path d="M0 0l5 4.998L10 0z" />
                  </svg>
                </div>
              </div>
              {isOpen && (
                <div className="bx--list-box__menu" key={key} id={key}>
                  {currentAvailable.map(
                    ({ branch, instance, indent = 0 }, inx) => {
                      const itemClasses = classNames({
                        'bx--list-box__menu-item': true,
                        'bx--list-box__menu-branch': branch,
                        searching: searchText,
                        open: inx < indexes.length
                      })
                      const label = branch || instance
                      return (
                        <div
                          role="button"
                          key={label}
                          className={itemClasses}
                          id={`downshift-0-item-${inx}`}
                          tabIndex="0"
                          style={{
                            textIndent: `${indent}px`,
                            whiteSpace: 'pre'
                          }}
                          onClick={this.clickSelect.bind(this, inx)}
                          onKeyPress={this.pressSelect.bind(this, inx)}
                        >
                          {this.renderLabel(label, searchText)}
                        </div>
                      )
                    }
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }

  renderLabel(label, searchText) {
    const inx =
      searchText &&
      searchText.length &&
      label.toLowerCase().indexOf(searchText.toLowerCase())
    if (inx !== null && inx >= 0) {
      label = [
        label.substr(0, inx),
        label.substr(inx, searchText.length),
        label.substr(inx + searchText.length)
      ]
      return (
        <React.Fragment>
          {label[0]}
          <b>{label[1]}</b>
          {label[2]}
        </React.Fragment>
      )
    } else {
      return <React.Fragment>{label}</React.Fragment>
    }
  }

  pressPress(e) {
    if (e.key === 'Escape') {
      this.clickClear()
    }
  }

  pressToggle(e) {
    if (e.key === 'Enter') {
      this.clickToggle()
    } else if (e.key === 'Escape') {
      this.clickClear()
    }
  }

  clickToggle(e) {
    if (e) {
      e.stopPropagation()
    }
    const { searchText: st } = this.state
    if (!st) {
      this.setState(preState => {
        let {
          currentAvailable,
          currentSelection,
          searchText,
          indexes,
          isOpen
        } = preState
        isOpen = !isOpen
        if (!isOpen) {
          currentAvailable = []
          currentSelection = undefined
          searchText = null
          indexes = []
        }
        return {
          currentAvailable,
          currentSelection,
          searchText,
          indexes,
          isOpen
        }
      })
    }
  }

  pressSelect(inx, e) {
    if (e.key === 'Enter') {
      this.clickSelect(inx)
    }
  }

  clickSelect(inx) {
    this.setState({ currentSelection: inx })
  }

  pressClear(inx, e) {
    if (e && e.key === 'Enter') {
      this.clickClear()
    }
  }

  clickClear() {
    this.setState({ searchText: '' })
  }
}

export default ControlPanelTreeSelect
