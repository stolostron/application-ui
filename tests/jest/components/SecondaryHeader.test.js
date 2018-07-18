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

import { SecondaryHeader } from '../../../src-web/components/SecondaryHeader'

describe('SecondaryHeader component 1', () => {
  it('renders as expected', () => {
    const component = renderer.create(
      <SecondaryHeader title='hello world' />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})

describe('SecondaryHeader component 2', () => {
  const tabs = [{
    id: 'dashboard-application',
    label: 'tabs.dashboard.application',
    url: '/hcmconsole/dashboard',
  }]
  it('renders as expected', () => {
    const component = renderer.create(
      <SecondaryHeader title='hello world' tabs={tabs} />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})

describe('SecondaryHeader component 3', () => {
  const tabs = [
    {
      id: 'logs-tab',
      label: 'tabs.dashboard.application',
      url: '/hcmconsole/dashboard',
    },
    {
      id: 'logs-tab',
      label: 'tabs.dashboard',
      url: '/hello',
    }
  ]
  const location = {
    pathname: '/hello'
  }
  it('renders as expected', () => {
    const component = renderer.create(
      //eslint-disable-next-line
      <SecondaryHeader title='hello world' role='Viewer' tabs={tabs} location={location} />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})

describe('SecondaryHeader component 4', () => {
  it('renders as expected', () => {
    const component = renderer.create(
      <SecondaryHeader title='hello world' />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})
