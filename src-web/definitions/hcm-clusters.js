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
  defaultSortField: 'ClusterName',
  primaryKey: 'ClusterName',
  tableKeys: [
    {
      msgKey: 'table.header.name',
      resourceKey: 'ClusterName',
    },
    {
      msgKey: 'table.header.labels',
      resourceKey: 'Labels',
      transformFunction: getLabels
    },
    {
      msgKey: 'table.header.endpoint',
      resourceKey: 'Labels.clusterip',
      transformFunction: getExternalLink
    },
    {
      msgKey: 'table.header.status',
      resourceKey: 'Status',
      transformFunction: getStatusIcon
    },
    {
      msgKey: 'table.header.nodes',
      resourceKey: 'TotalNodes',
    },
    {
      msgKey: 'table.header.storage',
      resourceKey: 'TotalStorage',
      transformFunction: getStorage
    },
    {
      msgKey: 'table.header.memory',
      resourceKey: 'TotalMemory',
      transformFunction: getMemory
    },
  ],
}

export function getExternalLink(item, locale) {
  return (item.Labels && item.Labels.clusterip) ? <a href={`https://${item.Labels.clusterip}:8443/console`}>{msgs.get('table.actions.launch', locale)}</a> : '-'
}

export function getLabels(item) {
  return <ul>
    {lodash.map(item.Labels, (value, key) => {
      if (key !== 'controller-revision-hash' && key != 'pod-template-generation' && key != 'pod-template-hash')
        return <li key={key+value}>{`${key}=${value}`}</li>
    })
    }
  </ul>
}

export function getStatusIcon(item) {
  let iconName
  switch (item.Status) {
  case 'healthy':
    iconName = 'icon--checkmark--glyph'
    break
  case 'warning':
    iconName = 'icon--warning--glyph'
    break
  case 'critical':
    iconName = 'icon--error--glyph'
    break
  }
  return (
    <div className='table-status-row'>
      <div className='table-status-icon'>
        <Icon className={`table-status-icon__${item.Status}`} name={iconName} />
      </div>
      <p>{item.Status}</p>
    </div>
  )
}

export function getStorage(item, locale) {
  return formatFileSize(item.TotalStorage, locale)
}

export function getMemory(item, locale) {
  return formatFileSize(item.TotalMemory, locale)
}

const formatFileSize = (size, locale, decimals, threshold, multiplier, units) => {
  size = size || 0
  if (decimals == null) {
    decimals = 2
  }
  threshold = threshold || 800 // Steps to next unit if exceeded
  multiplier = multiplier || 1024
  units = units || locale === 'fr' ? ['o', 'Kio', 'Mio', 'Gio', 'Tio', 'Pio'] : ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB']

  let factorize = 1, unitIndex

  for (unitIndex = 0; unitIndex < units.length; unitIndex++) {
    if (unitIndex > 0) {
      factorize = Math.pow(multiplier, unitIndex)
    }

    if (size < multiplier * factorize && size < threshold * factorize) {
      break
    }
  }

  if (unitIndex >= units.length) {
    unitIndex = units.length - 1
  }

  let fileSize = size / factorize

  fileSize = new Intl.NumberFormat(locale).format(fileSize.toFixed(decimals))

  // This removes unnecessary 0 or . chars at the end of the string/decimals
  if (fileSize.indexOf('.') > -1) {
    fileSize = fileSize.replace(/\.?0*$/, '')
  }

  return `${fileSize} ${units[unitIndex]}`
}
