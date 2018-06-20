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

import { DetailsView } from '../../../../src-web/components/topology/DetailsView'

describe('DetailsView component 1', () => {
  it('renders as expected', () => {
    const details = [{
      type: 'label',
      labelKey: 'label-key',
      value: 'value',
    }
    ]
    const component = renderer.create(
      <DetailsView
        context={{test: 'US-en'}}
        details={details}
        onClose={jest.fn()}
        resourceType={'test'}
        title={'test'}
      />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})
