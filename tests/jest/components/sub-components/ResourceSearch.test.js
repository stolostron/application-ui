/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import renderer from 'react-test-renderer'

// mock the uuid creation in ResourceSearch
jest.mock('uuid', () => {
  return { v4: jest.fn(() => 1) }
})
import ResourceSearch from '../../../../src-web/components/common/ResourceSearch'

describe('NoResource component', () => {
  it('renders as expected', () => {
    const component = renderer.create(
      <ResourceSearch
        handleSearch="handleSearch"
        searchLabel="true"
        searchPlaceholder="searchPlaceholder"
        renderSmallSearch="renderSmallSearch"
        searchValue="value"
      >
        <div className="child">Test</div>
      </ResourceSearch>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})
