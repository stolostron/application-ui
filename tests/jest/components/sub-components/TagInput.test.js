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

import TagInput from '../../../../src-web/components/common/TagInput'

describe('TagInput component 1', () => {
  const fn = jest.fn()
  const tagFilterProps = {
    tags: [
      { id: 'tag1', name: 'tag1' },
      { id: 'tag2', name: 'tag2' }
    ],
    suggestions: [
      { id: 'tag1', name: 'tag1' },
      { id: 'tag2', name: 'tag2' },
      { id: 'tag3', name: 'tag3' },
      { id: 'tag4', name: 'tag4' },
      { id: 'tag5', name: 'tag5' },
      { id: 'tag6', name: 'tag6' }
    ]
  }
  it('renders as expected', () => {
    const component = shallow(
      <TagInput  {...tagFilterProps} hideModalButton={true} onFilterButtonClick={fn} />
    )
    expect(component).toMatchSnapshot()
    //clear all out button
    component.find('.tagInput-clearAll').at(0).simulate('click')
    expect(component).toMatchSnapshot()
  })
})
