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

import DetailsView from '../../../../src-web/components/topology/DetailsView'


const myDetails = jest.fn()
myDetails
  .mockReturnValueOnce([{
    type: 'label',
    labelKey: 'label-key',
    value: 'value',
  }
  ])

const mockData = {
  'id':'application',
  'nodes':[
    {
      'name':'trader',
      'namespace':'default',
      'type':'application',
      'uid':'applicationtrader'
    }
  ],
  'context':{

  },
  'staticResourceData':{
    'topologyOrder':[
      'application',
      'appservice',
      'dependency'
    ],
    topologyNodeDetails: myDetails
  }
}


describe('DetailsView component 1', () => {
  it('renders as expected', () => {
    const component = renderer.create(
      <DetailsView
        context={mockData.context}
        onClose={jest.fn()}
        staticResourceData={mockData.staticResourceData}
        nodes={mockData.nodes}
        selectedNodeId={'applicationtrader'}
      />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})
