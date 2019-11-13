/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import renderer from 'react-test-renderer'
import { MemoryRouter } from 'react-router'

import { UtilizationCard } from '../../../src-web/components/UtilizationCard'

describe('UtilizationCard component 1', () => {
  it('renders as expected', () => {
    const component = renderer.create(
      <MemoryRouter initialEntries={['/random']}>
        <UtilizationCard
          critical={1}
          healthy={1}
          warning={1}
          title="unit test"
          type="pods"
        />
      </MemoryRouter>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})

describe('UtilizationCard component 2', () => {
  it('renders as expected', () => {
    const component = renderer.create(
      <MemoryRouter initialEntries={['/random']}>
        <UtilizationCard
          critical={0}
          healthy={0}
          warning={1}
          title="unit test 2"
          type="pods"
        />
      </MemoryRouter>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})

describe('UtilizationCard component 3', () => {
  it('renders as expected', () => {
    const component = renderer.create(
      <MemoryRouter initialEntries={['/random']}>
        <UtilizationCard
          critical={0}
          healthy={1}
          warning={0}
          title="unit test 3"
          type="pods"
        />
      </MemoryRouter>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})

describe('UtilizationCard component 4', () => {
  it('renders as expected', () => {
    const component = renderer.create(
      <MemoryRouter initialEntries={['/random']}>
        <UtilizationCard
          critical={0}
          healthy={0}
          warning={0}
          title="unit test 4"
          type="pods"
        />
      </MemoryRouter>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})
