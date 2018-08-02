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

import HealthOverview from '../../../../src-web/components/dashboard/HealthOverview'

describe('HealthOverview no components', () => {
  it('renders as expected', () => {
    const component = renderer.create(
      <HealthOverview />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})

const mockPieChartItems ={
  name:'1',
  data:[[1,1],[2,2]],
}

const mockBarChartItems ={
  name:'1',
  data:[[3,3],[4,4]],
}

const mockData = {
  mockPieChartItems,
  mockBarChartItems,
  locale:'en-US'
}

describe('HealthOverview mock components', () => {
  it('renders as expected', () => {
    const component = renderer.create(
      <HealthOverview {...mockData} />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})
