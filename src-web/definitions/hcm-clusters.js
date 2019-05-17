/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'
import React from 'react'
import lodash from 'lodash'
import msgs from '../../nls/platform.properties'
import resources from '../../lib/shared/resources'
import StatusField from '../components/common/StatusField'
import constants from '../../lib/shared/constants'

resources(() => {
  require('../../scss/table.scss')
})

export default {
  defaultSortField: 'metadata.name',
  primaryKey: 'metadata.name',
  tableKeys: [
    {
      msgKey: 'table.header.name',
      resourceKey: 'metadata.name',
    },
    {
      msgKey: 'table.header.namespace',
      resourceKey: 'metadata.namespace',
    },
    {
      msgKey: 'table.header.labels',
      resourceKey: 'metadata.labels',
      transformFunction: getLabels
    },
    {
      msgKey: 'table.header.endpoint',
      resourceKey: 'clusterip',
      transformFunction: getExternalLink
    },
    {
      msgKey: 'table.header.status',
      resourceKey: 'status',
      transformFunction: getStatusIcon
    },
    {
      msgKey: 'table.header.nodes',
      resourceKey: 'nodes',
    },
    {
      msgKey: 'table.header.klusterletVersion',
      resourceKey: 'klusterletVersion',
    },
    {
      msgKey: 'table.header.k8sVersion',
      resourceKey: 'k8sVersion',
    },
    {
      msgKey: 'table.header.storage',
      resourceKey: 'totalStorage',
      transformFunction: getStorage
    },
    {
      msgKey: 'table.header.memory',
      resourceKey: 'totalMemory',
      transformFunction: getMemory
    },
    {
      msgKey: 'table.header.cpu',
      resourceKey: 'totalCPU',
      transformFunction: getCPU
    },
  ],
  tableActions: [
    // 'table.actions.cluster.view.nodes',
    // 'table.actions.cluster.view.pods',
    'table.actions.cluster.edit.labels',
    'table.actions.cluster.launch',
    constants.MCM_CLUSTERS_SERVICES_ACTIONS.LOGGING.action,
    constants.MCM_CLUSTERS_SERVICES_ACTIONS.MONITORING.action,
    constants.MCM_CLUSTERS_SERVICES_ACTIONS.CEM.action,
    'table.actions.cluster.search'
  ],
}

export function getExternalLink(item, locale) {
  return item.consoleURL ? <a target="_blank" href={`${item.consoleURL}/console?useNav=platform-ui`}>{msgs.get('table.actions.launch', locale)}</a> : '-'
}

export function getLabels(item) {
  return <ul>
    {lodash.map(item.metadata.labels, (value, key) => {
      if (key !== 'controller-revision-hash' && key != 'pod-template-generation' && key != 'pod-template-hash')
        return <li key={`${key}=${value}`}>{`${key}=${value}`}</li>
    })
    }
  </ul>
}

export function getStatusIcon(item, locale) {
  let text
  switch (item.status) {
  case 'OK':
  case 'ok':
    text = 'ready'
    break
  case 'failed':
  case 'critical':
  case 'offline':
    text = 'offline'
    break
  case 'unknown':
  default :
    text = 'unknown'
    break
  }
  return <StatusField status={item.status} text={msgs.get(`table.cell.${text}`, locale)} />
}

// following functions return the percent of storage/memory used on each cluster
export function getStorage(item) {
  if (!item || !item.totalStorage) return '-'
  return `${item.totalStorage}%`
}

export function getMemory(item) {
  if (!item || !item.totalMemory) return '-'
  return `${item.totalMemory}%`
}

export function getCPU(item) {
  if (!item || !item.totalCPU) return '-'
  return `${item.totalCPU}%`
}
