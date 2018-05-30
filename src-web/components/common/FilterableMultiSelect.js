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
import { MultiSelect } from 'carbon-components-react'
import msgs from '../../../nls/platform.properties'

class FilterableMultiSelect extends React.Component {

  static propTypes = {
    activeFilters: PropTypes.array,
    availableFilters: PropTypes.array,
    disabled: PropTypes.bool,
    filterType: PropTypes.string,
    onChange: PropTypes.func,
    title: PropTypes.string
  }
  /**
   * The <MultiSelect> component uses a shallow compare when computing which items
   * are selected. This function helps to make sure that the array of selected items
   * reference the objects from the items array for the shallow compare to work.
   */
  getSelectedFilters = (items = [], selected = []) =>
    items.filter(i => selected.find(f => i.label === f.label))


  handleFilter = selection => {
    this.props.onChange(this.props.filterType, selection.selectedItems)
    this.updateTooltip()
  }

  componentDidMount () {
    this.updateTooltip()
  }

  updateTooltip () {
    this.multiSelect.inputNode.title = this.tooltip.join('\n')
  }

  render() {
    const {
      title,
      availableFilters,
      activeFilters=[],
      disabled } = this.props

    this.tooltip = []
    if (disabled) {
      this.tooltip.push(msgs.get('resource.filterLabel', [title], this.context.locale))
    } else if (!activeFilters.length) {
      this.tooltip.push(msgs.get('resource.filterAll', this.context.locale))
    } else {
      this.tooltip = activeFilters.map(filter => filter.label).sort()
    }
    return (
      <div className='multi-select-filter'>
        <div className='multi-select-filter-title'>
          {title}
        </div>
        <MultiSelect.Filterable
          ref={this.saveMultiSelectRef}
          placeholder={this.tooltip.join(', ')}
          items={availableFilters}
          initialSelectedItems={this.getSelectedFilters(availableFilters, activeFilters)}
          onChange={this.handleFilter}
          disabled={disabled}
        />
      </div>
    )
  }

  saveMultiSelectRef = ref => {
    this.multiSelect = ref
  }
}

export default FilterableMultiSelect
