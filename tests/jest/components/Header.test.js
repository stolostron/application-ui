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

// use mock function to return required value directly
// must be called before the main module got imported
jest.mock('../../../lib/client/http-util', () => {return { getContextRoot: jest.fn(() => 'getContextRoot')}})

// after mock function
import { Header } from '../../../src-web/components/Header'

import toJSON from 'enzyme-to-json'
describe('SecondaryHeader component', () => {
  // create two mock functions for even listeners
  const mockMenuClick = jest.fn()
  const mockDropDownClick = jest.fn()
  // pass all required props and callback functions while shallow rendering
  const wrapper = shallow(
    <Header user='admin' leftNavOpen={false} userDropdownOpen={false} handleMenuClick={mockMenuClick} handleUserDropdownClick={mockDropDownClick} />
  )

  // compare with existing snapshot
  it('renders as expected', () => {
    expect(toJSON(wrapper)).toMatchSnapshot()
  })

  // toggle the even, and mock function in this case should be called twice
  // get element by using enzyme selector
  // http://airbnb.io/enzyme/docs/api/ReactWrapper/find.html
  it('should toggle the hamburger icon on click', () => {
    const button = wrapper.find('button').first()
    button.simulate('click')
    expect(toJSON(wrapper)).toMatchSnapshot()
    button.simulate('click')
    expect(toJSON(wrapper)).toMatchSnapshot()
    expect(mockMenuClick.mock.calls.length).toBe(2)
  })

  // get element by searching id
  it('should toggle the user dropdown on click', () => {
    const button = wrapper.find('#user-dropdown')
    button.simulate('click')
    expect(toJSON(wrapper)).toMatchSnapshot()
    button.simulate('click')
    expect(toJSON(wrapper)).toMatchSnapshot()
    expect(mockDropDownClick.mock.calls.length).toBe(2)
  })
})

