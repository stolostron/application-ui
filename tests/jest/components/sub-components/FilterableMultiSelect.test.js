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
import { shallow } from 'enzyme'

import FilterableMultiSelect from '../../../../src-web/components/common/FilterableMultiSelect'

const mockData = {
  title: 'test',
  type: 'test',
  fetching: false,
  failure: false,
  availableFilters: [

  ],
  activeFilters: [

  ],
  onSelectedFilterChange: jest.fn()
}

describe('FilterableMultiSelect components', () => {

  it('renders as expected', () => {
    const component = shallow(
      <FilterableMultiSelect
        filterType={mockData.type}
        title={mockData.title}
        availableFilters={mockData.availableFilters}
        activeFilters={mockData.activeFilters}
        onChange={mockData.onSelectedFilterChange}
        fetching={mockData.fetching}
        failure={mockData.failure}
      />
    )
    expect(component).toMatchSnapshot()
  })

})
