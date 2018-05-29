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
import { MultiSelect, Tooltip } from 'carbon-components-react'
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
  }

  render() {
    const {
      availableFilters,
      activeFilters=[{label: msgs.get('resource.filterAll', this.context.locale)}],
      title,
      disabled } = this.props

    return (
      <div className='multi-select-filter'>
        <div className='multi-select-filter-title'>
          {title}
          <Tooltip triggerText='' iconDescription=''>
            <p className='bx--tooltip__label'>
              {msgs.get('resource.filterTooltip', [title.toLowerCase()], this.context.locale)}
            </p>
            <p>
              {activeFilters.map((filter) => (
                <div key={filter.label}>
                  {filter.label}
                </div>)
              )}
            </p>
          </Tooltip>
        </div>
        <MultiSelect.Filterable
          placeholder={msgs.get('resource.filterLabel', [title], this.context.locale)}
          items={availableFilters}
          initialSelectedItems={this.getSelectedFilters(availableFilters, activeFilters)}
          onChange={this.handleFilter}
          disabled={disabled}
        />
      </div>
    )
  }
}

export default FilterableMultiSelect
