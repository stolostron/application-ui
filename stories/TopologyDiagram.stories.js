/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'

import { storiesOf } from '@storybook/react'
import TopologyDiagram from '../src-web/components/TopologyDiagram'


const renderWith1Cluster = {
  clusters: [
    { id: '1', index: 0, name: 'Cluster A'},
  ],
  nodes: [
    { cluster: '1', uid: 'id-01', type: 'pod', name: 'My Pod'},
    { cluster: '1', uid: 'id-02', type: 'deployment', name: 'My Deployment'},
  ],
  links: [],
  onSelectedNodeChange: () => {},
}

const renderWith2Clusters = {
  clusters: [
    { id: '1', index: 0, name: 'Cluster A'},
    { id: '2', index: 1, name: 'Cluster B'},
  ],
  nodes: [
    { cluster: '1', uid: 'uid-01', type: 'deployment', name: 'My Deployment'},
    { cluster: '1', uid: 'uid-02', type: 'pod', name: 'My Pod'},
    { cluster: '2', uid: 'uid-10', type: 'service', name: 'My Service'},
    { cluster: '2', uid: 'uid-11', type: 'pod', name: 'My Pod 1'},
    { cluster: '2', uid: 'uid-12', type: 'pod', name: 'My Pod 2'},
    { cluster: '2', uid: 'uid-13', type: 'container', name: 'My Container'},
  ],
  links: [
    { source: 'uid-01', target:'uid-02', label: 'contains'},
    { source: 'uid-10', target:'uid-11', label: 'contains'},
    { source: 'uid-10', target:'uid-12', label: 'contains'},
    { source: 'uid-01', target:'uid-10', label: 'depends on'},
  ],
  onSelectedNodeChange: () => {},
}


storiesOf('Topology - Diagram', module)

  .add('with 1 cluster', () => (
    <div style={{height: '800px', width:'100%', marginTop: '25px'}}>
      <TopologyDiagram  {...renderWith1Cluster} />
    </div>
  ))

  .add('with 2 clusters', () => (
    <div style={{height: '800px', width:'100%', marginTop: '25px'}}>
      <TopologyDiagram  {...renderWith2Clusters} />
    </div>
  ))
