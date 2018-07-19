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
import renderer from 'react-test-renderer'

import ClusterViewer from '../../../src-web/components/topology/ClusterViewer'

describe('ClusterViewer no components', () => {
  const mockData = {
    clusters: [],
    nodes:[],
    links:[],
    onSelectedNodeChange: jest.fn()
  }
  it('renders as expected', () => {
    const component = renderer.create(
      <ClusterViewer
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
  cluster: {
    id: 'cluster_id',
    name: 'name'
  },
  nodes:[
    {
      'id': '1',
      'uid': '1',
      'name': '1',
      'cluster': 'cluster_id',
      'type': 'service',
      'namespace': 'default',
      'topology': 'cluster',
      '__typename': 'Resource'
    },
    {
      'id': '2',
      'uid': '2',
      'name': '2',
      'cluster': 'cluster_id',
      'type': 'service',
      'namespace': 'default',
      'topology': 'service',
      '__typename': 'Resource'
    },
    {
      'id': '3',
      'uid': '3',
      'name': '3',
      'cluster': 'cluster_id',
      'type': 'service',
      'namespace': 'default',
      'topology': 'service',
      '__typename': 'Resource'
    }],
  links:[
    {
      source: 1,
      target: 2,
      label: 'link',
      type: 'link'
    },
    {
      source: 2,
      target: 3,
      label: 'link',
      type: 'link'
    }
  ],
  onSelectedNodeChange: jest.fn()
}

describe('ClusterViewer 3 components', () => {
  it('renders as expected', () => {
    const component = shallow(
      <ClusterViewer
        id={mockData.cluster.id}
        name={mockData.cluster.name}
        nodes={mockData.nodes}
        links={mockData.links}
        onSelectedNodeChange={mockData.onSelectedNodeChange}
        selectedNodeId={mockData.selectedNodeId}
      />
    )
    expect(component).toMatchSnapshot()
  })
})
