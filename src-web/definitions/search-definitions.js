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
import { getAge } from '../../lib/client/resource-helper'
import { getStatusIcon as getClusterStatusIcon, getExternalLink } from './hcm-clusters'

export default {
  cluster: {
    columns: [
      { key: 'name' },
      { key: 'namespace' },
      { key: 'status', transform: getClusterStatusIcon },
      { key: 'nodes'},
      { key: 'cpu'},
      { key: 'storage'},
      { key: 'memory'},
      { key: 'consoleURL', msgKey: 'endpoint', transform: getExternalLink },
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
      { key: 'namespace' },
      { key: 'cluster' },
      { key: 'desired' },
      { key: 'current',  },
      { key: 'ready' },
      { key: 'updated' },
      { key: 'available' },
      // { key: 'nodeSelector' },
      { key: 'created', transform: getAge }
    ],
    actions: [],
  },
  deployment: {
    columns: [
      { key: 'name' },
      { key: 'namespace' },
      { key: 'cluster' },
      { key: 'desired' },
      { key: 'current' },
      { key: 'ready' },
      { key: 'available' },
      { key: 'created', transform: getAge }
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
      { key: 'cluster' },
      { key: 'role' },
      { key: 'architecture' },
      { key: 'osImage' },
      { key: 'cpu' },
      { key: 'created', transform: getAge }
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
      { key: 'created', transform: getAge }
    ],
    actions: [],
  },
  replicaset: {
    columns: [
      { key: 'name' },
      { key: 'namespace' },
    ],
    actions: [],
  },
  service: {
    columns: [
      { key: 'name' },
      { key: 'namespace' },
    ],
    actions: [],
  },
  statefulset: {
    columns: [
      { key: 'name' },
      { key: 'namespace' },
    ],
    actions: [],
  }
}
