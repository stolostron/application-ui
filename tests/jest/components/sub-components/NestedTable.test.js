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

import NestedTable from '../../../../src-web/components/common/NestedTable'

describe('NestedTable component 1', () => {
  const fn = jest.fn()
  const tagFilterProps = {
    selectedItems: [
      {
        'name': 'cloud=IBM',
        'id': 'cloud=IBM',
        'key': 'cloud',
        'value': 'IBM',
        'type': 'clusterLabel'
      },
    ],
    availableItems: [
      {
        key: 'clusterLabel',
        value: [
          {
            'name': 'cloud=IBM',
            'id': 'cloud=IBM',
            'key': 'cloud',
            'value': 'IBM',
            'type': 'clusterLabel'
          },
          {
            'name': 'clusterip=9.42.23.230',
            'id': 'clusterip=9.42.23.230',
            'key': 'clusterip',
            'value': '9.42.23.230',
            'type': 'clusterLabel'
          }
        ]
      }
    ]
  }
  it('renders as expected', () => {
    const component = shallow(
      <NestedTable  {...tagFilterProps} header={'header'} selectionChanged={fn} />
    )
    expect(component).toMatchSnapshot()
    component.find('.nest-table-expand-icon').at(0).simulate('click')
    expect(component).toMatchSnapshot()
  })
})
