/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import resources from '../../../lib/shared/resources'
import '../../../graphics/diagramShapes.svg'
import '../../../graphics/diagramIcons.svg'
import msgs from '../../../nls/platform.properties'
import _ from 'lodash'

resources(() => {
  require('../../../scss/filter-bar.scss')
})

class FilterBar extends React.Component {

  static propTypes = {
    activeFilters: PropTypes.array,
    availableFilters: PropTypes.array,
    onChange: PropTypes.func,
    tooltipMap: PropTypes.object,
    typeToShapeMap: PropTypes.object,
  }

  constructor (props) {
    super(props)
    this.state = {
      activeFilters:[]
    }
  }

  handleClick = (label) => {
    this.setState((prevState) => {
      // change check immediately
      const activeFilters = _.cloneDeep(prevState.activeFilters)
      const idx = activeFilters.findIndex(({label:active})=>active===label)
      if (idx!==-1) {
        activeFilters.splice(idx, 1)
      } else {
        activeFilters.push({label})
      }

      // but give the user the chance to click something else
      // before we update diagram
      if (this.changeTimeout) {
        clearTimeout(this.changeTimeout)
      }
      this.changeTimeout = setTimeout(() => {
        this.props.onChange('type', activeFilters)
      }, 200)

      return { activeFilters }
    })

  }

  componentWillReceiveProps(nextProps){
    this.setState({ activeFilters: _.cloneDeep(nextProps.activeFilters||[]) })
  }

  shouldComponentUpdate(nextProps, nextState){
    return !_.isEqual(this.props.activeFilters, nextProps.activeFilters) ||
    !_.isEqual(this.state.activeFilters, nextState.activeFilters) ||
    !_.isEqual(this.props.tooltipMap, nextProps.tooltipMap)
  }

  render() {
    const {activeFilters} = this.state
    const {availableFilters, typeToShapeMap, tooltipMap={} } = this.props
    return (
      <div className='filter-bar'>
        {availableFilters.map(({label}) => {
          const selected = !!activeFilters.find(({label: active})=> label===active)
          return (
            <FilterButton key={label} label={label}
              selected={selected}
              typeToShapeMap={typeToShapeMap}
              tooltip={tooltipMap[label]}
              handleClick={this.handleClick}
            />
          )
        })}
      </div>
    )
  }
}

class FilterButton extends React.Component {
  static propTypes = {
    handleClick: PropTypes.func,
    label: PropTypes.string,
    selected: PropTypes.bool,
    tooltip: PropTypes.string,
    typeToShapeMap: PropTypes.object,
  }

  handleClick = () => {
    document.activeElement.blur()
    this.props.handleClick(this.props.label)
  }

  handleKeyPress = (e) => {
    if ( e.key === 'Enter') {
      this.props.handleClick(this.props.label)
    }
  }

  shouldComponentUpdate(nextProps){
    return this.props.selected !== nextProps.selected ||
      this.props.tooltip!==nextProps.tooltip
  }

  render() {
    const {label, tooltip, selected, typeToShapeMap} = this.props
    const {shape='circle', className='default'} =  typeToShapeMap[label]||{}
    return (
      <div className='filter-bar-button-container' key={label} title={tooltip||''}>
        <div className='filter-bar-button'
          aria-checked={selected}  tabIndex='0' role={'checkbox'}
          aria-label={msgs.get(selected ? 'select' : 'unselect', this.context.locale)}
          onClick={this.handleClick} onKeyPress={this.handleKeyPress} >
          <svg width="16px" height="16px">
            <use href={`#diagramShapes_${shape}`} className={`${className} filter-bar-button-icon`}></use>
          </svg>
          <div className='filter-bar-button-label'>
            {label}
          </div>
        </div>
        {selected && <div className='filter-bar-button-checkmark'>
          <svg width="8px" height="8px">
            <use href={'#diagramIcons_checkmark'}></use>
          </svg>
        </div>}
      </div>
    )
  }
}

export default FilterBar
