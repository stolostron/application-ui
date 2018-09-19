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
import renderer from 'react-test-renderer'
import { MemoryRouter } from 'react-router'
import ResourceOverview from '../../../../src-web/components/dashboard/ResourceOverview'

describe('ResourceOverview no components', () => {
  it('renders as expected', () => {
    const component = renderer.create(
      <MemoryRouter initialEntries={[ '/random' ]}>
        <ResourceOverview />
      </MemoryRouter>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})

const mockItem = {
  critical:1,
  warning:2,
  healthy:3,
  name:'4',
  table:[[1,2],[3,4]]
}

describe('ResourceOverview no components', () => {
  it('renders as expected', () => {
    const component = renderer.create(
      <MemoryRouter initialEntries={[ '/random' ]}>
        <ResourceOverview cardItem={mockItem} />
      </MemoryRouter>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})
