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
import { shallow, mount } from 'enzyme'
import renderer from 'react-test-renderer'

import TopologyDiagram from '../../../src-web/components/TopologyDiagram'
import * as Actions from '../../../src-web/actions'

describe('TopologyDiagram component 1', () => {
  const mockData = {
    clusters: [],
    nodes:[],
    links:[],
    onSelectedNodeChange: jest.fn()
  }
  it('renders as expected', () => {
    const component = renderer.create(
      <TopologyDiagram
        clusters={mockData.clusters}
        nodes={mockData.nodes}
        links={mockData.links}
        onSelectedNodeChange={mockData.onSelectedNodeChange}
        selectedNodeId={mockData.selectedNodeId}
      />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})

const mockData = {
  clusters: [
    {
      id: 'this_is_id',
      name: 'name'
    }
  ],
  nodes:[
    {
      'id': '5b0ef443663e4b001bb7e198',
      'uid': 'toronto',
      'name': 'toronto',
      'cluster': null,
      'type': 'cluster',
      'namespace': null,
      'topology': 'cluster',
      '__typename': 'Resource'
    },
    {
      'id': '2',
      'uid': '2',
      'name': '2',
      'cluster': null,
      'type': 'service',
      'namespace': null,
      'topology': 'service',
      '__typename': 'Resource'
    },
    {
      'id': '3',
      'uid': '3',
      'name': '3',
      'cluster': null,
      'type': 'service',
      'namespace': null,
      'topology': 'service',
      '__typename': 'Resource'
    }],
  links:[
    {
      source: 2,
      target: 3,
      label: 'link',
      type: 'link'
    }
  ],
  onSelectedNodeChange: jest.fn()
}

describe('TopologyDiagram component 2', () => {
  it('renders as expected', () => {
    const component = shallow(
      <TopologyDiagram
        clusters={mockData.clusters}
        nodes={mockData.nodes}
        links={mockData.links}
        onSelectedNodeChange={mockData.onSelectedNodeChange}
        selectedNodeId={mockData.selectedNodeId}
        status={Actions.REQUEST_STATUS.DONE}
      />
    )
    expect(component).toMatchSnapshot()
  })
})

describe('TopologyDiagram component 3', () => {
  // enzyme full rendering, http://airbnb.io/enzyme/docs/api/mount.html
  it('renders as expected', () => {
    const component = mount(
      <TopologyDiagram
        clusters={mockData.clusters}
        nodes={mockData.nodes}
        links={mockData.links}
        onSelectedNodeChange={mockData.onSelectedNodeChange}
        selectedNodeId={mockData.selectedNodeId}
        status={Actions.REQUEST_STATUS.DONE}
      />
    )
    //zoom in / zoom out button
    component.find('input').at(0).simulate('click')
    expect(component).toMatchSnapshot()
    component.find('input').at(1).simulate('click')
    expect(component).toMatchSnapshot()
  })
})
