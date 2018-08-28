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
import lodash from 'lodash'
import msgs from '../../nls/platform.properties'
import resources from '../../lib/shared/resources'
import { Icon } from 'carbon-components-react'

resources(() => {
  require('../../scss/table.scss')
})

export default {
  defaultSortField: 'name',
  primaryKey: 'name',
  tableKeys: [
    {
      msgKey: 'table.header.name',
      resourceKey: 'name',
    },
    {
      msgKey: 'table.header.namespace',
      resourceKey: 'namespace',
    },
    {
      msgKey: 'table.header.labels',
      resourceKey: 'labels',
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
      msgKey: 'table.header.storage',
      resourceKey: 'totalStorage',
      transformFunction: getStorage
    },
    {
      msgKey: 'table.header.memory',
      resourceKey: 'totalMemory',
      transformFunction: getMemory
    },
  ],
}

export function getExternalLink(item, locale) {
  return item.clusterip ? <a target="_blank" href={`https://${item.clusterip}:8443/console`}>{msgs.get('table.actions.launch', locale)}</a> : '-'
}

export function getLabels(item) {
  return <ul>
    {lodash.map(item.labels, (value, key) => {
      if (key !== 'controller-revision-hash' && key != 'pod-template-generation' && key != 'pod-template-hash')
        return <li key={`${key}=${value}`}>{`${key}=${value}`}</li>
    })
    }
  </ul>
}

export function getStatusIcon(item) {
  let iconName
  let className
  switch (item.status) {
  case 'ok':
    iconName = 'icon--checkmark--glyph'
    className = 'healthy'
    break
  case 'warning':
    iconName = 'icon--warning--glyph'
    className = 'warning'
    break
  case 'failed':
  case 'critical':
    iconName = 'icon--error--glyph'
    className = 'critical'
    break
  case 'unknown':
    className = 'unknown'
    break
  }
  return (
    <div className='table-status-row'>
      <div className='table-status-icon'>
        {iconName && <Icon className={`table-status-icon__${className}`} name={iconName} description='' /> }
      </div>
      <p>{className}</p>
    </div>
  )
}

// following functions return the percent of storage/memory used on each cluster
export function getStorage(item) {
  return `${item.totalStorage}%`
}

export function getMemory(item) {
  return `${item.totalMemory}%`
}
