/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import renderer from 'react-test-renderer'
import { MemoryRouter } from 'react-router'

import WelcomePageTab from '../../../src-web/containers/WelcomePageTab'


describe('DashboardCard component 2', () => {
  it('renders as expected', () => {
    const component = renderer.create(
      <MemoryRouter initialEntries={[ '/welcome' ]}>
        <WelcomePageTab />
      </MemoryRouter>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})
