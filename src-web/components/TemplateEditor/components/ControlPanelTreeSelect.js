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
    handleChange: PropTypes.func,
    locale: PropTypes.string,
  }

  static getDerivedStateFromProps(props, state) {
    const {control, handleChange} = props
    const {available=[]} = control
    const {branches=0} = state
    let {active} = control
    let {currentSelection, searchList, indexes=[], isOpen, searchText} = state
    const branchLabels = []
    const branchIndents = []
    let switchOver
    let currentAvailable=[]


    /////////////////////////////////////////////////////////////
    // search mode
    if (searchText && searchText.length>1) {
      // nothing selected, filter list
      if (currentSelection===undefined) {
        searchList = []
        const fillArray = (arry) =>{
          arry.forEach(({children, value, description})=>{
            if (value) {
              const instance = `${value} - ${description}`
              if (instance.toLowerCase().indexOf(searchText)!==-1) {
                currentAvailable.push(instance)
                searchList.push({value, description})
              }
            } else if (children) {
              fillArray(children)
            }
          })
        }
        fillArray(available)
        isOpen = true
      } else {

        // handle change
        const {value, description} = searchList[currentSelection]
        active = `${value}  # ${description}`
        handleChange({selectedItem: active})
        currentAvailable = []
        indexes = []
        isOpen = false
        searchText = null

      }

    } else {
    /////////////////////////////////////////////////////////////
    // tree mode

      // get current list using indexes
      if (currentSelection!==undefined) {
        currentSelection -= branches
        if (currentSelection>=0) {
          indexes = _.cloneDeep(indexes)
          indexes.push(currentSelection)
        } else {
          // clicked a branch label
          indexes = indexes.slice(0, currentSelection)
        }
      }

      let path = indexes.map(index=>`[${index}]`).join('.children')
      currentAvailable = path ? _.get(available, path) : available
      currentAvailable = currentAvailable.children || currentAvailable

      let indent=0

      if (Array.isArray(currentAvailable)) {
        path=''
        branchIndents.push(indent)
        indexes.forEach(index=>{
          path += `[${index}]`
          let label =_.get(available, `${path}.label`)
          if (label) {
            label = `${label}`
            branchLabels.push(label)
            path += '.children'
            indent+=20
            branchIndents.push(indent)
          }
        })
        switchOver=branchLabels.length
        currentAvailable =
          [...branchLabels,
            ...currentAvailable.map(item=>{
              branchIndents.push(indent)
              if (item.label) {
                switchOver++
                return item.label
              } else {
                return `${item.value} - ${item.description}`
              }
            })]
      } else {

        // handle change
        active = `${currentAvailable.value}  # ${currentAvailable.description}`
        handleChange({selectedItem: active})
        currentAvailable = []
        indexes = []
        isOpen = false
      }
    }
    return {active, currentAvailable, currentSelection: undefined, indexes,
      branches: branchLabels.length, branchIndents, switchOver, isOpen,
      searchText, searchList}
  }

  constructor (props) {
    super(props)
    this.state = {
      isOpen: false,
      searchText: null,
    }
    // create active map
    this.addAvailableMap(props)
  }


  addAvailableMap(props) {
    const {control} = props
    control.availableMap = {}
    const {available, availableMap} = control
    this.addAvailableMapHelper(available, availableMap)
  }

  addAvailableMapHelper(available, availableMap) {
    available.forEach(({children, value, description}) =>{
      if (children) {
        this.addAvailableMapHelper(children, availableMap)
      } else {
        availableMap[value] = description
      }
    })
  }

  render() {
    const {control, locale} = this.props
    const {id, name, availableMap={}, validation} = control
    const {isOpen, active, currentAvailable, switchOver=0, branchIndents, indexes, searchText} = this.state
    const currentActive = availableMap[active] ? `${active} - ${availableMap[active]}` : active

    const toggleClasses = classNames({
      'bx--list-box__menu-icon': true,
      'bx--list-box__menu-icon--open': isOpen,
    })

    const aria = isOpen ? 'Close menu' : 'Open menu'
    const key = `${id}-${name}-${currentAvailable.join('-')}`
    return (
      <React.Fragment>
        <div className='creation-view-controls-treeselect'>
          <div className='creation-view-controls-treeselect-title'>
            {name}
            {validation.required ? <div className='creation-view-controls-required'>*</div> : null}
            <Tooltip control={control} locale={locale} />
          </div>
          <div id={id}>
            <div role='listbox' aria-label='Choose an item' tabIndex='0' className='bx--dropdown bx--list-box'>
              <div role='button' className='' tabIndex='0' type='button'
                aria-label={aria} aria-expanded={isOpen} aria-haspopup='true' data-toggle='true'
                onClick={this.clickToggle.bind(this)} onKeyPress={this.pressToggle.bind(this)}>
                <input className='bx--text-input' aria-label='ListBox input field'
                  spellCheck='false' role='combobox' aria-controls={key}
                  aria-autocomplete='list' aria-expanded='true' autoComplete='no'
                  id='downshift-0-input' placeholder='' value={searchText!==null? searchText : currentActive}
                  onFocus={(e)=>{ e.target.select() }} onKeyDown={this.pressPress.bind(this)}
                  onChange={(evt)=>this.setState({searchText:evt.currentTarget.value})}
                />
                <div role='button' className='bx--list-box__selection' tabIndex='0' title='Clear selected item'
                  onClick={this.clickClear.bind(this)} onKeyPress={this.pressClear.bind(this)}>
                  <svg height='10' role='img' viewBox='0 0 10 10' width='10'
                    focusable='false' aria-label='Clear selected item' alt='Clear selected item'>
                    <title>Clear selected item</title>
                    <path d='M6.32 5L10 8.68 8.68 10 5 6.32 1.32 10 0 8.68 3.68 5 0 1.32 1.32 0 5 3.68 8.68 0 10 1.32 6.32 5z'></path>
                  </svg>
                </div>
                <div role='button' tabIndex='0' className={toggleClasses}
                  onClick={this.clickToggle.bind(this)} onKeyPress={this.pressToggle.bind(this)}>
                  <svg fillRule='evenodd' height='5' role='img' viewBox='0 0 10 5' width='10' alt={aria} aria-label={aria}>
                    <title>Close menu</title>
                    <path d='M0 0l5 4.998L10 0z'></path>
                  </svg>
                </div>
              </div>
              {isOpen && <div className='bx--list-box__menu' key={key} id={key}>
                {currentAvailable.map((label, inx)=>{
                  const isBranch = inx<switchOver
                  const itemClasses = classNames({
                    'bx--list-box__menu-item': true,
                    'bx--list-box__menu-branch': isBranch,
                    'open': inx<indexes.length
                  })

                  return (
                    <div role='button' key={label} className={itemClasses}
                      id={`downshift-0-item-${inx}`} tabIndex='0' style={{textIndent: `${branchIndents[inx]}px`}}
                      onClick={this.clickSelect.bind(this, inx)} onKeyPress={this.pressSelect.bind(this, inx)}
                    >
                      {this.renderLabel(label, searchText)}
                    </div>
                  )
                })}
              </div>}
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }

  renderLabel(label, searchText) {
    if (searchText && searchText.length>1) {
      const inx = label.toLowerCase().indexOf(searchText)
      label = [
        label.substr(0,inx),
        label.substr(inx, searchText.length),
        label.substr(inx + searchText.length)
      ]
      return (
        <React.Fragment>
          {label[0]}<b>{label[1]}</b>{label[2]}
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          {label}
        </React.Fragment>
      )
    }
  }

  pressPress(e) {
    if ( e.key === 'Escape') {
      this.clickClear()
    }
  }

  pressToggle(e) {
    if ( e.key === 'Enter') {
      this.clickToggle()
    } else if ( e.key === 'Escape') {
      this.clickClear()
    }
  }

  clickToggle() {
    const {searchText:st} = this.state
    if (!st) {
      this.setState(preState => {
        let {currentAvailable, currentSelection, searchText, indexes, isOpen} = preState
        isOpen = !isOpen
        if (!isOpen) {
          currentAvailable=[]
          currentSelection=undefined
          searchText=null
          indexes=[]
        }
        return {currentAvailable, currentSelection, searchText, indexes, isOpen}
      })
    }
  }

  pressSelect(inx, e) {
    if ( e.key === 'Enter') {
      this.clickSelect(inx)
    }
  }

  clickSelect(inx) {
    this.setState({currentSelection: inx})
  }

  pressClear(inx, e) {
    if ( e.key === 'Enter') {
      this.clickClear()
    }
  }

  clickClear() {
    this.setState({searchText: null})
  }

}

export default ControlPanelTreeSelect
