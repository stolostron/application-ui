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
import NoResource from '../../../../src-web/components/common/NoResource'
import renderer from 'react-test-renderer'

// simple snapshot testing
// This module will create a snapshot in _snapshots_ folder with a file named NoResource.test.js.snap
// https://facebook.github.io/jest/docs/en/snapshot-testing.html
// All snapshot files should be committed alongside the modules they are covering and their tests.
// They should be considered as part of a test, similar to the value of any other assertion in Jest.
// execute `jest --updateSnapshot` to update/re-generate snapshots

describe('NoResource component', () => {
  it('renders as expected', () => {
    const component = renderer.create(
      <NoResource title='title' detail='detailed description'>
        <div className='child'>Test</div>
      </NoResource>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})
