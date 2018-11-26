/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

/**
  NOTE: See documentation in SearchResourceTable.js
 */

export default {
  cluster: {
    columns: [
      { key: 'name' },
      { key: 'namespace' },
      { key: 'status'},
      { key: 'nodes'},
      { key: 'cpu'},
      { key: 'storage'},
      { key: 'memory'},
      { key: 'endpoint'},
    ],
    actions: [
      'table.actions.cluster.view.nodes',
      'table.actions.cluster.view.pods',
      'table.actions.cluster.edit.labels',
    ],
  },
  daemonset: {
    columns: [
      { key: 'name' },
    ],
    actions: [],
  },
  namespace: {
    columns: [
      { key: 'name' },
    ],
    actions: [],
  },
  node: {
    columns: [
      { key: 'name' },
      { key: 'cpu' },
    ],
    actions: [],
  },
  persistentVolume: {
    columns: [
      { key: 'name' },
    ],
    actions: [],
  },
  persistentVolumeClaim: {
    columns: [
      { key: 'name' },
    ],
    actions: [],
  },
  pod: {
    columns: [
      { key: 'name' },
      { key: 'namespace' },
      { key: 'cluster'},
      { key: 'labels'},
      { key: 'images'},
      { key: 'status'},
      { key: 'restarts'},
      { key: 'hostIP'},
      { key: 'podIP'},
      { key: 'created'},
      { key: 'nodes'},
    ],
    actions: [],
  }
}
