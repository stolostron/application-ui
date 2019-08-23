/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import { shallow } from 'enzyme'

import EditorBar from '../../../../src-web/components/ApplicationTopologyModule/components/EditorBar'

describe('EditorBar components', () => {
  it('renders as expected', () => {
    const component = shallow(
      <EditorBar
        hasUndo={false}
        hasRedo={false}
        exceptions={[]}
        gotoEditorLine={jest.fn()}
        handleEditorCommand={jest.fn()}
        handleSearchChange={jest.fn()}
      />
    )
    expect(component).toMatchSnapshot()
  })
})
