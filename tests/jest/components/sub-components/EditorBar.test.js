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



import EditorBar from '../../../../src-web/components/common/EditorBar'

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
