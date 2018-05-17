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
import { SecondaryHeader } from '../../../src-web/components/SecondaryHeader'
import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'

// basic snapshot test
describe('SecondaryHeader component', () => {
  const wrapper = shallow(
    <SecondaryHeader title='Overview' />
  )
  it('renders as expected', () => {
    expect(toJSON(wrapper)).toMatchSnapshot()
  })
})

// renderTabs() is not implemented in SecondaryHeader yet, skip the test
// describe('SecondaryHeader component with tabs', () => {
//   const wrapper = shallow(
//     <SecondaryHeader title='Overview' />
//   )
//   it('renders as expected', () => {
//     expect(toJSON(wrapper)).toMatchSnapshot()
//   })
// })
